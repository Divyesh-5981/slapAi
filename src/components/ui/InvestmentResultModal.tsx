import React, { useEffect, useRef } from 'react';
import { CheckCircle, XCircle, TrendingUp, TrendingDown, ArrowRight, Trophy } from 'lucide-react';
import { type InvestmentResult, type StartupPitch, type InvestorProfile } from '../../services/investorService';
import { useAnimations } from '../../hooks/useAnimations';

interface InvestmentResultModalProps {
  result: InvestmentResult;
  pitch: StartupPitch;
  profile: InvestorProfile;
  onNextRound: () => void;
  onClose: () => void;
}

const InvestmentResultModal: React.FC<InvestmentResultModalProps> = ({
  result,
  pitch,
  profile,
  onNextRound,
  onClose
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const { bounceIn, staggerIn, pulseHover } = useAnimations();

  useEffect(() => {
    if (modalRef.current) {
      bounceIn(modalRef.current, { delay: 0.2 });
    }
  }, [bounceIn]);

  const handleNextRound = (e: React.MouseEvent) => {
    pulseHover(e.currentTarget);
    onNextRound();
  };

  const getResultIcon = () => {
    if (result.correct) {
      return result.points > 10 ? (
        <CheckCircle className="w-16 h-16 text-emerald-400" />
      ) : (
        <CheckCircle className="w-16 h-16 text-blue-400" />
      );
    } else {
      return <XCircle className="w-16 h-16 text-red-400" />;
    }
  };

  const getResultColor = () => {
    if (result.correct) {
      return result.points > 10 ? 'emerald' : 'blue';
    } else {
      return 'red';
    }
  };

  const color = getResultColor();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div
        ref={modalRef}
        className={`bg-gradient-to-br from-gray-900/95 to-gray-800/95 border-2 border-${color}-500/50 rounded-3xl p-8 max-w-2xl mx-4 shadow-2xl backdrop-blur-sm`}
      >
        {/* Result Header */}
        <div className="text-center mb-8">
          <div className="mb-4">
            {getResultIcon()}
          </div>
          <h2 className={`text-3xl font-bold text-${color}-400 mb-2`}>
            {result.correct ? 'Correct Decision!' : 'Wrong Call!'}
          </h2>
          <div className="text-xl text-white mb-4">
            {result.points > 0 ? '+' : ''}{result.points} points
          </div>
        </div>

        {/* Company Outcome */}
        <div className="mb-8 p-6 bg-gray-800/50 rounded-2xl border border-gray-700/50">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-purple-400" />
            What Actually Happened
          </h3>
          <div className="space-y-4">
            <div className="text-lg text-gray-200">
              <strong>{pitch.companyName}</strong> {result.actualOutcome.toLowerCase()}
            </div>
            <p className="text-gray-300 leading-relaxed">
              {result.explanation}
            </p>
          </div>
        </div>

        {/* VC Reaction */}
        <div className="mb-8 p-6 bg-purple-900/20 rounded-2xl border border-purple-700/30">
          <h3 className="text-lg font-bold text-purple-300 mb-3">
            Senior Partner's Feedback:
          </h3>
          <p className="text-gray-200 italic text-lg">
            "{result.vcReaction}"
          </p>
        </div>

        {/* Updated Stats */}
        <div className="mb-8 grid grid-cols-3 gap-4">
          <div className="text-center p-4 bg-gray-800/30 rounded-xl">
            <div className="text-2xl font-bold text-white">{profile.accuracy}%</div>
            <div className="text-sm text-gray-400">Accuracy</div>
          </div>
          <div className="text-center p-4 bg-gray-800/30 rounded-xl">
            <div className="text-2xl font-bold text-white">{profile.totalDeals}</div>
            <div className="text-sm text-gray-400">Total Deals</div>
          </div>
          <div className="text-center p-4 bg-gray-800/30 rounded-xl">
            <div className="text-2xl font-bold text-white">{profile.streak}</div>
            <div className="text-sm text-gray-400">Current Streak</div>
          </div>
        </div>

        {/* Rank Progress */}
        <div className="mb-8 p-4 bg-yellow-900/20 rounded-xl border border-yellow-700/30">
          <div className="flex items-center gap-2 mb-2">
            <Trophy className="w-5 h-5 text-yellow-400" />
            <span className="text-lg font-bold text-white">Current Rank: {profile.rank}</span>
          </div>
          <div className="text-sm text-gray-300">
            Keep making smart decisions to climb the VC ladder!
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={handleNextRound}
            className="flex-1 inline-flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white font-bold rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg shadow-purple-600/25"
          >
            Next Deal
            <ArrowRight className="w-5 h-5" />
          </button>
          
          <button
            onClick={onClose}
            className="px-6 py-4 bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 hover:text-white font-bold rounded-2xl transition-all duration-300 transform hover:scale-105"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvestmentResultModal;