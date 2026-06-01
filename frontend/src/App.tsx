import { Routes, Route, useLocation } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { UserProvider } from './context/UserContext'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import Health from './pages/Health'
import AIRecommendations from './pages/AIRecommendations'
import Chat from './pages/Chat'
import Reports from './pages/Reports'

const pageTitles: Record<string, { title: string; sub: string }> = {
  '/':        { title: 'Dashboard',         sub: 'Real-time atmospheric & health overview' },
  '/health':  { title: 'Health Analysis',   sub: 'AI-powered health risk monitoring'       },
  '/ai':      { title: 'AI Recommendations',sub: 'Personalized daily guidance from AI'     },
  '/chat':    { title: 'AI Chat',           sub: 'Ask anything about weather & health'     },
  '/reports': { title: 'Weekly Reports',    sub: 'Historical data & trend analysis'        },
}

function AppContent() {
  const location = useLocation()
  const page = pageTitles[location.pathname] ?? pageTitles['/']

  return (
    <div className="app-layout">
      <div className="bg-orb" style={{ width: 600, height: 600, background: 'rgba(137,208,237,0.07)', top: '-15%', left: '10%' }} />
      <div className="bg-orb" style={{ width: 500, height: 500, background: 'rgba(255,255,255,0.03)', bottom: '0%', right: '5%', animationDelay: '-7s' }} />
      <div className="bg-orb" style={{ width: 350, height: 350, background: 'rgba(255,180,171,0.05)', top: '40%', right: '20%', animationDelay: '-12s' }} />

      <Sidebar />

      <div className="main-area">
        <header className="top-header">
          <div className="header-search">
            <span className="material-symbols-outlined search-icon">search</span>
            <input type="text" placeholder="Search location, conditions…" />
          </div>

          <div className="header-actions">
            <div className="header-location">
              <span className="material-symbols-outlined icon-fill">location_on</span>
              Bangkok, TH
            </div>
            <button className="icon-btn" aria-label="Notifications">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <button className="icon-btn" aria-label="Settings">
              <span className="material-symbols-outlined">settings</span>
            </button>
          </div>
        </header>

        <div className="page-content">
          <div className="page-header">
            <h2>{page.title}</h2>
            <p>{page.sub}</p>
          </div>

          <Routes>
            <Route path="/"        element={<Dashboard />} />
            <Route path="/health"  element={<Health />} />
            <Route path="/ai"      element={<AIRecommendations />} />
            <Route path="/chat"    element={<Chat />} />
            <Route path="/reports" element={<Reports />} />
          </Routes>
        </div>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <UserProvider>
        <AppContent />
      </UserProvider>
    </ThemeProvider>
  )
}
