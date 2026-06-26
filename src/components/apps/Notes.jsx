import { useState, useEffect, useCallback, useRef } from 'react'
import { KEYS } from '../../constants'

function loadNotes() {
  try {
    const saved = localStorage.getItem(KEYS.notes)
    const notes = saved ? JSON.parse(saved) : null
    if (notes && notes.length > 0) return notes
  } catch {}
  return [
    { id: 'note-1', title: 'Welcome', content: 'Welcome to Quantio Notes!\n\nYour notes are automatically saved.' },
    { id: 'note-2', title: 'Getting Started', content: 'Type in the editor to create notes.\nClick + to add a new note.' },
  ]
}

function saveNotes(notes) {
  try { localStorage.setItem(KEYS.notes, JSON.stringify(notes)) } catch {}
}

export default function Notes() {
  const [notes, setNotes] = useState(loadNotes)
  const [activeId, setActiveId] = useState(null)
  const saveTimerRef = useRef(null)

  useEffect(() => {
    if (!activeId && notes.length > 0) setActiveId(notes[0].id)
  }, [])

  const activeNote = notes.find(n => n.id === activeId)

  const handleSelect = useCallback((id) => {
    setActiveId(id)
  }, [])

  const handleSave = useCallback((updatedNote) => {
    setNotes(prev => {
      const next = prev.map(n => n.id === updatedNote.id ? { ...n, ...updatedNote } : n)
      saveNotes(next)
      return next
    })
  }, [])

  const handleAdd = useCallback(() => {
    const id = 'note-' + Date.now()
    const newNotes = [{ id, title: 'Untitled', content: '' }, ...notes]
    setNotes(newNotes)
    setActiveId(id)
    saveNotes(newNotes)
  }, [notes])

  const handleDelete = useCallback(() => {
    if (!activeId || notes.length <= 1) return
    const filtered = notes.filter(n => n.id !== activeId)
    setNotes(filtered)
    setActiveId(filtered[0]?.id || null)
    saveNotes(filtered)
  }, [activeId, notes])

  const handleChange = useCallback((field, value) => {
    if (!activeNote) return
    const updated = { ...activeNote, [field]: value }
    setNotes(prev => prev.map(n => n.id === activeNote.id ? updated : n))

    clearTimeout(saveTimerRef.current)
    saveTimerRef.current = setTimeout(() => saveNotes(
      notes.map(n => n.id === activeNote.id ? updated : n)
    ), 300)
  }, [activeNote, notes])

  useEffect(() => {
    return () => clearTimeout(saveTimerRef.current)
  }, [])

  return (
    <div className="notes h-full flex flex-col">
      <div className="app-toolbar flex items-center gap-1 px-2.5 py-[5px] border-b-[0.5px] border-[var(--border-glass)] flex-shrink-0">
        <button
          className="px-2 py-[3px] border-none bg-transparent text-[var(--text-secondary)] text-[11px] cursor-pointer transition-all duration-100 rounded hover:bg-[var(--bg-glass-hover)] hover:text-[var(--text-primary)]"
          onClick={handleAdd}
        >+</button>
        <button
          className="px-2 py-[3px] border-none bg-transparent text-[var(--text-secondary)] text-[11px] cursor-pointer transition-all duration-100 rounded hover:bg-[var(--bg-glass-hover)] hover:text-[var(--text-primary)]"
          onClick={handleDelete}
          disabled={notes.length <= 1}
        >&#x2212;</button>
      </div>
      <div className="flex h-full overflow-hidden">
        <div className="notes-list w-[160px] border-r-[0.5px] border-[var(--border-glass)] overflow-y-auto p-[6px] flex-shrink-0">
          {notes.map((n) => (
            <div
              key={n.id}
              className={`notes-item p-[6px] px-2 rounded cursor-pointer transition-all duration-100 mb-0.5 ${n.id === activeId ? 'bg-[var(--accent-glass)]' : 'hover:bg-[var(--bg-glass-hover)]'}`}
              onClick={() => handleSelect(n.id)}
            >
              <div className="ni-title text-xs font-medium text-[var(--text-primary)] truncate">{n.title || 'Untitled'}</div>
              <div className="ni-preview text-[10px] text-[var(--text-tertiary)] truncate">{(n.content || '').split('\n')[0] || 'Empty note'}</div>
            </div>
          ))}
        </div>
        <div className="notes-editor-wrap flex-1 flex flex-col p-2.5 min-w-0">
          {activeNote ? (
            <>
              <input
                className="notes-title w-full border-none bg-transparent text-[var(--text-primary)] text-lg font-semibold p-[6px] px-1 outline-none border-b-[0.5px] border-[var(--border-glass)] mb-2.5"
                style={{ fontFamily: 'inherit' }}
                value={activeNote.title}
                placeholder="Note title"
                onChange={(e) => handleChange('title', e.target.value)}
              />
              <textarea
                className="notes-content flex-1 border-none bg-transparent text-[var(--text-primary)] text-xs leading-[1.6] p-[6px] px-1 outline-none resize-none"
                style={{ fontFamily: 'inherit' }}
                value={activeNote.content}
                placeholder="Write something..."
                onChange={(e) => handleChange('content', e.target.value)}
              />
            </>
          ) : (
            <div className="notes-empty flex-1 flex flex-col items-center justify-center text-[var(--text-tertiary)] gap-1.5">
              <div className="ne-icon text-[36px] opacity-20">&#x1F4DD;</div>
              <div className="ne-text text-[11px]">Select or create a note</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
