import React, { useEffect, useRef } from 'react';
import { Copy, RefreshCw, BarChart3 } from 'lucide-react';
import { useAnimations } from '../../hooks/useAnimations';

interface ScorecardResultProps {
  scorecardData: any;
  isLoading: boolean;
  error?: string;
  onCopy: () => void;
  onRegenerate: () => void;
}

const ScorecardResult: React.FC<ScorecardResultProps> = ({
  scorecardData,
  isLoading,
  error,
  onCopy,
  onRegenerate
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const scoresRef = useRef<HTMLDivElement>(null);
  const verdictRef = useRef<HTMLDivElement>(null);
  const { animateIn, staggerIn, progressBarFill, bounceIn, pulseHover } = useAnimations();

  const colors = {
    bg: 'bg-gradient-to-br from-purple-900/30 to-emerald-900/30',
    border: 'border-purple-500/50',
    iconBg: 'bg-gradient-to-br from-purple-600 to-emerald-600',
    textColor: 'text-purple-200',
    contentColor: 'text-gray-200',
    buttonColor: 'text-purple-300 hover:text-purple-200 hover:bg-purple-900/30'
  };

  useEffect(() => {
    if (!isLoading && scorecardData && cardRef.current) {
      // Animate card entrance
      animateIn(cardRef.current, {
        from: { opacity: 0, y: 50, scale: 0.95 },
        duration: 0.8
      });

      // Animate score bars with stagger
      if (scoresRef.current && scorecardData.scores) {
        const scoreElements = scoresRef.current.querySelectorAll('.score-item');
        staggerIn(Array.from(scoreElements), {
          from: { opacity: 0, x: -30 },
          duration: 0.6,
          stagger: 0.15,
          delay: 0.5
        });

        // Animate progress bars
        Object.entries(scorecardData.scores).filter(([key]) => key !== 'total').forEach(([key, score], index) => {
          const progressBar = scoresRef.current?.querySelector(`[data-score="${key}"] .progress-fill`);
          if (progressBar) {
            progressBarFill(progressBar as HTMLElement, `${score}%`, 0.8 + (index * 0.2));
          }
        });
      }

      // Bounce in the verdict
      if (verdictRef.current) {
        bounceIn(verdictRef.current, { delay: 2 });
      }
    }
  }, [isLoading, scorecardData, animateIn, staggerIn, progressBarFill, bounceIn]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-400 bg-emerald-500/20';
    if (score >= 60) return 'text-yellow-400 bg-yellow-500/20';
    if (score >= 40) return 'text-orange-400 bg-orange-500/20';
    return 'text-red-400 bg-red-500/20';
  };

  const getProgressColor = (score: number) => {
    if (score >= 80) return 'bg-emerald-500';
    if (score >= 60) return 'bg-yellow-500';
    if (score >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getTotalScoreColor = (total: number) => {
    if (total >= 400) return 'text-emerald-400';
    if (total >= 300) return 'text-yellow-400';
    if (total >= 200) return 'text-orange-400';
    return 'text-red-400';
  };

  const handleButtonClick = (callback: () => void) => (e: React.MouseEvent) => {
    const target = e.currentTarget;
    pulseHover(target);
    callback();
  };

  if (isLoading) {
    return (
      <div className={`rounded-2xl p-8 border-l-4 ${colors.bg} ${colors.border} animate-pulse backdrop-blur-sm shadow-2xl shadow-purple-900/20`}>
        <div className="flex items-center gap-4 mb-6">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${colors.iconBg} shadow-lg`}>
            <BarChart3 className="w-6 h-6 text-white animate-pulse" />
          </div>
          <div className={`text-xl font-bold ${colors.textColor}`}>
            AI is analyzing your pitch...
          </div>
        </div>
        
        {/* Loading Score Bars */}
        <div className="space-y-4">
          {['Originality', 'Market Size', 'Monetization', 'Clarity', 'Team Potential'].map((metric) => (
            <div key={metric} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-300">{metric}</span>
                <div className="w-8 h-4 bg-gray-700/50 rounded animate-pulse"></div>
              </div>
              <div className="w-full bg-gray-700/50 rounded-full h-2">
                <div className="bg-purple-500/50 h-2 rounded-full animate-pulse" style={{width: '60%'}}></div>
              </div>
            </div>
          ))}
        </div>
        
        <p className={`text-sm mt-6 ${colors.contentColor} opacity-75`}>
          Crunching numbers and preparing brutal honesty...
        </p>
      </div>
    );
  }

  if (!scorecardData) return null;

  return (
    <div 
      ref={cardRef}
      className={`rounded-2xl p-8 border-l-4 ${colors.bg} ${colors.border} transition-all duration-300 backdrop-blur-sm shadow-2xl shadow-purple-900/20`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${colors.iconBg} shadow-lg shadow-purple-600/25`}>
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
          <div className={`text-xl font-bold ${colors.textColor}`}>
            Your Startup Scorecard
          </div>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={handleButtonClick(onCopy)}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 border border-purple-700/30 ${colors.buttonColor} hover:scale-105 transform`}
            title="Copy scorecard"
          >
            <Copy className="w-4 h-4" />
            <span className="hidden sm:inline">Copy</span>
          </button>
          <button
            onClick={handleButtonClick(onRegenerate)}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 border border-purple-700/30 ${colors.buttonColor} hover:scale-105 transform`}
            title="Generate new scorecard"
          >
            <RefreshCw className="w-4 h-4" />
            <span className="hidden sm:inline">Rescore</span>
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-yellow-900/20 border border-yellow-700/50 rounded-xl backdrop-blur-sm animate-bounce">
          <div className="flex items-center gap-2 text-yellow-300 text-sm">
            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
            {error}
          </div>
        </div>
      )}

      {/* Score Breakdown */}
      {scorecardData.scores && (
        <div ref={scoresRef} className="space-y-6 mb-8">
          {Object.entries(scorecardData.scores).filter(([key]) => key !== 'total').map(([key, score]) => {
            const displayName = key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1');
            return (
              <div key={key} className="score-item space-y-2" data-score={key}>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-300">{displayName}</span>
                  <div className={`px-3 py-1 rounded-full text-xs font-bold ${getScoreColor(score as number)}`}>
                    {score}/100
                  </div>
                </div>
                <div className="w-full bg-gray-700/50 rounded-full h-2 overflow-hidden">
                  <div 
                    className={`progress-fill h-2 rounded-full transition-all duration-1000 ${getProgressColor(score as number)}`}
                    style={{width: '0%'}}
                  ></div>
                </div>
              </div>
            );
          })}
          
          {/* Total Score */}
          <div className="pt-4 border-t border-purple-700/30">
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold text-white">Total Score</span>
              <div className={`text-2xl font-bold ${getTotalScoreColor(scorecardData.scores.total)}`}>
                {scorecardData.scores.total}/500
              </div>
            </div>
            <div ref={verdictRef} className="mt-2 text-center">
              <span className="text-lg font-bold text-purple-300">{scorecardData.verdict}</span>
            </div>
          </div>
        </div>
      )}

      {/* Full Scorecard Text */}
      <div className={`leading-relaxed whitespace-pre-line ${colors.contentColor} text-base bg-gray-800/30 rounded-xl p-6 border border-purple-700/20`}>
        {scorecardData.scorecard}
      </div>
    </div>
  );
};

export default ScorecardResult;