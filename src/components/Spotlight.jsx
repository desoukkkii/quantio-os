import { useState, useEffect, useCallback, useRef } from 'react'
import { useOS } from '../context/OSContext'
import { DOCK_APPS } from '../constants'

export default function Spotlight() {
  const { state, openApp, setSpotlight, toggleSpotlight } = useOS()
  const [query, setQuery] = useState('')
  const inputRef = useRef(null)

  const open = state.spotlightOpen

  const results = query
    ? DOCK_APPS.filter(
        (a) =>
          a.label.toLowerCase().includes(query.toLowerCase()) ||
          a.desc.toLowerCase().includes(query.toLowerCase())
      )
    : []

  const close = useCallback(() => setSpotlight(false), [setSpotlight])

  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        toggleSpotlight()
      }
      if (e.key === 'Escape' && open) close()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, close, toggleSpotlight])

  useEffect(() => {
    if (open) {
      setQuery('')
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [open])

  const handleSelect = (id) => {
    openApp(id)
    close()
  }

  return (
    <div
      id="spotlight"
      className={`fixed inset-0 z-[8000] items-start justify-center pt-[18vh] ${open ? 'flex' : 'hidden'}`}
      onMouseDown={(e) => { if (!e.target.closest('.spotlight-modal')) close() }}
    >
      <div
        className="absolute inset-0"
        style={{ background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)' }}
      />
      <div
        className="spotlight-modal relative z-10 w-[500px] max-w-[90vw] overflow-hidden"
        style={{
          background: 'rgba(28,30,36,0.95)',
          backdropFilter: 'blur(40px) saturate(1.4)',
          WebkitBackdropFilter: 'blur(40px) saturate(1.4)',
          borderRadius: '16px',
          border: '0.5px solid var(--border-glass)',
          boxShadow: '0 40px 100px rgba(0,0,0,0.6), 0 0 0 0.5px rgba(255,255,255,0.08)',
          animation: open ? 'spotlightIn 0.25s var(--ease-spring)' : 'none',
        }}
      >
        <div className="flex items-center gap-2.5 px-4 py-[14px] border-b-[0.5px] border-[var(--border-glass)]">
          <span className="text-lg text-[var(--text-tertiary)] flex-shrink-0">&#x1F50D;</span>
          <input
            ref={inputRef}
            className="flex-1 border-none bg-transparent text-[16px] text-[var(--text-primary)] outline-none font-[400] tracking-[-0.01em]"
            style={{ fontFamily: 'inherit' }}
            placeholder="Search apps and actions..."
            spellCheck="false"
            autoComplete="off"
            aria-label="Search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && results.length > 0) {
                handleSelect(results[0].id)
              }
            }}
          />
        </div>
        <div className="py-1 max-h-[300px] overflow-y-auto">
          {!query ? (
            <div style={{ padding: '12px 16px', fontSize: '11px', color: 'var(--text-tertiary)' }}>
              Type to search apps...
            </div>
          ) : results.length > 0 ? (
            results.map((r) => (
              <div
                key={r.id}
                className="flex items-center gap-2.5 px-4 py-[7px] cursor-pointer transition-all duration-100 hover:bg-[var(--accent-glass)]"
                onClick={() => handleSelect(r.id)}
              >
                <div className="w-7 h-7 flex items-center justify-center text-[16px]">{r.icon}</div>
                <div>
                  <div className="text-[13px] text-[var(--text-primary)]">{r.label}</div>
                  <div className="text-[10px] text-[var(--text-tertiary)]">{r.desc}</div>
                </div>
              </div>
            ))
          ) : (
            <div style={{ padding: '12px 16px', fontSize: '11px', color: 'var(--text-tertiary)' }}>
              No results
            </div>
          )}
        </div>
        <div className="px-4 py-[6px] text-[10px] text-[var(--text-tertiary)] border-t-[0.5px] border-[var(--border-glass)] text-center">
          Press <kbd className="text-white/70">Esc</kbd> to close &middot; <kbd className="text-white/70">&#8984;K</kbd> to toggle
        </div>
      </div>
    </div>
  )
}
