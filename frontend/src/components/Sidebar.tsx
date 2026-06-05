import { useState, useEffect, useRef } from 'react'
import { NavLink, useSearchParams } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import { useUser } from '../context/UserContext'
import { useAuth } from '../context/AuthContext'
import API from '../services/api'
import { useNavigate } from 'react-router-dom'

const navItems = [
  { to: '/',       icon: 'dashboard',        label: 'Dashboard'   },
  { to: '/health', icon: 'health_and_safety',label: 'Health'      },
  { to: '/ai',     icon: 'auto_awesome',     label: 'AI Insights' },
  { to: '/chat',   icon: 'chat_bubble',      label: 'AI Chat'     },
  { to: '/reports',icon: 'assessment',       label: 'Reports'     },
]

interface GeoResult {
  name: string
  country: string | null
  admin1: string | null
  latitude: number
  longitude: number
  timezone: string
}

export default function Sidebar() {
  const { theme, toggleTheme } = useTheme()
  const [searchParams] = useSearchParams()
  const deviceParam = searchParams.get('device') ? `?${searchParams.toString()}` : ''
  const { city, setCity } = useUser()
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<GeoResult[]>([])
  const [searching, setSearching] = useState(false)
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (!query.trim() || query.trim().length < 2) {
      setResults([])
      return
    }
    setSearching(true)
    debounceRef.current = setTimeout(async () => {
      try {
        const r = await API.get(`/weather/geocode?name=${encodeURIComponent(query.trim())}&count=6`)
        if (r.data?.success && Array.isArray(r.data.data)) {
          setResults(r.data.data)
        } else {
          setResults([])
        }
      } catch {
        setResults([])
      } finally {
        setSearching(false)
      }
    }, 350)
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [query])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const pick = (g: GeoResult) => {
    const label = `${g.name}${g.admin1 && g.admin1 !== g.name ? ', ' + g.admin1 : ''}, ${g.country ?? ''}`
    console.log(`[Sidebar] city selected: "${label}"`)
    setCity(label)
    setQuery('')
    setResults([])
    setOpen(false)
    navigate(`/${deviceParam}`)
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">
          <span className="material-symbols-outlined icon-fill" style={{ fontSize: 20 }}>air</span>
        </div>
        <div>
          <h1>Aether AI</h1>
          <p>Atmospheric Intelligence</p>
        </div>
      </div>

      <div ref={containerRef} className="sidebar-search">
        <span className="material-symbols-outlined sidebar-search-icon">search</span>
        <input
          type="text"
          className="sidebar-search-input"
          placeholder={`Search city… (${city.split(',')[0]})`}
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true) }}
          onFocus={() => setOpen(true)}
        />
        {searching && <span className="material-symbols-outlined sidebar-search-spin">progress_activity</span>}
        {open && (results.length > 0 || (query.trim().length >= 2 && !searching)) && (
          <div className="sidebar-search-dropdown">
            {results.length === 0 ? (
              <div className="sidebar-search-empty">No matches</div>
            ) : (
              results.map((g, i) => (
                <button
                  key={`${g.latitude}-${g.longitude}-${i}`}
                  className="sidebar-search-item"
                  onClick={() => pick(g)}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 16 }}>location_on</span>
                  <div style={{ flex: 1, textAlign: 'left' }}>
                    <div className="sidebar-search-item-name">{g.name}</div>
                    <div className="sidebar-search-item-sub">
                      {[g.admin1, g.country].filter(Boolean).join(' · ')}
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        )}
      </div>

      <nav className="sidebar-nav">
        <span className="sidebar-section-label">Main</span>
        {navItems.map(({ to, icon, label }) => (
          <NavLink
            key={to}
            to={`${to}${deviceParam}`}
            end={to === '/'}
            className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
          >
            <span className="material-symbols-outlined">{icon}</span>
            {label}
          </NavLink>
        ))}


      </nav>

      <div className="sidebar-footer">
        <button className="nav-item" onClick={toggleTheme} style={{ marginBottom: 8 }}>
          <span className="material-symbols-outlined">{theme === 'dark' ? 'light_mode' : 'dark_mode'}</span>
          {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
        </button>
        <div className="user-card">
          <div className="user-avatar">
            <span className="material-symbols-outlined" style={{ fontSize: 18, color: 'var(--color-on-surface-variant)' }}>person</span>
          </div>
          <div className="user-card-info">
            <p>{user?.email ?? 'Aether User'}</p>
            <p>{city}</p>
          </div>
          <button
            className="icon-btn"
            aria-label="Sign out"
            title="Sign out"
            onClick={async () => {
              await logout()
              navigate('/login', { replace: true })
            }}
          >
            <span className="material-symbols-outlined">logout</span>
          </button>
        </div>
      </div>
    </aside>
  )
}
