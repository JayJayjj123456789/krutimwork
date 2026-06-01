import { createContext, useContext, useState, ReactNode } from 'react'
import { HealthProfile } from '../types'

interface UserState {
  userId: number
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
    <UserContext.Provider value={{ userId: 1, city, healthProfile, setCity, setHealthProfile }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const ctx = useContext(UserContext)
  if (!ctx) throw new Error('useUser must be used within UserProvider')
  return ctx
}
