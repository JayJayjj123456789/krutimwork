import { ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import styles from './Layout.module.css'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation()

  const navItems = [
    { path: '/', label: 'Dashboard' },
    { path: '/health', label: 'Health' },
    { path: '/chat', label: '💬 Chat' },
    { path: '/reports', label: '📊 Reports' },
  ]

  return (
    <div className={styles.container}>
      <nav className={styles.nav}>
        <h1 className={styles.logo}>🌤️ Weather Health AI</h1>
        <div className={styles.links}>
          {navItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`${styles.link} ${location.pathname === item.path ? styles.active : ''}`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
      <main className={styles.main}>
        {children}
      </main>
    </div>
  )
}
