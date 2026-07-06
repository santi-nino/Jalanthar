import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { isFirebaseConfigured } from '../firebase'

export default function DmLogin({ onClose }) {
  const { login, error } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitting(true)
    const ok = await login(email, password)
    setSubmitting(false)
    if (ok) onClose()
  }

  return (
    <div
      className="fixed inset-0 bg-ink/60 flex items-center justify-center z-50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="dm-login-title"
      onClick={onClose}
    >
      <form
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
        className="bg-parchment paper-texture border-2 border-gold rounded-sm shadow-2xl w-full max-w-sm p-6"
      >
        <h2
          id="dm-login-title"
          className="font-display text-xl text-leather-dark mb-1 uppercase tracking-wide"
        >
          DM Access
        </h2>
        <p className="text-sm text-ink-soft mb-4 font-body italic">
          The chronicle only answers to its keeper.
        </p>

        {isFirebaseConfigured && (
          <label className="block mb-3">
            <span className="text-sm font-display uppercase tracking-wide text-ink-soft">
              Email
            </span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-sm border border-leather bg-white/60 px-3 py-2 font-body focus:outline-none"
              autoFocus
            />
          </label>
        )}

        <label className="block mb-4">
          <span className="text-sm font-display uppercase tracking-wide text-ink-soft">
            Password
          </span>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-sm border border-leather bg-white/60 px-3 py-2 font-body focus:outline-none"
          />
        </label>

        {!isFirebaseConfigured && (
          <p className="text-xs text-wax mb-4">
            Demo mode: no Firebase project connected yet. This login only checks
            a local password meant for testing — it is not secure. Connect
            Firebase before sharing this site with players.
          </p>
        )}

        {error && <p className="text-sm text-wax mb-3">{error}</p>}

        <div className="flex gap-2 justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-display uppercase tracking-wide text-ink-soft hover:text-ink"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2 text-sm font-display uppercase tracking-wide bg-leather text-parchment rounded-sm hover:bg-leather-dark transition-colors disabled:opacity-50"
          >
            {submitting ? 'Checking…' : 'Enter'}
          </button>
        </div>
      </form>
    </div>
  )
}
