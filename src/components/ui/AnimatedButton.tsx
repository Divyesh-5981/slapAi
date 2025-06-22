import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { DivideIcon as LucideIcon } from 'lucide-react';
import { useSound } from '../../hooks/useSound';

interface AnimatedButtonProps {
  onClick: () => void;
  disabled?: boolean;
  isLoading?: boolean;
  variant?: 'primary' | 'secondary' | 'success' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: LucideIcon;
  children: React.ReactNode;
  className?: string;
  soundEffect?: boolean;
}

const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  onClick,
  disabled = false,
  isLoading = false,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  children,
  className = '',
  soundEffect = true
}) => {
  const { playClick, playHover } = useSound();
  const buttonRef = useRef<HTMLButtonElement>(null);

  const variants = {
    primary: 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg shadow-purple-600/25',
    secondary: 'bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-white shadow-lg shadow-gray-700/25',
    success: 'bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white shadow-lg shadow-emerald-600/25',
    danger: 'bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white shadow-lg shadow-red-600/25'
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };

  const handleClick = () => {
    if (soundEffect) playClick();
    onClick();
  };

  const handleHover = () => {
    if (soundEffect) playHover();
  };

  return (
    <motion.button
      ref={buttonRef}
      onClick={handleClick}
      onMouseEnter={handleHover}
      disabled={disabled || isLoading}
      className={`
        relative inline-flex items-center justify-center gap-3 font-bold rounded-2xl
        transition-all duration-300 transform-gpu
        disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
        focus:outline-none focus:ring-4 focus:ring-purple-500/30
        overflow-hidden
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
      whileHover={!disabled ? { 
        scale: 1.05,
        boxShadow: "0 20px 40px rgba(139, 92, 246, 0.4)"
      } : undefined}
      whileTap={!disabled ? { 
        scale: 0.95,
        transition: { duration: 0.1 }
      } : undefined}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Shimmer effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        initial={{ x: '-100%' }}
        animate={{ x: '100%' }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatDelay: 3,
          ease: "linear"
        }}
      />

      {/* Loading spinner */}
      {isLoading && (
        <motion.div
          className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      )}

      {/* Icon */}
      {Icon && !isLoading && (
        <motion.div
          initial={{ rotate: 0 }}
          whileHover={{ rotate: 12 }}
          transition={{ duration: 0.2 }}
        >
          <Icon className="w-5 h-5" />
        </motion.div>
      )}

      {/* Text */}
      <span className="relative z-10">
        {children}
      </span>

      {/* Ripple effect on click */}
      <motion.div
        className="absolute inset-0 bg-white/20 rounded-2xl"
        initial={{ scale: 0, opacity: 1 }}
        animate={{ scale: 0, opacity: 1 }}
        whileTap={{ scale: 1, opacity: 0 }}
        transition={{ duration: 0.3 }}
      />
    </motion.button>
  );
};

export default AnimatedButton;