import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';;
import { BsStars, BsEnvelope, BsLock, BsPerson, BsBriefcase, BsCheckCircleFill } from 'react-icons/bs';
import { GlassCard, Input, Button } from '../../components/ui';

const Register = () => {

  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');


  const [role, setRole] = useState('student');
  const [password, setPassword] = useState('');

  const calculateStrength = (pass) => {
    let score = 0;
    if (pass.length > 6) score++;
    if (pass.length > 10) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    return score;
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError('');

      const res = await axios.post(
        'http://localhost:5000/api/auth/register',
        {
          fullName,
          email,
          password,
          role
        }
      );

     localStorage.setItem(
  "verificationEmail",
  email
);

      navigate('/otp-verification');
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Registration failed'
      );
    } finally {
      setLoading(false);
    }
  };

  const strength = calculateStrength(password);
  const strengthLabels = ['Weak', 'Fair', 'Good', 'Strong', 'Unbreakable'];
  const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500', 'bg-purple-500'];

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Animated Orbs */}
      <motion.div
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute top-[10%] right-[10%] w-[500px] h-[500px] bg-purple-600/10 blur-[100px] rounded-full pointer-events-none"
      />

      <div className="w-full max-w-xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/20">
              <BsStars className="text-white text-2xl" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Create your account</h1>
          <p className="text-gray-400">Join SkillSync AI and start your learning journey</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', damping: 20, delay: 0.1 }}
        >
          <GlassCard className="border-white/10 shadow-2xl">
            <form className="space-y-6" onSubmit={handleRegister}>
              <div className="grid md:grid-cols-2 gap-6">
                <Input
                  label="Full Name"
                  placeholder="John Doe"
                  icon={BsPerson}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
                <Input
                  label="Email Address"
                  placeholder="name@company.com"
                  type="email"
                  icon={BsEnvelope}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {/* Role Selector */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400 ml-1">I am a</label>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { id: 'student', label: 'Student', icon: BsPerson, desc: 'I want to learn' },
                    { id: 'teacher', label: 'Teacher', icon: BsBriefcase, desc: 'I want to teach' }
                  ].map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setRole(r.id)}
                      className={`p-4 rounded-2xl border transition-all text-left group relative ${role === r.id ? 'border-purple-500 bg-purple-500/10' : 'border-white/5 bg-white/5 hover:border-white/20'}`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <r.icon className={role === r.id ? 'text-purple-400' : 'text-gray-500'} size={20} />
                        {role === r.id && <BsCheckCircleFill className="text-purple-400" />}
                      </div>
                      <div className={`font-bold ${role === r.id ? 'text-white' : 'text-gray-300'}`}>{r.label}</div>
                      <div className="text-xs text-gray-500">{r.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <Input
                  label="Password"
                  placeholder="••••••••"
                  type="password"
                  icon={BsLock}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

                {/* Password Strength UI */}
                {password && (
                  <div className="space-y-2 px-1">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-gray-500 font-medium">Strength: <span className={strength > 2 ? 'text-green-400' : 'text-orange-400'}>{strengthLabels[strength - 1] || 'Too Short'}</span></span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden flex gap-1">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div
                          key={i}
                          className={`h-full flex-1 transition-all duration-500 ${i <= strength ? strengthColors[strength - 1] : 'bg-transparent'}`}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <label
                htmlFor="terms"
                className="flex items-start gap-3 px-1 cursor-pointer"
              >
                <div className="relative pt-1">
                  <input
                    type="checkbox"
                    className="peer sr-only"
                    id="terms"
                    required
                  />

                  <div className="w-5 h-5 border border-white/20 rounded bg-white/5 peer-checked:bg-purple-600 peer-checked:border-purple-600 transition-all" />

                  <svg
                    className="absolute inset-0 w-5 h-5 text-white opacity-0 peer-checked:opacity-100 transition-opacity p-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="3"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>

                <span className="text-sm text-gray-400 select-none">
                  I agree to the{" "}
                  <a href="#" className="text-purple-400 hover:underline">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-purple-400 hover:underline">
                    Privacy Policy
                  </a>
                </span>
              </label>

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
                {loading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </form>

            <div className="mt-8 text-center text-gray-400">
              Already have an account?{' '}
              <Link to="/login" className="text-white font-bold hover:text-purple-400 transition-colors">
                Sign in
              </Link>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
