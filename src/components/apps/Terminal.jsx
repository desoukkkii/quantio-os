import { useState, useRef, useCallback, useEffect } from 'react'
import { useOS } from '../../context/OSContext'
import { TERMINAL_COMMANDS } from '../../constants'

export default function Terminal() {
  const { updateSettings } = useOS()
  const [lines, setLines] = useState([
    { text: 'Welcome to Quantio OS Terminal v1.0', className: '' },
    { text: 'Type "help" for available commands.\n', className: '' },
  ])
  const [input, setInput] = useState('')
  const outputRef = useRef(null)

  const handleKeyDown = useCallback((e) => {
    if (e.key !== 'Enter') return
    const val = input.trim()
    setInput('')

    const promptLine = { text: `quantio@os ~ % ${val}`, className: '' }

    if (val) {
      const parts = val.match(/(?:[^\s"]+|"[^"]*")+/g) || []
      const cmd = parts[0]?.toLowerCase()
      const args = parts.slice(1).map(a => a.replace(/^"(.*)"$/, '$1'))

      if (cmd === 'clear') {
        setLines([promptLine])
        return
      }

      const command = TERMINAL_COMMANDS[cmd]
      if (command) {
        const termInterface = {
          writeln: (text, cls = '') => setLines(prev => [...prev, { text, className: cls }]),
          clear: () => setLines([]),
        }
        try {
          command.fn(args, termInterface, { updateSettings })
        } catch (err) {
          setLines(prev => [...prev, { text: 'Error: ' + err.message, className: '' }])
        }
      } else {
        setLines(prev => [...prev, { text: `zsh: command not found: ${cmd}`, className: '' }])
      }
    } else {
      setLines(prev => [...prev, promptLine])
      return
    }

    setLines(prev => [...prev, promptLine])
  }, [input, updateSettings])

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight
    }
  }, [lines])

  return (
    <div className="terminal h-full flex flex-col bg-black">
      <div ref={outputRef} className="term-output flex-1 overflow-y-auto p-2.5 font-mono text-[12px] leading-[1.5] text-[#c0c0c0]">
        {lines.map((line, i) => (
          <div key={i} className={`term-line whitespace-pre-wrap break-all ${line.className}`}>
            {line.text}
          </div>
        ))}
      </div>
      <div className="term-input-line flex items-center gap-1.5 px-2.5 pb-2.5" onClick={(e) => e.currentTarget.querySelector('input')?.focus()}>
        <span className="term-prompt font-mono text-xs" style={{ color: 'var(--accent)' }}>quantio@os ~ %</span>
        <input
          className="term-input flex-1 border-none bg-transparent text-[#c0c0c0] font-mono text-xs outline-none"
          style={{ caretColor: 'var(--accent)' }}
          type="text"
          autoFocus
          spellCheck="false"
          autoComplete="off"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>
    </div>
  )
}
