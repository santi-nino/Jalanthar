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
  query,
  where,
} from 'firebase/firestore'
import { onAuthStateChanged } from 'firebase/auth'
import { db, auth, isFirebaseConfigured } from '../firebase'
// mockData.js is ~600kb (it carries every seed building/NPC/family/deity,
// plus historically the full item catalog) and is ONLY ever read below in
// the isFirebaseConfigured===false branch -- real deployments (this one
// included) always have Firebase configured, so that branch never runs
// for an actual player or DM. It used to be a static import here, which
// meant every visitor's browser downloaded and parsed all 600kb of seed
// data on every page load whether or not it was ever used. Now it's only
// fetched as its own chunk on the rare path that actually needs it (local
// dev without a configured Firebase project).

const DataContext = createContext(null)

const LS_KEYS = {
  buildings: 'jalanthar-demo-buildings',
  npcs: 'jalanthar-demo-npcs',
  families: 'jalanthar-demo-families',
  sources: 'jalanthar-demo-sources',
  deities: 'jalanthar-demo-deities',
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
  const [sources, setSources] = useState([])
  const [deities, setDeities] = useState([])
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
      const unsubBuildings = onSnapshot(collection(db, 'buildings'), (snap) =>
        setBuildings(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
      )
      const unsubFamilies = onSnapshot(collection(db, 'families'), (snap) =>
        setFamilies(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
      )

      // The npcs rule is `visible == true || revealedViaBuilding == true ||
      // auth != null` — a per-document condition. Firestore's real behavior
      // for list/collection queries is "all or nothing": it checks whether
      // every document a query COULD possibly return is provably allowed
      // by the rule, and if not, it rejects the ENTIRE query outright — it
      // does NOT silently filter out just the disallowed documents. (This
      // is documented Firestore behavior, not a bug on our end — Firebase's
      // own docs use this exact "public cities" example:
      // https://firebase.google.com/docs/firestore/security/rules-query.)
      // A plain unconstrained onSnapshot(collection(db,'npcs')) therefore
      // returned PERMISSION_DENIED — and an empty list — for every non-DM
      // visitor, regardless of how many NPCs actually had visible:true.
      // Nothing revealed was ever reaching a player's browser.
      //
      // The fix: query with an explicit where() matching one branch of the
      // rule's OR exactly. Firestore CAN statically prove a query like
      // `.where('visible','==',true)` only ever returns documents where
      // that field is true, satisfying the rule's first branch for every
      // possible result — so that query is allowed. Same logic for the
      // second branch. Two queries, merged client-side by id, cover the
      // full "visible OR revealedViaBuilding" set a player should see.
      // The DM doesn't need any of this: once authenticated, `auth != null`
      // alone makes the OR unconditionally true for every document
      // regardless of its data, so the plain unconstrained query is
      // provably fine in that case — same as it always was.
      let unsubNpcs = () => {}
      let unsubSources = () => {}
      // Sources are now readable by anyone (`allow read: if true` — see
      // firestore.rules) since the Catalogue tab is player-facing, so this
      // subscription is set up once, outside the auth branch below, and
      // stays live for players and the DM alike.
      unsubSources = onSnapshot(collection(db, 'sources'), (snap) =>
        setSources(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
      )
      // Deities are public read too (general Realms mythology isn't a
      // campaign spoiler the way an NPC's existence can be) -- same
      // always-on, outside-the-auth-branch pattern as sources above.
      const unsubDeities = onSnapshot(collection(db, 'deities'), (snap) =>
        setDeities(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
      )
      const unsubAuth = onAuthStateChanged(auth, (user) => {
        unsubNpcs()
        if (user) {
          unsubNpcs = onSnapshot(collection(db, 'npcs'), (snap) =>
            setNpcs(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
          )
        } else {
          let visibleDocs = {}
          let revealedDocs = {}
          const emit = () => setNpcs(Object.values({ ...visibleDocs, ...revealedDocs }))
          const unsubVisible = onSnapshot(
            query(collection(db, 'npcs'), where('visible', '==', true)),
            (snap) => {
              visibleDocs = Object.fromEntries(
                snap.docs.map((d) => [d.id, { id: d.id, ...d.data() }])
              )
              emit()
            }
          )
          const unsubRevealed = onSnapshot(
            query(collection(db, 'npcs'), where('revealedViaBuilding', '==', true)),
            (snap) => {
              revealedDocs = Object.fromEntries(
                snap.docs.map((d) => [d.id, { id: d.id, ...d.data() }])
              )
              emit()
            }
          )
          unsubNpcs = () => {
            unsubVisible()
            unsubRevealed()
          }
          // Sources are subscribed to once above regardless of auth state
          // -- no per-branch handling needed here.
        }
      })

      setLoading(false)
      return () => {
        unsubBuildings()
        unsubFamilies()
        unsubAuth()
        unsubNpcs()
        unsubSources()
        unsubDeities()
      }
    } else {
      import('../data/mockData').then(({ mockBuildings, mockNpcs, mockFamilies, mockDeities }) => {
        setBuildings(loadDemo(LS_KEYS.buildings, mockBuildings))
        setNpcs(loadDemo(LS_KEYS.npcs, mockNpcs))
        setFamilies(loadDemo(LS_KEYS.families, mockFamilies))
        setSources(loadDemo(LS_KEYS.sources, []))
        setDeities(loadDemo(LS_KEYS.deities, mockDeities))
        setLoading(false)
      })
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

  // ---- Sources ----
  // DM-only reference material (scanned menus, price lists, sourcebook
  // pages) — never shown to players, unlike buildings/npcs/families. See
  // the `sources` Firestore rule: read AND write both require auth, not
  // just write.
  const saveSource = useCallback(async (source) => {
    if (isFirebaseConfigured) {
      const ref = source.id
        ? doc(db, 'sources', source.id)
        : doc(collection(db, 'sources'))
      const { id: _discard, ...rest } = source
      await setDoc(ref, rest, { merge: true })
      return ref.id
    } else {
      const id = source.id || `src-${Date.now()}`
      setSources((prev) => {
        const next = source.id
          ? prev.map((s) => (s.id === id ? { ...s, ...source } : s))
          : [...prev, { ...source, id }]
        saveDemo(LS_KEYS.sources, next)
        return next
      })
      return id
    }
  }, [])

  const removeSource = useCallback(async (id) => {
    if (isFirebaseConfigured) {
      await deleteDoc(doc(db, 'sources', id))
    } else {
      setSources((prev) => {
        const next = prev.filter((s) => s.id !== id)
        saveDemo(LS_KEYS.sources, next)
        return next
      })
    }
  }, [])

  // ---- Deities (Pantheon tab) ----
  // Public read like buildings/families (general Realms mythology isn't a
  // spoiler), DM-only write -- see the `deities` Firestore rule. Same
  // create-or-update-by-id shape as saveSource/saveNpc/saveFamily above.
  const saveDeity = useCallback(async (deity) => {
    if (isFirebaseConfigured) {
      const ref = deity.id ? doc(db, 'deities', deity.id) : doc(collection(db, 'deities'))
      const { id: _discard, ...rest } = deity
      await setDoc(ref, rest, { merge: true })
      return ref.id
    } else {
      const id = deity.id || `deity-${Date.now()}`
      setDeities((prev) => {
        const next = deity.id
          ? prev.map((d) => (d.id === id ? { ...d, ...deity } : d))
          : [...prev, { ...deity, id }]
        saveDemo(LS_KEYS.deities, next)
        return next
      })
      return id
    }
  }, [])

  const removeDeity = useCallback(async (id) => {
    if (isFirebaseConfigured) {
      await deleteDoc(doc(db, 'deities', id))
    } else {
      setDeities((prev) => {
        const next = prev.filter((d) => d.id !== id)
        saveDemo(LS_KEYS.deities, next)
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
        sources,
        deities,
        loading,
        saveBuilding,
        removeBuilding,
        addResidentToBuilding,
        removeResidentFromBuilding,
        saveNpc,
        removeNpc,
        saveFamily,
        removeFamily,
        saveSource,
        removeSource,
        saveDeity,
        removeDeity,
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
