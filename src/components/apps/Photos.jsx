import { useState, useCallback } from 'react'
import { PHOTOS_SVGS } from '../../constants'

export default function Photos() {
  const [currentIdx, setCurrentIdx] = useState(0)
  const photo = PHOTOS_SVGS[currentIdx]

  const prev = useCallback(() => {
    if (currentIdx > 0) setCurrentIdx(i => i - 1)
  }, [currentIdx])

  const next = useCallback(() => {
    if (currentIdx < PHOTOS_SVGS.length - 1) setCurrentIdx(i => i + 1)
  }, [currentIdx])

  return (
    <div className="photos h-full flex flex-col items-center justify-center bg-black">
      <div className="photos-toolbar flex items-center gap-1.5 px-2.5 py-[5px] w-full border-b-[0.5px] border-[var(--border-glass)] flex-shrink-0">
        <button
          className="px-[7px] py-[3px] border-none bg-transparent text-[var(--text-secondary)] text-[11px] cursor-pointer transition-all duration-100 rounded hover:bg-[var(--bg-glass-hover)] hover:text-[var(--text-primary)]"
          onClick={prev}
          disabled={currentIdx === 0}
        >&#x25C0;</button>
        <span className="flex-1 text-[11px] text-center" style={{ color: 'var(--text-tertiary)' }}>
          {photo.name} ({currentIdx + 1}/{PHOTOS_SVGS.length})
        </span>
        <button
          className="px-[7px] py-[3px] border-none bg-transparent text-[var(--text-secondary)] text-[11px] cursor-pointer transition-all duration-100 rounded hover:bg-[var(--bg-glass-hover)] hover:text-[var(--text-primary)]"
          onClick={next}
          disabled={currentIdx === PHOTOS_SVGS.length - 1}
        >&#x25B6;</button>
      </div>
      <div className="photos-canvas flex-1 flex items-center justify-center p-3 overflow-hidden" dangerouslySetInnerHTML={{ __html: photo.svg }} />
      <div className="photos-strip flex items-center gap-1.5 px-2.5 py-[6px] w-full border-t-[0.5px] border-[var(--border-glass)] overflow-x-auto flex-shrink-0 justify-center">
        {PHOTOS_SVGS.map((p, i) => (
          <div
            key={i}
            className={`photos-thumb w-10 h-10 cursor-pointer overflow-hidden transition-all duration-150 flex-shrink-0 ${i === currentIdx ? 'opacity-100' : 'opacity-40 hover:opacity-70'}`}
            style={{ border: i === currentIdx ? '1px solid var(--accent)' : '1px solid transparent' }}
            onClick={() => setCurrentIdx(i)}
            dangerouslySetInnerHTML={{ __html: p.svg }}
          />
        ))}
      </div>
    </div>
  )
}
