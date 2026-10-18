import React from 'react';
import { motion } from 'framer-motion';

export const GlassCard = ({ children, className = '', ...props }) => (
  <motion.div
    className={`glass-card p-8 ${className}`}
    {...props}
  >
    {children}
  </motion.div>
);

export const Input = ({ label, icon: Icon, ...props }) => (
  <div className="space-y-2">
    {label && <label className="text-sm font-medium text-gray-400 ml-1">{label}</label>}
    <div className="relative group">
      {Icon && (
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-purple-400 transition-colors">
          <Icon size={18} />
        </div>
      )}
      <input
        className={`w-full bg-white/5 border border-white/10 rounded-xl py-3 ${Icon ? 'pl-11' : 'px-4'} pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/50 transition-all`}
        {...props}
      />
    </div>
  </div>
);

export const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const variants = {
    primary: 'bg-white text-black hover:bg-gray-200 shadow-[0_0_20px_rgba(255,255,255,0.1)]',
    outline: 'glass text-white hover:bg-white/10 border-white/10',
    ghost: 'text-gray-400 hover:text-white hover:bg-white/5',
    gradient: 'bg-gradient-premium text-white shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40'
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`px-6 py-3 rounded-xl font-bold transition-all disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export const Badge = ({ children, color = 'purple', className = '' }) => {
  const colors = {
    purple: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    cyan: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    green: 'bg-green-500/10 text-green-400 border-green-500/20',
    orange: 'bg-orange-500/10 text-orange-400 border-orange-500/20'
  };

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${colors[color]} ${className}`}>
      {children}
    </span>
  );
};
