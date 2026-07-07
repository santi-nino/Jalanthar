import { useState } from 'react'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { DataProvider } from './contexts/DataContext'
import Sidebar from './components/Sidebar'
import DmLogin from './components/DmLogin'
import DmEditBuildingForm from './components/DmEditBuildingForm'
import DmEditNpcForm from './components/DmEditNpcForm'
import DmEditFamilyForm from './components/DmEditFamilyForm'
import MapTab from './components/tabs/MapTab'
import BuildingListTab from './components/tabs/BuildingListTab'
import RelationshipTab from './components/tabs/RelationshipTab'
import { isFirebaseConfigured } from './firebase'

function AppShell() {
  const [activeTab, setActiveTab] = useState('map')
  const [showDmLogin, setShowDmLogin] = useState(false)
  const [editingBuilding, setEditingBuilding] = useState(undefined) // undefined = closed, null = new
  const [editingNpc, setEditingNpc] = useState(undefined)
  const [editingFamily, setEditingFamily] = useState(undefined)
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
        </div>
      </main>

      {showDmLogin && <DmLogin onClose={() => setShowDmLogin(false)} />}
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
