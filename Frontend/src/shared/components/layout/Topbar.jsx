import { ChevronDown, LogOut, Menu, Settings } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import useAuth from '../../../features/auth/hooks/useAuth';
import { showToast } from '../../../features/shared/components/Toast';

export function Topbar({ onMenuClick }) {
  const { user } = useSelector((state) => state.auth);
  const { logoutUser } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const name = user?.name || 'User';
  const initial = name.slice(0, 1).toUpperCase();

  const handleLogout = async () => {
    try {
      await logoutUser();
      showToast('success', 'Logged out successfully');
    } catch (err) {
      showToast('error', 'Logout failed');
    }
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    /* h-14 = exactly 56px. shrink-0 is critical — never let it compress. */
    <header className="shrink-0 h-14 flex items-center justify-between
      px-4 lg:px-6 bg-void border-b border-divide z-30">

      {/* Left: hamburger (mobile) + logo */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden w-9 h-9 flex items-center justify-center
            rounded-lg text-smoke hover:text-cream hover:bg-ink transition-colors cursor-pointer"
        >
          <Menu className="w-5 h-5" />
        </button>

        <Link to="/" className="flex items-center gap-2">
          <span className="font-display text-17 text-cream">MindVault</span>
          <span className="font-mono text-11 bg-ember text-cream px-2 py-0.5 rounded-full">
            v2
          </span>
        </Link>
      </div>

      {/* Right: user menu */}
      <div className="relative" ref={dropdownRef}>
        <div
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center gap-2 cursor-pointer group select-none"
        >
          <div className="w-8 h-8 rounded-full bg-dusk border border-divide
            flex items-center justify-center font-sans text-13 font-medium text-cream">
            {initial}
          </div>
          <span className="font-sans text-14 text-mist hidden md:block">{name}</span>
          <ChevronDown className="w-4 h-4 text-smoke group-hover:text-mist transition-colors" />
        </div>

        {/* Dropdown menu */}
        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-dusk border border-divide
            rounded-lg shadow-modal py-1 z-50 animate-fade-up">
            <button
              onClick={() => {
                showToast('info', 'Settings coming soon!');
                setDropdownOpen(false);
              }}
              className="w-full flex items-center gap-2 px-4 py-2.5 text-left
                font-sans text-14 text-mist hover:bg-ink hover:text-cream transition-colors"
            >
              <Settings className="w-4 h-4 text-smoke" />
              <span>Settings</span>
            </button>
            <hr className="border-divide my-1" />
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-4 py-2.5 text-left
                font-sans text-14 text-danger hover:bg-danger/10 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign out</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
