import React, { useState, useEffect, useRef } from 'react';
import { Trophy, Medal, Crown, Star, TrendingUp, Users, Calendar, Zap } from 'lucide-react';
import { useLoading } from '../context/LoadingContext';
import { getGlobalLeaderboard, getCurrentUser, getUserRankPosition, updateUserAlias, STARTUP_RANKS, calculateRank } from '../services/xpService';
import StatusBanner from '../components/ui/StatusBanner';
import { useAnimations } from '../hooks/useAnimations';

const LeaderboardMode: React.FC = () => {
  const { setIsPageLoading } = useLoading();
  const [leaderboard, setLeaderboard] = useState(getGlobalLeaderboard());
  const [currentUser, setCurrentUser] = useState(getCurrentUser());
  const [userPosition, setUserPosition] = useState(getUserRankPosition(currentUser.id));
  const [editingAlias, setEditingAlias] = useState(false);
  const [newAlias, setNewAlias] = useState(currentUser.alias);
  const [selectedTimeframe, setSelectedTimeframe] = useState<'all' | 'week' | 'month'>('all');

  const leaderboardRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const { animateIn, staggerIn, bounceIn, pulseHover } = useAnimations();

  useEffect(() => {
    setIsPageLoading(false);
  }, [setIsPageLoading]);

  useEffect(() => {
    // Refresh data
    const refreshData = () => {
      const updatedLeaderboard = getGlobalLeaderboard();
      const updatedUser = getCurrentUser();
      const updatedPosition = getUserRankPosition(updatedUser.id);
      
      setLeaderboard(updatedLeaderboard);
      setCurrentUser(updatedUser);
      setUserPosition(updatedPosition);
    };

    refreshData();
    
    // Refresh every 5 seconds
    const interval = setInterval(refreshData, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (leaderboardRef.current && statsRef.current) {
      staggerIn([statsRef.current, leaderboardRef.current], {
        from: { opacity: 0, y: 30 },
        duration: 0.8,
        stagger: 0.3
      });
    }
  }, [staggerIn]);

  const handleAliasUpdate = () => {
    if (newAlias.trim()) {
      const updatedUser = updateUserAlias(newAlias);
      setCurrentUser(updatedUser);
      setEditingAlias(false);
    }
  };

  const getRankIcon = (position: number) => {
    if (position === 1) return <Crown className="w-6 h-6 text-yellow-400" />;
    if (position === 2) return <Medal className="w-6 h-6 text-gray-400" />;
    if (position === 3) return <Medal className="w-6 h-6 text-amber-600" />;
    return <span className="text-lg font-bold text-gray-400">#{position}</span>;
  };

  const getPositionColor = (position: number) => {
    if (position === 1) return 'bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 border-yellow-500/50';
    if (position === 2) return 'bg-gradient-to-r from-gray-400/20 to-gray-500/20 border-gray-400/50';
    if (position === 3) return 'bg-gradient-to-r from-amber-600/20 to-amber-700/20 border-amber-600/50';
    return 'bg-gray-800/30 border-gray-700/50';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleButtonClick = (callback: () => void) => (e: React.MouseEvent) => {
    const target = e.currentTarget;
    pulseHover(target);
    callback();
  };

  return (
    <div className="space-y-8">
      {/* Status Banner */}
      <StatusBanner mode="leaderboard" />

      {/* User Stats Section */}
      <div 
        ref={statsRef}
        className="bg-gray-900/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-purple-800/30 p-8"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <Trophy className="w-8 h-8 text-yellow-400" />
            Your Startup Journey
          </h2>
          <div className="text-sm text-gray-400">
            Member since {formatDate(currentUser.joinDate)}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* User Profile */}
          <div className="bg-purple-900/20 rounded-2xl p-6 border border-purple-700/30">
            <div className="flex items-center gap-4 mb-4">
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold shadow-lg"
                style={{ backgroundColor: calculateRank(currentUser.xp).color }}
              >
                {calculateRank(currentUser.xp).icon}
              </div>
              <div className="flex-1">
                {editingAlias ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newAlias}
                      onChange={(e) => setNewAlias(e.target.value)}
                      className="flex-1 px-3 py-1 bg-gray-800 border border-purple-600 rounded text-white text-sm"
                      onKeyPress={(e) => e.key === 'Enter' && handleAliasUpdate()}
                      autoFocus
                    />
                    <button
                      onClick={handleAliasUpdate}
                      className="px-3 py-1 bg-purple-600 text-white rounded text-sm hover:bg-purple-700"
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <div 
                    onClick={() => setEditingAlias(true)}
                    className="text-lg font-bold text-white cursor-pointer hover:text-purple-300 transition-colors"
                  >
                    {currentUser.alias}
                  </div>
                )}
                <div className="text-sm text-purple-300">{currentUser.rank}</div>
              </div>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Global Rank:</span>
                <span className="text-white font-bold">
                  {userPosition > 0 ? `#${userPosition}` : 'Unranked'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Total XP:</span>
                <span className="text-purple-300 font-bold">{currentUser.xp.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Level:</span>
                <span className="text-white font-bold">{currentUser.level}</span>
              </div>
            </div>
          </div>

          {/* Activity Stats */}
          <div className="bg-blue-900/20 rounded-2xl p-6 border border-blue-700/30">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-blue-400" />
              Activity Stats
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Pitches Submitted:</span>
                <span className="text-white font-bold">{currentUser.totalPitches}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Roasts Generated:</span>
                <span className="text-white font-bold">{currentUser.totalRoasts}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">FixIts Used:</span>
                <span className="text-white font-bold">{currentUser.totalFixIts}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Memes Created:</span>
                <span className="text-white font-bold">{currentUser.totalMemes}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Voice Roasts:</span>
                <span className="text-white font-bold">{currentUser.totalVoiceRoasts}</span>
              </div>
            </div>
          </div>

          {/* Recent Achievement */}
          <div className="bg-emerald-900/20 rounded-2xl p-6 border border-emerald-700/30">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Star className="w-5 h-5 text-emerald-400" />
              Latest Pitch
            </h3>
            {currentUser.mostRoastedPitch ? (
              <div className="text-sm">
                <div className="text-gray-400 mb-2">Most Recent:</div>
                <div className="text-white italic bg-gray-800/50 p-3 rounded-lg">
                  "{currentUser.mostRoastedPitch.length > 100 
                    ? currentUser.mostRoastedPitch.substring(0, 100) + '...' 
                    : currentUser.mostRoastedPitch}"
                </div>
              </div>
            ) : (
              <div className="text-gray-400 text-sm">
                No pitches submitted yet. Start your journey!
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Global Leaderboard */}
      <div 
        ref={leaderboardRef}
        className="bg-gray-900/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-purple-800/30 overflow-hidden"
      >
        <div className="p-8 border-b border-purple-800/30">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <Users className="w-8 h-8 text-purple-400" />
              Global Leaderboard
            </h2>
            <div className="text-sm text-gray-400">
              {leaderboard.length} active entrepreneurs
            </div>
          </div>

          {/* Timeframe Filter */}
          <div className="flex gap-2">
            {(['all', 'week', 'month'] as const).map((timeframe) => (
              <button
                key={timeframe}
                onClick={handleButtonClick(() => setSelectedTimeframe(timeframe))}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                  selectedTimeframe === timeframe
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-800/50 text-gray-300 hover:bg-purple-900/30'
                }`}
              >
                {timeframe === 'all' ? 'All Time' : `This ${timeframe.charAt(0).toUpperCase() + timeframe.slice(1)}`}
              </button>
            ))}
          </div>
        </div>

        {/* Leaderboard List */}
        <div className="p-8">
          {leaderboard.length === 0 ? (
            <div className="text-center py-12">
              <Trophy className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <div className="text-xl text-gray-400 mb-2">No entrepreneurs yet!</div>
              <div className="text-sm text-gray-500">Be the first to submit a pitch and claim the top spot!</div>
            </div>
          ) : (
            <div className="space-y-4">
              {leaderboard.slice(0, 50).map((user, index) => {
                const position = index + 1;
                const isCurrentUser = user.id === currentUser.id;
                const userRank = calculateRank(user.xp);
                
                return (
                  <div
                    key={user.id}
                    className={`flex items-center gap-4 p-4 rounded-2xl border transition-all duration-300 hover:scale-[1.02] ${
                      isCurrentUser 
                        ? 'bg-purple-900/30 border-purple-500/50 ring-2 ring-purple-500/30' 
                        : getPositionColor(position)
                    }`}
                  >
                    {/* Position */}
                    <div className="w-12 flex justify-center">
                      {getRankIcon(position)}
                    </div>

                    {/* User Info */}
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold shadow-lg"
                      style={{ backgroundColor: userRank.color }}
                    >
                      {userRank.icon}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <div className={`font-bold ${isCurrentUser ? 'text-purple-300' : 'text-white'}`}>
                          {user.alias}
                        </div>
                        {isCurrentUser && (
                          <span className="text-xs bg-purple-600 text-white px-2 py-1 rounded-full">
                            You
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-400">{userRank.name}</div>
                    </div>

                    {/* Stats */}
                    <div className="text-right">
                      <div className="text-lg font-bold text-white">
                        {user.xp.toLocaleString()} XP
                      </div>
                      <div className="text-sm text-gray-400">
                        Level {user.level}
                      </div>
                    </div>

                    {/* Activity Indicator */}
                    <div className="text-right text-xs text-gray-500">
                      <div>{user.totalPitches} pitches</div>
                      <div>{user.totalRoasts} roasts</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Rank System Info */}
      <div className="bg-gray-900/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-purple-800/30 p-8">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
          <TrendingUp className="w-8 h-8 text-green-400" />
          Startup Rank System
        </h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {STARTUP_RANKS.map((rank, index) => (
            <div
              key={rank.level}
              className={`p-4 rounded-xl border transition-all duration-300 hover:scale-105 ${
                currentUser.level === rank.level
                  ? 'bg-purple-900/30 border-purple-500/50 ring-2 ring-purple-500/30'
                  : 'bg-gray-800/30 border-gray-700/50 hover:border-purple-600/50'
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                  style={{ backgroundColor: rank.color }}
                >
                  {rank.icon}
                </div>
                <div>
                  <div className="font-bold text-white text-sm">{rank.name}</div>
                  <div className="text-xs text-gray-400">Level {rank.level}</div>
                </div>
              </div>
              <div className="text-xs text-gray-400">
                {rank.minXP.toLocaleString()}+ XP required
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LeaderboardMode;