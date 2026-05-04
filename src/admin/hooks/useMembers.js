import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../../supabase/client'

export function useMembers() {
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchMembers = useCallback(async () => {
    setLoading(true)
    setError(null)
    const { data, error } = await supabase
      .from('members')
      .select('*, subscriptions(id, plan_name, end_date, status)')
      .order('created_at', { ascending: false })
    if (error) setError(error.message)
    else setMembers(data || [])
    setLoading(false)
  }, [])

  useEffect(() => { fetchMembers() }, [fetchMembers])

  async function createMember(fields) {
    const { data, error } = await supabase
      .from('members')
      .insert(fields)
      .select()
      .single()
    if (error) throw error
    setMembers((prev) => [data, ...prev])
    return data
  }

  async function updateMember(id, fields) {
    const { data, error } = await supabase
      .from('members')
      .update(fields)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    setMembers((prev) => prev.map((m) => (m.id === id ? data : m)))
    return data
  }

  const stats = {
    total: members.length,
    active: members.filter((m) => m.status === 'active').length,
    expired: members.filter((m) => m.status === 'expired').length,
    expiringSoon: members.filter((m) => {
      const sub = m.subscriptions?.find((s) => s.status === 'active')
      if (!sub) return false
      const days = (new Date(sub.end_date) - new Date()) / 86400000
      return days >= 0 && days <= 7
    }).length,
  }

  return { members, loading, error, stats, refetch: fetchMembers, createMember, updateMember }
}
