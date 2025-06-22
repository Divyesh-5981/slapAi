import React, { useState, useRef } from 'react';
import { DollarSign, X, ThumbsUp, ThumbsDown } from 'lucide-react';
import { type InvestmentDecision } from '../../services/investorService';
import { useAnimations } from '../../hooks/useAnimations';

interface InvestmentDecisionPanelProps {
  onDecision: (decision: InvestmentDecision) => void;
}

const InvestmentDecisionPanel: React.FC<InvestmentDecisionPanelProps> = ({ onDecision }) => {
  const [selectedDecision, setSelectedDecision] = useState<'invest' | 'pass' | null>(null);
  const [confidence, setConfidence] = useState(3);
  const [reasoning, setReasoning] = useState('');
  const panelRef = useRef<HTMLDivElement>(null);
  const { pulseHover, animateIn } = useAnimations();

  const handleSubmit = () => {
    if (!selectedDecision) return;

    const decision: InvestmentDecision = {
      decision: selectedDecision,
      confidence,
      reasoning: reasoning.trim() || undefined
    };

    onDecision(decision);
  };

  const handleButtonClick = (callback: () => void) => (e: React.MouseEvent) => {
    const target = e.currentTarget;
    pulseHover(target);
    callback();
  };

  const confidenceLabels = {
    1: 'Very Uncertain',
    2: 'Somewhat Uncertain', 
    3: 'Neutral',
    4: 'Somewhat Confident',
    5: 'Very Confident'
  };

  return (
    <div 
      ref={panelRef}
      className="mt-8 bg-gray-800/50 rounded-2xl p-8 border border-gray-700/50"
    >
      <h3 className="text-2xl font-bold text-white mb-6 text-center">
        Make Your Investment Decision
      </h3>

      {/* Decision Buttons */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <button
          onClick={() => setSelectedDecision('invest')}
          className={`p-6 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 ${
            selectedDecision === 'invest'
              ? 'bg-emerald-600/30 border-emerald-500 text-emerald-200'
              : 'bg-gray-800/30 border-gray-600 text-gray-300 hover:border-emerald-600/50'
          }`}
        >
          <div className="flex items-center justify-center gap-3 mb-3">
            <DollarSign className="w-8 h-8" />
            <span className="text-2xl font-bold">INVEST</span>
          </div>
          <p className="text-sm opacity-80">
            This startup has potential. I want to invest in this opportunity.
          </p>
        </button>

        <button
          onClick={() => setSelectedDecision('pass')}
          className={`p-6 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 ${
            selectedDecision === 'pass'
              ? 'bg-red-600/30 border-red-500 text-red-200'
              : 'bg-gray-800/30 border-gray-600 text-gray-300 hover:border-red-600/50'
          }`}
        >
          <div className="flex items-center justify-center gap-3 mb-3">
            <X className="w-8 h-8" />
            <span className="text-2xl font-bold">PASS</span>
          </div>
          <p className="text-sm opacity-80">
            Too risky or not compelling enough. I'll pass on this deal.
          </p>
        </button>
      </div>

      {/* Confidence Level */}
      {selectedDecision && (
        <div className="mb-6">
          <label className="block text-lg font-medium text-white mb-4">
            Confidence Level: {confidenceLabels[confidence as keyof typeof confidenceLabels]}
          </label>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-400">Low</span>
            <input
              type="range"
              min="1"
              max="5"
              value={confidence}
              onChange={(e) => setConfidence(parseInt(e.target.value))}
              className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
            />
            <span className="text-sm text-gray-400">High</span>
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            {Object.values(confidenceLabels).map((label, index) => (
              <span key={index} className={confidence === index + 1 ? 'text-purple-400 font-bold' : ''}>
                {index + 1}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Optional Reasoning */}
      {selectedDecision && (
        <div className="mb-8">
          <label className="block text-lg font-medium text-white mb-3">
            Investment Reasoning (Optional)
          </label>
          <textarea
            value={reasoning}
            onChange={(e) => setReasoning(e.target.value)}
            placeholder="Why did you make this decision? What factors influenced your choice?"
            className="w-full h-24 p-4 bg-gray-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 resize-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300"
            maxLength={200}
          />
          <div className="text-xs text-gray-400 mt-2">
            {reasoning.length}/200 characters
          </div>
        </div>
      )}

      {/* Submit Button */}
      <div className="text-center">
        <button
          onClick={handleButtonClick(handleSubmit)}
          disabled={!selectedDecision}
          className={`inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-bold transition-all duration-300 transform ${
            selectedDecision
              ? 'bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white hover:scale-105 shadow-lg shadow-purple-600/25'
              : 'bg-gray-700 text-gray-400 cursor-not-allowed'
          }`}
        >
          {selectedDecision === 'invest' ? (
            <ThumbsUp className="w-5 h-5" />
          ) : selectedDecision === 'pass' ? (
            <ThumbsDown className="w-5 h-5" />
          ) : (
            <DollarSign className="w-5 h-5" />
          )}
          {selectedDecision ? `Confirm ${selectedDecision.toUpperCase()}` : 'Select Your Decision'}
        </button>
      </div>
    </div>
  );
};

export default InvestmentDecisionPanel;