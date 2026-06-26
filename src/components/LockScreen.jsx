import { useEffect, useState, useCallback } from 'react'
import { useOS } from '../context/OSContext'
import { WALLPAPERS } from '../constants'

export default function LockScreen() {
  const { state, dispatch } = useOS()
  const [time, setTime] = useState('')
  const [date, setDate] = useState('')
  const [woken, setWoken] = useState(false)

  const updateClock = useCallback(() => {
    const now = new Date()
    const h = now.getHours().toString().padStart(2, '0')
    const m = now.getMinutes().toString().padStart(2, '0')
    setTime(`${h}:${m}`)
    const opts = { weekday: 'long', month: 'long', day: 'numeric' }
    setDate(now.toLocaleDateString('en-US', opts))
  }, [])

  useEffect(() => {
    if (!state.locked) return
    updateClock()
    setWoken(false)
    const timer = setInterval(updateClock, 1000)
    return () => clearInterval(timer)
  }, [state.locked, updateClock])

  useEffect(() => {
    if (!state.locked) return
    const handler = (e) => {
      const modKeys = ['Shift', 'Control', 'Alt', 'Meta', 'CapsLock', 'Tab']
      if (e.key === 'Enter') {
        if (woken) {
          dispatch({ type: 'UNLOCK' })
        } else {
          setWoken(true)
        }
      } else if (e.key === 'Escape') {
        setWoken(false)
      } else if (!woken && !modKeys.includes(e.key)) {
        setWoken(true)
      }
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [state.locked, woken, dispatch])

  const handleScreenClick = () => {
    if (woken) {
      dispatch({ type: 'UNLOCK' })
    } else {
      setWoken(true)
    }
  }

  const wp = WALLPAPERS[state.settings.wallpaper] || WALLPAPERS.sunset

  return (
    <div
      className={`fixed inset-0 z-[9000] flex flex-col items-center justify-center gap-1.5 cursor-default transition-all duration-700 ${state.locked ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      style={{ backgroundImage: wp.colors, backgroundSize: 'cover', backgroundPosition: 'center' }}
      onClick={handleScreenClick}
    >
      <div
        className="absolute inset-0 transition-opacity duration-700"
        style={{
          background: woken ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.75)',
          backdropFilter: woken ? 'blur(30px)' : 'blur(8px)',
          WebkitBackdropFilter: woken ? 'blur(30px)' : 'blur(8px)',
        }}
      />
      <div className={`relative z-10 flex flex-col items-center gap-1.5 transition-all duration-500 ${woken ? 'opacity-100 translate-y-0' : 'opacity-40 translate-y-4'}`}>
        <div
          className="w-[60px] h-[60px] rounded-full flex items-center justify-center text-[26px] font-bold text-white mb-5"
          style={{
            background: `linear-gradient(140deg, var(--accent), color-mix(in oklab, var(--accent) 70%, #fff))`,
            boxShadow: '0 12px 36px color-mix(in oklab, var(--accent) 40%, transparent), 0 0 0 1px rgba(255,255,255,0.08) inset',
          }}
        >
          Q
        </div>
        <div className="text-[76px] font-[200] text-white leading-none tracking-[-2px]" style={{ textShadow: '0 4px 24px rgba(0,0,0,0.4)' }}>
          {time}
        </div>
        <div className="text-base text-white/60 mb-8">{date}</div>
        {woken ? (
          <button
            onClick={(e) => { e.stopPropagation(); dispatch({ type: 'UNLOCK' }) }}
            className="px-6 py-2.5 rounded-full border border-white/15 bg-white/5 text-white text-[13px] cursor-pointer transition-all duration-200 hover:bg-white/10 active:scale-98"
            style={{ backdropFilter: 'blur(20px) saturate(1.4)', WebkitBackdropFilter: 'blur(20px) saturate(1.4)', fontFamily: 'inherit' }}
          >
            Click to unlock
          </button>
        ) : (
          <div className="text-white/30 text-[13px] animate-pulse">Click or press any key</div>
        )}
      </div>
    </div>
  )
}
