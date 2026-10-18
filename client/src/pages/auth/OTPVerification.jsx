import axios from "axios";
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { BsStars, BsCheckCircleFill, BsExclamationTriangleFill } from 'react-icons/bs';
import { GlassCard, Button } from '../../components/ui';

const OTPVerification = () => {
  const navigate = useNavigate();

  // State Management
  const [otp, setOtp] = useState(Array(6).fill(''));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [countdown, setCountdown] = useState(59);

  // References for inputs to handle focus
  const inputRefs = useRef([]);

  // Countdown timer for resending OTP
  useEffect(() => {
    let timer;
    if (countdown > 0 && !success) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown, success]);

  // Focus first input box on load
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  // Handle value change in OTP input box
  const handleChange = (index, value) => {
    // Only allow single digit numeric input
    if (value !== '' && !/^[0-9]$/.test(value)) {
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto focus next field
    if (value !== '' && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  // Handle Key down for Backspace and arrow navigation
  const handleKeyDown = (index, e) => {
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
  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').trim();
    if (!/^\d{6}$/.test(pasteData)) return; // Only paste 6 digit numbers

    const newOtp = pasteData.split('');
    setOtp(newOtp);
    inputRefs.current[5].focus();
  };

  // Verify OTP submission
 const handleVerify = async (e) => {
  e.preventDefault();

  const otpCode = otp.join("");

  if (otpCode.length !== 6) {
    setError("Please enter all 6 digits");
    return;
  }

  try {
    setLoading(true);
    setError("");

    const email = localStorage.getItem(
      "verificationEmail"
    );

    const response = await axios.post(
      "http://localhost:5000/api/auth/verify-otp",
      {
        email,
        otp: otpCode,
      }
    );

    if (response.data.success) {
      setSuccess(true);

      setTimeout(() => {
        navigate("/login");
      }, 2500);
    }

  } catch (err) {
    setError(
      err.response?.data?.message ||
      "OTP verification failed"
    );
  } finally {
    setLoading(false);
  }
};
  // Resend OTP action
const handleResend = async () => {
  if (countdown > 0) return;

  try {
    const email = localStorage.getItem(
      "verificationEmail"
    );

    await axios.post(
      "http://localhost:5000/api/auth/send-otp",
      {
        email,
      }
    );

    setOtp(Array(6).fill(""));
    setError("");
    setCountdown(59);

    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }

  } catch (err) {
    setError(
      err.response?.data?.message ||
      "Failed to resend OTP"
    );
  }
};
  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Animated Orbs matching Login.jsx exactly */}
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
                  key="otp-form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-white mb-2">Verify Your Email</h2>
                    <p className="text-sm text-gray-400">
                      We've sent a 6-digit verification code to your email address
                    </p>
                  </div>

                  <form className="space-y-6" onSubmit={handleVerify}>
                    {/* OTP Inputs Group */}
                    <div className="flex justify-center gap-2 md:gap-3" onPaste={handlePaste}>
                      {otp.map((digit, idx) => (
                        <motion.input
                          key={idx}
                          ref={(el) => (inputRefs.current[idx] = el)}
                          type="text"
                          maxLength={1}
                          inputMode="numeric"
                          pattern="[0-9]*"
                          value={digit}
                          onChange={(e) => handleChange(idx, e.target.value)}
                          onKeyDown={(e) => handleKeyDown(idx, e)}
                          className="w-12 h-12 md:w-14 md:h-14 text-center text-xl md:text-2xl font-bold text-white bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all focus:bg-white/10"
                          whileFocus={{ scale: 1.05 }}
                        />
                      ))}
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

                    {/* Verify Button */}
                    <Button
                      type="submit"
                      variant="gradient"
                      className="w-full py-3.5"
                      disabled={loading}
                    >
                      {loading ? 'Verifying...' : 'Verify OTP'}
                    </Button>
                  </form>

                  {/* Resend Action */}
                  <div className="text-center mt-6">
                    {countdown > 0 ? (
                      <span className="text-sm text-gray-500">
                        Resend code in <span className="font-semibold text-purple-400">{countdown}s</span>
                      </span>
                    ) : (
                      <button
                        onClick={handleResend}
                        className="text-sm font-semibold text-purple-400 hover:text-purple-300 transition-colors cursor-pointer hover:underline"
                      >
                        Resend Code
                      </button>
                    )}
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
                  <h3 className="text-2xl font-bold text-white mb-2">Email Verified!</h3>
                  <p className="text-gray-400 max-w-xs text-sm">
                    Email verified successfully. Redirecting you to the platform...
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

export default OTPVerification;
