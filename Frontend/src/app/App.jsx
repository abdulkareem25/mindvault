import { useCallback } from 'react'
import { RouterProvider } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { Toaster } from 'react-hot-toast'
import { Plus } from 'lucide-react'
import useAuth from '../features/auth/hooks/useAuth'
import { useKeyboardShortcut } from '../shared/hooks/useKeyboardShortcut'
import { openModal } from '../features/capture/captureSlice'
import router from './app.routes'

const App = () => {
  useAuth();
  const dispatch = useDispatch();

  const handleOpenCapture = useCallback(() => {
    dispatch(openModal());
  }, [dispatch]);

  useKeyboardShortcut(['Control', 'Shift', 'M'], handleOpenCapture);

  return (
    <>
      <RouterProvider router={router} />
      <Toaster position="bottom-right" />

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
