import { useState, useEffect, useRef } from 'react'
import { useOS } from '../context/OSContext'
import { DOCK_APPS } from '../constants'

export default function AppSwitcher() {
  const { state, focusWindow } = useOS()
  const [visible, setVisible] = useState(false)
  const [selectedIdx, setSelectedIdx] = useState(0)
  const appsRef = useRef([])
  const visibleRef = useRef(false)
  const selectedRef = useRef(0)
  const stateRef = useRef(state)

  stateRef.current = state

  useEffect(() => {
    visibleRef.current = visible
    selectedRef.current = selectedIdx
  }, [visible, selectedIdx])

  useEffect(() => {
    const onKeyDown = (e) => {
      const st = stateRef.current
      if (st.locked || !st.booted) return

      if (e.key === 'Tab' && (e.metaKey || e.altKey)) {
        e.preventDefault()
        const running = DOCK_APPS.filter(a => st.runningApps.has(a.id))
        appsRef.current = running.length > 0 ? running : DOCK_APPS

        if (!visibleRef.current) {
          setVisible(true)
          setSelectedIdx(0)
        } else {
          setSelectedIdx(prev => (prev + 1) % appsRef.current.length)
        }
        return
      }
    }

    const onKeyUp = (e) => {
      if (!visibleRef.current) return
      if (!e.metaKey && !e.altKey) {
        const app = appsRef.current[selectedRef.current]
        if (app) {
          const st = stateRef.current
          const windows = Array.from(st.windows.values()).filter(w => w.appId === app.id)
          if (windows.length > 0) {
            const top = windows.reduce((a, b) => (a.zIndex || 0) > (b.zIndex || 0) ? a : b)
            focusWindow(top.id)
          }
        }
        setVisible(false)
      }
    }

    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('keyup', onKeyUp)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('keyup', onKeyUp)
    }
  }, [focusWindow])

  if (!visible) return null

  const apps = appsRef.current

  return (
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center pointer-events-none"
      style={{
        background: 'rgba(0,0,0,0.3)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
    >
      <div className="flex items-center gap-3 px-5 py-4 rounded-2xl" style={{
        background: 'rgba(28,30,36,0.85)',
        border: '0.5px solid rgba(255,255,255,0.1)',
        boxShadow: '0 30px 80px rgba(0,0,0,0.6)',
      }}>
        {apps.map((app, i) => (
          <div
            key={app.id}
            className="flex flex-col items-center gap-1.5 px-3 py-2 rounded-xl transition-all duration-100"
            style={{
              background: i === selectedIdx ? 'var(--accent-glass)' : 'transparent',
              transform: i === selectedIdx ? 'scale(1.1)' : 'scale(0.9)',
              opacity: i === selectedIdx ? 1 : 0.5,
            }}
          >
            <div className="text-3xl">{app.icon}</div>
            <div className="text-[10px] text-white font-medium">{app.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
