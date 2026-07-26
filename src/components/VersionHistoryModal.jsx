import { VERSION_HISTORY } from '../data/version'

export default function VersionHistoryModal({ onClose }) {
  return (
    <div
      className="fixed inset-0 bg-ink/60 flex items-center justify-center z-50 p-4"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-parchment paper-texture border-2 border-gold rounded-sm shadow-2xl w-full max-w-lg max-h-[80vh] flex flex-col p-6"
      >
        <h2 className="font-display text-xl text-leather-dark uppercase tracking-wide mb-3">
          Version History
        </h2>
        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          {VERSION_HISTORY.map((v, i) => (
            <div key={v.version} className={i === 0 ? '' : 'opacity-70'}>
              <p className="text-sm font-display uppercase tracking-wide text-leather">
                Version {v.version}
                {i === 0 && <span className="ml-2 text-[10px] normal-case text-moss-dark">current</span>}
              </p>
              <p className="text-xs text-ink-soft mt-0.5 leading-relaxed">{v.notes}</p>
            </div>
          ))}
        </div>
        <div className="flex justify-end mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-display uppercase text-ink-soft"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
