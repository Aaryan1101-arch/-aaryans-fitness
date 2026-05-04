import { useState } from 'react'
import { supabaseConfigured } from '../../supabase/client'
import { useAuth } from '../hooks/useAuth'

export default function Login() {
  const { signIn } = useAuth()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await signIn(email)
      setSent(true)
    } catch (err) {
      setError(err.message || 'Could not send magic link. Check your email and try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!supabaseConfigured) {
    return (
      <div className="min-h-screen bg-ink-950 flex items-center justify-center px-4">
        <div className="glass-card p-8 max-w-sm w-full text-center">
          <div className="w-12 h-12 rounded-xl bg-brand/20 text-brand flex items-center justify-center mx-auto mb-4">
            <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.8" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
            </svg>
          </div>
          <p className="text-white font-semibold mb-2">Supabase not configured</p>
          <p className="text-white/40 text-sm leading-relaxed">
            Add <code className="text-brand-light">REACT_APP_SUPABASE_URL</code> and{' '}
            <code className="text-brand-light">REACT_APP_SUPABASE_ANON_KEY</code> to your environment variables.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-ink-950 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo mark */}
        <div className="flex justify-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-brand flex items-center justify-center shadow-glow">
            <svg fill="none" viewBox="0 0 24 24" strokeWidth="2.2" stroke="white" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
            </svg>
          </div>
        </div>

        <div className="glass-card p-8">
          {sent ? (
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-4">
                <svg fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
              </div>
              <p className="text-white font-semibold mb-2">Check your inbox</p>
              <p className="text-white/50 text-sm leading-relaxed">
                We sent a magic link to <span className="text-white">{email}</span>. Click it to sign in.
              </p>
              <button
                onClick={() => { setSent(false); setEmail('') }}
                className="mt-6 text-sm text-white/40 hover:text-white transition-colors"
              >
                Use a different email
              </button>
            </div>
          ) : (
            <>
              <p className="section-eyebrow text-left mb-1">Admin access</p>
              <h1 className="text-xl font-semibold text-white mb-6">Sign in</h1>

              <form onSubmit={handleSubmit}>
                <label htmlFor="email" className="block text-sm font-medium text-white/50 mb-2">
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="block w-full p-3 text-white bg-white/5 border border-white/10 rounded-xl placeholder:text-white/20 hover:border-white/20 focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/30 transition-all duration-200 mb-4"
                />

                {error && (
                  <p className="text-brand-light text-sm mb-4">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={loading || !email}
                  className="button w-full justify-center disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="inline-flex items-center gap-2">
                      <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.25" strokeWidth="4" />
                        <path fill="currentColor" d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4z" />
                      </svg>
                      Sending…
                    </span>
                  ) : 'Send Magic Link'}
                </button>
              </form>

              <p className="text-center text-xs text-white/25 mt-6">
                Only registered admins can sign in.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
