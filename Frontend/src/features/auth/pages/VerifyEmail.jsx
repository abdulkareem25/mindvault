import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import {
  MailIcon,
  Loader
} from 'lucide-react';
import { showToast } from '../../shared/components/Toast';

const VerifyEmail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading } = useSelector((state) => state.auth);
  const { handleResendVerificationEmail } = useAuth();

  const [resendLoading, setResendLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [userEmail, setUserEmail] = useState('');
  const emailFromState = location.state?.email;

  useEffect(() => {

    if (emailFromState) {
      setUserEmail(emailFromState);
    } else if (user?.email) {
      setUserEmail(user.email);
    } else {
      navigate('/signup');
    }
  }, [user, location, navigate]);

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
      await handleResendVerificationEmail(userEmail);
      setResendSuccess(true);
      showToast('success', 'Verification email resent! Please check your inbox.');
      setCooldown(60); // 60 second cooldown
      setTimeout(() => setResendSuccess(false), 3000); // Hide success message after 3 seconds
    } catch (error) {
      console.error('Failed to resend email:', error);
    } finally {
      setResendLoading(false);
    }
  };

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
            <p className="text-claude-warm-silver text-sm">Verify your email</p>
          </div>

          {/* Email Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-claude-terracotta/10 rounded-full flex items-center justify-center border border-claude-terracotta/30">
              <svg
                className="w-8 h-8 text-claude-terracotta"
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
            <h2 className="feature-title text-claude-ivory mb-3">
              Verification email sent!
            </h2>
            <p className="text-claude-warm-silver text-sm mb-2">
              We've sent a verification link to:
            </p>
            <p className="text-claude-terracotta font-medium text-sm break-all">
              {userEmail}
            </p>
          </div>

          {/* Instructions */}
          <div className="bg-claude-dark-surface border border-claude-border-dark rounded-base p-4 mb-6">
            <p className="text-claude-warm-silver text-sm leading-relaxed text-center">
              Please check your email and click the verification link to activate your account. The link will expire in 24 hours.
            </p>
          </div>

          {/* Resend Button */}
          <div className="space-y-3">
            <button
              onClick={handleResendEmail}
              disabled={cooldown > 0 || resendLoading || loading}
              className={`w-full py-2.5 rounded-base font-medium transition-all duration-200 flex items-center justify-center gap-2
                ${cooldown > 0 || resendLoading || loading
                  ? 'btn-secondary opacity-50 cursor-not-allowed'
                  : 'btn-primary hover:shadow-whisper'
                }`}
            >
              {resendLoading ? (
                <>
                  <Loader size={25} strokeWidth={2} className="animate-spin" />
                  Resending...
                </>
              ) : cooldown > 0 ? (
                `Resend in ${cooldown}s`
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <MailIcon className="h-10 w-10"/>
                  <span>Resend Verification Email</span>
                </div>
              )}
            </button>

            <p className="text-center text-claude-stone text-xs">
              Didn't receive the email? Check your spam folder or try resending.
            </p>
          </div>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-claude-border-dark"></div>
            <span className="text-claude-stone text-xs">or</span>
            <div className="flex-1 h-px bg-claude-border-dark"></div>
          </div>

          {/* Help Text */}
          <p className="text-center text-claude-warm-silver text-xs">
            Already verified?{' '}
            <button
              onClick={() => navigate('/login')}
              className="text-claude-terracotta hover:text-claude-coral transition-colors font-medium"
            >
              Go to login
            </button>
          </p>
        </div>

        {/* Footer Info */}
        <p className="text-center text-claude-stone text-xs mt-6">
          This page automatically updates when you verify your email
        </p>
      </div>
    </div>
  );
};

export default VerifyEmail;
