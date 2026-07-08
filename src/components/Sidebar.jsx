import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { IconMap, IconBuildings, IconResidents, IconKey, IconExit } from './icons'
import ExportDataModal from './ExportDataModal'

const TABS = [
  { id: 'map', label: 'Map', Icon: IconMap },
  { id: 'buildings', label: 'Buildings', Icon: IconBuildings },
  { id: 'residents', label: 'Residents', Icon: IconResidents },
]

export default function Sidebar({ activeTab, onTabChange, onOpenDm, mobileOpen, onCloseMobile }) {
  const [collapsed, setCollapsed] = useState(false)
  const [exportOpen, setExportOpen] = useState(false)
  const { isDm, logout } = useAuth()

  function selectTab(id) {
    onTabChange(id)
    onCloseMobile?.()
  }

  return (
    <>
      {/* Backdrop, mobile only, closes the drawer on tap */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-ink/60 z-40 md:hidden"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      <aside
        className={`leather-texture bg-leather text-parchment flex flex-col shrink-0 transition-transform duration-300 ease-out
          fixed inset-y-0 left-0 z-50 w-64
          md:static md:z-auto md:translate-x-0 md:transition-[width]
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
          ${collapsed ? 'md:w-16' : 'md:w-56'}
        `}
      >
        <div className="flex items-center justify-between md:justify-center h-12 border-b border-leather-dark">
          <button
            onClick={() => setCollapsed((c) => !c)}
            aria-label={collapsed ? 'Expand menu' : 'Collapse menu'}
            aria-expanded={!collapsed}
            className="hidden md:flex flex-1 h-full items-center justify-center hover:bg-leather-dark/40 transition-colors"
          >
            <span className="text-gold-light text-lg">{collapsed ? '»' : '«'}</span>
          </button>
          <span className="md:hidden pl-4 font-display text-sm uppercase tracking-wide text-gold-light">
            Jalanthar
          </span>
          <button
            onClick={onCloseMobile}
            aria-label="Close menu"
            className="md:hidden px-4 h-full text-parchment/70 hover:text-gold-light text-xl leading-none"
          >
            ×
          </button>
        </div>

        <nav className="flex-1 py-4" aria-label="Site sections">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => selectTab(tab.id)}
              aria-current={activeTab === tab.id ? 'page' : undefined}
              title={collapsed ? tab.label : undefined}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors border-l-4 ${
                activeTab === tab.id
                  ? 'border-gold bg-leather-dark/50 text-gold-light'
                  : 'border-transparent hover:bg-leather-dark/30'
              }`}
            >
              <span className="text-xl leading-none shrink-0" aria-hidden="true">
                <tab.Icon className="w-5 h-5" />
              </span>
              <span
                className={`font-display text-sm tracking-wide uppercase ${
                  collapsed ? 'md:hidden' : ''
                }`}
              >
                {tab.label}
              </span>
            </button>
          ))}
        </nav>

        <div className="border-t border-leather-dark p-3 space-y-1">
          {isDm && (
            <button
              onClick={() => setExportOpen(true)}
              className="w-full flex items-center justify-center gap-2 text-xs font-display uppercase tracking-wide text-parchment/70 hover:text-gold-light transition-colors py-2"
              title={collapsed ? 'Export data for Claude' : undefined}
            >
              <span className="w-4 h-4 shrink-0 flex items-center justify-center text-sm">⇩</span>
              <span className={collapsed ? 'md:hidden' : ''}>Export Data</span>
            </button>
          )}
          {isDm ? (
            <button
              onClick={logout}
              className="w-full flex items-center justify-center gap-2 text-xs font-display uppercase tracking-wide text-gold-light hover:text-parchment transition-colors py-2"
              title={collapsed ? 'End DM session' : undefined}
            >
              <IconExit className="w-4 h-4 shrink-0" />
              <span className={collapsed ? 'md:hidden' : ''}>End DM Session</span>
            </button>
          ) : (
            <button
              onClick={onOpenDm}
              className="w-full flex items-center justify-center gap-2 text-xs font-display uppercase tracking-wide text-parchment/60 hover:text-gold-light transition-colors py-2"
              title={collapsed ? 'DM login' : undefined}
            >
              <IconKey className="w-4 h-4 shrink-0" />
              <span className={collapsed ? 'md:hidden' : ''}>DM Login</span>
            </button>
          )}
        </div>
      </aside>
      {exportOpen && <ExportDataModal onClose={() => setExportOpen(false)} />}
    </>
  )
}
