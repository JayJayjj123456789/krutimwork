import { NavLink } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'

const navItems = [
  { to: '/',       icon: 'dashboard',        label: 'Dashboard'   },
  { to: '/health', icon: 'health_and_safety',label: 'Health'      },
  { to: '/ai',     icon: 'auto_awesome',     label: 'AI Insights' },
  { to: '/chat',   icon: 'chat_bubble',      label: 'AI Chat'     },
  { to: '/reports',icon: 'assessment',       label: 'Reports'     },
]

export default function Sidebar() {
  const { theme, toggleTheme } = useTheme()

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

      <nav className="sidebar-nav">
        <span className="sidebar-section-label">Main</span>
        {navItems.map(({ to, icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
          >
            <span className="material-symbols-outlined">{icon}</span>
            {label}
          </NavLink>
        ))}

        <span className="sidebar-section-label" style={{ marginTop: 12 }}>Weather</span>
        {[
          { icon: 'thermostat',    label: 'Temperature' },
          { icon: 'air',           label: 'Air Quality'  },
          { icon: 'wb_sunny',      label: 'UV Index'     },
        ].map(({ icon, label }) => (
          <button key={label} className="nav-item">
            <span className="material-symbols-outlined">{icon}</span>
            {label}
          </button>
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
            <p>Aether User</p>
            <p>Bangkok, Thailand</p>
          </div>
          <span className="material-symbols-outlined" style={{ fontSize: 16, color: 'var(--color-on-surface-variant)' }}>settings</span>
        </div>
      </div>
    </aside>
  )
}
