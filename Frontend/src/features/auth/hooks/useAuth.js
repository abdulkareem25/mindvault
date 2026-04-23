import { useDispatch } from 'react-redux';
import { setUser, setLoading, setError } from '../auth.slice';
import { login, signup, getCurrentUser } from '../service/auth.api';


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

  return {
    loginUser,
    signupUser,
    fetchCurrentUser,
  };
};

export default useAuth;