import { useNavigate } from 'react-router-dom';
import { Button } from '../../../shared/components/ui';

const AlreadyVerified = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-void flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-dusk border border-divide rounded-xl shadow-modal p-8">

          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="font-display text-20 text-cream">MindVault</span>
              <span className="font-mono text-11 bg-ember text-cream px-2 py-0.5 rounded-full">v2</span>
            </div>
            <p className="font-sans text-13 text-smoke">Email verification</p>
          </div>

          {/* Info Icon */}
          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 bg-info/15 rounded-full flex items-center justify-center border border-info/30">
              <svg
                className="w-10 h-10 text-info"
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
            <h2 className="font-display text-24 text-cream mb-3">
              Email Already Verified
            </h2>
            <p className="font-sans text-14 text-mist leading-relaxed">
              Your email has already been verified. You can proceed to login and start using MindVault.
            </p>
          </div>

          {/* Login Button */}
          <Button
            variant="primary"
            size="lg"
            onClick={() => navigate('/login')}
            className="w-full"
          >
            Go to Login →
          </Button>

          {/* Footer Info */}
          <div className="mt-6 p-4 bg-ink border border-divide rounded-lg">
            <p className="font-sans text-12 text-smoke text-center leading-relaxed">
              If you didn&apos;t verify this email, please contact support.
            </p>
          </div>
        </div>

        <p className="font-mono text-11 text-smoke text-center mt-6">
          © 2026 MindVault — Your private knowledge journal
        </p>
      </div>
    </div>
  );
};

export default AlreadyVerified;
