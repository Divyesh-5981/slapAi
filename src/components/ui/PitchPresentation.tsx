import React, { useRef, useEffect } from 'react';
import { Building2, Users, TrendingUp, DollarSign, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { type StartupPitch } from '../../services/investorService';
import { useAnimations } from '../../hooks/useAnimations';

interface PitchPresentationProps {
  pitch: StartupPitch;
  roundNumber: number;
  isRevealing: boolean;
}

const PitchPresentation: React.FC<PitchPresentationProps> = ({ pitch, roundNumber, isRevealing }) => {
  const presentationRef = useRef<HTMLDivElement>(null);
  const { animateIn, staggerIn, typewriterEffect } = useAnimations();

  useEffect(() => {
    if (presentationRef.current) {
      const elements = presentationRef.current.querySelectorAll('.pitch-element');
      staggerIn(Array.from(elements), {
        from: { opacity: 0, y: 30 },
        duration: 0.8,
        stagger: 0.2
      });
    }
  }, [pitch.id, staggerIn]);

  if (isRevealing) {
    return (
      <div className="text-center py-16">
        <div className="mb-8">
          <Clock className="w-16 h-16 text-purple-400 mx-auto mb-4 animate-spin" />
          <h3 className="text-2xl font-bold text-white mb-2">
            Analyzing Investment Outcome...
          </h3>
          <p className="text-gray-300">
            Our crystal ball is consulting the startup gods...
          </p>
        </div>
        
        <div className="flex justify-center gap-2">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="w-3 h-3 bg-purple-500 rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div ref={presentationRef} className="space-y-8">
      {/* Header */}
      <div className="pitch-element text-center">
        <div className="inline-flex items-center gap-2 bg-purple-900/30 text-purple-300 px-4 py-2 rounded-full text-sm font-medium border border-purple-700/50 mb-4">
          <Building2 className="w-4 h-4" />
          Deal #{roundNumber} • {pitch.category}
        </div>
        <h2 className="text-3xl font-bold text-white mb-2">
          {pitch.companyName}
        </h2>
        <div className="text-lg text-gray-300">
          Seeking {pitch.valuation} investment
        </div>
      </div>

      {/* Main Pitch */}
      <div className="pitch-element bg-gray-800/50 rounded-2xl p-8 border border-gray-700/50">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Building2 className="w-6 h-6 text-purple-400" />
          The Pitch
        </h3>
        <p className="text-lg text-gray-200 leading-relaxed">
          {pitch.pitch}
        </p>
      </div>

      {/* Company Details */}
      <div className="pitch-element grid md:grid-cols-2 gap-6">
        {/* Founders & Team */}
        <div className="bg-blue-900/20 rounded-2xl p-6 border border-blue-700/30">
          <h4 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-400" />
            Founders & Team
          </h4>
          <p className="text-gray-200">
            {pitch.founders}
          </p>
        </div>

        {/* Traction */}
        <div className="bg-emerald-900/20 rounded-2xl p-6 border border-emerald-700/30">
          <h4 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
            Traction & Metrics
          </h4>
          <p className="text-gray-200">
            {pitch.traction}
          </p>
        </div>
      </div>

      {/* Investment Highlights */}
      <div className="pitch-element">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <DollarSign className="w-6 h-6 text-yellow-400" />
          Investment Analysis
        </h3>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* Green Flags */}
          {pitch.greenFlags && pitch.greenFlags.length > 0 && (
            <div className="bg-emerald-900/20 rounded-2xl p-6 border border-emerald-700/30">
              <h4 className="text-lg font-bold text-emerald-300 mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Potential Strengths
              </h4>
              <ul className="space-y-2">
                {pitch.greenFlags.map((flag, index) => (
                  <li key={index} className="text-gray-200 flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                    {flag}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Red Flags */}
          {pitch.redFlags && pitch.redFlags.length > 0 && (
            <div className="bg-red-900/20 rounded-2xl p-6 border border-red-700/30">
              <h4 className="text-lg font-bold text-red-300 mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Potential Concerns
              </h4>
              <ul className="space-y-2">
                {pitch.redFlags.map((flag, index) => (
                  <li key={index} className="text-gray-200 flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                    {flag}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Investment Prompt */}
      <div className="pitch-element text-center bg-gradient-to-r from-purple-900/30 to-violet-900/30 rounded-2xl p-8 border border-purple-700/30">
        <h3 className="text-2xl font-bold text-white mb-4">
          What's Your Investment Decision?
        </h3>
        <p className="text-gray-300 text-lg">
          You have 60 seconds to decide. Will you invest in {pitch.companyName} or pass on this opportunity?
        </p>
      </div>
    </div>
  );
};

export default PitchPresentation;