import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Star, TrendingUp, Volume2, VolumeX, Zap } from 'lucide-react';
import { getCurrentUser, calculateRank, getXPToNextLevel, getLevelProgress } from '../../services/xpService';
import { useSound } from '../../hooks/useSound';
import { useConfetti } from '../../hooks/useConfetti';

interface EnhancedXPBadgeProps {
  onLevelUp?: (newRank: string) => void;
}

const EnhancedXPBadge: React.FC<EnhancedXPBadgeProps> = ({ onLevelUp }) => {
  const [user, setUser] = useState(getCurrentUser());
  const [showDetails, setShowDetails] = useState(false);
  const [showXPGain, setShowXPGain] = useState(false);
  const [xpGain, setXPGain] = useState(0);
  const prevXP = useRef(user.xp);
  const { playXP, playLevelUp, toggleSound, isSoundEnabled } = useSound();
  const { fireXPConfetti, fireLevelUpConfetti } = useConfetti();

  const currentRank = calculateRank(user.xp);
  const { needed, nextRank } = getXPToNextLevel(user.xp);
  const progress = getLevelProgress(user.xp);

  useEffect(() => {
    const handleStorageChange = () => {
      const updatedUser = getCurrentUser();
      const oldLevel = user.level;
      const oldXP = prevXP.current;
      
      // Check for XP gain
      if (updatedUser.xp > oldXP) {
        const gain = updatedUser.xp - oldXP;
        setXPGain(gain);
        setShowXPGain(true);
        playXP();
        fireXPConfetti();
        
        setTimeout(() => setShowXPGain(false), 2000);
      }
      
      // Check for level up
      if (updatedUser.level > oldLevel && onLevelUp) {
        playLevelUp();
        fireLevelUpConfetti();
        onLevelUp(updatedUser.rank);
      }
      
      setUser(updatedUser);
      prevXP.current = updatedUser.xp;
    };

    window.addEventListener('storage', handleStorageChange);
    const interval = setInterval(handleStorageChange, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [user.level, onLevelUp, playXP, playLevelUp, fireXPConfetti, fireLevelUpConfetti]);

  return (
    <div className="relative">
      {/* XP Gain Animation */}
      <AnimatePresence>
        {showXPGain && (
          <motion.div
            initial={{ opacity: 0, y: 0, scale: 0.5 }}
            animate={{ opacity: 1, y: -50, scale: 1 }}
            exit={{ opacity: 0, y: -80, scale: 0.5 }}
            className="absolute -top-12 left-1/2 transform -translate-x-1/2 z-50"
          >
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
              +{xpGain} XP
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main XP Badge */}
      <motion.div
        onClick={() => setShowDetails(!showDetails)}
        className="relative cursor-pointer group"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <div className="flex items-center gap-3 bg-gradient-to-r from-purple-600/20 to-violet-600/20 backdrop-blur-xl border border-purple-500/50 rounded-2xl px-4 py-3 shadow-lg">
          {/* Rank Icon with Glow */}
          <motion.div 
            className="relative w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold shadow-lg"
            style={{ backgroundColor: currentRank.color }}
            animate={{ 
              boxShadow: [
                `0 0 0 0 ${currentRank.color}40`,
                `0 0 0 8px ${currentRank.color}20`,
                `0 0 0 0 ${currentRank.color}40`
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {currentRank.icon}
            
            {/* Level indicator */}
            <motion.div
              className="absolute -top-1 -right-1 bg-gradient-to-r from-yellow-400 to-orange-400 text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring" }}
            >
              {user.level}
            </motion.div>
          </motion.div>

          {/* XP Info */}
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-white">
                {user.xp.toLocaleString()}
              </span>
              <Zap className="w-4 h-4 text-yellow-400" />
            </div>
            <div className="text-xs text-purple-300">
              {currentRank.name}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="flex flex-col items-end">
            <div className="text-xs text-gray-400 mb-1">
              {needed > 0 ? `${needed} to next` : 'Max Level!'}
            </div>
            <div className="w-16 bg-gray-700/50 rounded-full h-2 overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-purple-500 to-violet-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
          </div>
        </div>

        {/* Hover glow effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-violet-600/20 rounded-2xl blur-xl"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
      </motion.div>

      {/* Sound Toggle */}
      <motion.button
        onClick={(e) => {
          e.stopPropagation();
          toggleSound();
        }}
        className="absolute -top-2 -right-2 w-6 h-6 bg-gray-800/80 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-400 hover:text-white transition-colors"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        {isSoundEnabled() ? (
          <Volume2 className="w-3 h-3" />
        ) : (
          <VolumeX className="w-3 h-3" />
        )}
      </motion.button>

      {/* Detailed Tooltip */}
      <AnimatePresence>
        {showDetails && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            className="absolute top-full right-0 mt-4 w-80 bg-gray-900/95 backdrop-blur-xl border border-purple-500/50 rounded-3xl p-6 shadow-2xl z-50"
            onMouseLeave={() => setShowDetails(false)}
          >
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
              <motion.div 
                className="w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold shadow-lg"
                style={{ backgroundColor: currentRank.color }}
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {currentRank.icon}
              </motion.div>
              <div>
                <div className="text-xl font-bold text-white">{user.alias}</div>
                <div className="text-sm text-purple-300">{currentRank.name}</div>
              </div>
            </div>

            {/* XP Progress */}
            <div className="mb-6">
              <div className="flex justify-between text-sm text-gray-300 mb-2">
                <span>Level {user.level}</span>
                <span>{needed > 0 ? `${needed} XP to ${nextRank.name}` : 'Max Level!'}</span>
              </div>
              <div className="w-full bg-gray-700/50 rounded-full h-3 overflow-hidden">
                <motion.div 
                  className="h-full bg-gradient-to-r from-purple-500 to-violet-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                />
              </div>
              <div className="text-center text-xs text-purple-300 mt-2">
                {Math.round(progress)}% Complete
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 text-sm mb-6">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Pitches:</span>
                  <span className="text-white font-bold">{user.totalPitches}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Roasts:</span>
                  <span className="text-white font-bold">{user.totalRoasts}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">FixIts:</span>
                  <span className="text-white font-bold">{user.totalFixIts}</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Memes:</span>
                  <span className="text-white font-bold">{user.totalMemes}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Voice:</span>
                  <span className="text-white font-bold">{user.totalVoiceRoasts}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Total XP:</span>
                  <span className="text-purple-300 font-bold">{user.xp.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            {user.mostRoastedPitch && (
              <motion.div 
                className="p-4 bg-purple-900/20 rounded-xl border border-purple-700/30"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="text-xs text-purple-300 mb-2 flex items-center gap-1">
                  <Star className="w-3 h-3" />
                  Most Recent Pitch:
                </div>
                <div className="text-sm text-white italic">
                  "{user.mostRoastedPitch.length > 60 ? user.mostRoastedPitch.substring(0, 60) + '...' : user.mostRoastedPitch}"
                </div>
              </motion.div>
            )}

            {/* Motivational Tip */}
            <motion.div 
              className="mt-4 p-3 bg-gradient-to-r from-emerald-900/20 to-blue-900/20 rounded-xl border border-emerald-700/30"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <div className="text-xs text-emerald-300 text-center">
                💡 {getMotivationalTip(user.level, needed)}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const getMotivationalTip = (level: number, needed: number): string => {
  const tips = [
    "Every unicorn started with a roasted pitch!",
    "Keep grinding - your next idea might be the one!",
    "The best founders learn from brutal feedback.",
    "Turn those roasts into rocket fuel! 🚀",
    "Your pitch game is getting stronger!",
    "Level up by trying different modes!",
    "Voice roasts give the most XP - try one!",
    "Share your memes for bonus points!",
    "The leaderboard awaits your climb!",
    "From idea to IPO - one roast at a time!"
  ];
  
  if (needed === 0) return "You've reached the top! You're a legend! 👑";
  if (level >= 8) return "You're in the big leagues now! 🏆";
  if (level >= 5) return "Serious entrepreneur vibes! Keep going! 💪";
  
  return tips[Math.floor(Math.random() * tips.length)];
};

export default EnhancedXPBadge;