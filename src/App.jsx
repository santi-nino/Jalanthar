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
  const { isDm } = useAuth()

  return (
    <div className="h-screen w-screen flex overflow-hidden">
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenDm={() => setShowDmLogin(true)}
      />

      <main className="flex-1 min-w-0 min-h-0 h-full overflow-hidden bg-parchment paper-texture flex flex-col">
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
            />
          )}
          {activeTab === 'buildings' && (
            <BuildingListTab
              onEditBuilding={isDm ? (b) => setEditingBuilding(b) : undefined}
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
