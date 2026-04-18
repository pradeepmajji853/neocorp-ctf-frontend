import React, { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [player, setPlayer] = useState(null)
  const [solved, setSolved] = useState([])
  const [serviceMap, setServiceMap] = useState({})
  const [loading, setLoading] = useState(true)

  const fetchMe = async () => {
    try {
      const res = await axios.get('/api/auth/me', { withCredentials: true })
      setPlayer(res.data.player)
      setSolved(res.data.solved || [])

      // Also fetch the serviceMap from progress after confirming auth
      try {
        const prog = await axios.get('/api/progress', { withCredentials: true })
        setSolved(prog.data.solved || [])
        setServiceMap(prog.data.serviceMap || {})
      } catch { /* progress fetch failed, serviceMap stays empty */ }
    } catch {
      setPlayer(null)
      setSolved([])
      setServiceMap({})
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchMe() }, [])

  const login = async (username, password) => {
    const res = await axios.post('/api/auth/login', { username, password }, { withCredentials: true })
    setPlayer(res.data.player)
    await fetchMe()
    return res.data
  }

  const register = async (username, password) => {
    const res = await axios.post('/api/auth/register', { username, password }, { withCredentials: true })
    setPlayer(res.data.player)
    await fetchMe()
    return res.data
  }

  const logout = async () => {
    await axios.post('/api/auth/logout', {}, { withCredentials: true })
    setPlayer(null)
    setSolved([])
  }

  const refreshProgress = async () => {
    try {
      const res = await axios.get('/api/progress', { withCredentials: true })
      setSolved(res.data.solved || [])
      setServiceMap(res.data.serviceMap || {})
    } catch { /* ignore */ }
  }

  const isUnlocked = (challengeId) => {
    if (challengeId <= 1) return true
    return solved.includes(challengeId - 1)
  }

  return (
    <AuthContext.Provider value={{ player, solved, serviceMap, loading, login, register, logout, refreshProgress, isUnlocked }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
