import React from 'react';
import { motion } from 'framer-motion';

interface LoadingShimmerProps {
  lines?: number;
  className?: string;
}

const LoadingShimmer: React.FC<LoadingShimmerProps> = ({ lines = 3, className = '' }) => {
  return (
    <div className={`space-y-4 ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <motion.div
          key={index}
          className="relative overflow-hidden bg-gray-700/30 rounded-lg"
          style={{ height: index === 0 ? '24px' : index === lines - 1 ? '16px' : '20px' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: index * 0.1 }}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-400/20 to-transparent"
            animate={{ x: ['-100%', '100%'] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "linear",
              delay: index * 0.2
            }}
          />
        </motion.div>
      ))}
    </div>
  );
};

export default LoadingShimmer;