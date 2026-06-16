import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { Button, Input } from '../../../shared/components/ui';
import useAuth from '../hooks/useAuth';
import { showToast } from '../../shared/components/Toast';

const STEPS = {
  RESET_FORM: 'reset_form',
  SUCCESS: 'success',
  INVALID_TOKEN: 'invalid_token',
};

const PASSWORD_REQUIREMENTS = [
  { regex: /.{8,}/, label: 'At least 8 characters' },
  { regex: /[A-Z]/, label: 'One uppercase letter' },
  { regex: /[a-z]/, label: 'One lowercase letter' },
  { regex: /[0-9]/, label: 'One number' },
  { regex: /[!@#$%^&*]/, label: 'One special character' },
];

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { handleResetPassword } = useAuth();

  const [step, setStep] = useState(STEPS.RESET_FORM);
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [validatingToken, setValidatingToken] = useState(true);
  const [error, setError] = useState(null);

  // Extract and validate token from URL on mount
  useEffect(() => {
    const tokenFromUrl = searchParams.get('token');
    
    if (!tokenFromUrl) {
      setStep(STEPS.INVALID_TOKEN);
      setError('Invalid or missing reset token. Please request a new password reset.');
      setValidatingToken(false);
      return;
    }

    // Basic token validation (check if it's a valid hex string)
    if (!tokenFromUrl || tokenFromUrl.length < 20) {
      setStep(STEPS.INVALID_TOKEN);
      setError('The reset link appears to be invalid or corrupted.');
      setValidatingToken(false);
      return;
    }

    setToken(tokenFromUrl);
    setValidatingToken(false);
  }, [searchParams]);

  // Check password strength
  const getPasswordStrength = (password) => {
    return PASSWORD_REQUIREMENTS.filter(req => req.regex.test(password)).length;
  };

  const passwordStrength = getPasswordStrength(newPassword);
  const isPasswordValid = passwordStrength === PASSWORD_REQUIREMENTS.length;
  const passwordsMatch = newPassword === confirmPassword && newPassword !== '';
  const formIsValid = isPasswordValid && passwordsMatch && !loading;

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!isPasswordValid) {
      setError('Password does not meet all requirements');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      await handleResetPassword(token, newPassword);
      setStep(STEPS.SUCCESS);
    } catch (err) {
      const errorMessage = err.message || 'Failed to reset password';
      
      // Check if token is expired or invalid
      if (errorMessage.includes('token') || errorMessage.includes('expired')) {
        setStep(STEPS.INVALID_TOKEN);
        setError('Your reset link has expired. Please request a new one.');
      } else {
        setError(errorMessage);
        showToast('error', errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  if (validatingToken) {
    return (
      <div className="min-h-screen bg-void flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-4">
          <Loader className="w-8 h-8 text-ember animate-spin" />
          <p className="font-sans text-14 text-mist">Verifying reset link...</p>
        </div>
      </div>
    );
  }

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
            <p className="font-sans text-13 text-smoke">Create a new password</p>
          </div>

          {step === STEPS.INVALID_TOKEN && (
            <>
              {/* Error Icon */}
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-danger/10 rounded-full flex items-center justify-center border border-danger/30">
                  <AlertCircle className="w-8 h-8 text-danger" />
                </div>
              </div>

              {/* Error Message */}
              <div className="text-center mb-8">
                <h2 className="font-display text-24 text-cream mb-3">
                  Link Expired or Invalid
                </h2>
                <p className="font-sans text-14 text-mist mb-6">
                  {error || 'The password reset link is no longer valid. For security reasons, reset links expire after 24 hours.'}
                </p>

                <div className="bg-ink border border-divide rounded-lg p-4 mb-6">
                  <p className="font-sans text-13 text-mist">
                    Please request a new password reset link to continue.
                  </p>
                </div>

                <div className="flex flex-col gap-3">
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={() => navigate('/forgot-password')}
                    className="w-full"
                  >
                    Request New Reset Link
                  </Button>
                  <Button
                    variant="secondary"
                    size="lg"
                    onClick={() => navigate('/login')}
                    className="w-full"
                  >
                    Back to Login
                  </Button>
                </div>
              </div>
            </>
          )}

          {step === STEPS.RESET_FORM && (
            <>
              {/* Lock Icon */}
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-ember/10 rounded-full flex items-center justify-center border border-ember/30">
                  <Lock className="w-8 h-8 text-ember" />
                </div>
              </div>

              {/* Title */}
              <div className="text-center mb-6">
                <h2 className="font-display text-24 text-cream mb-2">
                  Create a Strong Password
                </h2>
                <p className="font-sans text-14 text-mist">
                  Choose a secure password to protect your account
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
              <form onSubmit={handleResetSubmit} className="space-y-4 mb-6">
                {/* New Password */}
                <div className="relative">
                  <label className="block font-sans text-13 font-medium text-cream mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => {
                        setNewPassword(e.target.value);
                        setError(null);
                      }}
                      placeholder="••••••••"
                      className="w-full px-4 py-2.5 bg-ink border border-divide rounded-lg text-cream placeholder-smoke focus:outline-none focus:border-ember transition-colors font-sans text-14 pr-11"
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-mist hover:text-cream transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Password Requirements Checklist */}
                <div className="bg-ink border border-divide rounded-lg p-4 space-y-2">
                  {PASSWORD_REQUIREMENTS.map((req, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <div
                        className={`w-4 h-4 rounded-full border-2 transition-colors ${
                          req.regex.test(newPassword)
                            ? 'bg-emerald-500 border-emerald-500'
                            : 'border-divide'
                        }`}
                      />
                      <span
                        className={`font-sans text-12 ${
                          req.regex.test(newPassword)
                            ? 'text-emerald-400'
                            : 'text-smoke'
                        }`}
                      >
                        {req.label}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Confirm Password */}
                <div className="relative">
                  <label className="block font-sans text-13 font-medium text-cream mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        setError(null);
                      }}
                      placeholder="••••••••"
                      className="w-full px-4 py-2.5 bg-ink border border-divide rounded-lg text-cream placeholder-smoke focus:outline-none focus:border-ember transition-colors font-sans text-14 pr-11"
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-mist hover:text-cream transition-colors"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Password Match Indicator */}
                {confirmPassword && (
                  <div
                    className={`flex items-center gap-2 font-sans text-13 px-3 py-2 rounded-lg ${
                      passwordsMatch
                        ? 'text-emerald-400 bg-emerald-500/10'
                        : 'text-danger bg-danger/10'
                    }`}
                  >
                    <div
                      className={`w-1.5 h-1.5 rounded-full ${
                        passwordsMatch ? 'bg-emerald-400' : 'bg-danger'
                      }`}
                    />
                    {passwordsMatch ? 'Passwords match' : 'Passwords do not match'}
                  </div>
                )}

                {/* Submit Button */}
                <Button
                  variant="primary"
                  size="lg"
                  loading={loading}
                  disabled={!formIsValid}
                  type="submit"
                  className="w-full mt-2"
                >
                  Reset Password
                </Button>
              </form>

              {/* Security Note */}
              <div className="bg-ink border border-divide rounded-lg p-4">
                <p className="font-sans text-12 text-mist text-center">
                  🔒 <strong>Your password is secure:</strong> Never shared, encrypted in transit, and hashed on our servers.
                </p>
              </div>
            </>
          )}

          {step === STEPS.SUCCESS && (
            <>
              {/* Success Icon */}
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center border border-emerald-500/30">
                  <CheckCircle className="w-8 h-8 text-emerald-500" />
                </div>
              </div>

              {/* Success Message */}
              <div className="text-center mb-8">
                <h2 className="font-display text-24 text-cream mb-3">
                  Password Reset Successful!
                </h2>
                <p className="font-sans text-14 text-mist mb-6">
                  Your password has been securely updated. You can now log in with your new password.
                </p>

                <div className="bg-ink border border-divide rounded-lg p-4 mb-6">
                  <div className="space-y-3 text-left">
                    <div className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-500 text-cream font-mono text-11 flex items-center justify-center font-bold">
                        ✓
                      </span>
                      <p className="font-sans text-13 text-mist">Your new password is now active</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-500 text-cream font-mono text-11 flex items-center justify-center font-bold">
                        ✓
                      </span>
                      <p className="font-sans text-13 text-mist">All other sessions have been logged out for security</p>
                    </div>
                  </div>
                </div>

                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => navigate('/login')}
                  className="w-full"
                >
                  Go to Login
                </Button>
              </div>
            </>
          )}
        </div>

        {/* Footer Text */}
        {step !== STEPS.SUCCESS && (
          <p className="font-mono text-11 text-smoke text-center mt-6">
            Having trouble?{' '}
            <button
              onClick={() => navigate('/forgot-password')}
              className="text-ember hover:underline cursor-pointer"
            >
              Request a new reset link
            </button>
          </p>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
