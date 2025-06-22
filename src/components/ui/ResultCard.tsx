import React, { useEffect, useRef } from 'react';
import { Copy, RefreshCw, DivideIcon as LucideIcon } from 'lucide-react';
import { Mode } from '../../types';
import { useAnimations } from '../../hooks/useAnimations';
import VoiceRoast from './VoiceRoast';

interface ResultCardProps {
  mode: Mode;
  result: string;
  isLoading: boolean;
  error?: string;
  onCopy: () => void;
  onRegenerate: () => void;
  icon: LucideIcon;
  title: string;
  loadingTitle: string;
  loadingDescription: string;
}

const ResultCard: React.FC<ResultCardProps> = ({
  mode,
  result,
  isLoading,
  error,
  onCopy,
  onRegenerate,
  icon: Icon,
  title,
  loadingTitle,
  loadingDescription
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const voiceRoastRef = useRef<HTMLDivElement>(null);
  const { animateIn, slideUpReveal, flameEffect, staggerIn, pulseHover } = useAnimations();

  const modeColors = {
    roast: {
      bg: 'bg-gradient-to-br from-purple-900/30 to-pink-900/30',
      border: 'border-purple-500/50',
      iconBg: 'bg-gradient-to-br from-purple-600 to-pink-600',
      textColor: 'text-purple-200',
      contentColor: 'text-gray-200',
      buttonColor: 'text-purple-300 hover:text-purple-200 hover:bg-purple-900/30'
    },
    fixit: {
      bg: 'bg-gradient-to-br from-purple-900/30 to-blue-900/30',
      border: 'border-purple-500/50',
      iconBg: 'bg-gradient-to-br from-purple-600 to-blue-600',
      textColor: 'text-purple-200',
      contentColor: 'text-gray-200',
      buttonColor: 'text-purple-300 hover:text-purple-200 hover:bg-purple-900/30'
    },
    scorecard: {
      bg: 'bg-gradient-to-br from-purple-900/30 to-emerald-900/30',
      border: 'border-purple-500/50',
      iconBg: 'bg-gradient-to-br from-purple-600 to-emerald-600',
      textColor: 'text-purple-200',
      contentColor: 'text-gray-200',
      buttonColor: 'text-purple-300 hover:text-purple-200 hover:bg-purple-900/30'
    },
    branding: {
      bg: 'bg-gradient-to-br from-purple-900/30 to-violet-900/30',
      border: 'border-purple-500/50',
      iconBg: 'bg-gradient-to-br from-purple-600 to-violet-600',
      textColor: 'text-purple-200',
      contentColor: 'text-gray-200',
      buttonColor: 'text-purple-300 hover:text-purple-200 hover:bg-purple-900/30'
    },
    meme: {
      bg: 'bg-gradient-to-br from-purple-900/30 to-pink-900/30',
      border: 'border-purple-500/50',
      iconBg: 'bg-gradient-to-br from-purple-600 to-pink-600',
      textColor: 'text-purple-200',
      contentColor: 'text-gray-200',
      buttonColor: 'text-purple-300 hover:text-purple-200 hover:bg-purple-900/30'
    }
  };

  const colors = modeColors[mode];

  useEffect(() => {
    if (!isLoading && result && cardRef.current) {
      // Animate the entire card entrance
      animateIn(cardRef.current, {
        from: { opacity: 0, y: 50, scale: 0.95 },
        duration: 0.8,
        ease: "power3.out"
      });

      // Stagger animate internal elements
      if (headerRef.current && contentRef.current && buttonsRef.current) {
        staggerIn([headerRef.current, contentRef.current, buttonsRef.current], {
          from: { opacity: 0, y: 20 },
          duration: 0.6,
          stagger: 0.2,
          delay: 0.3
        });
      }

      // Special flame effect for roast mode
      if (mode === 'roast' && headerRef.current) {
        const iconElement = headerRef.current.querySelector('.mode-icon');
        if (iconElement) {
          flameEffect(iconElement as HTMLElement);
        }
      }

      // Animate VoiceRoast component for roast mode
      if (mode === 'roast' && voiceRoastRef.current) {
        animateIn(voiceRoastRef.current, {
          from: { opacity: 0, y: 30 },
          duration: 0.6,
          delay: 1.0
        });
      }
    }
  }, [isLoading, result, mode, animateIn, staggerIn, flameEffect]);

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
            <Icon className="w-6 h-6 text-white animate-pulse" />
          </div>
          <div className={`text-xl font-bold ${colors.textColor}`}>
            {loadingTitle}
          </div>
        </div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-700/50 rounded animate-pulse"></div>
          <div className="h-4 bg-gray-700/50 rounded animate-pulse w-3/4"></div>
          <div className="h-4 bg-gray-700/50 rounded animate-pulse w-1/2"></div>
        </div>
        <p className={`text-sm mt-4 ${colors.contentColor} opacity-75 animate-pulse`}>
          {loadingDescription}
        </p>
      </div>
    );
  }

  return (
    <div 
      ref={cardRef}
      className={`rounded-2xl p-8 border-l-4 ${colors.bg} ${colors.border} transition-all duration-300 backdrop-blur-sm shadow-2xl shadow-purple-900/20 hover:shadow-purple-900/30`}
    >
      {/* Header */}
      <div 
        ref={headerRef}
        className="flex items-start justify-between mb-6"
      >
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${colors.iconBg} shadow-lg shadow-purple-600/25`}>
            <Icon className="w-6 h-6 text-white mode-icon" />
          </div>
          <div className={`text-xl font-bold ${colors.textColor}`}>
            {title}
          </div>
        </div>
        
        <div 
          ref={buttonsRef}
          className="flex gap-2"
        >
          <button
            onClick={handleButtonClick(onCopy)}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 border border-purple-700/30 ${colors.buttonColor} hover:scale-105 transform`}
            title="Copy result"
          >
            <Copy className="w-4 h-4" />
            <span className="hidden sm:inline">Copy</span>
          </button>
          <button
            onClick={handleButtonClick(onRegenerate)}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 border border-purple-700/30 ${colors.buttonColor} hover:scale-105 transform`}
            title="Generate new result"
          >
            <RefreshCw className="w-4 h-4" />
            <span className="hidden sm:inline">Regenerate</span>
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-yellow-900/20 border border-yellow-700/50 rounded-xl backdrop-blur-sm animate-bounce">
          <div className="flex items-center gap-2 text-yellow-300 text-sm">
            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
            {error}
          </div>
        </div>
      )}

      {/* Content */}
      <div 
        ref={contentRef}
        className={`leading-relaxed whitespace-pre-line ${colors.contentColor} text-base`}
      >
        {result}
      </div>

      {/* VoiceRoast Component - Only for Roast Mode */}
      {mode === 'roast' && result && (
        <div ref={voiceRoastRef}>
          <VoiceRoast 
            roastText={result}
            onError={(error) => console.error('VoiceRoast error:', error)}
          />
        </div>
      )}
    </div>
  );
};

export default ResultCard;