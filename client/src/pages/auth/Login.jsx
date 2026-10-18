import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { BsStars, BsGithub, BsGoogle, BsEnvelope, BsLock } from 'react-icons/bs';
import { GlassCard, Input, Button } from '../../components/ui';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError('');

      const res = await axios.post(
        'http://localhost:5000/api/auth/login',
        {
          email,
          password,
        }
      );

      login(res.data.user, res.data.token);

      const role = res.data.user.role;

      if (role === 'admin') {
        navigate('/admin');
      }

      if (role === 'teacher') {
        navigate('/teacher');
      }

      if (role === 'student') {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Login failed'
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Animated Orbs */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
          x: [0, 50, 0],
          y: [0, -50, 0]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-purple-600/20 blur-[120px] rounded-full pointer-events-none"
      />
      <motion.div
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.3, 0.5, 0.3],
          x: [0, -50, 0],
          y: [0, 50, 0]
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-cyan-600/20 blur-[120px] rounded-full pointer-events-none"
      />

      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-12 items-center relative z-10">
        {/* Left Side: Branding/Visual */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          className="hidden lg:block space-y-8"
        >
          <div className="flex items-center gap-3 mb-12">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/20">
              <BsStars className="text-white text-2xl" />
            </div>
            <span className="text-3xl font-bold tracking-tight text-white">SkillSync AI</span>
          </div>

          <h1 className="text-5xl font-bold leading-tight">
            The future of learning is <br />
            <span className="text-gradient">Personalized.</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-md">
            Join the most advanced AI-powered LMS platform and unlock your true potential today.
          </p>

          <div className="grid grid-cols-2 gap-6 pt-8">
            {[
              { label: 'Users', value: '50k+' },
              { label: 'Courses', value: '200+' },
              { label: 'AI Tutors', value: '24/7' },
              { label: 'Retention', value: '98%' },
            ].map((stat, i) => (
              <div key={i} className="glass-dark p-4 rounded-2xl border-white/5">
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-sm text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Right Side: Login Form */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', damping: 20 }}
        >
          <GlassCard className="max-w-md mx-auto border-white/10 shadow-2xl">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">Welcome Back</h2>
              <p className="text-gray-400">Sign in to continue your journey</p>
            </div>

            <form className="space-y-6" onSubmit={handleLogin}>
              <Input
                label="Email Address"
                placeholder="name@company.com"
                type="email"
                icon={BsEnvelope}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Input
                label="Password"
                placeholder="••••••••"
                type="password"
                icon={BsLock}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <div className="relative">
                    <input type="checkbox" className="peer sr-only" />
                    <div className="w-5 h-5 border border-white/20 rounded bg-white/5 peer-checked:bg-purple-600 peer-checked:border-purple-600 transition-all" />
                    <svg className="absolute inset-0 w-5 h-5 text-white opacity-0 peer-checked:opacity-100 transition-opacity p-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-gray-400 group-hover:text-white transition-colors">Remember me</span>
                </label>
                <Link to="/forgot-password" className="text-purple-400 hover:text-purple-300 font-medium">Forgot password?</Link>
              </div>

              {error && (
                <div className="text-red-500 text-sm text-center">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                variant="gradient"
                className="w-full"
                disabled={loading}
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </Button>

              <div className="relative py-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-[#0f172a] px-2 text-gray-500">Or continue with</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" className="flex items-center justify-center gap-2 font-medium py-2.5">
                  <BsGoogle /> Google
                </Button>
                <Button variant="outline" className="flex items-center justify-center gap-2 font-medium py-2.5">
                  <BsGithub /> GitHub
                </Button>
              </div>
            </form>

            <div className="mt-8 text-center text-gray-400">
              Don't have an account?{' '}
              <Link to="/register" className="text-white font-bold hover:text-purple-400 transition-colors">
                Create account
              </Link>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
