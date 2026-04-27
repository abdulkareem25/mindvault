import { useEffect } from 'react';
import { useChat } from '../hooks/useChat';

const Dashboard = () => {

  const { initSocketConnection } = useChat();

  useEffect(() => {
    initSocketConnection();
  }, []);

  return (
    <div className="min-h-screen bg-claude-deep-dark flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="section-heading text-claude-ivory mb-4">Welcome to Dashboard!</h1>
        <p className="body-large text-claude-warm-silver">Your AI-Powered Mind Mapping Experience</p>
      </div>
    </div>
  )
}

export default Dashboard
