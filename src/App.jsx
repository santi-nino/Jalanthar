import { useState, lazy, Suspense } from 'react'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { DataProvider } from './contexts/DataContext'
import Sidebar from './components/Sidebar'
import DmLogin from './components/DmLogin'
import MapTab from './components/tabs/MapTab'
import { isFirebaseConfigured } from './firebase'

// Everything below is lazy-loaded on purpose, not just out of habit: each
// of these pulls in a genuinely heavy dependency that most visits never
// touch on a given page load -- reactflow (~150kb) for the two tree/graph
// tabs, and the 500kb+ SRD item catalog (src/data/dnd5eItems.js) for the
// Catalogue tab and the building wares editor. Statically importing all of
// them (the way this file used to) meant every single visitor downloaded
// and parsed all of it up front just to see the Map tab, which is the
// default view. Splitting them into their own chunks means a player who
// only ever opens Map and Buildings never pays for reactflow or the SRD
// catalog at all. Map itself stays a normal static import since it's the
// tab that's visible immediately on load -- no point lazy-loading the one
// thing guaranteed to be needed right away.
const BuildingListTab = lazy(() => import('./components/tabs/BuildingListTab'))
const RelationshipTab = lazy(() => import('./components/tabs/RelationshipTab'))
const ResidentListTab = lazy(() => import('./components/tabs/ResidentListTab'))
const CatalogTab = lazy(() => import('./components/tabs/CatalogTab'))
const PantheonTab = lazy(() => import('./components/tabs/PantheonTab'))
const DmEditBuildingForm = lazy(() => import('./components/DmEditBuildingForm'))
const DmEditNpcForm = lazy(() => import('./components/DmEditNpcForm'))
const DmEditFamilyForm = lazy(() => import('./components/DmEditFamilyForm'))
const DmEditDeityForm = lazy(() => import('./components/DmEditDeityForm'))

// A minimal, near-invisible fallback -- these chunks are small enough
// (well under 200kb, mostly already cached after the first tab switch)
// that a full loading spinner would just be visual noise for what's
// normally a sub-100ms gap. This just holds the layout still.
function TabFallback() {
  return <div className="h-full w-full" aria-hidden="true" />
}

function AppShell() {
  const [activeTab, setActiveTab] = useState('map')
  const [showDmLogin, setShowDmLogin] = useState(false)
  const [editingBuilding, setEditingBuilding] = useState(undefined) // undefined = closed, null = new
  const [editingNpc, setEditingNpc] = useState(undefined)
  const [editingFamily, setEditingFamily] = useState(undefined)
  const [editingDeity, setEditingDeity] = useState(undefined)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const { isDm } = useAuth()

  return (
    <div className="h-screen w-screen flex overflow-hidden">
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenDm={() => setShowDmLogin(true)}
        mobileOpen={mobileNavOpen}
        onCloseMobile={() => setMobileNavOpen(false)}
      />

      <main className="flex-1 min-w-0 min-h-0 h-full overflow-hidden bg-parchment paper-texture flex flex-col">
        {/* Mobile-only top bar with hamburger — sidebar is off-canvas below md */}
        <div className="md:hidden flex items-center h-12 shrink-0 border-b border-leather/40 bg-parchment px-2">
          <button
            onClick={() => setMobileNavOpen(true)}
            aria-label="Open menu"
            className="p-2 text-leather-dark"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M3 6h18M3 12h18M3 18h18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
          <span className="font-display text-sm uppercase tracking-wide text-leather-dark ml-2">
            Jalanthar
          </span>
        </div>

        {!isFirebaseConfigured && (
          <div className="bg-gold/20 border-b border-gold text-xs font-mono text-leather-dark px-4 py-1.5 shrink-0">
            Demo mode — Firebase not connected. Data is stored only in this
            browser. See README.md to connect a real project.
          </div>
        )}

        <div className="flex-1 min-h-0">
          {activeTab === 'map' && (
            <MapTab
              onEditBuilding={isDm ? (b) => setEditingBuilding(b) : undefined}
              onEditNpc={isDm ? (n) => setEditingNpc(n) : undefined}
            />
          )}
          <Suspense fallback={<TabFallback />}>
            {activeTab === 'buildings' && (
              <BuildingListTab
                onEditBuilding={isDm ? (b) => setEditingBuilding(b) : undefined}
                onEditNpc={isDm ? (n) => setEditingNpc(n) : undefined}
              />
            )}
            {activeTab === 'residents' && (
              <RelationshipTab
                onEditNpc={isDm ? (n) => setEditingNpc(n) : undefined}
                onEditFamily={isDm ? (f) => setEditingFamily(f) : undefined}
              />
            )}
            {activeTab === 'roster' && (
              <ResidentListTab onEditNpc={isDm ? (n) => setEditingNpc(n) : undefined} />
            )}
            {activeTab === 'catalog' && <CatalogTab />}
            {activeTab === 'pantheon' && (
              <PantheonTab onEditDeity={isDm ? (d) => setEditingDeity(d) : undefined} />
            )}
          </Suspense>
        </div>
      </main>

      {showDmLogin && <DmLogin onClose={() => setShowDmLogin(false)} />}
      <Suspense fallback={null}>
        {editingBuilding !== undefined && (
          <DmEditBuildingForm
            building={editingBuilding}
            onClose={() => setEditingBuilding(undefined)}
          />
        )}
        {editingNpc !== undefined && (
          <DmEditNpcForm npc={editingNpc} onClose={() => setEditingNpc(undefined)} />
        )}
        {editingFamily !== undefined && (
          <DmEditFamilyForm
            family={editingFamily}
            onClose={() => setEditingFamily(undefined)}
          />
        )}
        {editingDeity !== undefined && (
          <DmEditDeityForm deity={editingDeity} onClose={() => setEditingDeity(undefined)} />
        )}
      </Suspense>
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <AppShell />
      </DataProvider>
    </AuthProvider>
  )
}
