import { useState } from 'react'
import { SIDEBAR_ITEMS, FINDER_FILES } from '../../constants'

export default function Finder() {
  const [activeSidebar, setActiveSidebar] = useState('documents')

  return (
    <div className="finder flex h-full overflow-hidden">
      <div className="finder-sidebar w-[160px] border-r-[0.5px] border-[var(--border-glass)] overflow-y-auto p-[6px] flex-shrink-0">
        {SIDEBAR_ITEMS.map((it) => (
          <div
            key={it.id}
            className={`finder-nav px-[6px] py-1 cursor-pointer text-[11px] rounded transition-all duration-100 flex items-center gap-1.5 ${activeSidebar === it.id ? 'bg-[var(--accent-glass)] text-[var(--accent)]' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-glass-hover)] hover:text-[var(--text-primary)]'}`}
            onClick={() => setActiveSidebar(it.id)}
          >
            <span className="text-[13px]">{it.icon}</span>
            <span>{it.label}</span>
          </div>
        ))}
      </div>
      <div className="finder-main flex-1 flex flex-col overflow-hidden">
        <div className="app-toolbar flex items-center gap-1 px-2.5 py-[5px] border-b-[0.5px] border-[var(--border-glass)] flex-shrink-0">
          <button className="px-2 py-[3px] border-none bg-transparent text-[var(--text-secondary)] text-[11px] cursor-pointer transition-all duration-100 rounded hover:bg-[var(--bg-glass-hover)] hover:text-[var(--text-primary)]" disabled>&#x2190;</button>
          <button className="px-2 py-[3px] border-none bg-transparent text-[var(--text-secondary)] text-[11px] cursor-pointer transition-all duration-100 rounded hover:bg-[var(--bg-glass-hover)] hover:text-[var(--text-primary)]" disabled>&#x2192;</button>
          <button className="px-2 py-[3px] border-none bg-transparent text-[var(--text-secondary)] text-[11px] cursor-pointer transition-all duration-100 rounded hover:bg-[var(--bg-glass-hover)] hover:text-[var(--text-primary)]">&#x25A6;</button>
        </div>
        <div className="finder-files flex-1 overflow-y-auto p-[6px] grid gap-0.5 content-start" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(min(68px, 16vw), 1fr))' }}>
          {FINDER_FILES.map((f, i) => (
            <div key={i} className="finder-item flex flex-col items-center gap-0.5 p-[6px] px-1 rounded cursor-pointer transition-all duration-100 text-center hover:bg-[var(--bg-glass-hover)]">
              <div className="fi-icon text-[26px] leading-none">{f.icon}</div>
              <div className="fi-name text-[10px] text-[var(--text-primary)] max-w-[64px] truncate">{f.name}</div>
              <div className="fi-size text-[9px] text-[var(--text-tertiary)]">{f.size}</div>
            </div>
          ))}
        </div>
        <div className="app-bar flex items-center px-2.5 py-0.5 border-t-[0.5px] border-[var(--border-glass)] text-[10px] text-[var(--text-tertiary)] flex-shrink-0 gap-2.5">
          <span>{FINDER_FILES.length} items</span>
        </div>
      </div>
    </div>
  )
}
