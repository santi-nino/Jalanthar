import { createContext, useContext, useEffect, useState } from 'react'
import {
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from 'firebase/auth'
import { auth, isFirebaseConfigured } from '../firebase'

const AuthContext = createContext(null)

const DEMO_SESSION_KEY = 'jalanthar-demo-dm-session'

export function AuthProvider({ children }) {
  const [isDm, setIsDm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (isFirebaseConfigured) {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        setIsDm(Boolean(user))
        setLoading(false)
      })
      return unsubscribe
    } else {
      // Demo mode: session lives in sessionStorage only, cleared on tab close.
      setIsDm(sessionStorage.getItem(DEMO_SESSION_KEY) === 'true')
      setLoading(false)
    }
  }, [])

  async function login(email, password) {
    setError(null)
    if (isFirebaseConfigured) {
      try {
        await signInWithEmailAndPassword(auth, email, password)
        return true
      } catch (err) {
        setError('Incorrect email or password.')
        return false
      }
    } else {
      // Demo-mode fallback: compares against a value set in .env.local as
      // VITE_DEMO_DM_PASSWORD. This is NOT secure (it ships in the client
      // bundle) — it exists only so the edit UI is testable before a real
      // Firebase project is connected. Once Firebase is configured, this
      // branch is never used.
      const demoPassword = import.meta.env.VITE_DEMO_DM_PASSWORD
      if (demoPassword && password === demoPassword) {
        sessionStorage.setItem(DEMO_SESSION_KEY, 'true')
        setIsDm(true)
        return true
      }
      setError('Incorrect password. (Demo mode has no email, password only.)')
      return false
    }
  }

  async function logout() {
    if (isFirebaseConfigured) {
      await firebaseSignOut(auth)
    } else {
      sessionStorage.removeItem(DEMO_SESSION_KEY)
      setIsDm(false)
    }
  }

  return (
    <AuthContext.Provider value={{ isDm, loading, error, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
