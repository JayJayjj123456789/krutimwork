import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react'
import { auth } from '../config/firebase'
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, signInWithPopup, GoogleAuthProvider, User } from 'firebase/auth'
import API from '../services/api'

interface AuthUser {
  userId: string
  email: string | null
}

interface AuthState {
  user: AuthUser | null
  token: string | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string) => Promise<void>
  googleLogin: () => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthState | undefined>(undefined)

function mapFirebaseUser(fbUser: User | null): { user: AuthUser | null; token: string | null } {
  if (!fbUser) return { user: null, token: null }
  return {
    user: { userId: fbUser.uid, email: fbUser.email },
    token: null,
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (fbUser) => {
      const { user: mappedUser, token: _ } = mapFirebaseUser(fbUser)
      setUser(mappedUser)
      if (fbUser) {
        const idToken = await fbUser.getIdToken()
        setToken(idToken)
        API.defaults.headers.common['Authorization'] = `Bearer ${idToken}`
      } else {
        setToken(null)
        delete API.defaults.headers.common['Authorization']
      }
      setLoading(false)
    })
    return unsub
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true)
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password)
      const idToken = await cred.user.getIdToken()
      setUser({ userId: cred.user.uid, email: cred.user.email })
      setToken(idToken)
      API.defaults.headers.common['Authorization'] = `Bearer ${idToken}`
    } finally {
      setLoading(false)
    }
  }, [])

  const signup = useCallback(async (email: string, password: string) => {
    setLoading(true)
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password)
      const idToken = await cred.user.getIdToken()
      setUser({ userId: cred.user.uid, email: cred.user.email })
      setToken(idToken)
      API.defaults.headers.common['Authorization'] = `Bearer ${idToken}`
    } finally {
      setLoading(false)
    }
  }, [])

  const googleLogin = useCallback(async () => {
    const provider = new GoogleAuthProvider()
    const cred = await signInWithPopup(auth, provider)
    const idToken = await cred.user.getIdToken()
    setUser({ userId: cred.user.uid, email: cred.user.email })
    setToken(idToken)
    API.defaults.headers.common['Authorization'] = `Bearer ${idToken}`
  }, [])

  const logout = useCallback(async () => {
    await signOut(auth)
    setUser(null)
    setToken(null)
    delete API.defaults.headers.common['Authorization']
  }, [])

  return (
    <AuthContext.Provider value={{ user, token, loading, login, signup, googleLogin, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
