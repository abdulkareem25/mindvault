import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, CheckCircle, AlertCircle } from 'lucide-react';
import { Button, Input } from '../../../shared/components/ui';
import useAuth from '../hooks/useAuth';
import { showToast } from '../../shared/components/Toast';

const STEPS = {
  EMAIL: 'email',
  CONFIRMATION: 'confirmation',
};

const ForgotPassword = () => {
  const navigate = useNavigate();
  const { handleForgotPassword } = useAuth();

  const [step, setStep] = useState(STEPS.EMAIL);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [error, setError] = useState(null);

  // Cooldown timer for resend attempts
  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (!email.trim()) {
        throw new Error('Please enter your email address');
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error('Please enter a valid email address');
      }

      await handleForgotPassword(email);
      setStep(STEPS.CONFIRMATION);
      setCooldown(60);
    } catch (err) {
      setError(err.message || 'Failed to send password reset email');
      showToast('error', err.message || 'Failed to send password reset email');
    } finally {
      setLoading(false);
    }
  };

  const handleResendEmail = async () => {
    setError(null);
    setLoading(true);

    try {
      await handleForgotPassword(email);
      setCooldown(60);
      showToast('success', 'Password reset email resent! Please check your inbox.');
    } catch (err) {
      setError(err.message || 'Failed to resend password reset email');
      showToast('error', err.message || 'Failed to resend password reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-void flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back button */}
        <button
          onClick={() => navigate('/login')}
          className="flex items-center gap-2 text-mist hover:text-cream transition-colors mb-8 font-sans text-14"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to login
        </button>

        <div className="bg-dusk border border-divide rounded-xl shadow-modal p-8">

          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="font-display text-20 text-cream">MindVault</span>
              <span className="font-mono text-11 bg-ember text-cream px-2 py-0.5 rounded-full">v2</span>
            </div>
            <p className="font-sans text-13 text-smoke">Reset your password</p>
          </div>

          {step === STEPS.EMAIL ? (
            <>
              {/* Email Icon */}
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-ember/10 rounded-full flex items-center justify-center border border-ember/30">
                  <Mail className="w-8 h-8 text-ember" />
                </div>
              </div>

              {/* Title */}
              <div className="text-center mb-6">
                <h2 className="font-display text-24 text-cream mb-2">
                  Forgot your password?
                </h2>
                <p className="font-sans text-14 text-mist">
                  Enter your email and we&apos;ll send you a link to reset your password.
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-6 p-4 bg-danger/10 border border-danger/50 rounded-lg flex gap-3">
                  <AlertCircle className="w-5 h-5 text-danger flex-shrink-0 mt-0.5" />
                  <p className="text-danger text-13 font-sans">{error}</p>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleEmailSubmit} className="space-y-4 mb-6">
                <Input
                  label="Email Address"
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError(null);
                  }}
                  placeholder="you@example.com"
                  required
                  disabled={loading}
                  autoFocus
                />

                <Button
                  variant="primary"
                  size="lg"
                  loading={loading}
                  type="submit"
                  className="w-full"
                >
                  Send Reset Link
                </Button>
              </form>

              {/* Security Note */}
              <div className="bg-ink border border-divide rounded-lg p-4">
                <p className="font-sans text-12 text-mist text-center">
                  💡 <strong>Security tip:</strong> We&apos;ll send a secure link to verify your identity before allowing password changes.
                </p>
              </div>
            </>
          ) : (
            <>
              {/* Check Icon */}
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center border border-emerald-500/30">
                  <CheckCircle className="w-8 h-8 text-emerald-500" />
                </div>
              </div>

              {/* Confirmation Message */}
              <div className="text-center mb-6">
                <h2 className="font-display text-24 text-cream mb-3">
                  Check your email!
                </h2>
                <p className="font-sans text-14 text-mist mb-2">
                  We&apos;ve sent a password reset link to:
                </p>
                <p className="font-sans text-14 text-ember font-medium break-all">
                  {email}
                </p>
              </div>

              {/* Instructions */}
              <div className="bg-ink border border-divide rounded-lg p-4 mb-6">
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-ember text-cream font-mono text-11 flex items-center justify-center font-bold">
                      1
                    </span>
                    <p className="font-sans text-13 text-mist">Click the reset link in the email</p>
                  </div>
                  <div className="flex gap-3">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-ember text-cream font-mono text-11 flex items-center justify-center font-bold">
                      2
                    </span>
                    <p className="font-sans text-13 text-mist">Create a new secure password</p>
                  </div>
                  <div className="flex gap-3">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-ember text-cream font-mono text-11 flex items-center justify-center font-bold">
                      3
                    </span>
                    <p className="font-sans text-13 text-mist">Log in with your new password</p>
                  </div>
                </div>
                <p className="font-sans text-12 text-smoke text-center mt-4 pt-4 border-t border-divide">
                  The link will expire in 24 hours for your security.
                </p>
              </div>

              {/* Resend Button */}
              <div className="space-y-3 mb-6">
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={handleResendEmail}
                  disabled={cooldown > 0 || loading}
                  loading={loading}
                  className="w-full"
                >
                  {cooldown > 0
                    ? `Resend in ${cooldown}s`
                    : 'Resend Reset Link'}
                </Button>

                <p className="font-sans text-12 text-smoke text-center">
                  Didn&apos;t receive the email? Check your spam folder or resend.
                </p>
              </div>

              {/* Divider */}
              <div className="my-6 flex items-center gap-3">
                <div className="flex-1 h-px bg-divide" />
                <span className="font-sans text-12 text-smoke">or</span>
                <div className="flex-1 h-px bg-divide" />
              </div>

              {/* Back Link */}
              <p className="font-sans text-14 text-smoke text-center">
                Remember your password?{' '}
                <button
                  onClick={() => navigate('/login')}
                  className="text-ember hover:underline transition-colors font-medium cursor-pointer"
                >
                  Sign in
                </button>
              </p>
            </>
          )}
        </div>

        {/* Footer Text */}
        <p className="font-mono text-11 text-smoke text-center mt-6">
          {step === STEPS.EMAIL
            ? 'Need help? Contact support@mindvault.ai'
            : 'Check your email for the reset link'}
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
