import React, { useRef, useEffect } from 'react';
import { Trophy, Target, TrendingUp, Zap, RotateCcw, Award } from 'lucide-react';
import { getRankProgress, INVESTOR_RANKS, type InvestorProfile } from '../../services/investorService';
import { useAnimations } from '../../hooks/useAnimations';

interface InvestorDashboardProps {
  profile: InvestorProfile;
  roundNumber: number;
  onReset: () => void;
}

const InvestorDashboard: React.FC<InvestorDashboardProps> = ({ profile, roundNumber, onReset }) => {
  const dashboardRef = useRef<HTMLDivElement>(null);
  const { staggerIn, pulseHover } = useAnimations();

  const { current, next, progress } = getRankProgress(profile.accuracy, profile.totalDeals);

  useEffect(() => {
    if (dashboardRef.current) {
      const elements = dashboardRef.current.querySelectorAll('.dashboard-item');
      staggerIn(Array.from(elements), {
        from: { opacity: 0, y: 20 },
        duration: 0.6,
        stagger: 0.1
      });
    }
  }, [staggerIn]);

  const handleResetClick = (e: React.MouseEvent) => {
    pulseHover(e.currentTarget);
    onReset();
  };

  return (
    <div 
      ref={dashboardRef}
      className="bg-gray-900/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-purple-800/30 p-8"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
          <Trophy className="w-8 h-8 text-yellow-400" />
          Investor Dashboard
        </h2>
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-400">
            Round {roundNumber}
          </div>
          <button
            onClick={handleResetClick}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-700/50 hover:bg-red-600/50 text-gray-300 hover:text-white rounded-xl transition-all duration-300 transform hover:scale-105"
            title="Reset game"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-4 gap-6">
        {/* Current Rank */}
        <div className="dashboard-item bg-gradient-to-br from-purple-900/30 to-violet-900/30 rounded-2xl p-6 border border-purple-700/30">
          <div className="flex items-center gap-3 mb-4">
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold shadow-lg"
              style={{ backgroundColor: current.color }}
            >
              {current.icon}
            </div>
            <div>
              <div className="text-lg font-bold text-white">{current.name}</div>
              <div className="text-sm text-purple-300">Level {current.level}</div>
            </div>
          </div>
          
          {progress < 100 && (
            <div>
              <div className="flex justify-between text-xs text-gray-400 mb-2">
                <span>Progress to {next.name}</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="w-full bg-gray-700/50 rounded-full h-2">
                <div 
                  className="h-full bg-gradient-to-r from-purple-500 to-violet-500 rounded-full transition-all duration-1000"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Accuracy */}
        <div className="dashboard-item bg-gradient-to-br from-emerald-900/30 to-green-900/30 rounded-2xl p-6 border border-emerald-700/30">
          <div className="flex items-center gap-3 mb-2">
            <Target className="w-8 h-8 text-emerald-400" />
            <div className="text-lg font-bold text-white">Accuracy</div>
          </div>
          <div className="text-3xl font-bold text-emerald-300 mb-1">
            {profile.accuracy}%
          </div>
          <div className="text-sm text-gray-400">
            {profile.correctDecisions}/{profile.totalDeals} correct
          </div>
        </div>

        {/* Total Points */}
        <div className="dashboard-item bg-gradient-to-br from-blue-900/30 to-cyan-900/30 rounded-2xl p-6 border border-blue-700/30">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-8 h-8 text-blue-400" />
            <div className="text-lg font-bold text-white">Total Points</div>
          </div>
          <div className="text-3xl font-bold text-blue-300 mb-1">
            {profile.totalPoints > 0 ? '+' : ''}{profile.totalPoints}
          </div>
          <div className="text-sm text-gray-400">
            Portfolio performance
          </div>
        </div>

        {/* Streak */}
        <div className="dashboard-item bg-gradient-to-br from-orange-900/30 to-red-900/30 rounded-2xl p-6 border border-orange-700/30">
          <div className="flex items-center gap-3 mb-2">
            <Zap className="w-8 h-8 text-orange-400" />
            <div className="text-lg font-bold text-white">Streak</div>
          </div>
          <div className="text-3xl font-bold text-orange-300 mb-1">
            {profile.streak}
          </div>
          <div className="text-sm text-gray-400">
            Best: {profile.bestStreak}
          </div>
        </div>
      </div>

      {/* Rank Progression */}
      <div className="mt-6 p-4 bg-gray-800/30 rounded-xl border border-gray-700/30">
        <div className="flex items-center gap-2 mb-3">
          <Award className="w-5 h-5 text-yellow-400" />
          <span className="text-sm font-medium text-white">VC Rank Progression</span>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {INVESTOR_RANKS.map((rank, index) => (
            <div
              key={rank.level}
              className={`flex-shrink-0 flex flex-col items-center gap-1 p-2 rounded-lg transition-all duration-300 ${
                profile.level >= rank.level
                  ? 'bg-purple-600/30 border border-purple-500/50'
                  : profile.level === rank.level - 1
                  ? 'bg-gray-700/50 border border-gray-600/50 animate-pulse'
                  : 'bg-gray-800/30 border border-gray-700/30'
              }`}
            >
              <div 
                className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                style={{ backgroundColor: profile.level >= rank.level ? rank.color : '#6b7280' }}
              >
                {rank.icon}
              </div>
              <div className="text-xs text-center text-gray-300 max-w-16">
                {rank.name.split(' ')[0]}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InvestorDashboard;