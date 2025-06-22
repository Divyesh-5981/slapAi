import React from 'react';
import { motion } from 'framer-motion';

interface ElegantLoadingSpinnerProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

const ElegantLoadingSpinner: React.FC<ElegantLoadingSpinnerProps> = ({ 
  message = 'Loading...', 
  size = 'md' 
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  const dotSizes = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4'
  };

  return (
    <div className="flex flex-col items-center justify-center gap-6">
      {/* Modern Gradient Spinner */}
      <div className="relative">
        {/* Outer rotating ring */}
        <motion.div
          className={`${sizeClasses[size]} rounded-full border-2 border-transparent bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 p-1`}
          animate={{ rotate: 360 }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          <div className="w-full h-full rounded-full bg-gray-900" />
        </motion.div>

        {/* Inner pulsing core */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate={{
            scale: [0.8, 1.2, 0.8],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <div className={`${dotSizes[size]} rounded-full bg-gradient-to-r from-purple-400 to-pink-400 shadow-lg shadow-purple-500/50`} />
        </motion.div>

        {/* Orbital dots */}
        {[0, 120, 240].map((rotation, index) => (
          <motion.div
            key={index}
            className="absolute inset-0"
            animate={{ rotate: 360 }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear",
              delay: index * 0.2
            }}
            style={{ transformOrigin: '50% 50%' }}
          >
            <motion.div
              className={`absolute top-0 left-1/2 transform -translate-x-1/2 ${
                size === 'sm' ? 'w-1 h-1' : size === 'md' ? 'w-1.5 h-1.5' : 'w-2 h-2'
              } rounded-full bg-gradient-to-r from-cyan-400 to-blue-400 shadow-sm shadow-cyan-400/50`}
              initial={{ rotate: rotation }}
              animate={{
                scale: [0.8, 1.2, 0.8],
                opacity: [0.6, 1, 0.6]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: index * 0.3
              }}
            />
          </motion.div>
        ))}
      </div>

      {/* Loading Message */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <motion.p
          className="text-lg font-medium text-white mb-2"
          animate={{
            opacity: [0.7, 1, 0.7]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {message}
        </motion.p>
        <motion.div
          className="flex justify-center gap-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              className="w-1 h-1 rounded-full bg-purple-400"
              animate={{
                y: [0, -4, 0],
                opacity: [0.4, 1, 0.4]
              }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: index * 0.2
              }}
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ElegantLoadingSpinner;