
import { signInWithPopup } from "firebase/auth";
import { googleProvider } from "../firebase";
import React, { useState } from 'react';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom'; // Add this line
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword 
} from 'firebase/auth';
import { Mail, Lock, LogIn, UserPlus, Loader2, AlertCircle, Wallet, Eye, EyeOff } from 'lucide-react';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred during authentication.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      const navigate = useNavigate(); // Navigate to dashboard after success
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-500 text-white mb-4 shadow-lg shadow-emerald-200">
            <Wallet size={32} />
          </div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">Daily Pay</h1>
          <p className="text-slate-500 font-medium">Track your freedom, one shift at a time.</p>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            {isLogin ? <LogIn size={20} className="text-emerald-500" /> : <UserPlus size={20} className="text-emerald-500" />}
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-xl bg-rose-50 text-rose-600 text-sm font-medium flex items-center gap-2 border border-rose-100">
                <AlertCircle size={16} />
                {error}
              </div>
            )}

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Password</label>
              <div className="relative">
                {/* Lock Icon on the left */}
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock size={18} />
                </div>

                {/* Password Input */}
                <input
                  type={showPassword ? "text" : "password"} // Toggle type based on state
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-medium"
                />

                {/* Eye Icon Button on the right */}
                <button
                  type="button" // Prevent form submission
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors outline-none"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-200 transition-all flex items-center justify-center gap-2 disabled:opacity-70 mt-2"
            >
              {loading ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                isLogin ? 'Sign In' : 'Sign Up'
              )}
            </button>
          </form>

          {/* Divider */}
        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-100"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase tracking-widest font-bold">
            <span className="px-4 bg-white text-slate-400">Or continue with</span>
          </div>
        </div>

        {/* Google Button */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full py-3.5 px-4 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-all flex items-center justify-center gap-3 shadow-sm"
        >
          <img 
            src="https://www.svgrepo.com/show/475656/google-color.svg" 
            alt="Google" 
            className="w-5 h-5"
          />
          Google
        </button>

          <div className="mt-6 pt-6 border-t border-slate-100 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm font-semibold text-slate-500 hover:text-emerald-600 transition-colors"
            >
              {isLogin ? "Don't have an account? Create one" : "Already have an account? Sign in"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
