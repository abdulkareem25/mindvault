import { useNavigate } from 'react-router-dom';

const AlreadyVerified = () => {
  const navigate = useNavigate();

  // useEffect(() => {
  //   // Redirect to login after 2 seconds
  //   const timer = setTimeout(() => {
  //     navigate('/login');
  //   }, 2000);

  //   return () => clearTimeout(timer);
  // }, [navigate]);

  return (
    <div className="min-h-screen bg-claude-deep-dark flex items-center justify-center p-4">
      {/* Content Container */}
      <div className="w-full max-w-md">
        <div className="card">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="feature-title text-claude-terracotta mb-2">
              MindVault
            </h1>
            <p className="text-claude-warm-silver text-sm">Email verification</p>
          </div>

          {/* Info Icon */}
          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 bg-claude-focus/20 rounded-full flex items-center justify-center border border-claude-focus/40">
              <svg
                className="w-10 h-10 text-claude-focus"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>

          {/* Message */}
          <div className="text-center mb-8">
            <h2 className="feature-title text-claude-ivory mb-3">
              Email Already Verified
            </h2>
            <p className="text-claude-warm-silver text-sm mb-4">
              Your email has already been verified. You can proceed to login and start using MindVault.
            </p>
          </div>

          {/* Manual Login Button */}
          <button
            onClick={() => navigate('/login')}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
            Go to Login
          </button>

          {/* Footer Info */}
          <div className="mt-6 p-4 bg-claude-dark-surface border border-claude-border-dark rounded-base">
            <p className="text-claude-warm-silver text-xs text-center leading-relaxed">
              If you didn't verify this email, please contact support.
            </p>
          </div>
        </div>

        {/* Bottom Footer */}
        <p className="text-center text-claude-stone text-xs mt-8">
          © 2026 MindVault - Your AI-Powered Mind Mapping Companion
        </p>
      </div>
    </div>
  );
};

export default AlreadyVerified;
