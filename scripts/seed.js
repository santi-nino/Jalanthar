// One-time helper to push the starter content (src/data/mockData.js) into a
// freshly-created Firestore project, so you're not starting from a totally
// empty database. Safe to run more than once — it overwrites by the same
// document IDs, it doesn't duplicate.
//
// Setup:
//   1. Firebase Console > Project Settings > Service Accounts >
//      "Generate new private key". Save the downloaded file as
//      scripts/serviceAccountKey.json (already gitignored).
//   2. npm run seed
//
// This script is NOT part of the deployed website — it's a one-off CLI tool
// you run locally, once, from your own machine.

import { initializeApp, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import path from 'path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

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

const { mockBuildings, mockNpcs, mockFamilies } = await import(
  '../src/data/mockData.js'
)

async function seedCollection(name, docs) {
  const batch = db.batch()
  for (const d of docs) {
    const { id, ...rest } = d
    batch.set(db.collection(name).doc(id), rest)
  }
  await batch.commit()
  console.log(`Seeded ${docs.length} document(s) into "${name}"`)
}

await seedCollection('buildings', mockBuildings)
await seedCollection('npcs', mockNpcs)
await seedCollection('families', mockFamilies)

console.log('\nDone. Your Firestore project now has starter content.')
process.exit(0)
