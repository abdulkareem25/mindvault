import { useDispatch } from 'react-redux';
import { setError, setLoading, setUser } from '../auth.slice';
import { getCurrentUser, login, resendVerificationEmail, signup } from '../service/auth.api';


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
      await signup(name, email, password, confirmPassword);
      dispatch(setError(null));
      return true;
    } catch (error) {
      dispatch(setError(error.message || 'Signup failed'));
      return false;
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

  const resendVerificationEmailHandler = async (email) => {
    try {
      await resendVerificationEmail(email);
    } catch (error) {
      throw new Error(error.message || 'Failed to resend verification email');
    }
  };

  return {
    loginUser,
    signupUser,
    fetchCurrentUser,
    resendVerificationEmail: resendVerificationEmailHandler,
  };
};

export default useAuth;