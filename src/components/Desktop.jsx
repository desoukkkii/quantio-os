import { useCallback, useEffect, useRef } from 'react'
import { useOS } from '../context/OSContext'
import { WALLPAPERS } from '../constants'
import MenuBar from './MenuBar'
import AppleDropdown from './AppleDropdown'
import Dock from './Dock'
import DesktopIcons from './DesktopIcons'
import Spotlight from './Spotlight'
import ContextMenu from './ContextMenu'
import NotificationContainer from './NotificationContainer'
import WindowManager from './WindowManager'
import AppSwitcher from './AppSwitcher'

export default function Desktop() {
  const { state, dispatch, setSpotlight, notify, openApp, updateSettings, closeWindow, minimizeWindow, setAppleMenu } = useOS()

  const stateRef = useRef(state)
  stateRef.current = state

  useEffect(() => {
    const handler = (e) => {
      const st = stateRef.current
      if (st.locked || !st.booted) return
      const meta = e.metaKey || e.ctrlKey
      if (!meta) return

      const focusedWinId = st.focusedWindow
      const focusedWin = focusedWinId ? st.windows.get(focusedWinId) : null

      if (e.key === 'w' && focusedWin) {
        e.preventDefault()
        closeWindow(focusedWinId)
      } else if (e.key === 'q') {
        e.preventDefault()
        if (focusedWin) {
          const appWindows = Array.from(st.windows.values()).filter(w => w.appId === focusedWin.appId)
          appWindows.forEach(w => closeWindow(w.id))
        }
      } else if (e.key === 'm' && focusedWin) {
        e.preventDefault()
        minimizeWindow(focusedWinId)
      }
    }

    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [closeWindow, minimizeWindow])

  const wp = WALLPAPERS[state.settings.wallpaper] || WALLPAPERS.sunset

  const handleClick = useCallback((e) => {
    if (state.appleMenuOpen && !e.target.closest('#apple-dropdown') && !e.target.closest('#apple-btn')) {
      setAppleMenu(false)
    }
    if (state.contextMenu && !e.target.closest('#context-menu') && !e.target.closest('#context-menu-container')) {
      dispatch({ type: 'SET_CONTEXT_MENU', payload: null })
    }
    if (state.spotlightOpen && !e.target.closest('#spotlight') && !e.target.closest('[aria-label="Open spotlight search"]')) {
      setSpotlight(false)
    }
  }, [dispatch, state.contextMenu, state.spotlightOpen, state.appleMenuOpen, setSpotlight, setAppleMenu])

  const longPressTimer = useRef(null)
  const LONG_PRESS_MS = 600

  const handleTouchStart = useCallback((e) => {
    if (e.touches.length > 1) return
    const target = e.target
    if (target.closest('.window') || target.closest('#dock') || target.closest('#menubar')) return
    longPressTimer.current = setTimeout(() => {
      const touch = e.touches[0]
      dispatch({
        type: 'SET_CONTEXT_MENU',
        payload: {
          x: touch.clientX,
          y: touch.clientY,
          items: [
            { label: 'New Folder', icon: '\uD83D\uDCC1', action: () => notify('Desktop', 'New folder created') },
            { label: 'Get Info', icon: '\u2139\uFE0F', action: () => notify('Info', 'Quantio OS Desktop') },
            { type: 'sep' },
            { label: 'Change Wallpaper', icon: '\uD83D\uDDBC', action: () => openApp('settings') },
            { label: 'Open Settings', icon: '\u2699\uFE0F', action: () => openApp('settings') },
            { type: 'sep' },
            { label: 'Show Desktop Icons', icon: '\uD83D\uDCBB', checked: state.settings.showDesktopIcons, action: () => updateSettings({ showDesktopIcons: !state.settings.showDesktopIcons }) },
          ],
        },
      })
    }, LONG_PRESS_MS)
  }, [dispatch, notify, openApp, updateSettings, state.settings.showDesktopIcons])

  const handleTouchEnd = useCallback(() => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current)
      longPressTimer.current = null
    }
  }, [])

  const handleTouchMove = useCallback(() => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current)
      longPressTimer.current = null
    }
  }, [])

  return (
    <main
      className={`fixed inset-0 flex flex-col ${state.locked ? 'hidden' : ''}`}
      style={{ background: '#0b0d12' }}
      onClick={handleClick}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchMove={handleTouchMove}
      onContextMenu={(e) => {
        if (!e.target.closest('.window') && !e.target.closest('#dock') && !e.target.closest('#menubar')) {
          e.preventDefault()
          dispatch({
            type: 'SET_CONTEXT_MENU',
            payload: {
              x: e.clientX,
              y: e.clientY,
              items: [
                { label: 'New Folder', icon: '\uD83D\uDCC1', action: () => notify('Desktop', 'New folder created') },
                { label: 'Get Info', icon: '\u2139\uFE0F', action: () => notify('Info', 'Quantio OS Desktop') },
                { type: 'sep' },
                { label: 'Change Wallpaper', icon: '\uD83D\uDDBC', action: () => openApp('settings') },
                { label: 'Open Settings', icon: '\u2699\uFE0F', action: () => openApp('settings') },
                { type: 'sep' },
                { label: 'Show Desktop Icons', icon: '\uD83D\uDCBB', checked: state.settings.showDesktopIcons, action: () => updateSettings({ showDesktopIcons: !state.settings.showDesktopIcons }) },
              ],
            },
          })
        }
      }}
    >
      <div
        className="absolute inset-0 transition-[background-image] duration-600"
        style={{ backgroundImage: wp.colors, backgroundSize: 'cover', backgroundPosition: 'center', filter: 'saturate(1.05)' }}
      >
        <div className="absolute inset-0 pointer-events-none"
          style={{
            background: `
              radial-gradient(120% 80% at 50% -10%, rgba(255,255,255,0.06), transparent 60%),
              radial-gradient(80% 60% at 50% 110%, rgba(0,0,0,0.45), transparent 60%)
            `
          }}
        />
        <div className="absolute inset-0 bg-black/10 pointer-events-none" />
      </div>

      <DesktopIcons />
      <WindowManager />

      <MenuBar />
      <AppleDropdown />
      <Dock />
      <Spotlight />
      <AppSwitcher />
      <ContextMenu />
      <NotificationContainer />
    </main>
  )
}
