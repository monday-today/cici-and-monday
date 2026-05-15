import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { encrypt, decrypt } from '../lib/crypto'
import { useAuth } from '../lib/auth'

export interface ImportantDate {
  id: string
  title: string
  date: string
  type: 'anniversary' | 'birthday'
  icon?: string
}

export interface Memory {
  id: string
  title: string
  content: string
  image_urls: string[]
  memory_date: string
}

export interface DiaryEntry {
  id: string
  title: string
  content: string
  mood: string
  image_urls: string[]
  entry_date: string
}

export interface Photo {
  id: string
  url: string
  thumbnail_url?: string
  caption: string
  taken_at: string
}

export interface Travel {
  id: string
  title: string
  story: string
  lat: number
  lng: number
  image_urls: string[]
  visit_date: string
}

export interface Wish {
  id: string
  title: string
  description: string
  completed: boolean
  completed_at?: string
}

function useData<T>(table: string, decryptContent = false) {
  const { uid, password } = useAuth()
  const [data, setData] = useState<T[]>([])
  const [loading, setLoading] = useState(true)

  const fetch = useCallback(async () => {
    setLoading(true)
    let query = supabase.from(table).select('*').order('created_at', { ascending: false })
    const { data: rows, error } = await query
    if (!error && rows) {
      if (decryptContent && password && uid) {
        const decrypted = await Promise.all(
          rows.map(async (row: Record<string, unknown>) => ({
            ...row,
            content: await decrypt(row.content as string, password, uid).catch(() => row.content),
          }))
        )
        setData(decrypted as T[])
      } else {
        setData(rows as T[])
      }
    }
    setLoading(false)
  }, [table, decryptContent, password, uid])

  useEffect(() => { fetch() }, [fetch])

  const add = async (item: Partial<Record<string, unknown>>) => {
    if (decryptContent && item.content && password && uid) {
      item.content = await encrypt(item.content as string, password, uid)
    }
    const { data: created, error } = await supabase.from(table).insert(item).select().single()
    if (!error && created) {
      setData(prev => [created as unknown as T, ...prev])
    }
    return { error }
  }

  const remove = async (id: string) => {
    const { error } = await supabase.from(table).delete().eq('id', id)
    if (!error) setData(prev => prev.filter((item) => (item as Record<string, unknown>).id !== id))
    return { error }
  }

  const update = async (id: string, updates: Partial<Record<string, unknown>>) => {
    const { error } = await supabase.from(table).update(updates).eq('id', id)
    if (!error) {
      setData(prev => prev.map((item) =>
        (item as Record<string, unknown>).id === id ? { ...item, ...updates } as T : item
      ))
    }
    return { error }
  }

  return { data, loading, add, remove, update, refetch: fetch }
}

export function useImportantDates() {
  const { data, loading, add, remove, update, refetch } = useData<ImportantDate>('important_dates')
  return { dates: data, loading, addDate: add, removeDate: remove, updateDate: update, refetch }
}

export function useMemories() {
  const { data, loading, add, remove, update, refetch } = useData<Memory>('memories')
  return { memories: data, loading, addMemory: add, removeMemory: remove, updateMemory: update, refetch }
}

export function useDiaryEntries() {
  const { data, loading, add, remove, update, refetch } = useData<DiaryEntry>('diary_entries', true)
  return { entries: data, loading, addEntry: add, removeEntry: remove, updateEntry: update, refetch }
}

export function usePhotos() {
  const { data, loading, add, remove, update, refetch } = useData<Photo>('photos')
  return { photos: data, loading, addPhoto: add, removePhoto: remove, updatePhoto: update, refetch }
}

export function useTravels() {
  const { data, loading, add, remove, update, refetch } = useData<Travel>('travels')
  return { travels: data, loading, addTravel: add, removeTravel: remove, updateTravel: update, refetch }
}

export function useWishes() {
  const { data, loading, add, remove, update, refetch } = useData<Wish>('wishes')
  return { wishes: data, loading, addWish: add, removeWish: remove, updateWish: update, refetch }
}

export async function uploadImage(file: File, bucket: string): Promise<string | null> {
  const ext = file.name.split('.').pop()
  const name = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
  const { error } = await supabase.storage.from(bucket).upload(name, file)
  if (error) return null
  const { data } = await supabase.storage.from(bucket).createSignedUrl(name, 31536000)
  return data?.signedUrl ?? null
}
