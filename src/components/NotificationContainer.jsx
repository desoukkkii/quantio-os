import { useOS } from '../context/OSContext'

export default function NotificationContainer() {
  const { state, removeNotification } = useOS()

  return (
    <div
      id="notification-container"
      className="fixed top-[calc(var(--menubar-height)+8px)] right-3 z-[7000] flex flex-col gap-1.5 pointer-events-none max-w-[320px]"
    >
      {state.notifications.map((n) => (
          <div
            key={n.id}
            className="notif-item pointer-events-auto px-3 py-2.5 flex gap-2 cursor-pointer"
          style={{
            background: 'rgba(30,32,38,0.92)',
            backdropFilter: 'blur(30px) saturate(1.4)',
            WebkitBackdropFilter: 'blur(30px) saturate(1.4)',
            borderRadius: 'var(--radius-md)',
            border: '0.5px solid var(--border-glass)',
            boxShadow: 'var(--shadow-md)',
            animation: 'notifSlideIn 0.28s var(--ease-spring)',
          }}
          onClick={() => removeNotification(n.id)}
        >
          <div
            className="w-6 h-6 flex items-center justify-center text-xs rounded-[var(--radius-sm)] flex-shrink-0"
            style={{ background: 'var(--accent-glass)' }}
          >
            {n.icon || '\uD83D\uDD14'}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold text-[var(--text-primary)] mb-[1px]">{n.title}</div>
            <div className="text-[11px] text-[var(--text-secondary)] leading-[1.4]">{n.msg}</div>
            <div className="text-[9px] text-[var(--text-tertiary)] mt-[3px]">just now</div>
          </div>
          <button
            className="w-[18px] h-[18px] border-none bg-transparent text-[var(--text-tertiary)] cursor-pointer flex items-center justify-center text-[8px] flex-shrink-0 transition-all duration-150 rounded-[3px] hover:bg-[var(--bg-glass-hover)] hover:text-[var(--text-primary)]"
            onClick={(e) => { e.stopPropagation(); removeNotification(n.id) }}
          >
            &#x2715;
          </button>
        </div>
      ))}
    </div>
  )
}
