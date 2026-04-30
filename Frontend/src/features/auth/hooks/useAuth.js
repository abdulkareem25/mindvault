import { useDispatch } from 'react-redux';
import { setError, setLoading, setUser } from '../auth.slice';
import { getCurrentUser, login, logout, resendVerificationEmail, signup } from '../services/auth.api';
import { showToast } from '../../shared/components/Toast';


const useAuth = () => {
  const dispatch = useDispatch();

  const loginUser = async (email, password) => {
    dispatch(setLoading(true));
    try {
      const data = await login(email, password);
      dispatch(setUser(data.user));
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
      const data = await getCurrentUser();
      dispatch(setUser(data.user));
      dispatch(setError(null));
    } catch (error) {
      dispatch(setUser(null));
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
      dispatch(setUser(null));
    } catch (error) {
      throw new Error(error.message || 'Logout failed');
    }
  };

  return {
    loginUser,
    signupUser,
    fetchCurrentUser,
    handleResendVerificationEmail,
    logoutUser
  };
};

export default useAuth;