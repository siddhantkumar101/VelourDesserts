import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ShieldAlert, Sparkles, ArrowLeft } from 'lucide-react';
import { authService } from '../../services/auth.service';
import { setCredentials } from '../../stores/authSlice';
import { addToast } from '../../stores/uiSlice';
import { ROUTES } from '../../constants/routes';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const AdminLogin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });

  useEffect(() => {
    // If already logged in as admin, skip login page
    if (isAuthenticated && user?.role === 'admin') {
      navigate(ROUTES.ADMIN_DASHBOARD);
    }
  }, [isAuthenticated, user, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await authService.login(formData);
      const authenticatedUser = res.data.user;

      // Restrict role: only administrators are allowed through this portal
      if (authenticatedUser.role !== 'admin') {
        // Automatically revoke/clear token session to keep layout secure
        dispatch(addToast({ 
          message: 'Access Denied: Administrative permissions required.', 
          type: 'error' 
        }));
        setIsLoading(false);
        return;
      }

      dispatch(setCredentials({ 
        user: authenticatedUser, 
        accessToken: res.data.accessToken 
      }));
      
      dispatch(addToast({ 
        message: 'Welcome back, Administrator!', 
        type: 'success' 
      }));
      
      navigate(ROUTES.ADMIN_DASHBOARD);
    } catch (error) {
      dispatch(addToast({ 
        message: error.message || 'Authentication failed. Please verify credentials.', 
        type: 'error' 
      }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#0F0805] text-[#FAF6F1] relative overflow-hidden select-none">
      
      {/* Decorative luxury gradient background glows */}
      <div className="absolute top-[20%] left-[10%] w-[350px] h-[350px] bg-rose/10 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-[20%] right-[10%] w-[350px] h-[350px] bg-gold/5 rounded-full blur-[120px] pointer-events-none z-0" />

      {/* Main glass card */}
      <div className="max-w-md w-full bg-white/[0.02] border border-white/[0.06] backdrop-blur-xl p-8 sm:p-10 rounded-[32px] shadow-2xl relative z-10 flex flex-col gap-6">
        
        {/* Portal Header */}
        <div className="flex flex-col items-center text-center gap-4">
          <div className="w-14 h-14 bg-rose/10 border border-rose/30 rounded-2xl flex items-center justify-center text-rose shadow-lg animate-pulse">
            <ShieldAlert className="w-7 h-7 text-[#FF7B93]" />
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="text-[#FF7B93] tracking-[0.25em] uppercase text-[10px] font-black bg-[#FF7B93]/10 border border-[#FF7B93]/20 px-3.5 py-1.5 rounded-full w-fit mx-auto shadow-sm">
              <Sparkles className="w-3 h-3 text-[#FF7B93] inline mr-1" /> Secure Console
            </span>
            <h2 className="font-display text-3xl font-black text-cream mt-2 tracking-tight">
              Velour <span className="text-[#FF7B93] italic font-normal">Desserts</span>
            </h2>
            <p className="text-[#D4C3B9] font-serif text-sm">Administrative Authentication Portal</p>
          </div>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 mt-2">
          
          <div className="flex flex-col gap-1 text-[#D4C3B9]">
            <label className="text-xs uppercase font-bold tracking-widest pl-1 mb-1">Admin Email</label>
            <input 
              id="email" 
              type="email" 
              required 
              value={formData.email}
              onChange={handleChange}
              placeholder="admin@velourdesserts.com"
              className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-3.5 text-cream placeholder-white/20 focus:outline-none focus:border-rose focus:ring-1 focus:ring-rose transition-all text-sm font-sans"
            />
          </div>

          <div className="flex flex-col gap-1 text-[#D4C3B9]">
            <label className="text-xs uppercase font-bold tracking-widest pl-1 mb-1">Secure Password</label>
            <input 
              id="password" 
              type="password" 
              required 
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••••••"
              className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-3.5 text-cream placeholder-white/20 focus:outline-none focus:border-rose focus:ring-1 focus:ring-rose transition-all text-sm font-sans"
            />
          </div>
          
          <Button 
            type="submit" 
            isLoading={isLoading}
            className="w-full mt-4 bg-[#FF7B93] hover:bg-rose-dark text-white shadow-lg shadow-rose/10 font-bold py-4 rounded-2xl border-none transition-all duration-300"
          >
            Authenticate Portal
          </Button>

        </form>

        {/* Escape storefront path */}
        <div className="border-t border-white/5 pt-5 mt-2 flex justify-center">
          <Link 
            to={ROUTES.HOME} 
            className="flex items-center gap-2 text-[#D4C3B9] hover:text-[#FF7B93] text-xs font-bold uppercase tracking-wider transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Return to Pâtisserie Shop
          </Link>
        </div>

      </div>

    </div>
  );
};

export default AdminLogin;
