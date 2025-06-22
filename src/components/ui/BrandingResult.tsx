import React, { useEffect, useRef } from 'react';
import { Copy, RefreshCw, Palette, ExternalLink } from 'lucide-react';
import { useAnimations } from '../../hooks/useAnimations';

interface BrandingResultProps {
  brandingData: any;
  isLoading: boolean;
  error?: string;
  onCopy: () => void;
  onRegenerate: () => void;
}

const BrandingResult: React.FC<BrandingResultProps> = ({
  brandingData,
  isLoading,
  error,
  onCopy,
  onRegenerate
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const sectionsRef = useRef<HTMLDivElement>(null);
  const { animateIn, staggerIn, stickyNoteFlip, pulseHover } = useAnimations();

  const colors = {
    bg: 'bg-gradient-to-br from-purple-900/30 to-violet-900/30',
    border: 'border-purple-500/50',
    iconBg: 'bg-gradient-to-br from-purple-600 to-violet-600',
    textColor: 'text-purple-200',
    contentColor: 'text-gray-200',
    buttonColor: 'text-purple-300 hover:text-purple-200 hover:bg-purple-900/30'
  };

  useEffect(() => {
    if (!isLoading && brandingData && cardRef.current) {
      // Animate card entrance
      animateIn(cardRef.current, {
        from: { opacity: 0, y: 50, scale: 0.95 },
        duration: 0.8
      });

      // Animate sections with sticky note flip effect
      if (sectionsRef.current) {
        const sections = sectionsRef.current.querySelectorAll('.branding-section');
        sections.forEach((section, index) => {
          stickyNoteFlip(section as HTMLElement, index * 0.2);
        });

        // Animate individual items within sections
        const items = sectionsRef.current.querySelectorAll('.branding-item');
        staggerIn(Array.from(items), {
          from: { opacity: 0, x: -20 },
          duration: 0.4,
          stagger: 0.05,
          delay: 1
        });
      }
    }
  }, [isLoading, brandingData, animateIn, staggerIn, stickyNoteFlip]);

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
            <Palette className="w-6 h-6 text-white animate-pulse" />
          </div>
          <div className={`text-xl font-bold ${colors.textColor}`}>
            AI is crafting your brand identity...
          </div>
        </div>
        
        {/* Loading Brand Elements */}
        <div className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-purple-500/50 rounded animate-pulse"></div>
              <div className="h-4 bg-gray-700/50 rounded animate-pulse w-20"></div>
            </div>
            <div className="space-y-2 ml-8">
              <div className="h-3 bg-gray-700/50 rounded animate-pulse w-32"></div>
              <div className="h-3 bg-gray-700/50 rounded animate-pulse w-28"></div>
              <div className="h-3 bg-gray-700/50 rounded animate-pulse w-36"></div>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-purple-500/50 rounded animate-pulse"></div>
              <div className="h-4 bg-gray-700/50 rounded animate-pulse w-24"></div>
            </div>
            <div className="space-y-2 ml-8">
              <div className="h-3 bg-gray-700/50 rounded animate-pulse w-40"></div>
              <div className="h-3 bg-gray-700/50 rounded animate-pulse w-36"></div>
              <div className="h-3 bg-gray-700/50 rounded animate-pulse w-44"></div>
            </div>
          </div>
        </div>
        
        <p className={`text-sm mt-6 ${colors.contentColor} opacity-75`}>
          Generating creative names, taglines, and positioning...
        </p>
      </div>
    );
  }

  if (!brandingData) return null;

  return (
    <div 
      ref={cardRef}
      className={`rounded-2xl p-8 border-l-4 ${colors.bg} ${colors.border} transition-all duration-300 backdrop-blur-sm shadow-2xl shadow-purple-900/20`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${colors.iconBg} shadow-lg shadow-purple-600/25`}>
            <Palette className="w-6 h-6 text-white" />
          </div>
          <div className={`text-xl font-bold ${colors.textColor}`}>
            Your Brand Identity Kit
          </div>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={handleButtonClick(onCopy)}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 border border-purple-700/30 ${colors.buttonColor} hover:scale-105 transform`}
            title="Copy branding suggestions"
          >
            <Copy className="w-4 h-4" />
            <span className="hidden sm:inline">Copy</span>
          </button>
          <button
            onClick={handleButtonClick(onRegenerate)}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 border border-purple-700/30 ${colors.buttonColor} hover:scale-105 transform`}
            title="Generate new suggestions"
          >
            <RefreshCw className="w-4 h-4" />
            <span className="hidden sm:inline">Regenerate</span>
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

      {/* Brand Elements Breakdown */}
      {brandingData.suggestions && (
        <div ref={sectionsRef} className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Names */}
          <div className="branding-section space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-purple-600/20 flex items-center justify-center">
                <span className="text-purple-400 font-bold text-sm">🧠</span>
              </div>
              <h3 className="text-lg font-bold text-white">Company Names</h3>
            </div>
            <div className="space-y-2 ml-11">
              {brandingData.suggestions.names.map((name: string, index: number) => (
                <div key={index} className="branding-item flex items-center justify-between p-3 bg-gray-800/30 rounded-lg border border-purple-700/20 hover:bg-gray-800/50 transition-all duration-300 hover:scale-105 transform">
                  <span className="text-gray-200 font-medium">{name}</span>
                  <button
                    onClick={() => window.open(`https://namecheap.com/domains/registration/results/?domain=${name.toLowerCase()}`, '_blank')}
                    className="text-purple-400 hover:text-purple-300 transition-colors hover:scale-110 transform"
                    title="Check domain availability"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Taglines */}
          <div className="branding-section space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-purple-600/20 flex items-center justify-center">
                <span className="text-purple-400 font-bold text-sm">💬</span>
              </div>
              <h3 className="text-lg font-bold text-white">Taglines</h3>
            </div>
            <div className="space-y-2 ml-11">
              {brandingData.suggestions.taglines.map((tagline: string, index: number) => (
                <div key={index} className="branding-item p-3 bg-gray-800/30 rounded-lg border border-purple-700/20 hover:bg-gray-800/50 transition-all duration-300 hover:scale-105 transform">
                  <span className="text-gray-200 italic">"{tagline}"</span>
                </div>
              ))}
            </div>
          </div>

          {/* Positioning */}
          <div className="branding-section space-y-4 md:col-span-2">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-purple-600/20 flex items-center justify-center">
                <span className="text-purple-400 font-bold text-sm">🎯</span>
              </div>
              <h3 className="text-lg font-bold text-white">Positioning Statement</h3>
            </div>
            <div className="ml-11 p-4 bg-gradient-to-r from-purple-900/20 to-violet-900/20 rounded-lg border border-purple-700/30 hover:scale-105 transform transition-all duration-300">
              <span className="text-gray-200 text-lg font-medium">{brandingData.suggestions.positioning}</span>
            </div>
          </div>

          {/* Domains */}
          <div className="branding-section space-y-4 md:col-span-2">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-purple-600/20 flex items-center justify-center">
                <span className="text-purple-400 font-bold text-sm">🌐</span>
              </div>
              <h3 className="text-lg font-bold text-white">Domain Suggestions</h3>
            </div>
            <div className="ml-11 flex flex-wrap gap-3">
              {brandingData.suggestions.domains.map((domain: string, index: number) => (
                <button
                  key={index}
                  onClick={() => window.open(`https://namecheap.com/domains/registration/results/?domain=${domain}`, '_blank')}
                  className="branding-item inline-flex items-center gap-2 px-4 py-2 bg-gray-800/50 hover:bg-purple-900/30 rounded-lg border border-purple-700/30 text-gray-200 hover:text-purple-300 transition-all duration-200 hover:scale-105 transform"
                >
                  <span className="font-mono text-sm">{domain}</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Full Branding Text */}
      <div className={`leading-relaxed whitespace-pre-line ${colors.contentColor} text-base bg-gray-800/30 rounded-xl p-6 border border-purple-700/20`}>
        {brandingData.branding}
      </div>
    </div>
  );
};

export default BrandingResult;