import { createContext, useContext, useReducer, useEffect, useCallback, useRef } from 'react'
import { KEYS, DEFAULT_SETTINGS, DOCK_APPS } from '../constants'

const OSContext = createContext()

let _idCounter = 0

function loadSettings() {
  try {
    const saved = localStorage.getItem(KEYS.settings)
    return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : { ...DEFAULT_SETTINGS }
  } catch { return { ...DEFAULT_SETTINGS } }
}

function saveSettings(settings) {
  try { localStorage.setItem(KEYS.settings, JSON.stringify(settings)) } catch {}
}

const initialState = {
  booted: false,
  locked: true,
  bootTime: null,
  settings: loadSettings(),
  activeApp: null,
  focusedWindow: null,
  windowZIndex: 100,
  runningApps: new Set(),
  windows: new Map(),
  notifications: [],
  contextMenu: null,
  spotlightOpen: false,
  appleMenuOpen: false,
}

function osReducer(state, action) {
  switch (action.type) {
    case 'BOOT_COMPLETE':
      return { ...state, booted: true, bootTime: action.payload }
    case 'LOCK':
      return { ...state, locked: true }
    case 'UNLOCK':
      return { ...state, locked: false }
    case 'SETTINGS_UPDATE': {
      const newSettings = { ...state.settings, ...action.payload }
      saveSettings(newSettings)
      return { ...state, settings: newSettings }
    }
    case 'SET_ACTIVE_APP':
      return { ...state, activeApp: action.payload }
    case 'SET_FOCUSED_WINDOW':
      return { ...state, focusedWindow: action.payload }
    case 'ADD_RUNNING_APP': {
      const newRunning = new Set(state.runningApps)
      newRunning.add(action.payload)
      return { ...state, runningApps: newRunning }
    }
    case 'REMOVE_RUNNING_APP': {
      const newRunning = new Set(state.runningApps)
      newRunning.delete(action.payload)
      return { ...state, runningApps: newRunning }
    }
    case 'CREATE_WINDOW': {
      const newWindows = new Map(state.windows)
      const win = { ...action.payload, zIndex: state.windowZIndex }
      newWindows.set(win.id, win)
      return {
        ...state,
        windows: newWindows,
        windowZIndex: state.windowZIndex + 2,
        focusedWindow: win.id,
        activeApp: win.appId,
      }
    }
    case 'MINIMIZE_WINDOW': {
      const newWindows = new Map(state.windows)
      const win = newWindows.get(action.payload)
      if (win) { newWindows.set(win.id, { ...win, minimized: true }) }
      return { ...state, windows: newWindows }
    }
    case 'RESTORE_WINDOW': {
      const newWindows = new Map(state.windows)
      const win = newWindows.get(action.payload)
      if (win) {
        newWindows.set(win.id, { ...win, minimized: false, zIndex: state.windowZIndex })
      }
      return { ...state, windows: newWindows, focusedWindow: action.payload, activeApp: win ? win.appId : state.activeApp, windowZIndex: state.windowZIndex + 2 }
    }
    case 'REMOVE_WINDOW': {
      const newWindows = new Map(state.windows)
      const removedWin = newWindows.get(action.payload)
      newWindows.delete(action.payload)
      let newRunning = state.runningApps
      if (removedWin) {
        const hasOther = Array.from(newWindows.values()).some(w => w.appId === removedWin.appId)
        if (!hasOther) {
          newRunning = new Set(state.runningApps)
          newRunning.delete(removedWin.appId)
        }
      }
      return { ...state, windows: newWindows, runningApps: newRunning }
    }
    case 'FOCUS_WINDOW': {
      const id = action.payload
      const win = state.windows.get(id)
      if (!win) return state
      const newWindows = new Map(state.windows)
      newWindows.set(id, { ...win, zIndex: state.windowZIndex })
      return {
        ...state,
        windows: newWindows,
        focusedWindow: id,
        activeApp: win.appId,
        windowZIndex: state.windowZIndex + 2,
      }
    }
    case 'SET_SPOTLIGHT':
      return { ...state, spotlightOpen: action.payload }
    case 'TOGGLE_SPOTLIGHT':
      return { ...state, spotlightOpen: !state.spotlightOpen }
    case 'ADD_NOTIFICATION':
      return { ...state, notifications: [...state.notifications, action.payload] }
    case 'REMOVE_NOTIFICATION':
      return { ...state, notifications: state.notifications.filter(n => n.id !== action.payload) }
    case 'SET_CONTEXT_MENU':
      return { ...state, contextMenu: action.payload }
    case 'TOGGLE_APPLE_MENU':
      return { ...state, appleMenuOpen: !state.appleMenuOpen }
    case 'SET_APPLE_MENU':
      return { ...state, appleMenuOpen: action.payload }
    default:
      return state
  }
}

export function OSProvider({ children }) {
  const [state, dispatch] = useReducer(osReducer, initialState)
  const notifIdRef = useRef(0)

  const updateSettings = useCallback((partial) => {
    dispatch({ type: 'SETTINGS_UPDATE', payload: partial })
  }, [])

  const openApp = useCallback((id, opts = {}) => {
    const app = DOCK_APPS.find(a => a.id === id)
    if (!app) return null
    const winId = `win-${++_idCounter}`
    const isMobile = window.innerWidth < 768
    const rect = isMobile
      ? {
          x: 0,
          y: 0,
          w: window.innerWidth,
          h: window.innerHeight - 30,
        }
      : {
          x: 80 + (_idCounter % 6) * 30,
          y: 40 + (_idCounter % 6) * 25,
          w: opts.width || 540,
          h: opts.height || 380,
        }
    const win = {
      id: winId,
      appId: id,
      title: app.label,
      icon: app.icon,
      minimized: false,
      rect,
    }
    dispatch({ type: 'ADD_RUNNING_APP', payload: id })
    dispatch({ type: 'CREATE_WINDOW', payload: win })
    return win
  }, [])

  const focusApp = useCallback((id) => {
    dispatch({ type: 'SET_ACTIVE_APP', payload: id })
  }, [])

  const focusWindow = useCallback((id) => {
    dispatch({ type: 'FOCUS_WINDOW', payload: id })
  }, [])

  const closeWindow = useCallback((id) => {
    dispatch({ type: 'REMOVE_WINDOW', payload: id })
  }, [])

  const minimizeWindow = useCallback((id) => {
    dispatch({ type: 'MINIMIZE_WINDOW', payload: id })
  }, [])

  const restoreWindow = useCallback((id) => {
    dispatch({ type: 'RESTORE_WINDOW', payload: id })
  }, [])

  const toggleSpotlight = useCallback(() => {
    dispatch({ type: 'TOGGLE_SPOTLIGHT' })
  }, [])

  const setSpotlight = useCallback((open) => {
    dispatch({ type: 'SET_SPOTLIGHT', payload: open })
  }, [])

  const notify = useCallback((title, msg, icon = '\uD83D\uDD14') => {
    const id = ++notifIdRef.current
    dispatch({ type: 'ADD_NOTIFICATION', payload: { id, title, msg, icon } })
    setTimeout(() => dispatch({ type: 'REMOVE_NOTIFICATION', payload: id }), 5000)
  }, [])

  const removeNotification = useCallback((id) => {
    dispatch({ type: 'REMOVE_NOTIFICATION', payload: id })
  }, [])

  const toggleAppleMenu = useCallback(() => {
    dispatch({ type: 'TOGGLE_APPLE_MENU' })
  }, [])

  const setAppleMenu = useCallback((open) => {
    dispatch({ type: 'SET_APPLE_MENU', payload: open })
  }, [])

  useEffect(() => {
    const root = document.documentElement
    root.style.setProperty('--accent', state.settings.accentColor)
    root.style.setProperty('--accent-hover', state.settings.accentColor + 'cc')
    root.style.setProperty('--accent-glass', state.settings.accentColor + '26')
    root.style.setProperty('--accent-glass-hover', state.settings.accentColor + '40')
  }, [state.settings.accentColor])

  const getAppLabel = useCallback((id) => {
    const app = DOCK_APPS.find(a => a.id === id)
    return app ? app.label : 'Finder'
  }, [])

  const value = {
    state,
    dispatch,
    updateSettings,
    openApp,
    focusApp,
    focusWindow,
    closeWindow,
    minimizeWindow,
    restoreWindow,
    toggleSpotlight,
    setSpotlight,
    notify,
    removeNotification,
    getAppLabel,
    toggleAppleMenu,
    setAppleMenu,
  }

  return <OSContext.Provider value={value}>{children}</OSContext.Provider>
}

export function useOS() {
  const ctx = useContext(OSContext)
  if (!ctx) throw new Error('useOS must be used within OSProvider')
  return ctx
}
