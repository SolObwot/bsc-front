import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import prideLogo from '../../assets/pride_logo_vertical.png'; 
import horizontalLogo from '../../assets/pride_logo_horizontal.png';
import { EnvelopeIcon, LockClosedIcon } from '@heroicons/react/24/outline';

const LoginForm = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    const { email, password } = formData;
    if (!email || !password) {
      setError('Please fill in all fields.');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address.');
      return false;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return false;
    }
    return true;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await login(formData);
      navigate('/dashboard');
    } catch (error) {
      setError(error.response?.data?.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
      {/* Left side: Decorative panel with logo - 40% on desktop, 30% on xl */}
      <div className="hidden lg:block lg:w-2/5 xl:w-[30%] bg-gradient-to-br from-teal-600 to-teal-800 relative overflow-hidden">
        {/* Decorative arcs */}
        <div className="absolute inset-0">
          {/* Top-right decorative arc */}
          <svg className="absolute right-0 top-0 h-64 w-64" viewBox="0 0 200 200" fill="none">
            <path 
              d="M200,0 Q100,0 100,100 Q100,200 0,200 L0,0 Z" 
              fill="rgba(255,255,255,0.1)"
            ></path>
          </svg>
          
          {/* Bottom-left decorative arc */}
          <svg className="absolute left-0 bottom-0 h-64 w-64" viewBox="0 0 200 200" fill="none">
            <path 
              d="M0,200 Q100,200 100,100 Q100,0 200,0 L0,0 Z" 
              fill="rgba(255,255,255,0.1)"
            ></path>
          </svg>
          
          {/* Main background shape */}
          <svg className="absolute left-0 top-0 h-full w-full" viewBox="0 0 800 800" preserveAspectRatio="none">
            <path 
              d="M0,0 L800,0 L800,800 Q400,650 0,800 Z" 
              fill="currentColor" 
              className="text-teal-700 opacity-50"
            ></path>
          </svg>
        </div>
        
        {/* Enhanced circular logo in center */}
        <div className="absolute flex items-center justify-center w-full h-full">
          <div className="relative w-48 h-48 rounded-full bg-white/90 border-6 border-teal-300 flex items-center justify-center shadow-xl">
            <img 
              src={prideLogo} 
              alt="Pride Logo" 
              className="w-50 h-50 object-contain p-4"
            />
          </div>
        </div>
        
        <div className="absolute bottom-0 inset-x-0 pb-12 text-center text-white">
          <h2 className="text-3xl font-bold">Welcome to Pride PMS</h2>
          <p className="mt-3 px-6 text-xl text-teal-100">Empowering Performance and Growth</p>
        </div>
      </div>
      
      {/* Right side: Login form container - 60% on desktop, 70% on xl */}
      <div className="flex w-full lg:w-3/5 xl:w-[70%] justify-center items-center p-6">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
          {/* Logo and brand name */}
          <div className="flex flex-col items-center mb-10">
            <img 
              src={horizontalLogo} 
              alt="Pride Logo" 
              className="h-20 w-auto mb-4"
            />
            <h1 className="text-2xl font-bold text-teal-900 text-center">PRIDE PMS</h1>
            <p className="text-xs font-medium text-gray-600 tracking-wider text-center mt-1">
              PERFORMANCE MANAGEMENT SYSTEM
            </p>
          </div>
          
          <h2 className="text-xl font-semibold text-gray-800 mb-8 text-center">
            Sign In to Your Account
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  autoComplete="email"
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockClosedIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  autoComplete="current-password"
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <Link to="/forgot-password" className="font-medium text-teal-600 hover:text-teal-500">
                  Forgot password?
                </Link>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4">
                <div className="flex">
                  <div className="ml-3">
                    <p className="text-sm text-red-700">
                      {error}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-gradient-to-r from-teal-700 to-teal-600 hover:from-teal-800 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </>
                ) : 'Sign in'}
              </button>
            </div>
          </form>
          
          <div className="mt-10 text-center text-xs text-gray-500 space-y-2">
            <p>Copyright &copy; {new Date().getFullYear()} Pride Bank Ltd. All rights reserved.</p>
            <p className="text-[11px] text-gray-400">
              Permission to use, copy, modify, and distribute this software and its documentation for any purpose is prohibited unless authorized in writing by the Managing Director.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;