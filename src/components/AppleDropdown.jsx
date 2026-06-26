import { useOS } from '../context/OSContext'

export default function AppleDropdown() {
  const { state, dispatch, notify, setAppleMenu } = useOS()

  const handleAction = (action) => {
    setAppleMenu(false)

    if (action === 'about') {
      notify('Quantio OS', 'Version 1.0 \u00B7 Built with web technologies')
    } else if (action === 'sleep') {
      dispatch({ type: 'LOCK' })
    } else if (action === 'restart') {
      window.location.reload()
    } else if (action === 'shutdown') {
      document.body.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100vh;background:#000;color:#fff;font-family:system-ui;font-size:18px;flex-direction:column;gap:16px"><span>\u23F9\uFE0F</span><span>Shut Down</span></div>'
    }
  }

  return (
    <div
      id="apple-dropdown"
      className={`absolute top-[var(--menubar-height)] left-[2px] min-w-[220px] flex-col p-1 rounded-[var(--radius-md)] border-[0.5px] border-[var(--border-glass)] z-[5500] ${state.appleMenuOpen ? 'flex' : 'hidden'}`}
      style={{
        background: 'rgba(30,32,38,0.92)',
        backdropFilter: 'blur(30px) saturate(1.4)',
        WebkitBackdropFilter: 'blur(30px) saturate(1.4)',
        boxShadow: 'var(--shadow-lg)',
        animation: 'dropdownIn 0.12s var(--ease)',
      }}
    >
      {[
        { label: 'About Quantio', action: 'about' },
        { type: 'sep' },
        { label: 'Lock Screen', action: 'sleep' },
        { label: 'Restart...', action: 'restart' },
        { label: 'Shut Down...', action: 'shutdown' },
      ].map((item, i) =>
        item.type === 'sep' ? (
          <div key={i} className="h-px bg-[var(--border-glass)] mx-2 my-[3px]" />
        ) : (
          <div
            key={i}
            className="px-2.5 py-[5px] text-xs text-[var(--text-primary)] rounded cursor-pointer transition-all duration-100 hover:bg-[var(--accent)] hover:text-white"
            onClick={() => handleAction(item.action)}
          >
            {item.label}
          </div>
        )
      )}
    </div>
  )
}
