import { useState, useEffect, useCallback, useMemo } from 'react'
import { supabase } from '../../supabase/client'

export function useLeads() {
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchLeads = useCallback(async () => {
    setLoading(true)
    setError(null)
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) setError(error.message)
    else setLeads(data || [])
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchLeads()

    const channel = supabase
      .channel('leads-realtime')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'leads' }, (payload) => {
        setLeads((prev) => [payload.new, ...prev])
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'leads' }, (payload) => {
        setLeads((prev) => prev.map((l) => (l.id === payload.new.id ? payload.new : l)))
      })
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [fetchLeads])

  const stats = useMemo(() => {
    const now = new Date()
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const weekStart = new Date(todayStart)
    weekStart.setDate(weekStart.getDate() - 6)

    const byStatus = leads.reduce((acc, l) => {
      acc[l.status] = (acc[l.status] || 0) + 1
      return acc
    }, {})

    return {
      total: leads.length,
      today: leads.filter((l) => new Date(l.created_at) >= todayStart).length,
      thisWeek: leads.filter((l) => new Date(l.created_at) >= weekStart).length,
      byStatus,
      new: byStatus.new || 0,
    }
  }, [leads])

  async function updateStatus(id, status) {
    const { error } = await supabase.from('leads').update({ status }).eq('id', id)
    if (error) throw error
  }

  async function updateNotes(id, notes) {
    const { error } = await supabase.from('leads').update({ notes }).eq('id', id)
    if (error) throw error
  }

  return { leads, loading, error, stats, refetch: fetchLeads, updateStatus, updateNotes }
}
