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
  photo_urls?: string
  notes?: string
  count_mode?: 'countdown' | 'anniversary'
  sort_order?: number
  show_on_home?: boolean
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
    const plainContent = item.content
    if (decryptContent && item.content && password && uid) {
      item.content = await encrypt(item.content as string, password, uid)
    }
    const { data: created, error } = await supabase.from(table).insert(item).select().single()
    if (!error && created) {
      if (decryptContent && plainContent) {
        setData(prev => [{ ...created, content: plainContent } as unknown as T, ...prev])
      } else {
        setData(prev => [created as unknown as T, ...prev])
      }
    }
    return { error }
  }

  const remove = async (id: string) => {
    const { error } = await supabase.from(table).delete().eq('id', id)
    if (!error) setData(prev => prev.filter((item) => (item as Record<string, unknown>).id !== id))
    return { error }
  }

  const update = async (id: string, updates: Partial<Record<string, unknown>>) => {
    const plainContent = updates.content
    if (decryptContent && updates.content && password && uid) {
      updates = { ...updates, content: await encrypt(updates.content as string, password, uid) }
    }
    const { error } = await supabase.from(table).update(updates).eq('id', id)
    if (!error) {
      setData(prev => prev.map((item) =>
        (item as Record<string, unknown>).id === id ? { ...item, ...updates, ...(plainContent ? { content: plainContent } : {}) } as T : item
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

export interface DanmakuMessage {
  id: string
  text: string
  likes: number
  created_at: string
}

export function useDanmaku() {
  const [messages, setMessages] = useState<DanmakuMessage[]>([])
  const [loading, setLoading] = useState(true)
  const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000

  const fetch = useCallback(async () => {
    const cutoff = new Date(Date.now() - SEVEN_DAYS_MS).toISOString()
    const { data, error } = await supabase
      .from('danmaku')
      .select('*')
      .gt('created_at', cutoff)
      .order('created_at', { ascending: false })
      .limit(100)
    if (!error && data) {
      setMessages(data as DanmakuMessage[])
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    fetch()
  }, [fetch])

  // Realtime subscription for new messages
  useEffect(() => {
    const channel = supabase
      .channel('danmaku-changes')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'danmaku' },
        (payload) => {
          const msg = payload.new as DanmakuMessage
          const cutoff = Date.now() - SEVEN_DAYS_MS
          if (new Date(msg.created_at).getTime() > cutoff) {
            setMessages((prev) => [msg, ...prev].slice(0, 100))
          }
        },
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'danmaku' },
        (payload) => {
          const updated = payload.new as DanmakuMessage
          setMessages((prev) => prev.map((m) => (m.id === updated.id ? updated : m)))
        },
      )
      .on(
        'postgres_changes',
        { event: 'DELETE', schema: 'public', table: 'danmaku' },
        (payload) => {
          const deleted = payload.old as DanmakuMessage
          setMessages((prev) => prev.filter((m) => m.id !== deleted.id))
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const addMessage = async (text: string) => {
    const { error } = await supabase.from('danmaku').insert({ text, likes: 0 })
    return { error }
  }

  const likeMessage = async (id: string, currentLikes: number) => {
    const { error } = await supabase.from('danmaku').update({ likes: currentLikes + 1 }).eq('id', id)
    return { error }
  }

  const deleteMessage = async (id: string) => {
    const { error } = await supabase.from('danmaku').delete().eq('id', id)
    return { error }
  }

  // Cleanup old messages on mount
  useEffect(() => {
    const cutoff = new Date(Date.now() - SEVEN_DAYS_MS).toISOString()
    supabase.from('danmaku').delete().lt('created_at', cutoff).then(() => {})
  }, [])

  return { messages, loading, addMessage, likeMessage, deleteMessage, refetch: fetch }
}

export interface FoodRecord {
  id: string
  dish_name: string
  restaurant: string
  location: string
  photo_url: string
  notes: string
  allergies: string
  record_date: string
  created_at: string
}

export function useFoodRecords() {
  const { data, loading, add, remove, update, refetch } = useData<FoodRecord>('food_records')
  return {
    records: data,
    loading,
    addRecord: add as (item: Record<string, unknown>) => Promise<{ error: unknown }>,
    removeRecord: remove,
    updateRecord: update,
    refetch,
  }
}

export interface TimelinePhoto {
  id: string
  url: string
  caption: string
  created_at: string
}

export function useTimelinePhotos() {
  const { data, loading, add, remove, update, refetch } = useData<TimelinePhoto>('timeline_photos')
  return {
    photos: data,
    loading,
    addPhoto: add as (item: Record<string, unknown>) => Promise<{ error: unknown }>,
    removePhoto: remove,
    updatePhoto: update,
    refetch,
  }
}

export interface Recipe {
  id: string
  name: string
  ingredients: string
  steps: string
  cooking_time: string
  notes: string
  photo_url: string
  created_at: string
}

export function useRecipes() {
  const { data, loading, add, remove, update, refetch } = useData<Recipe>('recipes')
  return {
    recipes: data,
    loading,
    addRecipe: add as (item: Record<string, unknown>) => Promise<{ error: unknown }>,
    removeRecipe: remove,
    updateRecipe: update,
    refetch,
  }
}

async function compressImage(file: File): Promise<Blob> {
  if (file.size < 100 * 1024) return file
  return new Promise((resolve) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      URL.revokeObjectURL(url)
      const maxW = 1600
      let w = img.width, h = img.height
      if (w > maxW) { h = Math.round(h * maxW / w); w = maxW }
      const canvas = document.createElement('canvas')
      canvas.width = w; canvas.height = h
      const ctx = canvas.getContext('2d')!
      ctx.drawImage(img, 0, 0, w, h)
      canvas.toBlob((blob) => {
        if (blob && blob.size < file.size) { resolve(blob) }
        else { resolve(file) }
      }, 'image/jpeg', 0.65)
    }
    img.src = url
  })
}

export async function uploadImage(file: File, bucket: string): Promise<string | null> {
  const compressed = await compressImage(file)
  const f = new File([compressed], file.name.replace(/\.[^.]+$/, '.jpg'), { type: 'image/jpeg' })
  const name = `${Date.now()}-${Math.random().toString(36).slice(2)}.jpg`
  const { error } = await supabase.storage.from(bucket).upload(name, f)
  if (error) return null
  const { data } = await supabase.storage.from(bucket).createSignedUrl(name, 31536000)
  return data?.signedUrl ?? null
}
