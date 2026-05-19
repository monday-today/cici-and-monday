import { useState, useMemo, type ReactNode } from 'react'
import { AnimatePresence } from 'framer-motion'
import { PageTransition } from '../components/ui/PageTransition'
import { BottomNav } from '../components/ui/BottomNav'
import { EmptyState } from '../components/ui/EmptyState'
import { FoodCard } from '../components/food/FoodCard'
import { AddFoodModal } from '../components/food/AddFoodModal'
import { RecipeCard } from '../components/food/RecipeCard'
import { AddRecipeModal } from '../components/food/AddRecipeModal'
import { useFoodRecords, useRecipes } from '../hooks/useSupabase'

const PLATE_ICON = 'https://cdn.jsdelivr.net/npm/openmoji@14.0.0/color/svg/1F372.svg'

type Tab = 'records' | 'recipes'

function MasonryGrid({ children, cols, smCols, gap }: { children: ReactNode[]; cols: number; smCols: number; gap: number }) {
  const items = Array.isArray(children) ? children : [children]

  const renderColumns = (n: number) => {
    const columns: ReactNode[][] = Array.from({ length: n }, () => [])
    items.forEach((item, i) => columns[i % n].push(item))
    return columns.map((colItems, ci) => (
      <div key={ci} className="flex-1 min-w-0 flex flex-col" style={{ gap }}>
        {colItems.map((child, j) => <div key={j}>{child}</div>)}
      </div>
    ))
  }

  return (
    <>
      <div className="sm:hidden flex" style={{ gap }}>{renderColumns(cols)}</div>
      <div className="hidden sm:flex" style={{ gap }}>{renderColumns(smCols)}</div>
    </>
  )
}

export default function FoodPage() {
  const [tab, setTab] = useState<Tab>('records')
  const { records, loading: loadingRecords, addRecord, removeRecord, updateRecord } = useFoodRecords()
  const { recipes, loading: loadingRecipes, addRecipe, removeRecipe, updateRecipe } = useRecipes()
  const [showAddRecord, setShowAddRecord] = useState(false)
  const [showAddRecipe, setShowAddRecipe] = useState(false)

  const sortedRecords = useMemo(() =>
    [...(records || [])].sort((a, b) => new Date(b.record_date).getTime() - new Date(a.record_date).getTime()),
    [records]
  )
  const sortedRecipes = useMemo(() =>
    [...(recipes || [])].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()),
    [recipes]
  )

  const handleAddRecord = async (item: Record<string, unknown>) => {
    const result = await addRecord(item)
    if (!result.error) setShowAddRecord(false)
    return result
  }

  const handleAddRecipe = async (item: Record<string, unknown>) => {
    const result = await addRecipe(item)
    if (!result.error) setShowAddRecipe(false)
    return result
  }

  const tabBtnClass = (t: Tab) =>
    `px-4 py-2 rounded-full text-sm font-medium transition-all ${tab === t ? 'bg-white/20 text-white' : 'text-white/40 hover:text-white/70'}`

  return (
    <PageTransition>
      <BottomNav />

      <div
        className="space-y-4"
        style={{ padding: 'clamp(1rem, 5vw, 2.5rem) clamp(1rem, 4vw, 1.5rem)', paddingBottom: '5rem' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src={PLATE_ICON} alt="" className="w-6 h-6" />
            <h1 className="font-title text-white tracking-wider" style={{ fontSize: 'clamp(1.2rem, 4vw, 1.6rem)' }}>
              食记
            </h1>
          </div>
          <button
            onClick={() => tab === 'records' ? setShowAddRecord(true) : setShowAddRecipe(true)}
            className="rounded-full bg-white/15 hover:bg-white/25 border border-white/20 text-white/90 px-4 py-2 transition-all text-sm"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            + {tab === 'records' ? '打卡' : '食谱'}
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mt-6" style={{ fontFamily: "'Montserrat', sans-serif" }}>
          <button onClick={() => setTab('records')} className={tabBtnClass('records')}>美食打卡</button>
          <button onClick={() => setTab('recipes')} className={tabBtnClass('recipes')}>食谱存档</button>
        </div>

        {/* Content */}
        {tab === 'records' ? (
          loadingRecords ? (
            <div className="flex justify-center py-20">
              <span className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            </div>
          ) : sortedRecords.length > 0 ? (
            <MasonryGrid cols={2} smCols={3} gap={12}>
              {sortedRecords.map((r) => (
                <FoodCard key={r.id} record={r} onDelete={removeRecord} onUpdate={updateRecord} />
              ))}
            </MasonryGrid>
          ) : (
            <EmptyState icon="" message="还没有美食记录，开始打卡吧" />
          )
        ) : (
          loadingRecipes ? (
            <div className="flex justify-center py-20">
              <span className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            </div>
          ) : sortedRecipes.length > 0 ? (
            <MasonryGrid cols={2} smCols={3} gap={12}>
              {sortedRecipes.map((r) => (
                <RecipeCard key={r.id} recipe={r} onDelete={removeRecipe} onUpdate={updateRecipe} />
              ))}
            </MasonryGrid>
          ) : (
            <EmptyState icon="" message="还没有食谱，开始记录吧" />
          )
        )}
      </div>

      <AnimatePresence>
        <AddFoodModal key="add-record" open={showAddRecord} onClose={() => setShowAddRecord(false)} onSave={handleAddRecord} />
        <AddRecipeModal key="add-recipe" open={showAddRecipe} onClose={() => setShowAddRecipe(false)} onSave={handleAddRecipe} />
      </AnimatePresence>
    </PageTransition>
  )
}
