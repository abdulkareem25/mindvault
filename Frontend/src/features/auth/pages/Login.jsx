import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const Login = () => {

  const { loading, error, user } = useSelector((state) => state.auth);
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await loginUser(formData.email, formData.password);
  };

  useEffect(() => {
    if (user && !error && !loading) {
      if (user.isVerified) {
        navigate('/dashboard');
      } else {
        navigate('/verify-email');
      }
    }
  }, [user, error, loading, navigate]);


  return (
    <div className="min-h-screen bg-claude-deep-dark flex items-center justify-center p-4">
      {/* Form Container */}
      <div className="w-full max-w-md">
        <div className="card">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="feature-title text-claude-terracotta mb-2">
              MindVault
            </h1>
            <p className="text-claude-warm-silver text-sm">Welcome back</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-claude-error/10 border border-claude-error rounded-base flex items-start gap-3">
              <svg
                className="w-10 h-10 text-claude-error shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <p className="text-claude-error text-sm">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-claude-warm-silver text-sm font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                required
                onChange={handleChange}
                placeholder="you@example.com"
                disabled={loading}
                className='w-full px-3 py-2 rounded-lg bg-claude-dark-surface border border-claude-border-dark transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-claude-focus focus:border-claude-focus text-claude-ivory placeholder-claude-stone disabled:opacity-50 disabled:cursor-not-allowed'
              />
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-claude-warm-silver text-sm font-medium mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                required
                onChange={handleChange}
                placeholder="••••••••"
                disabled={loading}
                className='w-full px-3 py-2 rounded-lg bg-claude-dark-surface border border-claude-border-dark transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-claude-focus focus:border-claude-focus text-claude-ivory placeholder-claude-stone disabled:opacity-50 disabled:cursor-not-allowed'
              />
            </div>

            {/* Forgot Password Link */}
            <div className="flex justify-end pt-1">
              <Link to="#" className="text-claude-coral hover:text-claude-terracotta text-xs transition-colors">
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full mt-6 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span className="text-sm">Signing in...</span>
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-claude-border-dark"></div>
            <span className="text-claude-stone text-xs">or</span>
            <div className="flex-1 h-px bg-claude-border-dark"></div>
          </div>

          {/* Sign Up Link */}
          <p className="text-center text-claude-olive text-sm">
            Don't have an account?{' '}
            <Link to="/signup" className="text-claude-coral hover:text-claude-terracotta transition-colors font-medium">
              Create one
            </Link>
          </p>
        </div>

        {/* Footer */}
        <p className="text-center text-[#606060] text-xs mt-8">
          © 2026 MindVault
        </p>
      </div>
    </div>
  )
}

export default Login
