import { useState, useCallback } from 'react'
import { CALC_LAYOUT } from '../../constants'

function isOp(label) {
  return ['+', '\u2212', '\u00D7', '\u00F7'].includes(label)
}

function isFn(label) {
  return ['C', '\u00B1', '%', '\u2190'].includes(label)
}

export default function Calculator() {
  const [current, setCurrent] = useState('0')
  const [prev, setPrev] = useState('')
  const [operator, setOperator] = useState(null)
  const [reset, setReset] = useState(false)

  const updateDisplay = (val) => {
    return val.length > 14 ? parseFloat(val).toExponential(4) : val
  }

  const inputDigit = useCallback((val) => {
    if (reset) {
      setCurrent(val === '.' ? '0.' : val)
      setReset(false)
    } else {
      setCurrent(prev => {
        if (val === '.' && prev.includes('.')) return prev
        if (prev === '0' && val !== '.') return val
        return prev + val
      })
    }
  }, [reset])

  const handleOp = useCallback((op) => {
    if (operator && !reset) {
      calculate()
    }
    setPrev(current)
    setOperator(op)
    setReset(true)
  }, [operator, reset, current])

  const calculate = useCallback(() => {
    if (!operator) return
    const a = parseFloat(prev)
    const b = parseFloat(current)
    let r
    switch (operator) {
      case '+': r = a + b; break
      case '\u2212': r = a - b; break
      case '\u00D7': r = a * b; break
      case '\u00F7': r = b !== 0 ? a / b : 'Error'; break
      default: return
    }
    setCurrent(typeof r === 'number' ? String(parseFloat(r.toFixed(10))) : 'Error')
    setPrev('')
    setOperator(null)
    setReset(true)
  }, [operator, prev, current])

  const handleFn = useCallback((f) => {
    if (f === 'C') {
      setCurrent('0')
      setPrev('')
      setOperator(null)
      setReset(false)
    } else if (f === '\u00B1') {
      setCurrent(c => String(-parseFloat(c)))
    } else if (f === '%') {
      setCurrent(c => String(parseFloat(c) / 100))
    } else if (f === '\u2190') {
      setCurrent(c => c.length > 1 ? c.slice(0, -1) : '0')
    }
  }, [])

  const handleClick = useCallback((label) => {
    if (label === '=') calculate()
    else if (isOp(label)) handleOp(label)
    else if (isFn(label)) handleFn(label)
    else inputDigit(label)
  }, [calculate, handleOp, handleFn, inputDigit])

  const getBtnClass = (label) => {
    if (isOp(label)) return 'op'
    if (isFn(label)) return 'fn'
    if (label === '=') return 'eq'
    return ''
  }

  return (
    <div className="calculator h-full flex flex-col p-2.5">
      <div className="calc-display px-2.5 py-3 mb-2 rounded-[var(--radius-sm)] flex flex-col justify-end" style={{ background: 'var(--bg-input)', minHeight: '64px' }}>
        <div className="calc-expr text-[11px] min-h-[16px] break-all" style={{ color: 'var(--text-tertiary)' }}>
          {operator ? `${prev} ${operator}` : ''}
        </div>
        <div className="calc-result text-[30px] font-[300] text-[var(--text-primary)] overflow-hidden text-ellipsis text-right">
          {updateDisplay(current)}
        </div>
      </div>
      <div className="calc-grid flex-1 grid grid-cols-4 gap-[5px]">
        {CALC_LAYOUT.flat().map((label, i) => (
          <button
            key={i}
            className={`calc-btn border-none rounded-[var(--radius-sm)] text-[15px] font-medium cursor-pointer transition-all duration-100 flex items-center justify-center hover:shadow-[0_4px_12px_rgba(0,0,0,0.25)] active:scale-95 ${getBtnClass(label) === 'op' ? 'text-[var(--accent)]' : getBtnClass(label) === 'fn' ? 'text-[var(--text-tertiary)] text-xs' : getBtnClass(label) === 'eq' ? 'text-white' : 'text-[var(--text-primary)]'}`}
            style={{
              background: getBtnClass(label) === 'op' ? 'var(--accent-glass)' : getBtnClass(label) === 'eq' ? 'var(--accent)' : 'var(--bg-glass)',
              fontFamily: 'inherit',
              boxShadow: getBtnClass(label) === 'eq' ? '0 6px 18px color-mix(in oklab, var(--accent) 45%, transparent)' : 'none',
            }}
            onClick={() => handleClick(label)}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  )
}
