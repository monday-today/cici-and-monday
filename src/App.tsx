import { HashRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './lib/auth'
import { AuthGate } from './components/auth/AuthGate'
import { AnimatePresence } from 'framer-motion'
import AuthPage from './pages/AuthPage'
import WelcomePage from './pages/WelcomePage'
import HomePage from './pages/HomePage'
import DatesPage from './pages/DatesPage'
import MemoriesPage from './pages/MemoriesPage'
import TravelPage from './pages/TravelPage'
import DiaryPage from './pages/DiaryPage'
import AlbumPage from './pages/AlbumPage'
import WishesPage from './pages/WishesPage'

export default function App() {
  return (
    <HashRouter>
      <AuthProvider>
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/" element={<AuthGate><WelcomePage /></AuthGate>} />
            <Route path="/home" element={<AuthGate><HomePage /></AuthGate>} />
            <Route path="/dates" element={<AuthGate><DatesPage /></AuthGate>} />
            <Route path="/memories" element={<AuthGate><MemoriesPage /></AuthGate>} />
            <Route path="/travel" element={<AuthGate><TravelPage /></AuthGate>} />
            <Route path="/diary" element={<AuthGate><DiaryPage /></AuthGate>} />
            <Route path="/album" element={<AuthGate><AlbumPage /></AuthGate>} />
            <Route path="/wishes" element={<AuthGate><WishesPage /></AuthGate>} />
          </Routes>
        </AnimatePresence>
      </AuthProvider>
    </HashRouter>
  )
}
