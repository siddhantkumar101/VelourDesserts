import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { authService } from '../../services/auth.service';
import { setCredentials } from '../../stores/authSlice';
import { addToast } from '../../stores/uiSlice';
import { ROUTES } from '../../constants/routes';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });

  const handleChange = (e) => setFormData({ ...formData, [e.target.id]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      dispatch(addToast({ message: 'Passwords do not match.', type: 'error' }));
      return;
    }
    
    setIsLoading(true);
    try {
      const res = await authService.register({ name: formData.name, email: formData.email, password: formData.password });
      dispatch(setCredentials({ user: res.data.user, accessToken: res.data.accessToken }));
      dispatch(addToast({ message: 'Account created successfully!', type: 'success' }));
      navigate(ROUTES.ACCOUNT);
    } catch (error) {
      dispatch(addToast({ message: error.message || 'Registration failed', type: 'error' }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-cream">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-sm border border-chocolate/5">
        <div className="text-center mb-8">
          <h2 className="font-display text-3xl font-bold text-chocolate">Create Account</h2>
          <p className="text-chocolate/60 mt-2 font-serif text-lg">Join Velour Desserts</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input 
            label="Full Name" 
            id="name" 
            type="text" 
            required 
            value={formData.name}
            onChange={handleChange}
          />
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
          <Input 
            label="Confirm Password" 
            id="confirmPassword" 
            type="password" 
            required 
            value={formData.confirmPassword}
            onChange={handleChange}
          />
          
          <Button type="submit" className="w-full mt-4" isLoading={isLoading}>
            Create Account
          </Button>
        </form>

        <p className="mt-8 text-center text-sm text-chocolate/70">
          Already have an account?{' '}
          <Link to={ROUTES.LOGIN} className="font-bold text-rose hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
