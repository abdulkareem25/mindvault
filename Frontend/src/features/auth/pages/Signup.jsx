import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const Signup = () => {

  const { signupUser } = useAuth();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await signupUser(formData.name, formData.email, formData.password, formData.confirmPassword);
  
    if (success) {
      navigate('/verify-email', { state: { email: formData.email } });
    }
  };

  return (
    <div className="min-h-screen bg-claude-deep-dark flex items-center justify-center p-4">
      {/* Form Container */}
      <div className="w-full max-w-md max-h-screen overflow-y-auto">
        <div className="card">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="feature-title text-claude-terracotta mb-2">
              MindVault
            </h1>
            <p className="text-claude-warm-silver text-sm">Create your account</p>
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
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Input */}
            <div>
              <label htmlFor="name" className="block text-claude-warm-silver text-sm font-medium mb-2">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                required
                onChange={handleChange}
                placeholder="John Doe"
                disabled={loading}
                className='w-full px-3 py-2 rounded-lg bg-claude-dark-surface border border-claude-border-dark transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-claude-focus focus:border-claude-focus text-claude-ivory placeholder-claude-stone disabled:opacity-50 disabled:cursor-not-allowed'
              />
            </div>

            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-claude-warm-silver text-sm font-medium mb-2">
                Email Address
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

            {/* Confirm Password Input */}
            <div>
              <label htmlFor="confirmPassword" className="block text-claude-warm-silver text-sm font-medium mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                required
                onChange={handleChange}
                placeholder="••••••••"
                disabled={loading}
                className='w-full px-3 py-2 rounded-lg bg-claude-dark-surface border border-claude-border-dark transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-claude-focus focus:border-claude-focus text-claude-ivory placeholder-claude-stone disabled:opacity-50 disabled:cursor-not-allowed'
              />
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
                  <span className="text-sm">Creating account...</span>
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-claude-border-dark"></div>
            <span className="text-claude-stone text-xs">or</span>
            <div className="flex-1 h-px bg-claude-border-dark"></div>
          </div>

          {/* Login Link */}
          <p className="text-center text-claude-warm-silver text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-claude-coral hover:text-claude-terracotta transition-colors font-medium">
              Sign in
            </Link>
          </p>
        </div>

        {/* Footer */}
        <p className="text-center text-claude-stone text-xs mt-8">
          © 2026 MindVault
        </p>
      </div>
    </div>
  )
}

export default Signup
