import { useState } from 'react'
import { useOS } from '../context/OSContext'
import { DESKTOP_ICONS_DATA } from '../constants'

export default function DesktopIcons() {
  const { state, openApp, notify } = useOS()
  const [selected, setSelected] = useState(null)

  if (!state.settings.showDesktopIcons) return null

  const handleClick = (id) => {
    setSelected(id)
  }

  const handleDblClick = (id) => {
    if (id === 'finder') openApp('finder')
    else if (id === 'trash') notify('Trash', 'Trash is empty')
  }

  return (
    <div className="absolute top-[var(--menubar-height)] left-0 right-0 bottom-[var(--dock-height)] z-10 p-5 flex flex-col flex-wrap gap-1 content-start">
      {DESKTOP_ICONS_DATA.map((ic) => (
        <div
          key={ic.id}
          data-app={ic.id}
          onClick={() => handleClick(ic.id)}
          onDoubleClick={() => handleDblClick(ic.id)}
          className={`flex flex-col items-center w-[74px] p-2 px-1 rounded-[var(--radius-sm)] cursor-pointer transition-all duration-150 gap-0.5 hover:bg-[var(--bg-glass)] active:scale-94 ${selected === ic.id ? 'bg-[var(--accent-glass)]' : ''}`}
        >
          <div className="w-11 h-11 flex items-center justify-center text-[26px]">{ic.icon}</div>
          <div className="text-[11px] text-[var(--text-primary)] text-center leading-tight max-w-[66px] truncate">{ic.label}</div>
        </div>
      ))}
    </div>
  )
}
