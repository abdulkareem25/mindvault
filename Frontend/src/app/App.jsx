import { useCallback, useEffect } from 'react'
import { RouterProvider } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import AppToaster from '../shared/components/AppToaster'
import { Plus } from 'lucide-react'
import useAuth from '../features/auth/hooks/useAuth'
import { useKeyboardShortcut } from '../shared/hooks/useKeyboardShortcut'
import { openModal } from '../features/capture/captureSlice'
import { useSocket } from '../features/chat/hooks/useSocket'
import router from './app.routes'

const App = () => {
  const { fetchCurrentUser } = useAuth();
  const dispatch = useDispatch();

  // Global socket listener — vault:updated events sunne ke liye
  useSocket();

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const handleOpenCapture = useCallback(() => {
    dispatch(openModal());
  }, [dispatch]);

  useKeyboardShortcut(['Control', 'Shift', 'M'], handleOpenCapture);

  return (
    <>
      <RouterProvider router={router} />
      <AppToaster />

      {/* Mobile floating capture button */}
      <button
        onClick={handleOpenCapture}
        className="fixed bottom-6 right-6 z-30 md:hidden w-14 h-14 rounded-full bg-vault-terracotta text-vault-ivory flex items-center justify-center shadow-lg hover:bg-vault-coral transition-colors"
      >
        <Plus size={24} />
      </button>
    </>
  )
}

export default App
