import { useOS } from '../context/OSContext'
import Window from './Window'

export default function WindowManager() {
  const { state } = useOS()
  const windows = Array.from(state.windows.values()).filter(w => !w.minimized)

  return (
    <div
      id="window-container"
      className="absolute top-[var(--menubar-height)] left-0 right-0 bottom-0 z-[100] pointer-events-none overflow-hidden"
    >
      {windows.map((win) => (
        <Window key={win.id} win={win} />
      ))}
    </div>
  )
}
