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
    <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-linear-to-br from-[#0f0f0f] via-[#1a1a1a] to-[#0f0f0f]"></div>
      <div className="absolute top-1/4 left-1/2 w-96 h-96 bg-[#00aaff]/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-[#21808d]/5 rounded-full blur-3xl"></div>

      {/* Content Container */}
      <div className="relative w-full max-w-md z-10">
        <div className="bg-[#1a1a1a] backdrop-blur-sm rounded-xl shadow-xl p-8 border border-[#2a2a2a]">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-semibold text-[#f0f0f0] mb-2">
              MindVault
            </h1>
            <p className="text-[#a0a0a0] text-sm font-normal">Email verification</p>
          </div>

          {/* Info Icon */}
          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 bg-[#00aaff]/20 rounded-full flex items-center justify-center border border-[#00aaff]/40">
              <svg
                className="w-10 h-10 text-[#00aaff]"
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
            <h2 className="text-2xl font-semibold text-[#f0f0f0] mb-3">
              Email Already Verified
            </h2>
            <p className="text-[#c0c0c0] text-sm mb-4">
              Your email has already been verified. You can proceed to login and start using MindVault.
            </p>
          </div>

          {/* Info Box */}
          {/* <div className="bg-[#00aaff]/10 border border-[#00aaff]/30 rounded-lg p-4 mb-8">
            <p className="text-[#a0a0a0] text-sm text-center">
              Redirecting to login in <span className="text-[#00aaff] font-semibold">2 seconds</span>...
            </p>
          </div> */}

          {/* Manual Login Button */}
          <button
            onClick={() => navigate('/login')}
            className="w-full py-2.5 px-4 bg-[#00aaff] hover:bg-[#0088cc] text-[#0f0f0f] font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
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
          <div className="mt-6 p-4 bg-[#2a2a2a]/50 border border-[#3a3a3a] rounded-lg">
            <p className="text-[#707070] text-xs text-center leading-relaxed">
              If you didn't verify this email, please contact support.
            </p>
          </div>
        </div>

        {/* Bottom Footer */}
        <p className="text-center text-[#606060] text-xs mt-8">
          © 2026 MindVault - Your AI-Powered Mind Mapping Companion
        </p>
      </div>
    </div>
  );
};

export default AlreadyVerified;
