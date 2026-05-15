import { useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

const pageOrder = ['/home', '/memories', '/travel', '/diary', '/album', '/wishes']

export function useSwipe() {
  const navigate = useNavigate()
  const location = useLocation()

  const handleSwipe = useCallback((direction: 'left' | 'right') => {
    const idx = pageOrder.indexOf(location.pathname)
    if (idx === -1) return
    if (direction === 'left' && idx < pageOrder.length - 1) {
      navigate(pageOrder[idx + 1])
    } else if (direction === 'right' && idx > 0) {
      navigate(pageOrder[idx - 1])
    }
  }, [location.pathname, navigate])

  return { handleSwipe }
}
