import React, { useState, useEffect, useRef, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { Menu, Search, Bell, X, TrendingUp, Users, Heart, ChevronRight } from 'lucide-react'
import { useData } from './context/DataContext'

export function HeaderBar({ userName, onToggleSidebar, onNavigate }) {
  const { token, campaigns, donors, donations } = useData()
  const [messages, setMessages] = useState([])
  const [newReplies, setNewReplies] = useState([])
  const [bellOpen, setBellOpen] = useState(false)
  const bellRef = useRef(null)

 
  const [query, setQuery] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0, width: 0 })
  const searchWrapRef = useRef(null)
  const inputRef = useRef(null)

  const SEEN_KEY = 'seen_reply_counts'

  const fetchMessages = async () => {
    if (!token) return
    try {
      const res = await fetch('http://localhost:5001/api/messages/mine', {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        const data = await res.json()
        setMessages(data)
        const seen = JSON.parse(localStorage.getItem(SEEN_KEY) || '{}')
        const fresh = data.filter((m) => {
          const currentCount = m.replies?.length || 0
          const seenCount = seen[m.id] ?? 0
          return currentCount > seenCount
        })
        setNewReplies(fresh)
      }
    } catch {}
  }

  useEffect(() => {
    fetchMessages()
    const interval = setInterval(fetchMessages, 10000)
    return () => clearInterval(interval)
  }, [token])

 
  useEffect(() => {
    const handleClick = (e) => {
      if (bellRef.current && !bellRef.current.contains(e.target)) setBellOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  
  useEffect(() => {
    const handleClick = (e) => {
      const portal = document.getElementById('search-portal')
      const inWrap = searchWrapRef.current?.contains(e.target)
      const inPortal = portal?.contains(e.target)
      if (!inWrap && !inPortal) setSearchOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

 
  const updateDropdownPos = useCallback(() => {
    if (searchWrapRef.current) {
      const rect = searchWrapRef.current.getBoundingClientRect()
      setDropdownPos({ top: rect.bottom + 8, left: rect.left, width: rect.width })
    }
  }, [])

  useEffect(() => {
    if (searchOpen) updateDropdownPos()
  }, [searchOpen, updateDropdownPos])

  useEffect(() => {
    window.addEventListener('resize', updateDropdownPos)
    return () => window.removeEventListener('resize', updateDropdownPos)
  }, [updateDropdownPos])

  const markAllSeen = () => {
    const seen = JSON.parse(localStorage.getItem(SEEN_KEY) || '{}')
    messages.forEach((m) => { seen[m.id] = m.replies?.length || 0 })
    localStorage.setItem(SEEN_KEY, JSON.stringify(seen))
    setNewReplies([])
  }

  const totalNew = newReplies.length

  // ── Search logic ──
  const q = query.trim().toLowerCase()

  const matchedCampaigns = q.length >= 1
    ? (campaigns || []).filter(c =>
        c.title?.toLowerCase().includes(q) ||
        c.description?.toLowerCase().includes(q)
      ).slice(0, 4)
    : []

  const matchedDonors = q.length >= 1
    ? (donors || []).filter(d =>
        d.sponsor?.toLowerCase().includes(q) ||
        d.project?.toLowerCase().includes(q) ||
        d.type?.toLowerCase().includes(q)
      ).slice(0, 3)
    : []

  const matchedDonations = q.length >= 1
    ? (donations || []).filter(d =>
        d.donor?.toLowerCase().includes(q) ||
        d.campaign?.toLowerCase().includes(q) ||
        d.channel?.toLowerCase().includes(q)
      ).slice(0, 3)
    : []

  const hasResults = matchedCampaigns.length > 0 || matchedDonors.length > 0 || matchedDonations.length > 0
  const showDropdown = searchOpen && q.length >= 1
  const totalResults = matchedCampaigns.length + matchedDonors.length + matchedDonations.length

  const handleResultClick = (page) => {
    setQuery('')
    setSearchOpen(false)
    onNavigate?.(page)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') { setQuery(''); setSearchOpen(false) }
  }


  const SearchDropdown = (
    <div
      id="search-portal"
      style={{
        position: 'fixed',
        top: dropdownPos.top,
        left: dropdownPos.left,
        width: dropdownPos.width,
        zIndex: 9999,
      }}
      className="bg-white border border-gray-200 rounded-2xl shadow-2xl overflow-hidden"
    >
      {!hasResults ? (
        <div className="px-4 py-6 text-center text-sm text-gray-400">
          No results for "<span className="font-medium text-gray-600">{query}</span>"
        </div>
      ) : (
        <div className="max-h-96 overflow-y-auto">

          {/* Campaigns */}
          {matchedCampaigns.length > 0 && (
            <div>
              <div className="px-4 py-2 flex items-center gap-1.5 bg-gray-50 border-b border-gray-100">
                <TrendingUp className="h-3 w-3 text-gray-400" />
                <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">Campaigns</span>
              </div>
              {matchedCampaigns.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => handleResultClick('campaigns')}
                  className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-blue-50 transition-colors text-left group border-b border-gray-50"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{c.title}</p>
                    {c.description && (
                      <p className="text-xs text-gray-400 truncate mt-0.5">{c.description}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0 ml-3">
                    <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${
                      c.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {c.status}
                    </span>
                    <ChevronRight className="h-3.5 w-3.5 text-gray-300 group-hover:text-blue-400 transition-colors" />
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Sponsors */}
          {matchedDonors.length > 0 && (
            <div>
              <div className="px-4 py-2 flex items-center gap-1.5 bg-gray-50 border-b border-gray-100">
                <Users className="h-3 w-3 text-gray-400" />
                <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">Sponsors</span>
              </div>
              {matchedDonors.map((d) => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => handleResultClick('campaigns')}
                  className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-blue-50 transition-colors text-left group border-b border-gray-50"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{d.sponsor}</p>
                    <p className="text-xs text-gray-400 truncate mt-0.5">{d.project} · {d.type}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 ml-3">
                    <span className="text-xs font-semibold text-gray-700">
                      ₱{Number(d.amount || 0).toLocaleString()}
                    </span>
                    <ChevronRight className="h-3.5 w-3.5 text-gray-300 group-hover:text-blue-400 transition-colors" />
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Donations */}
          {matchedDonations.length > 0 && (
            <div>
              <div className="px-4 py-2 flex items-center gap-1.5 bg-gray-50 border-b border-gray-100">
                <Heart className="h-3 w-3 text-gray-400" />
                <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">Donations</span>
              </div>
              {matchedDonations.map((d) => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => handleResultClick('campaigns')}
                  className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-blue-50 transition-colors text-left group border-b border-gray-50"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{d.donor}</p>
                    <p className="text-xs text-gray-400 truncate mt-0.5">{d.campaign} · {d.channel}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 ml-3">
                    <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${
                      d.status === 'Completed' ? 'bg-green-100 text-green-700' :
                      d.status === 'Pending' ? 'bg-amber-100 text-amber-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {d.status}
                    </span>
                    <span className="text-xs font-semibold text-gray-700">
                      ₱{Number(d.amount || 0).toLocaleString()}
                    </span>
                    <ChevronRight className="h-3.5 w-3.5 text-gray-300 group-hover:text-blue-400 transition-colors" />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="px-4 py-2 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
        <span className="text-[10px] text-gray-400">
          {hasResults ? `${totalResults} result${totalResults !== 1 ? 's' : ''}` : 'Try a different keyword'}
        </span>
        <span className="text-[10px] text-gray-400">
          Press <kbd className="px-1 py-0.5 bg-gray-200 rounded text-[9px] font-mono">Esc</kbd> to close
        </span>
      </div>
    </div>
  )

  return (
    <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6 sticky top-0 z-10">
      <div className="flex-1 flex items-center gap-3 max-w-xl">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="p-1.5 rounded-full text-gray-500 hover:text-blue-600 hover:bg-blue-50"
        >
          <Menu className="h-5 w-5" />
        </button>

       
        <div className="relative w-full" ref={searchWrapRef}>
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setSearchOpen(true); updateDropdownPos() }}
            onFocus={() => { setSearchOpen(true); updateDropdownPos() }}
            onKeyDown={handleKeyDown}
            className="block w-full pl-9 pr-8 py-2 border border-gray-300 rounded-full bg-gray-50 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm transition-colors"
            placeholder="Search campaigns, donors, donations..."
          />
          {query && (
            <button
              type="button"
              onClick={() => { setQuery(''); setSearchOpen(false); inputRef.current?.focus() }}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

     
      {showDropdown && createPortal(SearchDropdown, document.body)}

      <div className="flex items-center gap-3">
        <div className="hidden md:flex items-center text-[11px] text-gray-500 bg-gray-50 border border-gray-200 rounded-full px-3 py-1">
          <span className="mr-1">Last updated:</span>
          <span>{new Date().toLocaleTimeString()}</span>
        </div>

       
        <div className="relative" ref={bellRef}>
          <button
            type="button"
            onClick={() => setBellOpen((v) => !v)}
            className="relative p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-50"
          >
            <Bell className="h-5 w-5" />
            {totalNew > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[11px] flex items-center justify-center font-bold leading-none">
                {totalNew}
              </span>
            )}
          </button>

          {bellOpen && (
            <div className="absolute right-0 top-10 w-80 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden z-50">
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                <span className="text-sm font-semibold text-gray-900">
                  Notifications
                  {totalNew > 0 && <span className="ml-2 text-xs text-red-500 font-bold">({totalNew} new)</span>}
                </span>
                <div className="flex items-center gap-3">
                  {totalNew > 0 && (
                    <button onClick={markAllSeen} className="text-[11px] text-blue-600 hover:underline">
                      Mark all read
                    </button>
                  )}
                  <button onClick={() => setBellOpen(false)} className="text-gray-400 hover:text-gray-600">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="max-h-72 overflow-y-auto">
                {newReplies.length > 0 ? (
                  <div>
                    <p className="px-4 py-2 text-[10px] font-semibold text-gray-400 uppercase bg-gray-50 border-b border-gray-100">
                      New replies from admin
                    </p>
                    {newReplies.map((m) => {
                      const seenCount = JSON.parse(localStorage.getItem(SEEN_KEY) || '{}')[m.id] ?? 0
                      const newCount = (m.replies?.length || 0) - seenCount
                      return (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => { markAllSeen(); setBellOpen(false); onNavigate?.('my-messages') }}
                          className="w-full flex items-start gap-3 px-4 py-3 hover:bg-blue-50 transition-colors border-b border-gray-50 bg-blue-50/40 text-left"
                        >
                          <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white flex-shrink-0 text-xs font-bold">
                            +{newCount}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-semibold text-gray-900 truncate">{m.subject || '(no subject)'}</p>
                            <p className="text-xs text-gray-500 truncate">{m.message}</p>
                            <p className="text-[10px] text-blue-600 mt-0.5 font-medium">Admin replied to your message</p>
                          </div>
                          <span className="h-2 w-2 rounded-full bg-blue-500 flex-shrink-0 mt-2" />
                        </button>
                      )
                    })}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-gray-400 gap-2">
                    <Bell className="h-7 w-7" />
                    <p className="text-sm">No new notifications</p>
                  </div>
                )}

                <div>
                  <p className="px-4 py-2 text-[10px] font-semibold text-gray-400 uppercase bg-gray-50 border-b border-gray-100 border-t border-t-gray-100">
                    General
                  </p>
                  <div className="flex items-start gap-3 px-4 py-3">
                    <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <svg className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Welcome to Knowledge Channel</p>
                      <p className="text-xs text-gray-500">Thank you for joining and supporting our mission.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-4 py-3 border-t border-gray-100 bg-gray-50">
                <button
                  type="button"
                  onClick={() => { markAllSeen(); setBellOpen(false); onNavigate?.('my-messages') }}
                  className="text-xs text-blue-600 hover:underline font-medium"
                >
                  Go to My Messages →
                </button>
              </div>
            </div>
          )}
        </div>

        {userName && (
          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm">
            {userName.charAt(0).toUpperCase()}
          </div>
        )}
      </div>
    </header>
  )
}