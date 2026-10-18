import axios from "axios";
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { BsStars, BsLock, BsEye, BsEyeSlash, BsCheckCircleFill, BsExclamationTriangleFill, BsArrowLeft } from 'react-icons/bs';
import { GlassCard, Button } from '../../components/ui';

const ResetPassword = () => {
  const navigate = useNavigate();

  // State Management
  const [otp, setOtp] = useState(Array(6).fill(''));
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // References for OTP inputs to handle focus
  const inputRefs = useRef([]);

  // Focus first input box on load
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  // Handle value change in OTP input box
  const handleOtpChange = (index, value) => {
    // Only allow single digit numeric input
    if (value !== '' && !/^[0-9]$/.test(value)) {
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (error) setError('');

    // Auto focus next field
    if (value !== '' && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  // Handle Key down for Backspace and arrow navigation
  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace') {
      if (otp[index] === '') {
        // If current box is empty, move to previous box and clear it
        if (index > 0) {
          inputRefs.current[index - 1].focus();
          const newOtp = [...otp];
          newOtp[index - 1] = '';
          setOtp(newOtp);
        }
      } else {
        // If current box is not empty, clear it
        const newOtp = [...otp];
        newOtp[index] = '';
        setOtp(newOtp);
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1].focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  // Handle Paste
  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').trim();
    if (!/^\d{6}$/.test(pasteData)) return; // Only paste 6 digit numbers

    const newOtp = pasteData.split('');
    setOtp(newOtp);
    inputRefs.current[5].focus();
  };

  // Reset Password submission handler
  const handleResetPassword = async (e) => {
    e.preventDefault();

    const otpCode = otp.join("");

    // Validation checks
    if (otpCode.length !== 6) {
      setError("Please enter the 6-digit verification code.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

  try {
  setLoading(true);
  setError("");

  const email =
    localStorage.getItem("resetEmail");

  if (!email) {
    setError(
      "Reset session expired. Please request a new reset code."
    );
    return;
  }

  const response = await axios.post(
    "http://localhost:5000/api/auth/reset-password",
    {
      email,
      otp: otpCode,
      newPassword: password,
    }
  );
  if (response.data.success) {
    localStorage.removeItem(
      "resetEmail"
    );

    setSuccess(true);

    setTimeout(() => {
      navigate("/login");
    }, 2500);
  }

} catch (err) {
      setError(
        err.response?.data?.message ||
        "Password reset failed. Please request a new code or try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Animated Orbs matching design system exactly */}
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
                  key="reset-password-form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-white mb-2">Reset Password</h2>
                    <p className="text-sm text-gray-400">
                      Enter the verification code sent to your email and create a new password.
                    </p>
                  </div>

                  <form className="space-y-6" onSubmit={handleResetPassword}>
                    {/* OTP Inputs Group */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-400 ml-1">Verification Code</label>
                      <div className="flex justify-center gap-2 md:gap-3" onPaste={handleOtpPaste}>
                        {otp.map((digit, idx) => (
                          <motion.input
                            key={idx}
                            ref={(el) => (inputRefs.current[idx] = el)}
                            type="text"
                            maxLength={1}
                            inputMode="numeric"
                            pattern="[0-9]*"
                            value={digit}
                            onChange={(e) => handleOtpChange(idx, e.target.value)}
                            onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                            className="w-12 h-12 md:w-14 md:h-14 text-center text-xl md:text-2xl font-bold text-white bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all focus:bg-white/10"
                            whileFocus={{ scale: 1.05 }}
                          />
                        ))}
                      </div>
                    </div>

                    {/* New Password */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-400 ml-1">New Password</label>
                      <div className="relative group">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-purple-400 transition-colors">
                          <BsLock size={18} />
                        </div>
                        <input
                          type={showPassword ? "text" : "password"}
                          className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-12 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/50 transition-all focus:bg-white/10"
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => {
                            setPassword(e.target.value);
                            if (error) setError('');
                          }}
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors focus:outline-none"
                        >
                          {showPassword ? <BsEyeSlash size={18} /> : <BsEye size={18} />}
                        </button>
                      </div>
                    </div>

                    {/* Confirm Password */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-400 ml-1">Confirm Password</label>
                      <div className="relative group">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-purple-400 transition-colors">
                          <BsLock size={18} />
                        </div>
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-12 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/50 transition-all focus:bg-white/10"
                          placeholder="••••••••"
                          value={confirmPassword}
                          onChange={(e) => {
                            setConfirmPassword(e.target.value);
                            if (error) setError('');
                          }}
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors focus:outline-none"
                        >
                          {showConfirmPassword ? <BsEyeSlash size={18} /> : <BsEye size={18} />}
                        </button>
                      </div>
                    </div>

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

                    {/* Reset Password Button */}
                    <Button
                      type="submit"
                      variant="gradient"
                      className="w-full py-3.5"
                      disabled={loading}
                    >
                      {loading ? 'Resetting Password...' : 'Reset Password'}
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
                  <h3 className="text-2xl font-bold text-white mb-2">Password Reset Successfully</h3>
                  <p className="text-gray-400 max-w-xs text-sm">
                    Your password has been updated successfully. Redirecting to login...
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
};

export default ResetPassword;
