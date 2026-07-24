// Helper to push content from src/data/mockData.js into Firestore.
//
// IMPORTANT — by default this SKIPS any document whose ID already exists in
// Firestore. It only ever creates documents that are missing. This used to
// unconditionally overwrite every matching document (including ones you'd
// since hand-edited live — map coordinates, relationship tree positions,
// wares, reveal flags, all of it), which caused real data loss the one time
// it got re-run after live edits had been made. That old "safe to run more
// than once" claim in this comment was wrong, and the behavior has been
// changed to match — see --force below if you genuinely want the old
// behavior back for a specific one-off reason.
//
// ONE exception to "skip if it already exists": a building's `residents`
// array. When a new family gets added whose members work at an existing
// building (the guild, a shop, a temple...), that building's document
// already exists — so a plain skip would silently drop those new
// residents forever, which already happened more than once in practice.
// The fix is a separate, narrow pass that only ever UNIONS mockData.js's
// residents into an existing building's residents — it adds IDs, never
// removes one, and never touches any other field (coordinates,
// description, wares, anything). New buildings still go through the
// normal create-if-missing path above; this only covers buildings that
// already existed before this run.
//
// Setup:
//   1. Firebase Console > Project Settings > Service Accounts >
//      "Generate new private key". Save the downloaded file as
//      scripts/serviceAccountKey.json (already gitignored).
//   2. npm run seed
//
// To force-overwrite documents that already exist (DANGEROUS — this will
// blow away any live edits made to those exact document IDs since
// mockData.js was last updated):
//   npm run seed -- --force
//
// This script is NOT part of the deployed website — it's a one-off CLI tool
// you run locally, from your own machine.

import { initializeApp, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import path from 'path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const FORCE = process.argv.includes('--force')

let serviceAccount
try {
  serviceAccount = JSON.parse(
    readFileSync(path.join(__dirname, 'serviceAccountKey.json'), 'utf-8')
  )
} catch {
  console.error(
    '\nMissing scripts/serviceAccountKey.json.\n' +
      'Download it from Firebase Console > Project Settings > Service Accounts\n' +
      '> Generate new private key, save it at scripts/serviceAccountKey.json, and re-run.\n'
  )
  process.exit(1)
}

initializeApp({ credential: cert(serviceAccount) })
const db = getFirestore()

const { mockBuildings, mockNpcs, mockFamilies, mockSources } = await import(
  '../src/data/mockData.js'
)

async function seedCollection(name, docs) {
  const existingIds = FORCE
    ? new Set()
    : new Set((await db.collection(name).listDocuments()).map((ref) => ref.id))

  const batch = db.batch()
  let created = 0
  let skipped = 0
  for (const d of docs) {
    const { id, ...rest } = d
    if (existingIds.has(id)) {
      skipped++
      continue
    }
    batch.set(db.collection(name).doc(id), rest)
    created++
  }
  await batch.commit()
  console.log(
    `"${name}": created ${created} new document(s)` +
      (skipped ? `, skipped ${skipped} that already existed` : '')
  )
  return existingIds
}

async function mergeExistingBuildingResidents(docs, existingIds) {
  if (FORCE) return // --force already fully overwrote these, nothing to merge
  const batch = db.batch()
  let updated = 0
  for (const b of docs) {
    if (!existingIds.has(b.id)) continue // handled by the create pass above
    const snap = await db.collection('buildings').doc(b.id).get()
    const liveResidents = snap.data()?.residents || []
    const merged = [...new Set([...liveResidents, ...(b.residents || [])])]
    if (merged.length !== liveResidents.length) {
      batch.update(db.collection('buildings').doc(b.id), { residents: merged })
      updated++
    }
  }
  if (updated > 0) {
    await batch.commit()
  }
  console.log(
    `"buildings": merged new residents into ${updated} existing building(s)` +
      (updated === 0 ? ' (nothing new to add)' : '')
  )
}

if (FORCE) {
  console.log(
    '\n--force is set: this WILL overwrite every document whose ID already exists,\n' +
      'wiping out any live edits made to those documents. Proceeding in 5 seconds —\n' +
      'Ctrl+C now to abort.\n'
  )
  await new Promise((resolve) => setTimeout(resolve, 5000))
}

const existingBuildingIds = await seedCollection('buildings', mockBuildings)
await mergeExistingBuildingResidents(mockBuildings, existingBuildingIds)
await seedCollection('npcs', mockNpcs)
await seedCollection('families', mockFamilies)
await seedCollection('sources', mockSources)

console.log('\nDone.')
process.exit(0)
