import { useState } from 'react'
import { useOS } from '../../context/OSContext'
import { WALLPAPERS, ACCENT_COLORS } from '../../constants'

const pages = [
  { id: 'general', label: 'General', icon: '\u2699\uFE0F' },
  { id: 'wallpaper', label: 'Wallpaper', icon: '\uD83D\uDDBC\uFE0F' },
  { id: 'accent', label: 'Accent Color', icon: '\uD83C\uDFA8' },
  { id: 'dock', label: 'Dock', icon: '\u2B1C' },
]

export default function Settings() {
  const { state, updateSettings } = useOS()
  const [activePage, setActivePage] = useState('general')

  return (
    <div className="settings h-full flex overflow-hidden">
      <div className="settings-sidebar w-[160px] border-r-[0.5px] border-[var(--border-glass)] p-[6px] overflow-y-auto flex-shrink-0">
        {pages.map((p) => (
          <div
            key={p.id}
            className={`settings-item p-[6px] px-2 rounded cursor-pointer text-xs transition-all duration-100 mb-0.5 flex items-center gap-2 ${activePage === p.id ? 'bg-[var(--accent-glass)] text-[var(--accent)]' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-glass-hover)] hover:text-[var(--text-primary)]'}`}
            onClick={() => setActivePage(p.id)}
          >
            <span>{p.icon}</span>
            <span>{p.label}</span>
          </div>
        ))}
      </div>
      <div className="settings-content flex-1 p-5 overflow-y-auto">
        {activePage === 'general' && <GeneralPage state={state} updateSettings={updateSettings} />}
        {activePage === 'wallpaper' && <WallpaperPage state={state} updateSettings={updateSettings} />}
        {activePage === 'accent' && <AccentPage state={state} updateSettings={updateSettings} />}
        {activePage === 'dock' && <DockPage state={state} updateSettings={updateSettings} />}
      </div>
    </div>
  )
}

function GeneralPage({ state, updateSettings }) {
  return (
    <>
      <div className="settings-title text-[15px] font-semibold mb-3.5 text-[var(--text-primary)]">General</div>
      <div
        className="settings-row flex items-center justify-between px-3 py-2 rounded-[var(--radius-sm)] mb-1"
        style={{ background: 'var(--bg-glass)' }}
      >
        <div>
          <div className="settings-label text-xs text-[var(--text-primary)]">Show Desktop Icons</div>
          <div className="settings-desc text-[10px] mt-[1px]" style={{ color: 'var(--text-tertiary)' }}>Display icons on the desktop</div>
        </div>
        <div
          className={`toggle w-[34px] h-5 rounded-[10px] cursor-pointer relative flex-shrink-0 transition-all duration-200 ${state.settings.showDesktopIcons ? 'on' : ''}`}
          style={{ background: state.settings.showDesktopIcons ? 'var(--accent)' : 'var(--bg-raised)' }}
          onClick={() => updateSettings({ showDesktopIcons: !state.settings.showDesktopIcons })}
        >
          <div
            className="tog-knob absolute top-[2px] w-4 h-4 rounded-full bg-white transition-all duration-200"
            style={{ left: state.settings.showDesktopIcons ? '16px' : '2px' }}
          />
        </div>
      </div>
      <div
        className="settings-row flex items-center justify-between px-3 py-2 rounded-[var(--radius-sm)] mb-1"
        style={{ background: 'var(--bg-glass)' }}
      >
        <div>
          <div className="settings-label text-xs text-[var(--text-primary)]">About Quantio OS</div>
          <div className="settings-desc text-[10px] mt-[1px]" style={{ color: 'var(--text-tertiary)' }}>Version 1.0 &middot; Built with web technologies</div>
        </div>
      </div>
    </>
  )
}

function WallpaperPage({ state, updateSettings }) {
  return (
    <>
      <div className="settings-title text-[15px] font-semibold mb-3.5 text-[var(--text-primary)]">Wallpaper</div>
      <div className="wall-grid grid gap-2" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(90px, 1fr))' }}>
        {Object.entries(WALLPAPERS).map(([k, v]) => (
          <div
            key={k}
            className={`wall-opt aspect-[16/10] rounded-[var(--radius-sm)] cursor-pointer overflow-hidden relative transition-all duration-150 ${k === state.settings.wallpaper ? 'ring-2 ring-[var(--accent)] shadow-[0_0_16px_var(--accent-glass)]' : 'border border-transparent hover:border-[var(--accent)]'}`}
            onClick={() => updateSettings({ wallpaper: k })}
          >
            <div className="wp-preview w-full h-full" style={{ background: v.colors }} />
            <div className="wp-label absolute bottom-0 left-0 right-0 bg-black/50 text-white text-[9px] px-1 py-0.5 text-center">{v.label}</div>
          </div>
        ))}
      </div>
    </>
  )
}

function AccentPage({ state, updateSettings }) {
  return (
    <>
      <div className="settings-title text-[15px] font-semibold mb-3.5 text-[var(--text-primary)]">Accent Color</div>
      <div className="color-grid flex gap-2 flex-wrap">
        {ACCENT_COLORS.map((c) => (
          <div
            key={c}
            className={`color-swatch w-[30px] h-[30px] rounded-full cursor-pointer border-2 transition-all duration-150 hover:scale-112 ${c === state.settings.accentColor ? 'border-[var(--text-primary)]' : 'border-transparent'}`}
            style={{ background: c }}
            onClick={() => updateSettings({ accentColor: c })}
          />
        ))}
      </div>
    </>
  )
}

function DockPage({ state, updateSettings }) {
  const [val, setVal] = useState(state.settings.dockSize)

  return (
    <>
      <div className="settings-title text-[15px] font-semibold mb-3.5 text-[var(--text-primary)]">Dock</div>
      <div
        className="settings-row flex items-center justify-between px-3 py-2 rounded-[var(--radius-sm)] mb-1"
        style={{ background: 'var(--bg-glass)' }}
      >
        <div>
          <div className="settings-label text-xs text-[var(--text-primary)]">Dock Size</div>
          <div className="settings-desc text-[10px] mt-[1px]" style={{ color: 'var(--text-tertiary)' }}>Adjust the size of dock icons</div>
        </div>
        <div className="range-wrap flex items-center gap-2.5">
          <input
            type="range"
            min="0.6"
            max="1.6"
            step="0.1"
            value={val}
            onChange={(e) => {
              const v = parseFloat(e.target.value)
              setVal(v)
              updateSettings({ dockSize: v })
            }}
            className="w-[120px] h-1 rounded-full outline-none cursor-pointer"
            style={{
              WebkitAppearance: 'none',
              appearance: 'none',
              background: 'var(--bg-raised)',
            }}
          />
          <span className="range-val text-xs min-w-[20px] text-center" style={{ color: 'var(--text-secondary)' }}>
            {Math.round(val * 100)}%
          </span>
        </div>
      </div>
    </>
  )
}
