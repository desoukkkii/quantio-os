import { useEffect, useState } from 'react'
import { useOS } from '../context/OSContext'

export default function MenuBar() {
  const { state, getAppLabel, toggleSpotlight, toggleAppleMenu } = useOS()
  const [clock, setClock] = useState('')

  useEffect(() => {
    const update = () => {
      const now = new Date()
      const h = now.getHours().toString().padStart(2, '0')
      const m = now.getMinutes().toString().padStart(2, '0')
      const d = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      setClock(`${d} ${h}:${m}`)
    }
    update()
    const timer = setInterval(update, 30000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div
      id="menubar"
      className="relative z-[5000] h-[var(--menubar-height)] flex items-center px-2 flex-shrink-0"
      style={{
        background: 'var(--bg-menubar)',
        backdropFilter: 'blur(20px) saturate(1.5)',
        WebkitBackdropFilter: 'blur(20px) saturate(1.5)',
        borderBottom: '0.5px solid rgba(255,255,255,0.06)',
      }}
    >
      <div className="flex items-center h-full gap-0">
        <button
          id="apple-btn"
          className="w-7 h-full border-none bg-transparent text-[var(--text-primary)] text-[15px] cursor-pointer flex items-center justify-center transition-all duration-150 hover:bg-[var(--bg-glass)] hover:rounded-[3px]"
          aria-label="Quantio menu"
          onClick={(e) => {
            e.stopPropagation()
            toggleAppleMenu()
          }}
        >
          &#63743;
        </button>
        <span className="text-xs font-semibold text-[var(--text-primary)] mx-[10px] ml-1 tracking-[-0.01em]">
          {getAppLabel(state.activeApp)}
        </span>
        <div className="flex items-center h-full gap-0">
          {['File', 'Edit', 'View', 'Window', 'Help'].map((item) => (
            <button
              key={item}
              className="h-full px-2 border-none bg-transparent text-xs text-[var(--text-secondary)] cursor-pointer transition-all duration-150 hover:bg-[var(--accent-glass)] hover:text-[var(--accent)] rounded-[5px]"
              type="button"
            >
              {item}
            </button>
          ))}
        </div>
      </div>
      <div className="flex items-center h-full gap-0 ml-auto">
        <button
          className="h-full px-2 border-none bg-transparent text-xs text-[var(--text-secondary)] cursor-pointer transition-all duration-150 hover:bg-[var(--accent-glass)] hover:text-[var(--accent)] rounded-[5px] flex items-center"
          aria-label="Open spotlight search"
          onClick={toggleSpotlight}
        >
          &#x1F50D;
        </button>
        <button className="h-full px-[6px] border-none bg-transparent text-[11px] text-[var(--text-secondary)] cursor-pointer flex items-center transition-all duration-150 hover:text-[var(--text-primary)]" aria-label="Wi-Fi">&#x1F4F6;</button>
        <button className="h-full px-[6px] border-none bg-transparent text-[11px] text-[var(--text-secondary)] cursor-pointer flex items-center transition-all duration-150 hover:text-[var(--text-primary)]" aria-label="Battery">&#x26A1;</button>
        <div className="text-[11px] text-[var(--text-secondary)] px-[6px] h-full flex items-center">{clock}</div>
      </div>
    </div>
  )
}
