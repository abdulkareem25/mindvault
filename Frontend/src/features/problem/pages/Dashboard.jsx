import { useEffect } from 'react'
import { useProblem } from '../hooks/useProblem';

const Dashboard = () => {

  const { initSocketConnection } = useProblem();

  useEffect(() => {
    initSocketConnection();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center text-2xl font-semibold text-gray-500">
      Welcome to the Dashboard!
    </div>
  )
}

export default Dashboard
