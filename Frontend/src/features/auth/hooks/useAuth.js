import { useDispatch } from 'react-redux';
import { setError, setLoading, setUser, setToken, clearAuth } from '../auth.slice';
import { getCurrentUser, login, logout, resendVerificationEmail, signup, refreshToken, forgotPassword, resetPassword } from '../services/auth.api';
import { showToast } from '../../shared/components/Toast';


const useAuth = () => {
  const dispatch = useDispatch();

  const loginUser = async (email, password) => {
    dispatch(setLoading(true));
    try {
      const data = await login(email, password);
      dispatch(setUser(data.user));
      dispatch(setToken(data.accessToken));
      dispatch(setError(null));
    } catch (error) {
      dispatch(setError(error.message || 'Login failed'));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const signupUser = async (name, email, password, confirmPassword) => {
    dispatch(setLoading(true));
    try {
      const response = await signup(name, email, password, confirmPassword);
      dispatch(setError(null));
      showToast('success', response.message || 'Signup successful! Please verify your email.');
      return response.success;
    } catch (error) {
      dispatch(setError(error.message || 'Signup failed'));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const fetchCurrentUser = async () => {
    dispatch(setLoading(true));
    try {
      // Silently restore session on app load if refresh token cookie exists
      const data = await refreshToken();
      dispatch(setUser(data.user));
      dispatch(setToken(data.accessToken));
      dispatch(setError(null));
    } catch (error) {
      dispatch(clearAuth());
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleResendVerificationEmail = async (email) => {
    try {
      await resendVerificationEmail(email);
    } catch (error) {
      throw new Error(error.message || 'Failed to resend verification email');
    }
  };

  const logoutUser = async () => {
    try {
      await logout();
      dispatch(clearAuth());
    } catch (error) {
      throw new Error(error.message || 'Logout failed');
    }
  };

  const handleForgotPassword = async (email) => {
    try {
      const response = await forgotPassword(email);
      showToast('success', response.message || 'Password reset email sent! Please check your inbox.');
    } catch (error) {
      throw new Error(error.message || 'Failed to send password reset email');
    }
  };

  const handleResetPassword = async (token, newPassword) => {
    try {
      const response = await resetPassword(token, newPassword);
      showToast('success', response.message || 'Password reset successful! You can now log in with your new password.');
    } catch (error) {
      throw new Error(error.message || 'Failed to reset password');
    }
  };


  return {
    loginUser,
    signupUser,
    fetchCurrentUser,
    handleResendVerificationEmail,
    logoutUser,
    handleForgotPassword,
    handleResetPassword,
  };
};

export default useAuth;