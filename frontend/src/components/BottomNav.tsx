import { NavLink } from 'react-router-dom'

const navItems = [
  { to: '/',              icon: 'dashboard',         label: 'Dashboard' },
  { to: '/health',        icon: 'health_and_safety', label: 'Health'    },
  { to: '/ai',            icon: 'auto_awesome',      label: 'AI'        },
  { to: '/chat',          icon: 'chat_bubble',       label: 'Chat'      },
  { to: '/reports',       icon: 'assessment',        label: 'Reports'   },
]

export default function BottomNav() {
  return (
    <nav className="bottom-nav">
      {navItems.map(({ to, icon, label }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
        >
          <span className={`material-symbols-outlined${to === '/' ? '' : ''}`}>{icon}</span>
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
