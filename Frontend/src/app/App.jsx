import { useCallback, useEffect } from 'react'
import { RouterProvider } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import AppToaster from '../shared/components/AppToaster'
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
    </>
  )
}

export default App
