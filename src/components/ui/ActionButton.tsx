import React, { useRef } from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';
import { useAnimations } from '../../hooks/useAnimations';

interface ActionButtonProps {
  onClick: () => void;
  disabled: boolean;
  isLoading: boolean;
  mode: 'roast' | 'fixit' | 'scorecard' | 'branding' | 'meme';
  icon: LucideIcon;
  loadingText: string;
  actionText: string;
}

const ActionButton: React.FC<ActionButtonProps> = ({
  onClick,
  disabled,
  isLoading,
  mode,
  icon: Icon,
  loadingText,
  actionText
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { pulseHover } = useAnimations();

  const modeColors = {
    roast: 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 focus:ring-purple-500/30 shadow-lg shadow-purple-600/25',
    fixit: 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 focus:ring-purple-500/30 shadow-lg shadow-purple-600/25',
    scorecard: 'bg-gradient-to-r from-purple-600 to-emerald-600 hover:from-purple-700 hover:to-emerald-700 focus:ring-purple-500/30 shadow-lg shadow-purple-600/25',
    branding: 'bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 focus:ring-purple-500/30 shadow-lg shadow-purple-600/25',
    meme: 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 focus:ring-purple-500/30 shadow-lg shadow-purple-600/25'
  };

  const handleClick = () => {
    if (buttonRef.current && !disabled) {
      pulseHover(buttonRef.current);
    }
    onClick();
  };

  return (
    <button
      ref={buttonRef}
      onClick={handleClick}
      disabled={disabled}
      className={`
        inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-white
        transition-all duration-300 transform hover:scale-105 active:scale-95
        focus:outline-none focus:ring-4 border border-purple-500/20
        disabled:bg-gray-700 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none
        disabled:opacity-50 hover:shadow-2xl
        ${modeColors[mode]}
      `}
    >
      {isLoading ? (
        <>
          <LoadingSpinner size="md" color="text-white" />
          <span className="animate-pulse">{loadingText}</span>
        </>
      ) : (
        <>
          <Icon className="w-5 h-5 transition-transform duration-300 group-hover:rotate-12" />
          {actionText}
        </>
      )}
    </button>
  );
};

export default ActionButton;