import React, { useState, useEffect, useRef } from 'react';
import { TrendingUp, DollarSign, Target, Brain, Clock, Award, RefreshCw } from 'lucide-react';
import { useLoading } from '../context/LoadingContext';
import { 
  generateRandomPitch, 
  evaluateInvestment, 
  getInvestorProfile, 
  updateInvestorProfile,
  getRankProgress,
  INVESTOR_RANKS,
  type StartupPitch, 
  type InvestmentDecision, 
  type InvestmentResult 
} from '../services/investorService';
import { awardXP } from '../services/xpService';
import StatusBanner from '../components/ui/StatusBanner';
import InvestorDashboard from '../components/ui/InvestorDashboard';
import PitchPresentation from '../components/ui/PitchPresentation';
import InvestmentDecisionPanel from '../components/ui/InvestmentDecisionPanel';
import InvestmentResultModal from '../components/ui/InvestmentResultModal';
import { useAnimations } from '../hooks/useAnimations';

const InvestorMode: React.FC = () => {
  const { setIsPageLoading, setLoadingMessage } = useLoading();
  const [currentPitch, setCurrentPitch] = useState<StartupPitch | null>(null);
  const [investorProfile, setInvestorProfile] = useState(getInvestorProfile());
  const [showResult, setShowResult] = useState(false);
  const [lastResult, setLastResult] = useState<InvestmentResult | null>(null);
  const [isRevealing, setIsRevealing] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [roundNumber, setRoundNumber] = useState(1);

  const containerRef = useRef<HTMLDivElement>(null);
  const { animateIn, staggerIn } = useAnimations();

  useEffect(() => {
    setIsPageLoading(false);
  }, [setIsPageLoading]);

  useEffect(() => {
    if (containerRef.current) {
      animateIn(containerRef.current, {
        from: { opacity: 0, y: 30 },
        duration: 0.8
      });
    }
  }, [animateIn]);

  const startNewRound = () => {
    const newPitch = generateRandomPitch();
    setCurrentPitch(newPitch);
    setShowResult(false);
    setLastResult(null);
    setIsRevealing(false);
    setGameStarted(true);
  };

  const handleInvestmentDecision = async (decision: InvestmentDecision) => {
    if (!currentPitch) return;

    setLoadingMessage('Analyzing investment outcome...');
    setIsPageLoading(true);
    setIsRevealing(true);

    // Simulate dramatic reveal delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    const result = evaluateInvestment(currentPitch, decision);
    const updatedProfile = updateInvestorProfile(result.correct, result.points);
    
    // Award XP for making investment decisions
    awardXP('pitch_submit', `Investment decision on ${currentPitch.companyName}`);
    
    setLastResult(result);
    setInvestorProfile(updatedProfile);
    setShowResult(true);
    setIsRevealing(false);
    setRoundNumber(prev => prev + 1);
    setIsPageLoading(false);
  };

  const handleNextRound = () => {
    startNewRound();
  };

  const resetGame = () => {
    setGameStarted(false);
    setCurrentPitch(null);
    setShowResult(false);
    setLastResult(null);
    setRoundNumber(1);
  };

  return (
    <div ref={containerRef} className="space-y-8">
      {/* Status Banner */}
      <StatusBanner mode="investor" />

      {/* Investor Dashboard */}
      <InvestorDashboard 
        profile={investorProfile}
        roundNumber={roundNumber}
        onReset={resetGame}
      />

      {/* Main Game Area */}
      <div className="bg-gray-900/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-purple-800/30 overflow-hidden">
        {!gameStarted ? (
          /* Welcome Screen */
          <div className="p-12 text-center">
            <div className="mb-8">
              <TrendingUp className="w-20 h-20 text-purple-400 mx-auto mb-6" />
              <h2 className="text-3xl font-bold text-white mb-4">
                Welcome to the Investor Simulator
              </h2>
              <p className="text-xl text-gray-300 mb-6 max-w-2xl mx-auto">
                Step into the shoes of a venture capitalist. Evaluate startup pitches, make investment decisions, 
                and see if you have what it takes to spot the next unicorn!
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-8 max-w-4xl mx-auto">
              <div className="bg-purple-900/20 rounded-2xl p-6 border border-purple-700/30">
                <Brain className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-white mb-2">Analyze Pitches</h3>
                <p className="text-sm text-gray-300">
                  Read startup pitches and identify red flags, green flags, and market opportunities.
                </p>
              </div>
              
              <div className="bg-blue-900/20 rounded-2xl p-6 border border-blue-700/30">
                <Target className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-white mb-2">Make Decisions</h3>
                <p className="text-sm text-gray-300">
                  Choose to invest or pass on each opportunity. Your accuracy determines your VC rank.
                </p>
              </div>
              
              <div className="bg-emerald-900/20 rounded-2xl p-6 border border-emerald-700/30">
                <Award className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-white mb-2">Climb the Ranks</h3>
                <p className="text-sm text-gray-300">
                  Start as an intern and work your way up to legendary VC status through smart investments.
                </p>
              </div>
            </div>

            <button
              onClick={startNewRound}
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white font-bold rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg shadow-purple-600/25"
            >
              <DollarSign className="w-6 h-6" />
              Start Investing
            </button>
          </div>
        ) : (
          /* Game Interface */
          <div className="p-8">
            {currentPitch && !showResult && (
              <>
                <PitchPresentation 
                  pitch={currentPitch}
                  roundNumber={roundNumber}
                  isRevealing={isRevealing}
                />
                
                {!isRevealing && (
                  <InvestmentDecisionPanel 
                    onDecision={handleInvestmentDecision}
                  />
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* Investment Result Modal */}
      {showResult && lastResult && currentPitch && (
        <InvestmentResultModal
          result={lastResult}
          pitch={currentPitch}
          profile={investorProfile}
          onNextRound={handleNextRound}
          onClose={() => setShowResult(false)}
        />
      )}
    </div>
  );
};

export default InvestorMode;