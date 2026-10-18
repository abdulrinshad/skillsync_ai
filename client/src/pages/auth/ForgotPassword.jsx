import axios from "axios";
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { BsStars, BsEnvelope, BsCheckCircleFill, BsExclamationTriangleFill, BsArrowLeft } from 'react-icons/bs';
import { GlassCard, Input, Button } from '../../components/ui';

const ForgotPassword = () => {
  const navigate = useNavigate();

  // State Management
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Form Validation & Submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setError('Email address is required');
      return;
    }
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    try {
  setLoading(true);
  setError("");

  const response = await axios.post(
    "http://localhost:5000/api/auth/forgot-password",
    {
      email,
    }
  );

  if (response.data.success) {
  localStorage.setItem(
    "resetEmail",
    email
  );

  setSuccess(true);

  setTimeout(() => {
    navigate("/reset-password");
  }, 2000);
}

} catch (err) {
  setError(
    err.response?.data?.message ||
    "Failed to send password reset code"
  );
} finally {
  setLoading(false);
}
  }

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Animated Orbs matching Login.jsx and OTPVerification.jsx exactly */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
          x: [0, 50, 0],
          y: [0, -50, 0]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-purple-600/20 blur-[120px] rounded-full pointer-events-none"
      />
      <motion.div
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.3, 0.5, 0.3],
          x: [0, -50, 0],
          y: [0, 50, 0]
        }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-cyan-600/20 blur-[120px] rounded-full pointer-events-none"
      />

      <div className="w-full max-w-md relative z-10">
        {/* Branding Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/20">
              <BsStars className="text-white text-2xl" />
            </div>
            <span className="text-3xl font-bold tracking-tight text-white">SkillSync AI</span>
          </div>
        </motion.div>

        {/* Card Component */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', damping: 20 }}
        >
          <GlassCard className="border-white/10 shadow-2xl relative overflow-hidden">
            <AnimatePresence mode="wait">
              {!success ? (
                <motion.div
                  key="forgot-password-form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-white mb-2">Forgot Password?</h2>
                    <p className="text-sm text-gray-400">
                      Enter your email address and we'll send you a password reset code.
                    </p>
                  </div>

                  <form className="space-y-6" onSubmit={handleSubmit}>
                    {/* Email Input */}
                    <Input
                      label="Email Address"
                      placeholder="name@company.com"
                      type="email"
                      icon={BsEnvelope}
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (error) setError('');
                      }}
                      required
                    />

                    {/* Error Area */}
                    <AnimatePresence>
                      {error && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm"
                        >
                          <BsExclamationTriangleFill className="shrink-0" />
                          <span>{error}</span>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Send Reset Code Button */}
                    <Button
                      type="submit"
                      variant="gradient"
                      className="w-full py-3.5"
                      disabled={loading}
                    >
                      {loading ? 'Sending Code...' : 'Send Reset Code'}
                    </Button>
                  </form>

                  {/* Navigation link back to Login */}
                  <div className="text-center mt-6">
                    <Link
                      to="/login"
                      className="inline-flex items-center gap-2 text-sm font-semibold text-purple-400 hover:text-purple-300 transition-colors cursor-pointer hover:underline"
                    >
                      <BsArrowLeft className="text-base" />
                      Back to Login
                    </Link>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="success-message"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-8 text-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: [0, 1.2, 1] }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="w-16 h-16 bg-green-500/10 border border-green-500/20 text-green-400 rounded-full flex items-center justify-center mb-4 text-3xl shadow-lg shadow-green-500/20"
                  >
                    <BsCheckCircleFill />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-white mb-2">Code Sent!</h3>
                  <p className="text-gray-400 max-w-xs text-sm mb-6">
                    Password reset code has been sent to your email.
                  </p>
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-purple-400 hover:text-purple-300 transition-colors cursor-pointer hover:underline"
                  >
                    <BsArrowLeft className="text-base" />
                    Back to Login
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
};

export default ForgotPassword;
