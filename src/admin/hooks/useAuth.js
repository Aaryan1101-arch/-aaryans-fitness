import { useState, useEffect } from 'react'
import { supabase } from '../../supabase/client'

export function useAuth() {
  // undefined = still loading; null = no session
  const [session, setSession] = useState(undefined)
  const [admin, setAdmin] = useState(null)
  const [adminLoading, setAdminLoading] = useState(false)

  async function fetchAdmin(uid) {
    setAdminLoading(true)
    const { data } = await supabase
      .from('admins')
      .select('id, email, role, last_seen_at')
      .eq('auth_id', uid)
      .single()

    if (!data) {
      await supabase.auth.signOut()
      setAdmin(null)
    } else {
      setAdmin(data)
      supabase.from('admins').update({ last_seen_at: new Date().toISOString() }).eq('auth_id', uid)
    }
    setAdminLoading(false)
  }

  useEffect(() => {
    if (!supabase) { setSession(null); return }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      if (session) fetchAdmin(session.user.id)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      if (session) fetchAdmin(session.user.id)
      else setAdmin(null)
    })

    return () => subscription.unsubscribe()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function signIn(email) {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/admin` },
    })
    if (error) throw error
  }

  async function signOut() {
    await supabase.auth.signOut()
  }

  const loading = session === undefined || (session !== null && adminLoading)

  return { session, admin, loading, signIn, signOut }
}
