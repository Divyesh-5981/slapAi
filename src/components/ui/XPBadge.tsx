import React, { useEffect, useRef, useState } from 'react';
import { Trophy, Star, TrendingUp } from 'lucide-react';
import { getCurrentUser, calculateRank, getXPToNextLevel, getLevelProgress } from '../../services/xpService';
import { useAnimations } from '../../hooks/useAnimations';

interface XPBadgeProps {
  onLevelUp?: (newRank: string) => void;
}

const XPBadge: React.FC<XPBadgeProps> = ({ onLevelUp }) => {
  const [user, setUser] = useState(getCurrentUser());
  const [showDetails, setShowDetails] = useState(false);
  const badgeRef = useRef<HTMLDivElement>(null);
  const detailsRef = useRef<HTMLDivElement>(null);
  const { animateIn, pulseHover, bounceIn } = useAnimations();

  const currentRank = calculateRank(user.xp);
  const { needed, nextRank } = getXPToNextLevel(user.xp);
  const progress = getLevelProgress(user.xp);

  useEffect(() => {
    // Listen for XP updates
    const handleStorageChange = () => {
      const updatedUser = getCurrentUser();
      const oldLevel = user.level;
      setUser(updatedUser);
      
      // Check for level up
      if (updatedUser.level > oldLevel && onLevelUp) {
        onLevelUp(updatedUser.rank);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Also check periodically for updates from same tab
    const interval = setInterval(handleStorageChange, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [user.level, onLevelUp]);

  useEffect(() => {
    if (badgeRef.current) {
      animateIn(badgeRef.current, {
        from: { opacity: 0, scale: 0.8 },
        duration: 0.6
      });
    }
  }, [animateIn]);

  const handleBadgeClick = () => {
    if (badgeRef.current) {
      pulseHover(badgeRef.current);
    }
    setShowDetails(!showDetails);
  };

  return (
    <div className="relative">
      {/* XP Badge */}
      <div
        ref={badgeRef}
        onClick={handleBadgeClick}
        className="flex items-center gap-2 bg-gradient-to-r from-purple-600/20 to-violet-600/20 border border-purple-500/50 rounded-full px-4 py-2 cursor-pointer hover:scale-105 transform transition-all duration-300 shadow-lg backdrop-blur-sm"
      >
        <div 
          className="w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold shadow-lg"
          style={{ backgroundColor: currentRank.color }}
        >
          {currentRank.icon}
        </div>
        <div className="text-sm font-bold text-white">
          {user.xp.toLocaleString()} XP
        </div>
        <div className="text-xs text-purple-300">
          Lv.{user.level}
        </div>
      </div>

      {/* Detailed Tooltip */}
      {showDetails && (
        <div
          ref={detailsRef}
          className="absolute top-full right-0 mt-2 w-80 bg-gray-900/95 border border-purple-500/50 rounded-2xl p-6 shadow-2xl backdrop-blur-sm z-50"
          onMouseLeave={() => setShowDetails(false)}
        >
          {/* Header */}
          <div className="flex items-center gap-3 mb-4">
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold shadow-lg"
              style={{ backgroundColor: currentRank.color }}
            >
              {currentRank.icon}
            </div>
            <div>
              <div className="text-lg font-bold text-white">{user.alias}</div>
              <div className="text-sm text-purple-300">{currentRank.name}</div>
            </div>
          </div>

          {/* XP Progress */}
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-300 mb-2">
              <span>Level {user.level}</span>
              <span>{needed > 0 ? `${needed} XP to ${nextRank.name}` : 'Max Level!'}</span>
            </div>
            <div className="w-full bg-gray-700/50 rounded-full h-2 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-purple-500 to-violet-500 rounded-full transition-all duration-1000"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
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
            <div className="space-y-2">
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

          {/* Most Roasted Pitch */}
          {user.mostRoastedPitch && (
            <div className="mt-4 p-3 bg-purple-900/20 rounded-lg border border-purple-700/30">
              <div className="text-xs text-purple-300 mb-1">Most Recent Pitch:</div>
              <div className="text-sm text-white italic">
                "{user.mostRoastedPitch.length > 60 ? user.mostRoastedPitch.substring(0, 60) + '...' : user.mostRoastedPitch}"
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default XPBadge;