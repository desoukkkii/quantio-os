import { useCallback, useRef, useState } from 'react'
import { useOS } from '../context/OSContext'
import { DOCK_APPS } from '../constants'

export default function Dock() {
  const { state, openApp, focusWindow, restoreWindow, dispatch } = useOS()
  const [bouncing, setBouncing] = useState(null)
  const bounceTimers = useRef({})

  const handleDockClick = useCallback((id) => {
    const windows = state.windows
    const existing = Array.from(windows.values()).filter(w => w.appId === id)
    if (existing.length > 0) {
      const firstClosed = existing.find(w => w.minimized)
      const firstOpen = existing.find(w => !w.minimized)
      if (firstClosed) {
        restoreWindow(firstClosed.id)
      } else if (firstOpen) {
        focusWindow(firstOpen.id)
      }
    } else {
      openApp(id)
      setBouncing(id)
      clearTimeout(bounceTimers.current[id])
      bounceTimers.current[id] = setTimeout(() => setBouncing(null), 400)
    }
  }, [state.windows, openApp, focusWindow, restoreWindow])

  const handleContextMenu = useCallback((e, id) => {
    e.preventDefault()
    e.stopPropagation()
    const windows = state.windows
    const existing = Array.from(windows.values()).filter(w => w.appId === id)
    const items = []
    if (state.runningApps.has(id)) {
      items.push({
        label: 'Hide',
        icon: '\u2B07',
        action: () => {
          existing.forEach(w => {
            dispatch({ type: 'MINIMIZE_WINDOW', payload: w.id })
          })
        },
      })
      items.push({
        label: 'Quit',
        icon: '\u2716',
        action: () => {
          existing.forEach(w => {
            dispatch({ type: 'REMOVE_WINDOW', payload: w.id })
          })
        },
      })
    } else {
      items.push({ label: 'Open', icon: '\u25B6', action: () => openApp(id) })
    }
    dispatch({ type: 'SET_CONTEXT_MENU', payload: { x: e.clientX, y: e.clientY, items } })
  }, [state.runningApps, state.windows, openApp, dispatch])

  const minimizedWindows = Array.from(state.windows.values()).filter(w => w.minimized)

  const dockIconSize = Math.round(48 * state.settings.dockSize)
  const dockIconFont = Math.round(24 * state.settings.dockSize)

  return (
    <nav
      id="dock"
      className="absolute bottom-[10px] left-1/2 -translate-x-1/2 z-[5000] flex items-center px-3 gap-1"
      style={{
        height: Math.round(76 * state.settings.dockSize) + 'px',
        background: 'var(--bg-dock)',
        backdropFilter: 'blur(30px) saturate(1.4)',
        WebkitBackdropFilter: 'blur(30px) saturate(1.4)',
        borderRadius: 'var(--radius-xl)',
        border: '0.5px solid rgba(255,255,255,0.09)',
        boxShadow: '0 18px 50px rgba(0,0,0,0.5), 0 0 0 0.5px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.07)',
      }}
      aria-label="Application dock"
    >
      <div className="flex items-center gap-[2px] dock-items overflow-x-auto scrollbar-none max-w-full" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {DOCK_APPS.map((app) => {
          const running = state.runningApps.has(app.id)
          const active = state.activeApp === app.id
          const isBouncing = bouncing === app.id
          return (
            <div
              key={app.id}
              className={`dock-item flex flex-col items-center cursor-pointer relative px-[2px] py-1 transition-all duration-200 hover:-translate-y-2 hover:scale-112 active:-translate-y-1 active:scale-104 ${running ? 'running' : ''} ${active ? 'active' : ''} ${isBouncing ? 'animate-dock-bounce' : ''}`}
              data-app={app.id}
              onClick={() => handleDockClick(app.id)}
              onContextMenu={(e) => handleContextMenu(e, app.id)}
              onTouchEnd={(e) => { e.preventDefault(); handleDockClick(app.id) }}
            >
              <div
                className="dock-icon flex items-center justify-center transition-all duration-250"
                style={{
                  width: dockIconSize + 'px',
                  height: dockIconSize + 'px',
                  fontSize: dockIconFont + 'px',
                  filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.35))',
                }}
              >
                {app.icon}
              </div>
              <div
                className="dock-label absolute bottom-[calc(100%+8px)] left-1/2 -translate-x-1/2 text-[10px] text-white px-2 py-[3px] rounded whitespace-nowrap opacity-0 pointer-events-none transition-all duration-150"
                style={{
                  background: 'rgba(20,22,28,0.92)',
                  backdropFilter: 'blur(12px)',
                  border: '0.5px solid rgba(255,255,255,0.1)',
                  fontWeight: 500,
                  letterSpacing: '0.01em',
                }}
              >
                {app.label}
              </div>
              <div
                className="dock-indicator w-1 h-1 rounded-full mt-[3px] transition-all duration-200"
                style={
                  running && active
                    ? { background: '#fff' }
                    : running
                    ? { background: 'var(--accent)', boxShadow: '0 0 6px var(--accent-glass)' }
                    : { background: 'rgba(255,255,255,0.15)' }
                }
              />
            </div>
          )
        })}
      </div>

      {minimizedWindows.length > 0 && (
        <>
          <div
            className="w-px h-8 mx-1"
            style={{ background: 'rgba(255,255,255,0.12)' }}
          />
          <div className="flex items-center gap-[2px]">
            {minimizedWindows.map((w) => {
              const app = DOCK_APPS.find(a => a.id === w.appId)
              const minIconSize = Math.round(40 * state.settings.dockSize)
              return (
                <div
                  key={w.id}
                  className="dock-item-min flex flex-col items-center cursor-pointer relative px-[2px] py-1 transition-all duration-200 hover:-translate-y-1 hover:scale-105"
                  onClick={() => restoreWindow(w.id)}
                  title={w.title}
                >
                  <div
                    className="flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity"
                    style={{
                      width: minIconSize + 'px',
                      height: minIconSize + 'px',
                      fontSize: Math.round(18 * state.settings.dockSize) + 'px',
                      filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.35))',
                    }}
                  >
                    {app ? app.icon : '\uD83D\uDCC4'}
                  </div>
                </div>
              )
            })}
          </div>
        </>
      )}
    </nav>
  )
}
