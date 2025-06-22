import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Flame, Zap, Sparkles } from 'lucide-react';
import EnhancedXPBadge from '../ui/EnhancedXPBadge';
import LevelUpNotification from '../ui/LevelUpNotification';

const Header: React.FC = () => {
  const location = useLocation();
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [newRank, setNewRank] = useState('');
  
  const getCurrentMode = () => {
    const path = location.pathname;
    if (path === '/fixit') return 'FixIt Mode';
    if (path === '/scorecard') return 'Scorecard Mode';
    if (path === '/branding') return 'Branding Doctor';
    if (path === '/meme') return 'Meme Mode';
    if (path === '/investor') return 'Investor Simulator';
    if (path === '/leaderboard') return 'Leaderboard';
    return 'Roast Mode';
  };

  const handleLevelUp = (rankName: string) => {
    setNewRank(rankName);
    setShowLevelUp(true);
  };

  return (
    <>
      <motion.header 
        className="bg-gray-900/95 border-b border-purple-800/30 sticky top-0 z-50 backdrop-blur-xl shadow-lg shadow-purple-900/10"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-4 group">
              <motion.div 
                className="relative flex-shrink-0"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {/* Enhanced flame icon with glow */}
                <div className="relative">
                  <Flame className="w-10 h-10 text-purple-400 group-hover:text-purple-300 transition-colors duration-300 relative z-10" />
                  <motion.div
                    className="absolute inset-0 bg-purple-500/30 rounded-full blur-md"
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.3, 0.6, 0.3]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                </div>
                
                {/* Sparkle effects */}
                <motion.div 
                  className="absolute -top-1 -right-1"
                  animate={{
                    rotate: [0, 180, 360],
                    scale: [0.8, 1.2, 0.8]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <Sparkles className="w-3 h-3 text-pink-400 opacity-75" />
                </motion.div>
              </motion.div>
              
              <motion.div 
                className="transform group-hover:scale-105 transition-transform duration-300"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-purple-200 to-purple-300 bg-clip-text text-transparent group-hover:from-purple-300 group-hover:to-pink-300 transition-all duration-300 text-glow">
                  PitchSlap.ai
                </h1>
                <motion.p 
                  className="text-sm text-gray-400 -mt-1 font-medium tracking-wide"
                  animate={{
                    opacity: [0.7, 1, 0.7]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  Startup Reality Check
                </motion.p>
              </motion.div>
            </Link>

            {/* Center - Current Mode Indicator */}
            <motion.div 
              className="hidden md:flex items-center gap-3 bg-gradient-to-r from-purple-900/60 to-violet-900/60 backdrop-blur-xl text-purple-200 px-8 py-4 rounded-2xl text-sm font-semibold border border-purple-600/40 shadow-xl shadow-purple-900/30"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 20px 40px rgba(139, 92, 246, 0.4)"
              }}
              style={{
                boxShadow: "0 0 20px rgba(139, 92, 246, 0.2)"
              }}
            >
              {/* Animated background glow */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-violet-600/20 rounded-2xl"
                animate={{
                  opacity: [0.5, 0.8, 0.5],
                  scale: [1, 1.02, 1]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              
              <motion.div
                className="relative z-10"
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <Zap className="w-5 h-5 text-yellow-400" />
              </motion.div>
              <span className="bg-gradient-to-r from-purple-200 to-pink-200 bg-clip-text text-transparent font-bold relative z-10">
                {getCurrentMode()}: Active
              </span>
            </motion.div>

            {/* Right - Enhanced XP Badge */}
            <motion.div 
              className="flex items-center gap-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <EnhancedXPBadge onLevelUp={handleLevelUp} />
              
              {/* Mobile Menu Button */}
              <motion.div 
                className="md:hidden"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <button className="p-3 text-gray-400 hover:text-purple-300 transition-colors duration-300 rounded-xl bg-gray-800/50 hover:bg-purple-900/30 border border-gray-700/50 hover:border-purple-600/50">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Enhanced header glow effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-purple-900/20 via-transparent to-purple-900/20 pointer-events-none"
          animate={{ 
            opacity: [0.3, 0.7, 0.3],
            scale: [1, 1.02, 1]
          }}
          transition={{ 
            duration: 5, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Bottom gradient line */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"
          animate={{
            opacity: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </motion.header>

      {/* Level Up Notification */}
      {showLevelUp && (
        <LevelUpNotification
          newRank={newRank}
          onClose={() => setShowLevelUp(false)}
        />
      )}
    </>
  );
};

export default Header;