import React, { useEffect, useRef } from 'react';
import { Zap, Target, BarChart3, Palette, Image, Trophy, TrendingUp, DivideIcon as LucideIcon } from 'lucide-react';
import { Mode } from '../../types';
import { useAnimations } from '../../hooks/useAnimations';

interface StatusBannerProps {
  mode: Mode | 'leaderboard' | 'investor';
}

const StatusBanner: React.FC<StatusBannerProps> = ({ mode }) => {
  const bannerRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);
  const currentMode = useRef<Mode | 'leaderboard' | 'investor'>(mode);
  const { animateIn, staggerIn } = useAnimations();

  const modeConfig = {
    roast: {
      icon: Zap,
      title: 'Dynamic AI Roast Engine: Online',
      description: 'Powered by Bolt\'s built-in AI. Every roast is freshly generated and uniquely brutal - no templates, just pure AI creativity!',
      bgColor: 'bg-gradient-to-r from-emerald-900/30 to-green-900/30',
      borderColor: 'border-emerald-500/50',
      textColor: 'text-emerald-200',
      iconColor: 'text-emerald-400'
    },
    fixit: {
      icon: Target,
      title: 'AI Pitch Doctor: Ready to Fix',
      description: 'Transform vague, buzzword-heavy pitches into sharp, investor-ready versions. Every rewrite is tailored to your specific idea.',
      bgColor: 'bg-gradient-to-r from-blue-900/30 to-cyan-900/30',
      borderColor: 'border-blue-500/50',
      textColor: 'text-blue-200',
      iconColor: 'text-blue-400'
    },
    scorecard: {
      icon: BarChart3,
      title: 'AI Scorecard Engine: Ready to Judge',
      description: 'Rate your startup across key metrics: Originality, Market Size, Monetization, Clarity, and Team Potential. Get brutal but actionable feedback.',
      bgColor: 'bg-gradient-to-r from-emerald-900/30 to-green-900/30',
      borderColor: 'border-emerald-500/50',
      textColor: 'text-emerald-200',
      iconColor: 'text-emerald-400'
    },
    branding: {
      icon: Palette,
      title: 'Branding Doctor: Ready to Rebrand',
      description: 'Get AI-powered suggestions for memorable company names, witty taglines, and sharp positioning statements. Stand out in a crowded market.',
      bgColor: 'bg-gradient-to-r from-purple-900/30 to-violet-900/30',
      borderColor: 'border-purple-500/50',
      textColor: 'text-purple-200',
      iconColor: 'text-purple-400'
    },
    meme: {
      icon: Image,
      title: 'Meme Generator: Ready to Meme-ify',
      description: 'Turn your startup pitch into viral-worthy memes with smart template matching and sarcastic captions. Perfect for sharing your roast!',
      bgColor: 'bg-gradient-to-r from-pink-900/30 to-purple-900/30',
      borderColor: 'border-pink-500/50',
      textColor: 'text-pink-200',
      iconColor: 'text-pink-400'
    },
    leaderboard: {
      icon: Trophy,
      title: 'Leaderboard: Compete & Rank Up',
      description: 'Track your XP, climb the startup ranks, and compete with entrepreneurs worldwide. From Pre-Seedling to Pitch Slap Legend!',
      bgColor: 'bg-gradient-to-r from-yellow-900/30 to-amber-900/30',
      borderColor: 'border-yellow-500/50',
      textColor: 'text-yellow-200',
      iconColor: 'text-yellow-400'
    },
    investor: {
      icon: TrendingUp,
      title: 'Investor Simulator: Ready to Invest',
      description: 'Step into the shoes of a VC! Evaluate dynamic startup pitches, make investment decisions, and climb from intern to legendary investor.',
      bgColor: 'bg-gradient-to-r from-indigo-900/30 to-blue-900/30',
      borderColor: 'border-indigo-500/50',
      textColor: 'text-indigo-200',
      iconColor: 'text-indigo-400'
    }
  };

  const config = modeConfig[mode];
  const Icon = config.icon;

  useEffect(() => {
    // Only animate on initial mount or when mode actually changes
    const modeChanged = currentMode.current !== mode;
    
    if ((!hasAnimated.current || modeChanged) && bannerRef.current && iconRef.current && contentRef.current) {
      hasAnimated.current = true;
      currentMode.current = mode;
      
      // Animate banner entrance
      animateIn(bannerRef.current, {
        from: { opacity: 0, y: -30 },
        duration: 0.8
      });

      // Stagger animate internal elements
      staggerIn([iconRef.current, contentRef.current], {
        from: { opacity: 0, x: -20 },
        duration: 0.6,
        stagger: 0.2,
        delay: 0.3
      });
    }
  }, [mode, animateIn, staggerIn]); // Only depend on mode changes

  return (
    <div 
      ref={bannerRef}
      className={`border rounded-2xl p-6 ${config.bgColor} ${config.borderColor} transition-all duration-300 backdrop-blur-sm shadow-xl shadow-purple-900/10 hover:shadow-purple-900/20 hover:scale-[1.02] transform`}
    >
      <div className="flex items-start gap-4">
        <div 
          ref={iconRef}
          className={`p-3 rounded-xl bg-gray-900/50 backdrop-blur-sm ${config.iconColor} shadow-lg hover:scale-110 transform transition-all duration-300`}
        >
          <Icon className="w-6 h-6" />
        </div>
        <div ref={contentRef} className={config.textColor}>
          <h3 className="font-bold text-lg mb-2">{config.title}</h3>
          <p className="text-sm leading-relaxed opacity-90">{config.description}</p>
        </div>
      </div>
    </div>
  );
};

export default StatusBanner;