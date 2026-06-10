import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { Loader, MailIcon } from 'lucide-react';
import { showToast } from '../../shared/components/Toast';
import useAuth from '../hooks/useAuth';
import { Button } from '../../../shared/components/ui';

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
      setCooldown(60);
      setTimeout(() => setResendSuccess(false), 3000);
    } catch (error) {
      console.error('Failed to resend email:', error);
    } finally {
      setResendLoading(false);
    }
  };

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
            <p className="font-sans text-13 text-smoke">Verify your email</p>
          </div>

          {/* Email Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-ember/10 rounded-full flex items-center justify-center border border-ember/30">
              <MailIcon className="w-8 h-8 text-ember" />
            </div>
          </div>

          {/* Main Message */}
          <div className="text-center mb-6">
            <h2 className="font-display text-24 text-cream mb-3">
              Verification email sent!
            </h2>
            <p className="font-sans text-14 text-mist mb-2">
              We&apos;ve sent a verification link to:
            </p>
            <p className="font-sans text-14 text-ember font-medium break-all">
              {userEmail}
            </p>
          </div>

          {/* Instructions */}
          <div className="bg-ink border border-divide rounded-lg p-4 mb-6">
            <p className="font-sans text-13 text-mist leading-relaxed text-center">
              Please check your email and click the verification link to activate your account. The link will expire in 24 hours.
            </p>
          </div>

          {/* Resend Button */}
          <div className="space-y-3">
            <Button
              variant="secondary"
              size="lg"
              onClick={handleResendEmail}
              disabled={cooldown > 0 || resendLoading || loading}
              loading={resendLoading}
              className="w-full"
            >
              {cooldown > 0
                ? `Resend in ${cooldown}s`
                : 'Resend Verification Email'}
            </Button>

            <p className="font-sans text-12 text-smoke text-center">
              Didn&apos;t receive the email? Check your spam folder or try resending.
            </p>
          </div>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-divide" />
            <span className="font-sans text-12 text-smoke">or</span>
            <div className="flex-1 h-px bg-divide" />
          </div>

          {/* Help Text */}
          <p className="font-sans text-14 text-smoke text-center">
            Already verified?{' '}
            <button
              onClick={() => navigate('/login')}
              className="text-ember hover:underline transition-colors font-medium cursor-pointer"
            >
              Go to login
            </button>
          </p>
        </div>

        <p className="font-mono text-11 text-smoke text-center mt-6">
          This page automatically updates when you verify your email
        </p>
      </div>
    </div>
  );
};

export default VerifyEmail;
