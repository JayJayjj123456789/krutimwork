import { NavLink } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'
import styles from './Navbar.module.css'

const navItems = [
  { to: '/', icon: 'dashboard', label: 'Dashboard' },
  { to: '/health', icon: 'health_and_safety', label: 'Health' },
  { to: '/ai', icon: 'auto_awesome', label: 'AI' },
  { to: '/chat', icon: 'chat_bubble', label: 'Chat' },
  { to: '/reports', icon: 'assessment', label: 'Reports' },
]

export default function Navbar() {
  const { theme, toggleTheme } = useTheme()

  return (
    <nav className={styles.nav}>
      <div className={styles.brand}>
        <div className={styles.logo}>
          <span className="material-symbols-outlined icon-fill" style={{ fontSize: 20, color: 'var(--color-secondary)' }}>air</span>
        </div>
        <span className={styles.brandName}>Aether AI</span>
      </div>

      <div className={styles.links}>
        {navItems.map(({ to, icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) => `${styles.link}${isActive ? ` ${styles.active}` : ''}`}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>{icon}</span>
            {label}
          </NavLink>
        ))}
      </div>

      <button className={styles.themeBtn} onClick={toggleTheme} aria-label="Toggle theme">
        <span className="material-symbols-outlined">{theme === 'dark' ? 'light_mode' : 'dark_mode'}</span>
      </button>
    </nav>
  )
}
