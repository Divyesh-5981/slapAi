import React, { useEffect, useRef } from 'react';
import { Mode } from '../../types';
import { useAnimations } from '../../hooks/useAnimations';

interface PitchInputProps {
  pitch: string;
  setPitch: (pitch: string) => void;
  mode: Mode;
  maxLength?: number;
}

const PitchInput: React.FC<PitchInputProps> = ({ 
  pitch, 
  setPitch, 
  mode, 
  maxLength = 500 
}) => {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const counterRef = useRef<HTMLDivElement>(null);
  const { animateIn, staggerIn, typewriterEffect } = useAnimations();
  const hasAnimated = useRef(false);

  const modeConfig = {
    roast: {
      title: 'Drop your startup pitch below 👇',
      description: 'Describe your startup idea, business model, or pitch. The more details, the more creative our AI gets with the roast.',
      placeholder: "e.g., 'We're building an AI-powered app that uses blockchain to revolutionize how people share photos of their food...'"
    },
    fixit: {
      title: 'Share your pitch for a professional rewrite ✨',
      description: 'Paste your current pitch, elevator speech, or startup description. Our AI will transform it into a clear, compelling version that investors will actually understand.',
      placeholder: "e.g., 'We're leveraging cutting-edge AI to disrupt the traditional paradigm of food photography through our innovative blockchain-powered social ecosystem...'"
    },
    scorecard: {
      title: 'Submit your pitch for scoring 📊',
      description: 'Share your startup idea and get scored across key metrics: Clarity, Market Fit, Monetization, and Originality.',
      placeholder: "e.g., 'Our B2B SaaS platform helps small businesses automate their customer service using AI chatbots...'"
    },
    branding: {
      title: 'Describe your startup for branding help 🎨',
      description: 'Tell us about your startup and target market. We\'ll suggest better names, taglines, and positioning strategies.',
      placeholder: "e.g., 'We help remote teams collaborate better through video-first project management tools...'"
    },
    meme: {
      title: 'Share your pitch for meme-ification 🎭',
      description: 'Drop your startup pitch and watch our AI turn it into a viral-worthy meme. Perfect for sharing your roast with the world!',
      placeholder: "e.g., 'We're disrupting the pet industry with an AI-powered blockchain solution for dog walking...'"
    }
  };

  const config = modeConfig[mode];

  useEffect(() => {
    // Only animate on initial mount or mode change, not on every render
    if (!hasAnimated.current && titleRef.current && descriptionRef.current && textareaRef.current) {
      hasAnimated.current = true;
      
      staggerIn([titleRef.current, descriptionRef.current, textareaRef.current], {
        from: { opacity: 0, y: 30 },
        duration: 0.7,
        stagger: 0.15
      });

      // Typewriter effect for placeholder (only if textarea is empty and not focused)
      if (!pitch && textareaRef.current && document.activeElement !== textareaRef.current) {
        const cleanup = typewriterEffect(
          textareaRef.current, 
          config.placeholder, 
          30
        );
        
        return cleanup;
      }
    }
  }, [mode]); // Only depend on mode, not on every state change

  useEffect(() => {
    // Reset animation flag when mode changes
    hasAnimated.current = false;
  }, [mode]);

  useEffect(() => {
    // Animate character counter when it appears (only when approaching limit)
    if (counterRef.current && pitch.length > maxLength * 0.9) {
      animateIn(counterRef.current, {
        from: { opacity: 0, scale: 0.8 },
        duration: 0.4
      });
    }
  }, [pitch.length > maxLength * 0.9]); // Only animate when crossing threshold

  return (
    <div className="space-y-6">
      <div>
        <h2 
          ref={titleRef}
          className="text-2xl font-bold text-white mb-3"
        >
          {config.title}
        </h2>
        <p 
          ref={descriptionRef}
          className="text-gray-300 leading-relaxed"
        >
          {config.description}
        </p>
      </div>
      
      <div className="space-y-4">
        <div className="relative">
          <textarea
            ref={textareaRef}
            value={pitch}
            onChange={(e) => setPitch(e.target.value)}
            placeholder={config.placeholder}
            className="w-full h-40 p-6 border-2 border-purple-700/50 rounded-2xl resize-none 
                     focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 
                     transition-all duration-300 text-white placeholder-gray-400
                     bg-gray-800/50 backdrop-blur-sm focus:bg-gray-800/70 text-base leading-relaxed
                     shadow-lg shadow-purple-900/10 hover:shadow-purple-900/20
                     focus:scale-[1.02] transform"
            maxLength={maxLength}
          />
          <div 
            ref={counterRef}
            className="absolute bottom-4 right-4 text-sm text-gray-400 bg-gray-900/80 px-2 py-1 rounded-lg border border-gray-700/50 backdrop-blur-sm"
          >
            {pitch.length}/{maxLength}
          </div>
        </div>
        
        {pitch.length > maxLength * 0.9 && (
          <div className="text-sm text-yellow-300 bg-yellow-900/20 border border-yellow-700/50 rounded-lg p-3 backdrop-blur-sm animate-pulse">
            💡 <strong>Tip:</strong> You're approaching the character limit. Consider being more concise for better results.
          </div>
        )}
      </div>
    </div>
  );
};

export default PitchInput;