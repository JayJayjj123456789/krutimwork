import { createContext, useContext, useState, ReactNode } from 'react'
import { HealthProfile } from '../types'
import { useAuth } from './AuthContext'

interface UserState {
  userId: string
  city: string
  healthProfile: HealthProfile | null
  setCity: (city: string) => void
  setHealthProfile: (profile: HealthProfile) => void
}

const UserContext = createContext<UserState | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const [city, setCity] = useState('Bangkok')
  const [healthProfile, setHealthProfile] = useState<HealthProfile | null>(null)

  return (
    <UserContext.Provider value={{ userId: '', city, healthProfile, setCity, setHealthProfile }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const ctx = useContext(UserContext)
  if (!ctx) throw new Error('useUser must be used within UserProvider')
  const auth = useAuth()
  return { ...ctx, userId: auth.user?.userId ?? '' }
}
