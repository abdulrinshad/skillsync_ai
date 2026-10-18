import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BsStars, BsEnvelope, BsLock, BsEye, BsEyeSlash, BsArrowRight } from 'react-icons/bs';
import { useAuth } from '../../context/AuthContext';
import { GlassCard, Input, Button } from '../../components/ui';

const AdminLogin = () => {
  const navigate = useNavigate();
  const { user: authUser, login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Redirect authenticated admins away from login page
  useEffect(() => {
    const token = localStorage.getItem('token_admin') || localStorage.getItem('token');
    const localUserStr = localStorage.getItem('user_admin') || localStorage.getItem('user');
    let localUser = null;
    try {
      if (localUserStr) localUser = JSON.parse(localUserStr);
    } catch (e) {
      console.error(e);
    }

    const isAdmin = (authUser && authUser.role === 'admin') || (token && localUser && localUser.role === 'admin');
    if (isAdmin) {
      navigate('/admin/dashboard');
    }
  }, [authUser, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password,
      });

      const { token, user } = res.data;

      if (user.role !== 'admin') {
        setError('Access denied. Admin account required.');
        setLoading(false);
        return;
      }

      // Store in localStorage as requested
      login(user, token);

localStorage.setItem(
  'skillsync_user',
  JSON.stringify(user)
);

setSuccess(true);

      // Short delay for success animation before navigating
      setTimeout(() => {
        navigate('/admin/dashboard');
      }, 1000);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Authentication failed. Please verify your credentials.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4 md:p-8 relative overflow-hidden font-sans">
      {/* Background Animated Gradient Mesh */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-950/40 via-slate-950 to-black pointer-events-none z-0" />
      
      {/* Animated Glowing Orbs */}
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.15, 0.3, 0.15],
          x: [0, 80, 0],
          y: [0, -40, 0]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-[-20%] left-[-10%] w-[500px] md:w-[800px] h-[500px] md:h-[800px] bg-purple-600/10 blur-[130px] rounded-full pointer-events-none z-0"
      />
      <motion.div
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.15, 0.25, 0.15],
          x: [0, -60, 0],
          y: [0, 60, 0]
        }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-[-20%] right-[-10%] w-[500px] md:w-[800px] h-[500px] md:h-[800px] bg-indigo-600/10 blur-[130px] rounded-full pointer-events-none z-0"
      />

      <div className="w-full max-w-6xl grid lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
        
        {/* Left Side: Branding / Secure Access Promo */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="hidden lg:flex lg:col-span-6 flex-col justify-between h-full min-h-[500px] pr-8"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/20">
              <BsStars className="text-white text-2xl animate-pulse" />
            </div>
            <span className="text-3xl font-extrabold tracking-tight text-white bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400">
              SkillSync <span className="text-purple-400">AI</span>
            </span>
          </div>

          <div className="my-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold tracking-wide uppercase">
              Secure Control Center
            </div>
            <h1 className="text-4xl xl:text-5xl font-black text-white leading-tight">
              Welcome Back,<br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-indigo-300 to-cyan-300">
                Administrator
              </span>
            </h1>
            <p className="text-base xl:text-lg text-slate-400 leading-relaxed max-w-md">
              Access the SkillSync AI management platform. Monitor system performance, oversee courses, manage users, and orchestrate global settings.
            </p>

            <div className="p-5 rounded-2xl border border-white/5 bg-slate-950/40 backdrop-blur-md max-w-md">
              <div className="flex items-start gap-4">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500 mt-2 animate-ping" />
                <div>
                  <h4 className="font-semibold text-white text-sm">Secure Portal Access</h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    This login is restricted to authorized administrative personnel only. All access attempts are logged and monitored.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-xs text-slate-600 flex items-center gap-1.5 mt-8">
            <span>SkillSync AI v2.5.0</span>
            <span>•</span>
            <span>SSL Secured</span>
          </div>
        </motion.div>

        {/* Right Side: Login Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="lg:col-span-6 w-full max-w-md mx-auto"
        >
          {/* Top header in mobile / tablet view */}
          <div className="flex lg:hidden items-center justify-center gap-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/25">
              <BsStars className="text-white text-xl" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-white">SkillSync AI</span>
          </div>

          <GlassCard className="border-white/10 shadow-2xl bg-slate-950/45 backdrop-blur-2xl p-8 rounded-3xl relative overflow-hidden">
            {/* Ambient inner glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-[1px] bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-50" />

            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white tracking-tight">Admin Sign In</h2>
              <p className="text-sm text-slate-400 mt-1.5">Please verify your credentials to continue.</p>
            </div>

            {/* Error alerts */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/25 text-red-400 text-sm flex items-start gap-2.5"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 flex-shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}

            {/* Success state */}
            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 rounded-xl bg-green-500/10 border border-green-500/25 text-green-400 text-sm flex items-start gap-2.5"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 flex-shrink-0" />
                <span>Authentication successful! Accessing control center...</span>
              </motion.div>
            )}

            <form className="space-y-5" onSubmit={handleLogin}>
              <Input
                label="Administrator Email"
                placeholder="admin@skillsync.ai"
                type="email"
                icon={BsEnvelope}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading || success}
                className="bg-slate-950/60 border-white/5 text-white focus:border-purple-500/50"
              />

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400 ml-1">Password</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-purple-400 transition-colors">
                    <BsLock size={18} />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading || success}
                    className="w-full bg-slate-950/60 border border-white/10 rounded-xl py-3 pl-11 pr-12 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/50 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading || success}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                  >
                    {showPassword ? <BsEyeSlash size={18} /> : <BsEye size={18} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm pt-1">
                <label className="flex items-center gap-2.5 cursor-pointer group">
                  <div className="relative">
                    <input
                      type="checkbox"
                      className="peer sr-only"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      disabled={loading || success}
                    />
                    <div className="w-5 h-5 border border-white/20 rounded bg-white/5 peer-checked:bg-purple-600 peer-checked:border-purple-600 transition-all flex items-center justify-center">
                      <svg className="w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                  <span className="text-gray-400 group-hover:text-slate-200 transition-colors">Remember me</span>
                </label>
                <Link
                  to="/forgot-password"
                  className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                variant="gradient"
                className="w-full mt-6 py-3.5 bg-gradient-to-r from-purple-600 via-indigo-600 to-indigo-700 font-bold tracking-wide text-white rounded-xl shadow-lg shadow-purple-500/20 hover:shadow-purple-500/35 transition-all flex items-center justify-center gap-2"
                disabled={loading || success}
              >
                {loading ? (
                  <div className="flex items-center gap-2.5">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Authorizing...</span>
                  </div>
                ) : success ? (
                  <span>Access Granted</span>
                ) : (
                  <>
                    <span>Enter Control Center</span>
                    <BsArrowRight className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
            </form>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminLogin;
