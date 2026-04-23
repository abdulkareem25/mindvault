import { useEffect } from 'react'
import { RouterProvider } from 'react-router-dom'
import useAuth from '../features/auth/hooks/useAuth'
import router from './app.routes'

const App = () => {
  const { fetchCurrentUser } = useAuth();

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  return (
    <RouterProvider router={router} />
  )
}

export default App