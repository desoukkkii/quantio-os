import { useRef, useCallback, useState, useEffect } from 'react'
import { useOS } from '../context/OSContext'
import Finder from './apps/Finder'
import Terminal from './apps/Terminal'
import Calculator from './apps/Calculator'
import Notes from './apps/Notes'
import Photos from './apps/Photos'
import Settings from './apps/Settings'

const resizeDirs = ['n', 's', 'e', 'w', 'ne', 'nw', 'se', 'sw']

const appContent = {
  finder: Finder,
  terminal: Terminal,
  calculator: Calculator,
  notes: Notes,
  photos: Photos,
  settings: Settings,
}

export default function Window({ win }) {
  const { state, focusWindow, closeWindow, minimizeWindow, dispatch } = useOS()
  const elRef = useRef(null)
  const [maximized, setMaximized] = useState(false)
  const [prevRect, setPrevRect] = useState(null)
  const [closing, setClosing] = useState(false)
  const winRef = useRef(win)

  useEffect(() => {
    winRef.current = win
  }, [win])

  const isFocused = state.focusedWindow === win.id
  const remainingRef = useRef([])
  const appWindowsRef = useRef([])

  const handleFocus = useCallback(() => {
    focusWindow(win.id)
  }, [focusWindow, win.id])

  const handleClose = useCallback(() => {
    setClosing(true)
    const currentWin = winRef.current
    const allWindows = Array.from(state.windows.values())
    remainingRef.current = allWindows.filter(w => w.id !== currentWin.id && !w.minimized)
    appWindowsRef.current = allWindows.filter(w => w.appId === currentWin.appId && w.id !== currentWin.id)
    setTimeout(() => {
      closeWindow(currentWin.id)
      if (appWindowsRef.current.length > 0) {
        const last = remainingRef.current[remainingRef.current.length - 1]
        if (last) focusWindow(last.id)
      } else {
        dispatch({ type: 'SET_ACTIVE_APP', payload: null })
      }
    }, 120)
  }, [closeWindow, dispatch, focusWindow, state.windows])

  const handleMinimize = useCallback(() => {
    minimizeWindow(win.id)
  }, [minimizeWindow, win.id])

  const toggleMaximize = useCallback(() => {
    const el = elRef.current
    if (!el) return
    if (maximized && prevRect) {
      Object.assign(win.rect, prevRect)
      el.style.left = prevRect.x + 'px'
      el.style.top = prevRect.y + 'px'
      el.style.width = prevRect.w + 'px'
      el.style.height = prevRect.h + 'px'
      setMaximized(false)
      setPrevRect(null)
    } else {
      setPrevRect({ ...win.rect })
      const container = el.parentElement?.getBoundingClientRect()
      if (container) {
        win.rect.x = 0
        win.rect.y = 0
        win.rect.w = container.width
        win.rect.h = container.height
        el.style.left = '0px'
        el.style.top = '0px'
        el.style.width = '100%'
        el.style.height = '100%'
      }
      setMaximized(true)
    }
  }, [maximized, prevRect, win])

  const startDrag = useCallback((e) => {
    if (e.target.closest('.win-btn') || maximized) return
    e.preventDefault()
    const clientX = e.touches ? e.touches[0].clientX : e.clientX
    const clientY = e.touches ? e.touches[0].clientY : e.clientY
    const startX = clientX
    const startY = clientY
    const origX = win.rect.x
    const origY = win.rect.y

    const onMove = (e) => {
      const cx = e.touches ? e.touches[0].clientX : e.clientX
      const cy = e.touches ? e.touches[0].clientY : e.clientY
      win.rect.x = origX + (cx - startX)
      win.rect.y = origY + (cy - startY)
      const el = elRef.current
      if (el) {
        el.style.left = win.rect.x + 'px'
        el.style.top = win.rect.y + 'px'
      }
    }
    const onUp = () => {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseup', onUp)
      document.removeEventListener('touchmove', onMove)
      document.removeEventListener('touchend', onUp)
    }
    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseup', onUp)
    document.addEventListener('touchmove', onMove, { passive: true })
    document.addEventListener('touchend', onUp)
  }, [win, maximized])

  const startResize = useCallback((e, dir) => {
    if (maximized) return
    e.preventDefault()
    const clientX = e.touches ? e.touches[0].clientX : e.clientX
    const clientY = e.touches ? e.touches[0].clientY : e.clientY
    const startX = clientX
    const startY = clientY
    const { x: ox, y: oy, w: ow, h: oh } = win.rect

    const minW = window.innerWidth < 480 ? Math.min(280, window.innerWidth - 16) : 320
    const minH = 180

    const onMove = (e) => {
      const cx = e.touches ? e.touches[0].clientX : e.clientX
      const cy = e.touches ? e.touches[0].clientY : e.clientY
      const dx = cx - startX
      const dy = cy - startY
      let x = ox, y = oy, w = ow, h = oh
      if (dir.includes('e')) w = Math.max(minW, ow + dx)
      if (dir.includes('w')) { w = Math.max(minW, ow - dx); x = ox + (ow - w) }
      if (dir.includes('s')) h = Math.max(minH, oh + dy)
      if (dir.includes('n')) { h = Math.max(minH, oh - dy); y = oy + (oh - h) }
      win.rect.x = x; win.rect.y = y; win.rect.w = w; win.rect.h = h
      const el = elRef.current
      if (el) {
        el.style.left = x + 'px'
        el.style.top = y + 'px'
        el.style.width = w + 'px'
        el.style.height = h + 'px'
      }
    }
    const onUp = () => {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseup', onUp)
      document.removeEventListener('touchmove', onMove)
      document.removeEventListener('touchend', onUp)
    }
    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseup', onUp)
    document.addEventListener('touchmove', onMove, { passive: true })
    document.addEventListener('touchend', onUp)
  }, [win, maximized])

  const zIndex = isFocused ? state.windowZIndex : (win.zIndex || state.windowZIndex - 1)

  const ContentComponent = appContent[win.appId]

  return (
    <div
      ref={elRef}
      id={win.id}
      className={`window absolute flex flex-col pointer-events-auto ${closing ? 'closing' : ''} ${isFocused ? 'focused' : ''}`}
      style={{
        left: win.rect.x + 'px',
        top: win.rect.y + 'px',
        width: win.rect.w + 'px',
        height: win.rect.h + 'px',
        zIndex: zIndex,
        minWidth: '320px',
        minHeight: '180px',
        background: 'var(--bg-window)',
        backdropFilter: 'blur(50px) saturate(1.6)',
        WebkitBackdropFilter: 'blur(50px) saturate(1.6)',
        borderRadius: maximized ? '0' : 'var(--radius-lg)',
        border: '0.5px solid var(--border-glass)',
        boxShadow: isFocused ? 'var(--shadow-window-focus)' : 'var(--shadow-window)',
        animation: closing ? 'windowOut 0.12s var(--ease) forwards' : 'windowIn 0.22s var(--ease-spring)',
      }}
      onMouseDown={handleFocus}
    >
      <div
        className="window-titlebar flex items-center h-9 min-h-[36px] px-2.5 cursor-move flex-shrink-0 relative select-none"
        style={{
          background: 'linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0))',
          borderBottom: '0.5px solid var(--border-glass)',
          borderRadius: maximized ? '0' : 'var(--radius-lg) var(--radius-lg) 0 0',
        }}
        onMouseDown={startDrag}
        onTouchStart={startDrag}
      >
        <div className="win-controls flex gap-2 z-[2]">
          {['close', 'minimize', 'maximize'].map((action) => (
            <button
              key={action}
              className={`win-btn w-3 h-3 rounded-full border-none cursor-pointer relative transition-all duration-150 hover:scale-112 active:scale-90 ${action === 'close' ? 'bg-[#ff5f57]' : action === 'minimize' ? 'bg-[#fdbc40]' : 'bg-[#33c748]'}`}
              onClick={(e) => {
                e.stopPropagation()
                if (action === 'close') handleClose()
                else if (action === 'minimize') handleMinimize()
                else if (action === 'maximize') toggleMaximize()
              }}
            >
              <span
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-100"
                style={
                  action === 'close'
                    ? { width: '7px', height: '1px', background: 'rgba(0,0,0,0.5)', transform: 'translate(-50%, -50%) rotate(45deg)' }
                    : action === 'minimize'
                    ? { width: '7px', height: '1px', background: 'rgba(0,0,0,0.5)', transform: 'translate(-50%, -50%)' }
                    : { width: '5px', height: '5px', border: '1px solid rgba(0,0,0,0.5)', borderRadius: '1px', transform: 'translate(-50%, -50%)' }
                }
              />
            </button>
          ))}
        </div>
        <div className="win-title absolute left-1/2 -translate-x-1/2 text-xs font-medium text-[var(--text-secondary)] truncate max-w-[35%]">
          {win.icon} {win.title}
        </div>
      </div>

      <div
        className="window-content flex-1 overflow-auto relative"
        style={{ background: 'rgba(20,22,28,0.55)', borderRadius: maximized ? '0' : '0 0 var(--radius-lg) var(--radius-lg)' }}
      >
        {ContentComponent ? <ContentComponent /> : (
          <div className="flex items-center justify-center h-full text-[13px]" style={{ color: 'var(--text-tertiary)' }}>
            {win.appId} app
          </div>
        )}
      </div>

      {resizeDirs.map((dir) => (
        <div
          key={dir}
          className={`window-resize absolute z-10 ${dir === 'n' ? 'top-[-5px] left-2 right-2 h-[10px] cursor-n-resize' : ''} ${dir === 's' ? 'bottom-[-5px] left-2 right-2 h-[10px] cursor-s-resize' : ''} ${dir === 'e' ? 'right-[-5px] top-2 bottom-2 w-[10px] cursor-e-resize' : ''} ${dir === 'w' ? 'left-[-5px] top-2 bottom-2 w-[10px] cursor-w-resize' : ''} ${dir === 'ne' ? 'top-[-5px] right-[-5px] w-[14px] h-[14px] cursor-ne-resize' : ''} ${dir === 'nw' ? 'top-[-5px] left-[-5px] w-[14px] h-[14px] cursor-nw-resize' : ''} ${dir === 'se' ? 'bottom-[-5px] right-[-5px] w-[14px] h-[14px] cursor-se-resize' : ''} ${dir === 'sw' ? 'bottom-[-5px] left-[-5px] w-[14px] h-[14px] cursor-sw-resize' : ''}`}
          onMouseDown={(e) => startResize(e, dir)}
          onTouchStart={(e) => startResize(e, dir)}
        />
      ))}
    </div>
  )
}
