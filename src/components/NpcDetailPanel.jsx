import { useAuth } from '../contexts/AuthContext'

const REL_LABELS = { family: 'Family', friend: 'Friend', rival: 'Rival' }
const REL_COLORS = {
  family: 'text-ink-soft',
  friend: 'text-moss-dark',
  rival: 'text-wax-dark',
}

export default function NpcDetailPanel({ npc, npcsById, onEdit, onSelectRelated }) {
  const { isDm } = useAuth()

  return (
    <div className="font-body">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-display text-2xl text-leather-dark leading-tight">{npc.name}</h3>
          <p className="text-sm uppercase tracking-wide text-ink-soft/70 font-display mt-1">
            {npc.familyName}
            {npc.job && <span> · {npc.job}</span>}
          </p>
        </div>
        {isDm && onEdit && (
          <button
            onClick={onEdit}
            className="text-xs font-display uppercase tracking-wide text-wax hover:text-wax-dark border border-wax rounded-sm px-2 py-1 shrink-0"
          >
            Edit
          </button>
        )}
      </div>

      {npc.famousQuote && (
        <p className="mt-3 italic text-ink-soft border-l-2 border-gold pl-3">
          "{npc.famousQuote}"
        </p>
      )}

      <div className="mt-4 space-y-4">
        {(npc.eyeColor || npc.hairColor || npc.height || npc.weight) && (
          <div>
            <h4 className="font-display text-sm uppercase tracking-wide text-leather-dark mb-1">
              At a Glance
            </h4>
            <ul className="text-ink-soft text-sm grid grid-cols-2 gap-x-4 gap-y-0.5">
              {npc.eyeColor && <li>Eyes: {npc.eyeColor}</li>}
              {npc.hairColor && <li>Hair: {npc.hairColor}</li>}
              {npc.height && <li>Height: {npc.height}</li>}
              {npc.weight && <li>Weight: {npc.weight}</li>}
            </ul>
          </div>
        )}
        {npc.distinguishingFeatures && (
          <Section title="Distinguishing Features" text={npc.distinguishingFeatures} />
        )}
        {npc.appearance && (
          <Section title="Appearance" text={npc.appearance} />
        )}
        {npc.clothing && <Section title="Clothing" text={npc.clothing} />}
        {npc.personality && <Section title="Personality" text={npc.personality} />}
        {npc.history && <Section title="Known History" text={npc.history} />}

        {npc.relationships?.length > 0 && (
          <div>
            <h4 className="font-display text-sm uppercase tracking-wide text-leather-dark mb-1">
              Relationships
            </h4>
            <ul className="space-y-1">
              {npc.relationships.map((rel, i) => {
                const target = npcsById[rel.targetId]
                if (!target) return null
                return (
                  <li key={i}>
                    <button
                      onClick={() => onSelectRelated?.(target.id)}
                      className="underline decoration-dotted hover:text-wax text-left"
                    >
                      {target.name}
                    </button>
                    <span className={`ml-2 text-xs font-display uppercase tracking-wide ${REL_COLORS[rel.type]}`}>
                      {REL_LABELS[rel.type] || rel.type}
                    </span>
                    {rel.note && (
                      <span className="block text-sm italic text-ink-soft/80">{rel.note}</span>
                    )}
                  </li>
                )
              })}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

function Section({ title, text }) {
  return (
    <div>
      <h4 className="font-display text-sm uppercase tracking-wide text-leather-dark mb-1">
        {title}
      </h4>
      <p className="text-ink-soft leading-relaxed whitespace-pre-line">{text}</p>
    </div>
  )
}
