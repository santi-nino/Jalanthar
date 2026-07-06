import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import {
  collection,
  onSnapshot,
  doc,
  setDoc,
  deleteDoc,
  addDoc,
} from 'firebase/firestore'
import { db, isFirebaseConfigured } from '../firebase'
import { mockBuildings, mockNpcs, mockFamilies } from '../data/mockData'

const DataContext = createContext(null)

const LS_KEYS = {
  buildings: 'jalanthar-demo-buildings',
  npcs: 'jalanthar-demo-npcs',
  families: 'jalanthar-demo-families',
}

function loadDemo(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function saveDemo(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

export function DataProvider({ children }) {
  const [buildings, setBuildings] = useState([])
  const [npcs, setNpcs] = useState([])
  const [families, setFamilies] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isFirebaseConfigured) {
      const unsubs = [
        onSnapshot(collection(db, 'buildings'), (snap) =>
          setBuildings(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
        ),
        onSnapshot(collection(db, 'npcs'), (snap) =>
          setNpcs(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
        ),
        onSnapshot(collection(db, 'families'), (snap) =>
          setFamilies(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
        ),
      ]
      setLoading(false)
      return () => unsubs.forEach((u) => u())
    } else {
      setBuildings(loadDemo(LS_KEYS.buildings, mockBuildings))
      setNpcs(loadDemo(LS_KEYS.npcs, mockNpcs))
      setFamilies(loadDemo(LS_KEYS.families, mockFamilies))
      setLoading(false)
    }
  }, [])

  // ---- Buildings ----
  const saveBuilding = useCallback(
    async (building) => {
      if (isFirebaseConfigured) {
        const ref = building.id
          ? doc(db, 'buildings', building.id)
          : doc(collection(db, 'buildings'))
        await setDoc(ref, { ...building, id: undefined }, { merge: true })
      } else {
        setBuildings((prev) => {
          const id = building.id || `bld-${Date.now()}`
          const next = building.id
            ? prev.map((b) => (b.id === id ? { ...b, ...building } : b))
            : [...prev, { ...building, id }]
          saveDemo(LS_KEYS.buildings, next)
          return next
        })
      }
    },
    []
  )

  const removeBuilding = useCallback(async (id) => {
    if (isFirebaseConfigured) {
      await deleteDoc(doc(db, 'buildings', id))
    } else {
      setBuildings((prev) => {
        const next = prev.filter((b) => b.id !== id)
        saveDemo(LS_KEYS.buildings, next)
        return next
      })
    }
  }, [])

  // ---- NPCs ----
  const saveNpc = useCallback(async (npc) => {
    if (isFirebaseConfigured) {
      const ref = npc.id ? doc(db, 'npcs', npc.id) : doc(collection(db, 'npcs'))
      await setDoc(ref, { ...npc, id: undefined }, { merge: true })
    } else {
      setNpcs((prev) => {
        const id = npc.id || `npc-${Date.now()}`
        const next = npc.id
          ? prev.map((n) => (n.id === id ? { ...n, ...npc } : n))
          : [...prev, { ...npc, id }]
        saveDemo(LS_KEYS.npcs, next)
        return next
      })
    }
  }, [])

  const removeNpc = useCallback(async (id) => {
    if (isFirebaseConfigured) {
      await deleteDoc(doc(db, 'npcs', id))
    } else {
      setNpcs((prev) => {
        const next = prev.filter((n) => n.id !== id)
        saveDemo(LS_KEYS.npcs, next)
        return next
      })
    }
  }, [])

  // ---- Families ----
  const saveFamily = useCallback(async (family) => {
    if (isFirebaseConfigured) {
      const ref = family.id
        ? doc(db, 'families', family.id)
        : doc(collection(db, 'families'))
      await setDoc(ref, { ...family, id: undefined }, { merge: true })
    } else {
      setFamilies((prev) => {
        const id = family.id || `fam-${Date.now()}`
        const next = family.id
          ? prev.map((f) => (f.id === id ? { ...f, ...family } : f))
          : [...prev, { ...family, id }]
        saveDemo(LS_KEYS.families, next)
        return next
      })
    }
  }, [])

  const removeFamily = useCallback(async (id) => {
    if (isFirebaseConfigured) {
      await deleteDoc(doc(db, 'families', id))
    } else {
      setFamilies((prev) => {
        const next = prev.filter((f) => f.id !== id)
        saveDemo(LS_KEYS.families, next)
        return next
      })
    }
  }, [])

  return (
    <DataContext.Provider
      value={{
        buildings,
        npcs,
        families,
        loading,
        saveBuilding,
        removeBuilding,
        saveNpc,
        removeNpc,
        saveFamily,
        removeFamily,
      }}
    >
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  const ctx = useContext(DataContext)
  if (!ctx) throw new Error('useData must be used within DataProvider')
  return ctx
}
