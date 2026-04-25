import { useEffect } from 'react';
import { useChat } from '../hooks/useChat';

const Dashboard = () => {

  const { initSocketConnection } = useChat();

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
