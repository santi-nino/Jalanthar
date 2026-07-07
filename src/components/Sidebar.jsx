import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { IconMap, IconBuildings, IconResidents, IconKey, IconExit } from './icons'

const TABS = [
  { id: 'map', label: 'Map', Icon: IconMap },
  { id: 'buildings', label: 'Buildings', Icon: IconBuildings },
  { id: 'residents', label: 'Residents', Icon: IconResidents },
]

export default function Sidebar({ activeTab, onTabChange, onOpenDm }) {
  const [collapsed, setCollapsed] = useState(false)
  const { isDm, logout } = useAuth()

  return (
    <aside
      className={`leather-texture bg-leather text-parchment flex flex-col shrink-0 transition-[width] duration-300 ease-out ${
        collapsed ? 'w-16' : 'w-56'
      }`}
    >
      <button
        onClick={() => setCollapsed((c) => !c)}
        aria-label={collapsed ? 'Expand menu' : 'Collapse menu'}
        aria-expanded={!collapsed}
        className="flex items-center justify-center h-12 border-b border-leather-dark hover:bg-leather-dark/40 transition-colors"
      >
        <span className="text-gold-light text-lg">{collapsed ? '»' : '«'}</span>
      </button>

      <nav className="flex-1 py-4" aria-label="Site sections">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            aria-current={activeTab === tab.id ? 'page' : undefined}
            title={collapsed ? tab.label : undefined}
            className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors border-l-4 ${
              activeTab === tab.id
                ? 'border-gold bg-leather-dark/50 text-gold-light'
                : 'border-transparent hover:bg-leather-dark/30'
            }`}
          >
            <span className="text-xl leading-none" aria-hidden="true">
              <tab.Icon className="w-5 h-5" />
            </span>
            {!collapsed && (
              <span className="font-display text-sm tracking-wide uppercase">
                {tab.label}
              </span>
            )}
          </button>
        ))}
      </nav>

      <div className="border-t border-leather-dark p-3">
        {isDm ? (
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 text-xs font-display uppercase tracking-wide text-gold-light hover:text-parchment transition-colors py-2"
            title={collapsed ? 'End DM session' : undefined}
          >
            <IconExit className="w-4 h-4 shrink-0" />
            {!collapsed && 'End DM Session'}
          </button>
        ) : (
          <button
            onClick={onOpenDm}
            className="w-full flex items-center justify-center gap-2 text-xs font-display uppercase tracking-wide text-parchment/60 hover:text-gold-light transition-colors py-2"
            title={collapsed ? 'DM login' : undefined}
          >
            <IconKey className="w-4 h-4 shrink-0" />
            {!collapsed && 'DM Login'}
          </button>
        )}
      </div>
    </aside>
  )
}
