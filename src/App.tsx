import { HashRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './lib/auth'
import { AuthGate } from './components/auth/AuthGate'
import { AnimatePresence } from 'framer-motion'
import AuthPage from './pages/AuthPage'
import WelcomePage from './pages/WelcomePage'
import HomePage from './pages/HomePage'
import DatesPage from './pages/DatesPage'
import FoodPage from './pages/FoodPage'
import TravelPage from './pages/TravelPage'
import DiaryPage from './pages/DiaryPage'
import AlbumPage from './pages/AlbumPage'
import TimelinePage from './pages/TimelinePage'

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
            <Route path="/food" element={<AuthGate><FoodPage /></AuthGate>} />
            <Route path="/travel" element={<AuthGate><TravelPage /></AuthGate>} />
            <Route path="/diary" element={<AuthGate><DiaryPage /></AuthGate>} />
            <Route path="/album" element={<AuthGate><AlbumPage /></AuthGate>} />
            <Route path="/timeline" element={<AuthGate><TimelinePage /></AuthGate>} />
          </Routes>
        </AnimatePresence>
      </AuthProvider>
    </HashRouter>
  )
}
