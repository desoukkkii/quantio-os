import { useEffect, useState, useRef } from 'react'
import { useOS } from '../context/OSContext'

const steps = [
  { pct: 15, text: 'Initializing kernel...' },
  { pct: 30, text: 'Loading system services...' },
  { pct: 50, text: 'Configuring display...' },
  { pct: 70, text: 'Starting window server...' },
  { pct: 85, text: 'Launching dock...' },
  { pct: 100, text: 'Ready' },
]

export default function BootScreen() {
  const { dispatch } = useOS()
  const [visible, setVisible] = useState(true)
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState('Starting up...')
  const iRef = useRef(0)

  useEffect(() => {
    const tick = () => {
      if (iRef.current >= steps.length) {
        setTimeout(() => {
          window._bootTime = Date.now()
          dispatch({ type: 'BOOT_COMPLETE', payload: Date.now() })
          setVisible(false)
        }, 300)
        return
      }
      const s = steps[iRef.current]
      setProgress(s.pct)
      setStatus(s.text)
      iRef.current++
      setTimeout(tick, 300 + Math.random() * 200)
    }
    tick()
  }, [dispatch])

  return (
    <div
      className={`fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-[#000] transition-opacity duration-400 ${visible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      style={{ background: visible ? 'radial-gradient(60% 60% at 50% 50%, #0b0d12 0%, #000 100%)' : '' }}
    >
      <div className={`w-16 h-16 mb-9 text-white ${visible ? 'animate-boot-pulse' : ''}`}>
        <svg viewBox="0 0 80 80" fill="none" aria-hidden="true" className="w-full h-full opacity-80">
          <rect x="8" y="8" width="64" height="64" rx="18" stroke="currentColor" strokeWidth="2" fill="none" />
          <path d="M28 34 L40 24 L52 34 L52 50 L40 60 L28 50 Z" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinejoin="round" />
          <path d="M33 39 L40 33 L47 39 L47 51 L40 57 L33 51 Z" stroke="currentColor" strokeWidth="1.2" fill="none" strokeLinejoin="round" opacity="0.6" />
          <circle cx="40" cy="45" r="2.5" fill="currentColor" />
        </svg>
      </div>
      <div className="w-[220px] h-[3px] bg-white/5 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{ width: `${progress}%`, background: 'var(--accent)' }}
        />
      </div>
      <div className="mt-3.5 font-mono text-[11px] text-white/25">{status}</div>
    </div>
  )
}
