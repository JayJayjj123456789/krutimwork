import { NavLink, useSearchParams } from 'react-router-dom'

const navItems = [
  { to: '/',              icon: 'dashboard',         label: 'Dashboard' },
  { to: '/health',        icon: 'health_and_safety', label: 'Health'    },
  { to: '/ai',            icon: 'auto_awesome',      label: 'AI'        },
  { to: '/chat',          icon: 'chat_bubble',       label: 'Chat'      },
  { to: '/reports',       icon: 'assessment',        label: 'Reports'   },
]

export default function BottomNav() {
  const [searchParams] = useSearchParams()
  const deviceParam = searchParams.get('device') ? `?${searchParams.toString()}` : ''
  return (
    <nav className="bottom-nav">
      {navItems.map(({ to, icon, label }) => (
        <NavLink
          key={to}
          to={`${to}${deviceParam}`}
          end={to === '/'}
          className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
        >
          <span className="material-symbols-outlined">{icon}</span>
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
