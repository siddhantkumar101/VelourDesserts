import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { authService } from '../../services/auth.service';
import { setCredentials } from '../../stores/authSlice';
import { addToast } from '../../stores/uiSlice';
import { ROUTES } from '../../constants/routes';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });

  useEffect(() => {
    const token = searchParams.get('token');
    const userParam = searchParams.get('user');
    if (token && userParam) {
      try {
        const parsedUser = JSON.parse(decodeURIComponent(userParam));
        dispatch(setCredentials({ user: parsedUser, accessToken: token }));
        dispatch(addToast({ message: 'Welcome back!', type: 'success' }));
        navigate(ROUTES.ACCOUNT);
      } catch (err) {
        console.error('Failed to parse Google OAuth user parameters', err);
      }
    }
  }, [searchParams, dispatch, navigate]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.id]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await authService.login(formData);
      dispatch(setCredentials({ user: res.data.user, accessToken: res.data.accessToken }));
      dispatch(addToast({ message: 'Welcome back!', type: 'success' }));
      navigate(ROUTES.ACCOUNT);
    } catch (error) {
      dispatch(addToast({ message: error.message || 'Login failed', type: 'error' }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    let baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';
    
    // Clean up any double-slashes or trailing slashes
    baseUrl = baseUrl.replace(/\/+$/, '');
    
    // If they specified only the domain, append '/api/v1' automatically
    if (!baseUrl.endsWith('/api/v1')) {
      baseUrl = `${baseUrl}/api/v1`;
    }
    
    window.location.href = `${baseUrl}/auth/google`;
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-8 sm:py-12 px-4 sm:px-6 lg:px-8 bg-cream">
      <div className="max-w-md w-full bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-chocolate/5">
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-chocolate">Sign In</h2>
          <p className="text-chocolate/60 mt-1 sm:mt-2 font-serif text-base sm:text-lg">Welcome back to Velour Desserts</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <Input 
            label="Email Address" 
            id="email" 
            type="email" 
            required 
            value={formData.email}
            onChange={handleChange}
          />
          <Input 
            label="Password" 
            id="password" 
            type="password" 
            required 
            value={formData.password}
            onChange={handleChange}
          />
          
          <Button type="submit" className="w-full mt-2" isLoading={isLoading}>
            Sign In
          </Button>
        </form>

        <div className="mt-6 flex items-center justify-between">
          <div className="w-full h-px bg-chocolate/10" />
          <span className="px-4 text-xs font-medium text-chocolate/40 uppercase tracking-widest">Or</span>
          <div className="w-full h-px bg-chocolate/10" />
        </div>

        <button 
          onClick={handleGoogleLogin}
          className="mt-6 w-full flex items-center justify-center gap-2 sm:gap-3 bg-white border border-chocolate/20 text-chocolate px-3 sm:px-4 py-3 rounded-pill hover:bg-cream-dark transition-colors font-medium text-sm shadow-sm"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </button>

        <p className="mt-8 text-center text-sm text-chocolate/70">
          Don't have an account?{' '}
          <Link to={ROUTES.REGISTER} className="font-bold text-rose hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
