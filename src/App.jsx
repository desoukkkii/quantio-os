import { OSProvider } from './context/OSContext'
import BootScreen from './components/BootScreen'
import LockScreen from './components/LockScreen'
import Desktop from './components/Desktop'

export default function App() {
  return (
    <OSProvider>
      <AppContent />
    </OSProvider>
  )
}

function AppContent() {
  return (
    <>
      <BootScreen />
      <LockScreen />
      <Desktop />
    </>
  )
}
