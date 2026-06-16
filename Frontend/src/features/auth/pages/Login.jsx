import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Input } from '../../../shared/components/ui';
import useAuth from '../hooks/useAuth';

const CATEGORY_DOT = {
  coding: '#7099e8',
  deen: '#b88cdb',
  admin: '#d4a84c',
  life: '#5ec98a',
};

const Login = () => {
  const { loading, error, user } = useSelector((state) => state.auth);
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await loginUser(formData.email, formData.password);
  };

  useEffect(() => {
    if (user && !error && !loading) {
      if (user.isVerified) {
        navigate('/');
      } else {
        navigate('/verify-email');
      }
    }
  }, [user, error, loading, navigate]);

  return (
    <div className="min-h-screen flex bg-void">

      {/* Left panel: form */}
      <div className="flex-1 flex flex-col justify-center px-8 py-12">
        <div className="max-w-100 mx-auto w-full">

          {/* Logo */}
          <div className="flex items-center gap-2 mb-10">
            <span className="font-display text-20 text-cream">MindVault</span>
            <span className="font-mono text-11 bg-ember text-cream px-2 py-0.5 rounded-full">v2</span>
          </div>

          {/* Page heading */}
          <div className="mb-8">
            <p className="font-sans text-12 font-medium uppercase tracking-[0.8px] text-ember mb-2">
              WELCOME BACK
            </p>
            <h1 className="font-display text-32 text-cream">Sign in to journal</h1>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-danger/10 border border-danger/50 rounded-md">
              <p className="text-danger text-13 font-sans font-medium">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
              disabled={loading}
            />

            <Input
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              disabled={loading}
            />

            <Button
              variant="primary"
              size="lg"
              loading={loading}
              type="submit"
              className="w-full mt-2"
            >
              Sign in
            </Button>
          </form>

          <p className="font-sans text-14 text-smoke text-center mt-5">
            <Link
              to="#"
              className="text-ember hover:underline"
              onClick={(e) => {
                e.preventDefault();
                navigate('/forgot-password');
              }}
            >
              Forgot password?
            </Link>
          </p>

          <p className="font-sans text-14 text-smoke text-center mt-3">
            Don&apos;t have an account?{' '}
            <Link to="/signup" className="text-ember font-medium hover:underline">
              Create one
            </Link>
          </p>
        </div>
      </div>

      {/* Right panel: brand (hidden on mobile) */}
      <div className="hidden lg:flex w-115 shrink-0 bg-obsidian
        border-l border-divide flex-col justify-center px-12 py-12">
        <p className="font-mono text-11 text-sienna uppercase tracking-wider mb-5">
          Your knowledge, remembered
        </p>
        <h2 className="font-display text-32 text-cream leading-snug mb-5">
          Every conversation<br />
          becomes a <span className="text-ember">memory</span>.
        </h2>
        <p className="font-sans text-14 text-mist leading-relaxed mb-10">
          MindVault watches your conversations and quietly builds a personal knowledge
          base — then brings that context back exactly when you need it.
        </p>
        <div className="flex flex-wrap gap-2">
          {[
            { cat: 'coding', label: 'Coding · 42' },
            { cat: 'deen', label: 'Deen · 18' },
            { cat: 'admin', label: 'Admin · 7' },
            { cat: 'life', label: 'Life · 23' },
          ].map(({ cat, label }) => (
            <span
              key={cat}
              className="font-mono text-12 px-3 py-1.5 rounded-lg border border-divide bg-ink"
              style={{ color: CATEGORY_DOT[cat] }}
            >
              {label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Login;
