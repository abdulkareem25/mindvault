import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const VerifyEmail = () => {
  const navigate = useNavigate();
  const { user, loading } = useSelector((state) => state.auth);
  const { resendVerificationEmail } = useAuth();

  const [resendLoading, setResendLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    // If no user, redirect to signup
    if (!user) {
      navigate('/signup');
    } else {
      setUserEmail(user.email || '');
    }
  }, [user, navigate]);

  // Cooldown timer
  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const handleResendEmail = async () => {
    setResendLoading(true);
    setResendSuccess(false);
    try {
      await resendVerificationEmail(userEmail);
      setResendSuccess(true);
      setCooldown(60); // 60 second cooldown
      setTimeout(() => setResendSuccess(false), 3000); // Hide success message after 3 seconds
    } catch (error) {
      console.error('Failed to resend email:', error);
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-linear-to-br from-[#0f0f0f] via-[#1a1a1a] to-[#0f0f0f]"></div>
      <div className="absolute top-1/4 left-1/2 w-96 h-96 bg-[#21808d]/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-[#00aaff]/5 rounded-full blur-3xl"></div>

      {/* Content Container */}
      <div className="relative w-full max-w-md z-10">
        <div className="bg-[#1a1a1a] backdrop-blur-sm rounded-xl shadow-xl p-8 border border-[#2a2a2a]">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-semibold text-[#f0f0f0] mb-2">
              MindVault
            </h1>
            <p className="text-[#a0a0a0] text-sm font-normal">Verify your email</p>
          </div>

          {/* Email Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-[#21808d]/10 rounded-full flex items-center justify-center border border-[#21808d]/30">
              <svg
                className="w-8 h-8 text-[#21808d]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
          </div>

          {/* Main Message */}
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold text-[#f0f0f0] mb-3">
              Verification email sent!
            </h2>
            <p className="text-[#c0c0c0] text-sm mb-2">
              We've sent a verification link to:
            </p>
            <p className="text-[#21808d] font-medium text-sm break-all">
              {userEmail}
            </p>
          </div>

          {/* Instructions */}
          <div className="bg-[#2a2a2a]/50 border border-[#3a3a3a] rounded-lg p-4 mb-6">
            <p className="text-[#a0a0a0] text-sm leading-relaxed">
              Please check your email and click the verification link to activate your account. The link will expire in 24 hours.
            </p>
          </div>

          {/* Success Message */}
          {resendSuccess && (
            <div className="mb-6 p-3 bg-green-500/10 border border-green-500/30 rounded-lg flex items-start gap-2 animate-in fade-in">
              <svg
                className="w-4 h-4 text-green-500 mt-0.5 shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <p className="text-green-400 text-xs">Verification email resent successfully!</p>
            </div>
          )}

          {/* Resend Button */}
          <div className="space-y-3">
            <button
              onClick={handleResendEmail}
              disabled={cooldown > 0 || resendLoading || loading}
              className={`w-full py-2.5 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2
                ${cooldown > 0 || resendLoading || loading
                  ? 'bg-[#21808d]/30 text-[#21808d]/60 cursor-not-allowed border border-[#21808d]/20'
                  : 'bg-[#21808d] text-white hover:bg-[#1a6670] border border-[#21808d] hover:shadow-lg hover:shadow-[#21808d]/20'
                }`}
            >
              {resendLoading ? (
                <>
                  <svg
                    className="w-4 h-4 animate-spin"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  Resending...
                </>
              ) : cooldown > 0 ? (
                `Resend in ${cooldown}s`
              ) : (
                <>
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
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  Resend Verification Email
                </>
              )}
            </button>

            <p className="text-center text-[#707070] text-xs">
              Didn't receive the email? Check your spam folder or try resending.
            </p>
          </div>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-[#3a3a3a]"></div>
            <span className="text-[#707070] text-xs">or</span>
            <div className="flex-1 h-px bg-[#3a3a3a]"></div>
          </div>

          {/* Help Text */}
          <p className="text-center text-[#a0a0a0] text-xs">
            Already verified?{' '}
            <button
              onClick={() => navigate('/login')}
              className="text-[#21808d] hover:text-[#1a6670] transition-colors font-medium"
            >
              Go to login
            </button>
          </p>
        </div>

        {/* Footer Info */}
        <p className="text-center text-[#707070] text-xs mt-6">
          This page automatically updates when you verify your email
        </p>
      </div>
    </div>
  );
};

export default VerifyEmail;
