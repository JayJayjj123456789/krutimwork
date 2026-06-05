import { Routes, Route, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import { ThemeProvider } from './context/ThemeContext'
import { UserProvider, useUser } from './context/UserContext'
import { AuthProvider } from './context/AuthContext'
import { ErrorBoundary } from './components/ErrorBoundary'
import Sidebar from './components/Sidebar'
import BottomNav from './components/BottomNav'
import WeatherBackdrop from './components/WeatherBackdrop'
import DeviceFrame from './components/DeviceFrame'
import Dashboard from './pages/Dashboard'
import Health from './pages/Health'
import AIRecommendations from './pages/AIRecommendations'
import Chat from './pages/Chat'
import Reports from './pages/Reports'
import API from './services/api'

const pageTitles = {
  en: {
    '/':        { title: 'Dashboard',         sub: 'Real-time atmospheric & health overview' },
    '/health':  { title: 'Health Analysis',   sub: 'AI-powered health risk monitoring'       },
    '/ai':      { title: 'AI Recommendations',sub: 'Personalized daily guidance from AI'     },
    '/chat':    { title: 'AI Chat',           sub: 'Ask anything about weather & health'     },
    '/reports': { title: 'Weekly Reports',    sub: 'Historical data & trend analysis'        },
  },
  th: {
    '/':        { title: 'แดชบอร์ด',         sub: 'ภาพรวมสภาพอากาศและสุขภาพแบบเรียลไทม์' },
    '/health':  { title: 'วิเคราะห์สุขภาพ',  sub: 'ติดตามความเสี่ยงสุขภาพด้วย AI'          },
    '/ai':      { title: 'คำแนะนำจาก AI',   sub: 'คำแนะนำเฉพาะตัวจาก AI'                  },
    '/chat':    { title: 'แชทกับ AI',        sub: 'ถามอะไรก็ได้เกี่ยวกับอากาศและสุขภาพ' },
    '/reports': { title: 'รายงานประจำสัปดาห์',sub: 'ข้อมูลย้อนหลังและวิเคราะห์แนวโน้ม' },
  },
}

function Layout() {
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const phoneMode = searchParams.get('device') === 'phone'
  const deviceParam = searchParams.get('device') ? `?${searchParams.toString()}` : ''
  const [lang, setLang] = useState<'en' | 'th'>(() => (document.documentElement.lang === 'th' ? 'th' : 'en'))
  const page = pageTitles[lang][location.pathname as keyof typeof pageTitles.en] ?? pageTitles[lang]['/']

  const toggleLang = () => {
    const next = lang === 'en' ? 'th' : 'en'
    setLang(next)
    document.documentElement.lang = next
  }
  const { city, setCity } = useUser()
  const navigate = useNavigate()
  console.log(`[App] route: ${location.pathname} city="${city}" phone=${phoneMode}`)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<{ name: string; country: string | null; admin1: string | null }[]>([])
  const [open, setOpen] = useState(false)
  const [searching, setSearching] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const wrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (!query.trim() || query.trim().length < 2) { setResults([]); return }
    setSearching(true)
    debounceRef.current = setTimeout(async () => {
      try {
        const r = await API.get(`/weather/geocode?name=${encodeURIComponent(query.trim())}&count=5`)
        setResults(r.data?.success && Array.isArray(r.data.data) ? r.data.data : [])
      } catch { setResults([]) } finally { setSearching(false) }
    }, 350)
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
  }, [query])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const pick = (g: { name: string; country: string | null; admin1: string | null }) => {
    const label = `${g.name}${g.admin1 && g.admin1 !== g.name ? ', ' + g.admin1 : ''}, ${g.country ?? ''}`
    setCity(label); setQuery(''); setResults([]); setOpen(false); navigate(`/${deviceParam}`)
  }

  return (
    <div className={`app-layout${phoneMode ? ' phone-mode' : ''}`}>
      <WeatherBackdrop />
      <Sidebar />
      <BottomNav />

      <div className="main-area">
        <header className="top-header">
          <div className="header-search" ref={wrapRef}>
            <span className="material-symbols-outlined search-icon">search</span>
            <input
              type="text"
              placeholder="Search location, conditions…"
              value={query}
              onChange={(e) => { setQuery(e.target.value); setOpen(true) }}
              onFocus={() => setOpen(true)}
            />
            {open && (results.length > 0 || (query.trim().length >= 2 && !searching)) && (
              <div className="header-search-dropdown">
                {results.length === 0 ? (
                  <div className="header-search-empty">No matches</div>
                ) : (
                  results.map((g, i) => (
                    <button key={`${g.name}-${g.country ?? ''}-${i}`} className="header-search-item" onClick={() => pick(g)}>
                      <span className="material-symbols-outlined" style={{ fontSize: 16 }}>location_on</span>
                      <div>
                        <div className="header-search-item-name">{g.name}</div>
                        <div className="header-search-item-sub">{[g.admin1, g.country].filter(Boolean).join(' · ')}</div>
                      </div>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>

          <div className="header-actions">
            <div className="header-location">
              <span className="material-symbols-outlined icon-fill">location_on</span>
              <span className="location-text">{city}</span>
            </div>
            <button className="icon-btn" aria-label="Notifications">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <button className="lang-btn" onClick={toggleLang} aria-label="Toggle language">
              <span className="material-symbols-outlined">translate</span>
              <span className="lang-label">{lang === 'en' ? 'TH' : 'EN'}</span>
            </button>
            <button className="icon-btn" aria-label="Settings">
              <span className="material-symbols-outlined">settings</span>
            </button>
          </div>
        </header>

        <div className="page-content page-enter" key={location.pathname}>
          <div className="page-header">
            <h2>{page.title}</h2>
            <p>{page.sub}</p>
          </div>

          <ErrorBoundary>
            <Routes>
              <Route index        element={<Dashboard />} />
              <Route path="health"  element={<Health />} />
              <Route path="ai"      element={<AIRecommendations />} />
              <Route path="chat"    element={<Chat />} />
              <Route path="reports" element={<Reports />} />
            </Routes>
          </ErrorBoundary>
        </div>
      </div>
    </div>
  )
}

function RequireAuth({ children }: { children: React.ReactNode }) {
  // TEMP: auth disabled — login page is not ready
  return <>{children}</>
  // const { user, loading } = useAuth()
  // if (loading) return <div className="loading-screen"><span className="spinner" /></div>
  // if (!user) return <Navigate to="/login" replace />
  // return <>{children}</>
}

function AuthWatcher() {
  // TEMP: auth disabled — do not redirect to /login on 401
  return null
  // const navigate = useNavigate()
  // const { logout } = useAuth()
  // useEffect(() => {
  //   const handler = () => {
  //     logout().catch(() => {})
  //     navigate('/login', { replace: true })
  //   }
  //   window.addEventListener('auth:unauthorized', handler)
  //   return () => window.removeEventListener('auth:unauthorized', handler)
  // }, [navigate, logout])
}

function MaybeFrame({ children }: { children: React.ReactNode }) {
  const [searchParams] = useSearchParams()
  if (searchParams.get('device') === 'phone') {
    return <DeviceFrame>{children}</DeviceFrame>
  }
  return <>{children}</>
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <UserProvider>
          <AuthWatcher />
          <Routes>
            {/* TEMP: login/signup disabled — not ready yet */}
            {/* <Route path="/login" element={<Login />} /> */}
            {/* <Route path="/signup" element={<Signup />} /> */}
            <Route path="/*" element={<RequireAuth><MaybeFrame><Layout /></MaybeFrame></RequireAuth>} />
          </Routes>
        </UserProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}
