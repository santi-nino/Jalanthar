import { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react'
import {
  collection,
  onSnapshot,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  arrayUnion,
  arrayRemove,
} from 'firebase/firestore'
import { db, auth, isFirebaseConfigured } from '../firebase'
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

// A resident's name is supposed to surface the moment ANY building that
// lists them goes "revealed" — but Firestore security rules can only see
// the NPC document being read, not reach backward into every building to
// ask "does anyone revealed list me?" (rules can't run cross-collection
// queries like that). So the truth of "is this NPC name-visible via some
// building" has to be denormalized onto the NPC doc itself as a plain
// boolean the read rule can check directly. This computes that boolean
// from a given buildings list — call it with the most current buildings
// state available (including any edit that hasn't round-tripped through
// onSnapshot yet) whenever a building's `revealed` flag or `residents`
// list changes.
function computeRevealedViaBuilding(npcId, buildingsList) {
  return buildingsList.some((b) => b.revealed && (b.residents || []).includes(npcId))
}

export function DataProvider({ children }) {
  const [buildings, setBuildings] = useState([])
  const [npcs, setNpcs] = useState([])
  const [families, setFamilies] = useState([])
  const [loading, setLoading] = useState(true)

  // Kept in sync every render so callbacks below can read the latest
  // buildings/npcs without needing them in a useCallback dependency array
  // (which would redefine — and break memoization of — every save function
  // on every single data change).
  const buildingsRef = useRef(buildings)
  const npcsRef = useRef(npcs)
  useEffect(() => {
    buildingsRef.current = buildings
  }, [buildings])
  useEffect(() => {
    npcsRef.current = npcs
  }, [npcs])

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

  // Re-derives revealedViaBuilding for exactly the NPCs who could plausibly
  // have changed (whoever was a resident of the affected building, before
  // or after the edit) and only writes the ones that actually differ.
  // `buildingsOverride` lets the caller supply the just-saved building's
  // true post-save shape immediately, rather than waiting for onSnapshot to
  // round-trip before this can compute correctly.
  const syncRevealForNpcIds = useCallback(async (npcIds, buildingsOverride) => {
    const uniqueIds = [...new Set(npcIds)].filter(Boolean)
    if (uniqueIds.length === 0) return
    const currentBuildings = buildingsOverride || buildingsRef.current
    const currentNpcs = npcsRef.current

    if (isFirebaseConfigured) {
      // Only the DM's own edits ever change `revealed` or `residents` in
      // the first place (Firestore rules block anyone else from touching
      // those fields), so this is always a no-op set of writes for a
      // player session — but guard on auth anyway rather than relying on
      // that indirectly, since npcs writes require it outright.
      if (!auth?.currentUser) return
      await Promise.all(
        uniqueIds.map(async (id) => {
          const npc = currentNpcs.find((n) => n.id === id)
          if (!npc) return
          const next = computeRevealedViaBuilding(id, currentBuildings)
          if (!!npc.revealedViaBuilding === next) return
          await updateDoc(doc(db, 'npcs', id), { revealedViaBuilding: next })
        })
      )
    } else {
      setNpcs((prev) => {
        let changed = false
        const next = prev.map((n) => {
          if (!uniqueIds.includes(n.id)) return n
          const val = computeRevealedViaBuilding(n.id, currentBuildings)
          if (!!n.revealedViaBuilding === val) return n
          changed = true
          return { ...n, revealedViaBuilding: val }
        })
        if (changed) saveDemo(LS_KEYS.npcs, next)
        return changed ? next : prev
      })
    }
  }, [])

  // ---- Buildings ----
  const saveBuilding = useCallback(
    async (building) => {
      const priorResidents = building.id
        ? buildingsRef.current.find((b) => b.id === building.id)?.residents || []
        : []
      const affectedNpcIds = [...priorResidents, ...(building.residents || [])]

      if (isFirebaseConfigured) {
        const ref = building.id
          ? doc(db, 'buildings', building.id)
          : doc(collection(db, 'buildings'))
        const { id: _discard, ...rest } = building
        await setDoc(ref, rest, { merge: true })
        const savedBuilding = { id: ref.id, ...rest }
        const buildingsWithSave = [
          ...buildingsRef.current.filter((b) => b.id !== ref.id),
          savedBuilding,
        ]
        await syncRevealForNpcIds(affectedNpcIds, buildingsWithSave)
        return ref.id
      } else {
        const id = building.id || `bld-${Date.now()}`
        let savedBuilding
        setBuildings((prev) => {
          const next = building.id
            ? prev.map((b) => (b.id === id ? { ...b, ...building } : b))
            : [...prev, { ...building, id }]
          savedBuilding = next.find((b) => b.id === id)
          saveDemo(LS_KEYS.buildings, next)
          return next
        })
        const buildingsWithSave = [
          ...buildingsRef.current.filter((b) => b.id !== id),
          savedBuilding || { ...building, id },
        ]
        await syncRevealForNpcIds(affectedNpcIds, buildingsWithSave)
        return id
      }
    },
    [syncRevealForNpcIds]
  )

  const removeBuilding = useCallback(async (id) => {
    const removedResidents = buildingsRef.current.find((b) => b.id === id)?.residents || []
    if (isFirebaseConfigured) {
      await deleteDoc(doc(db, 'buildings', id))
    } else {
      setBuildings((prev) => {
        const next = prev.filter((b) => b.id !== id)
        saveDemo(LS_KEYS.buildings, next)
        return next
      })
    }
    const buildingsAfterRemoval = buildingsRef.current.filter((b) => b.id !== id)
    await syncRevealForNpcIds(removedResidents, buildingsAfterRemoval)
  }, [syncRevealForNpcIds])

  // Atomic add/remove for a single resident id, so two simultaneous edits
  // (e.g. from two DM sessions) can't clobber each other's changes to the
  // same building's residents array the way a full read-modify-write would.
  const addResidentToBuilding = useCallback(async (buildingId, npcId) => {
    let buildingsWithChange
    if (isFirebaseConfigured) {
      await updateDoc(doc(db, 'buildings', buildingId), { residents: arrayUnion(npcId) })
      buildingsWithChange = buildingsRef.current.map((b) =>
        b.id === buildingId
          ? { ...b, residents: [...new Set([...(b.residents || []), npcId])] }
          : b
      )
    } else {
      setBuildings((prev) => {
        const next = prev.map((b) =>
          b.id === buildingId
            ? { ...b, residents: [...new Set([...(b.residents || []), npcId])] }
            : b
        )
        saveDemo(LS_KEYS.buildings, next)
        return next
      })
      buildingsWithChange = buildingsRef.current.map((b) =>
        b.id === buildingId
          ? { ...b, residents: [...new Set([...(b.residents || []), npcId])] }
          : b
      )
    }
    await syncRevealForNpcIds([npcId], buildingsWithChange)
  }, [syncRevealForNpcIds])

  const removeResidentFromBuilding = useCallback(async (buildingId, npcId) => {
    let buildingsWithChange
    if (isFirebaseConfigured) {
      await updateDoc(doc(db, 'buildings', buildingId), { residents: arrayRemove(npcId) })
      buildingsWithChange = buildingsRef.current.map((b) =>
        b.id === buildingId
          ? { ...b, residents: (b.residents || []).filter((id) => id !== npcId) }
          : b
      )
    } else {
      setBuildings((prev) => {
        const next = prev.map((b) =>
          b.id === buildingId
            ? { ...b, residents: (b.residents || []).filter((id) => id !== npcId) }
            : b
        )
        saveDemo(LS_KEYS.buildings, next)
        return next
      })
      buildingsWithChange = buildingsRef.current.map((b) =>
        b.id === buildingId
          ? { ...b, residents: (b.residents || []).filter((id) => id !== npcId) }
          : b
      )
    }
    await syncRevealForNpcIds([npcId], buildingsWithChange)
  }, [syncRevealForNpcIds])

  // ---- NPCs ----
  const saveNpc = useCallback(async (npc) => {
    if (isFirebaseConfigured) {
      const ref = npc.id ? doc(db, 'npcs', npc.id) : doc(collection(db, 'npcs'))
      const { id: _discard, ...rest } = npc
      await setDoc(ref, rest, { merge: true })
      return ref.id
    } else {
      const id = npc.id || `npc-${Date.now()}`
      setNpcs((prev) => {
        const next = npc.id
          ? prev.map((n) => (n.id === id ? { ...n, ...npc } : n))
          : [...prev, { ...npc, id }]
        saveDemo(LS_KEYS.npcs, next)
        return next
      })
      return id
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
      const { id: _discard, ...rest } = family
      await setDoc(ref, rest, { merge: true })
      return ref.id
    } else {
      const id = family.id || `fam-${Date.now()}`
      setFamilies((prev) => {
        const next = family.id
          ? prev.map((f) => (f.id === id ? { ...f, ...family } : f))
          : [...prev, { ...family, id }]
        saveDemo(LS_KEYS.families, next)
        return next
      })
      return id
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
        addResidentToBuilding,
        removeResidentFromBuilding,
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
