import { useEffect, useRef } from 'react'
import { useOS } from '../context/OSContext'

export default function ContextMenu() {
  const { state, dispatch } = useOS()
  const menuRef = useRef(null)

  const ctx = state.contextMenu

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        dispatch({ type: 'SET_CONTEXT_MENU', payload: null })
      }
    }
    if (ctx) {
      document.addEventListener('mousedown', handler)
      return () => document.removeEventListener('mousedown', handler)
    }
  }, [ctx, dispatch])

  if (!ctx) return null

  const items = ctx.items

  return (
    <div
      id="context-menu-container"
      ref={menuRef}
      className="fixed z-[8000] min-w-[190px] flex-col p-1 rounded-[var(--radius-md)] border-[0.5px] border-[var(--border-glass)]"
      style={{
        display: 'flex',
        background: 'rgba(30,32,38,0.94)',
        backdropFilter: 'blur(30px) saturate(1.4)',
        WebkitBackdropFilter: 'blur(30px) saturate(1.4)',
        boxShadow: 'var(--shadow-lg)',
        left: Math.min(ctx.x, window.innerWidth - 190 - 4) + 'px',
        top: Math.min(ctx.y, window.innerHeight - 50 - 4) + 'px',
        animation: 'ctxIn 0.08s var(--ease)',
      }}
    >
      {items.map((item, i) =>
        item.type === 'sep' ? (
          <div key={i} className="h-px bg-[var(--border-glass)] mx-2 my-[3px]" />
        ) : (
          <button
            key={i}
            className="flex items-center gap-2 px-2.5 py-[5px] text-xs text-[var(--text-primary)] rounded cursor-pointer transition-all duration-100 hover:bg-[var(--accent)] hover:text-white border-none bg-transparent w-full text-left"
            onClick={() => {
              if (item.action) item.action()
              dispatch({ type: 'SET_CONTEXT_MENU', payload: null })
            }}
          >
            <span className="w-4 text-center text-[11px]">{item.icon || ''}</span>
            <span>{item.label}</span>
            {item.checked !== undefined && (
              <span className="ml-auto">{item.checked ? '\u2713' : ''}</span>
            )}
          </button>
        )
      )}
    </div>
  )
}
