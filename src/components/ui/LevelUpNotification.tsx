import React, { useEffect, useRef } from 'react';
import { Trophy, Star, Sparkles } from 'lucide-react';
import { calculateRank } from '../../services/xpService';
import { useAnimations } from '../../hooks/useAnimations';

interface LevelUpNotificationProps {
  newRank: string;
  onClose: () => void;
}

const LevelUpNotification: React.FC<LevelUpNotificationProps> = ({ newRank, onClose }) => {
  const notificationRef = useRef<HTMLDivElement>(null);
  const { bounceIn, animateIn } = useAnimations();

  const rankData = calculateRank(0); // We'll find the actual rank
  const actualRank = newRank;

  useEffect(() => {
    if (notificationRef.current) {
      bounceIn(notificationRef.current, { delay: 0.2 });
    }

    // Auto-close after 5 seconds
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [bounceIn, onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div
        ref={notificationRef}
        className="bg-gradient-to-br from-purple-900/90 to-violet-900/90 border-2 border-yellow-400/50 rounded-3xl p-8 max-w-md mx-4 text-center shadow-2xl backdrop-blur-sm"
      >
        {/* Celebration Icons */}
        <div className="flex justify-center gap-4 mb-6">
          <Sparkles className="w-8 h-8 text-yellow-400 animate-pulse" />
          <Trophy className="w-12 h-12 text-yellow-400 animate-bounce" />
          <Sparkles className="w-8 h-8 text-yellow-400 animate-pulse" />
        </div>

        {/* Level Up Message */}
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-yellow-400 mb-2">
            LEVEL UP! 🎉
          </h2>
          <p className="text-xl text-white mb-4">
            You've reached a new rank!
          </p>
          <div className="text-2xl font-bold text-purple-300">
            {actualRank}
          </div>
        </div>

        {/* Motivational Message */}
        <div className="mb-6 p-4 bg-purple-800/30 rounded-xl border border-purple-600/50">
          <p className="text-sm text-purple-200">
            {getRankMessage(actualRank)}
          </p>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          Keep Grinding! 🚀
        </button>
      </div>
    </div>
  );
};

const getRankMessage = (rank: string): string => {
  const messages: Record<string, string> = {
    'Idea Haver': 'You\'ve got ideas! Now let\'s see if they\'re any good... 💡',
    'MVP Builder': 'Building that minimum viable product! Keep iterating! 🔨',
    'Beta Tester': 'Testing, testing... Is this thing on? 🧪',
    'Product Hunter': 'Hunting for that perfect product-market fit! 🎯',
    'Growth Hacker': 'Growth hacking your way to the top! 📈',
    'Series A Hopeful': 'VCs are starting to notice you... maybe! 💰',
    'VC Bait': 'You\'re officially VC bait! Time to practice that pitch! 🎣',
    'Unicorn Hunter': 'Hunting for that billion-dollar valuation! 🦄',
    'Startup Sensei': 'You\'ve mastered the art of startup warfare! 🥋',
    'Exit Strategy': 'Planning your exit? Smart move! 🚀',
    'Pitch Slap Legend': 'You are the chosen one! The ultimate pitch slapper! 👑'
  };

  return messages[rank] || 'You\'re climbing the startup ladder! Keep going! 🔥';
};

export default LevelUpNotification;