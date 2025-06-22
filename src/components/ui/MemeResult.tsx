import React, { useEffect, useRef, useState } from 'react';
import { Copy, RefreshCw, Image, Download, Share2, ExternalLink } from 'lucide-react';
import { useAnimations } from '../../hooks/useAnimations';

interface MemeResultProps {
  memeData: any;
  isLoading: boolean;
  error?: string;
  onCopy: () => void;
  onRegenerate: () => void;
}

const MemeResult: React.FC<MemeResultProps> = ({
  memeData,
  isLoading,
  error,
  onCopy,
  onRegenerate
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const memeCanvasRef = useRef<HTMLCanvasElement>(null);
  const [memeImageUrl, setMemeImageUrl] = useState<string>('');
  const { animateIn, staggerIn, pulseHover } = useAnimations();

  const colors = {
    bg: 'bg-gradient-to-br from-purple-900/30 to-pink-900/30',
    border: 'border-purple-500/50',
    iconBg: 'bg-gradient-to-br from-purple-600 to-pink-600',
    textColor: 'text-purple-200',
    contentColor: 'text-gray-200',
    buttonColor: 'text-purple-300 hover:text-purple-200 hover:bg-purple-900/30'
  };

  // Meme templates with their layouts
  const memeTemplates = {
    'drake-format': {
      name: 'Drake Format',
      width: 600,
      height: 600,
      layout: 'side-by-side'
    },
    'galaxy-brain': {
      name: 'Galaxy Brain',
      width: 600,
      height: 800,
      layout: 'vertical-stack'
    },
    'spongebob-mocking': {
      name: 'SpongeBob Mocking',
      width: 600,
      height: 600,
      layout: 'single-image'
    },
    'this-is-fine': {
      name: 'This is Fine',
      width: 600,
      height: 400,
      layout: 'single-image'
    },
    'wojak-mask': {
      name: 'Wojak Crying/Smiling Mask',
      width: 600,
      height: 600,
      layout: 'single-image'
    },
    'distracted-boyfriend': {
      name: 'Distracted Boyfriend',
      width: 600,
      height: 400,
      layout: 'three-panel'
    },
    'confused-math-lady': {
      name: 'Confused Math Lady',
      width: 600,
      height: 400,
      layout: 'single-image'
    }
  };

  useEffect(() => {
    if (!isLoading && memeData && cardRef.current) {
      // Animate card entrance
      animateIn(cardRef.current, {
        from: { opacity: 0, y: 50, scale: 0.95 },
        duration: 0.8
      });

      // Generate the meme image
      generateMemeImage();
    }
  }, [isLoading, memeData, animateIn]);

  const generateMemeImage = async () => {
    if (!memeData || !memeCanvasRef.current) return;

    const canvas = memeCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const template = memeTemplates[memeData.template as keyof typeof memeTemplates] || memeTemplates['drake-format'];
    
    // Set canvas dimensions
    canvas.width = template.width;
    canvas.height = template.height;

    // Clear canvas
    ctx.fillStyle = '#1f2937';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw meme based on template
    await drawMemeTemplate(ctx, template, memeData);

    // Convert to image URL
    const imageUrl = canvas.toDataURL('image/png');
    setMemeImageUrl(imageUrl);
  };

  const drawMemeTemplate = async (ctx: CanvasRenderingContext2D, template: any, data: any) => {
    const { width, height } = template;
    
    // Set up text styling
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 3;
    ctx.textAlign = 'center';
    ctx.font = 'bold 32px Arial, sans-serif';

    switch (template.layout) {
      case 'drake-format':
        await drawDrakeFormat(ctx, width, height, data);
        break;
      case 'single-image':
        await drawSingleImageMeme(ctx, width, height, data);
        break;
      case 'vertical-stack':
        await drawVerticalStackMeme(ctx, width, height, data);
        break;
      case 'three-panel':
        await drawThreePanelMeme(ctx, width, height, data);
        break;
      default:
        await drawDefaultMeme(ctx, width, height, data);
    }
  };

  const drawDrakeFormat = async (ctx: CanvasRenderingContext2D, width: number, height: number, data: any) => {
    // Draw background sections
    ctx.fillStyle = '#4f46e5';
    ctx.fillRect(0, 0, width, height / 2);
    ctx.fillStyle = '#059669';
    ctx.fillRect(0, height / 2, width, height / 2);

    // Draw Drake-like figure (simplified)
    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(50, height / 4 - 50, 100, 100);
    ctx.fillRect(50, height * 3/4 - 50, 100, 100);

    // Add text
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 28px Arial';
    
    // Top text (rejecting)
    const topLines = wrapText(ctx, data.topText || 'Old way', width - 200, 30);
    topLines.forEach((line, index) => {
      ctx.strokeText(line, width - 150, height / 4 + (index * 35));
      ctx.fillText(line, width - 150, height / 4 + (index * 35));
    });

    // Bottom text (approving)
    const bottomLines = wrapText(ctx, data.bottomText || 'New way', width - 200, 30);
    bottomLines.forEach((line, index) => {
      ctx.strokeText(line, width - 150, height * 3/4 + (index * 35));
      ctx.fillText(line, width - 150, height * 3/4 + (index * 35));
    });
  };

  const drawSingleImageMeme = async (ctx: CanvasRenderingContext2D, width: number, height: number, data: any) => {
    // Draw placeholder image area
    ctx.fillStyle = '#6b7280';
    ctx.fillRect(50, 50, width - 100, height - 150);

    // Add top text
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 36px Arial';
    const topLines = wrapText(ctx, data.topText || data.caption, width - 100, 40);
    topLines.forEach((line, index) => {
      ctx.strokeText(line, width / 2, 40 + (index * 45));
      ctx.fillText(line, width / 2, 40 + (index * 45));
    });

    // Add bottom text if available
    if (data.bottomText) {
      const bottomLines = wrapText(ctx, data.bottomText, width - 100, 40);
      bottomLines.forEach((line, index) => {
        ctx.strokeText(line, width / 2, height - 60 + (index * 45));
        ctx.fillText(line, width / 2, height - 60 + (index * 45));
      });
    }
  };

  const drawVerticalStackMeme = async (ctx: CanvasRenderingContext2D, width: number, height: number, data: any) => {
    const sections = 4;
    const sectionHeight = height / sections;

    // Draw brain evolution sections
    for (let i = 0; i < sections; i++) {
      const brightness = 50 + (i * 50);
      ctx.fillStyle = `hsl(240, 50%, ${brightness}%)`;
      ctx.fillRect(0, i * sectionHeight, width, sectionHeight);

      // Add brain representation
      ctx.fillStyle = '#fbbf24';
      ctx.fillRect(50, i * sectionHeight + 20, 100, sectionHeight - 40);
    }

    // Add text
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 24px Arial';
    const textLines = [
      'Basic idea',
      'Add AI',
      'Add blockchain', 
      data.caption || 'Revolutionary!'
    ];

    textLines.forEach((text, index) => {
      ctx.strokeText(text, width - 150, (index * sectionHeight) + (sectionHeight / 2));
      ctx.fillText(text, width - 150, (index * sectionHeight) + (sectionHeight / 2));
    });
  };

  const drawThreePanelMeme = async (ctx: CanvasRenderingContext2D, width: number, height: number, data: any) => {
    const panelWidth = width / 3;

    // Draw three panels
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(0, 0, panelWidth, height);
    ctx.fillStyle = '#3b82f6';
    ctx.fillRect(panelWidth, 0, panelWidth, height);
    ctx.fillStyle = '#10b981';
    ctx.fillRect(panelWidth * 2, 0, panelWidth, height);

    // Add figures
    ctx.fillStyle = '#fbbf24';
    for (let i = 0; i < 3; i++) {
      ctx.fillRect(i * panelWidth + 20, height / 2 - 30, 60, 60);
    }

    // Add labels
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 16px Arial';
    const labels = ['Old way', 'Your idea', 'Better way'];
    labels.forEach((label, index) => {
      ctx.strokeText(label, (index * panelWidth) + (panelWidth / 2), height - 20);
      ctx.fillText(label, (index * panelWidth) + (panelWidth / 2), height - 20);
    });
  };

  const drawDefaultMeme = async (ctx: CanvasRenderingContext2D, width: number, height: number, data: any) => {
    // Simple top/bottom text meme
    ctx.fillStyle = '#6b7280';
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 36px Arial';

    // Top text
    const topLines = wrapText(ctx, data.topText || data.caption, width - 40, 40);
    topLines.forEach((line, index) => {
      ctx.strokeText(line, width / 2, 50 + (index * 45));
      ctx.fillText(line, width / 2, 50 + (index * 45));
    });

    // Bottom text
    if (data.bottomText) {
      const bottomLines = wrapText(ctx, data.bottomText, width - 40, 40);
      bottomLines.forEach((line, index) => {
        ctx.strokeText(line, width / 2, height - 100 + (index * 45));
        ctx.fillText(line, width / 2, height - 100 + (index * 45));
      });
    }
  };

  const wrapText = (ctx: CanvasRenderingContext2D, text: string, maxWidth: number, lineHeight: number): string[] => {
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = words[0];

    for (let i = 1; i < words.length; i++) {
      const word = words[i];
      const width = ctx.measureText(currentLine + ' ' + word).width;
      if (width < maxWidth) {
        currentLine += ' ' + word;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    }
    lines.push(currentLine);
    return lines;
  };

  const handleDownload = () => {
    if (!memeImageUrl) return;
    
    const link = document.createElement('a');
    link.href = memeImageUrl;
    link.download = `pitchslap-meme-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShare = async () => {
    if (!memeData) return;

    const shareText = `${memeData.shareText}\n\n${memeData.caption}\n\nGenerated by PitchSlap.ai 🔥`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'PitchSlap.ai Meme',
          text: shareText,
          url: window.location.origin
        });
      } catch (err) {
        // Fallback to clipboard
        navigator.clipboard.writeText(shareText);
      }
    } else {
      navigator.clipboard.writeText(shareText);
    }
  };

  const handleRedditShare = () => {
    if (!memeData) return;
    
    const title = encodeURIComponent(`${memeData.caption} (Generated by PitchSlap.ai)`);
    const url = `https://www.reddit.com/r/startups/submit?title=${title}&text=${encodeURIComponent(memeData.shareText)}`;
    window.open(url, '_blank');
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
            <Image className="w-6 h-6 text-white animate-pulse" />
          </div>
          <div className={`text-xl font-bold ${colors.textColor}`}>
            AI is creating your meme...
          </div>
        </div>
        
        {/* Loading Meme Canvas */}
        <div className="mb-6">
          <div className="w-full max-w-md mx-auto aspect-square bg-gray-700/50 rounded-xl animate-pulse flex items-center justify-center">
            <Image className="w-16 h-16 text-gray-500 animate-bounce" />
          </div>
        </div>
        
        <p className={`text-sm mt-4 ${colors.contentColor} opacity-75`}>
          Selecting perfect meme template and crafting sarcastic caption...
        </p>
      </div>
    );
  }

  if (!memeData) return null;

  return (
    <div 
      ref={cardRef}
      className={`rounded-2xl p-8 border-l-4 ${colors.bg} ${colors.border} transition-all duration-300 backdrop-blur-sm shadow-2xl shadow-purple-900/20`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${colors.iconBg} shadow-lg shadow-purple-600/25`}>
            <Image className="w-6 h-6 text-white" />
          </div>
          <div className={`text-xl font-bold ${colors.textColor}`}>
            Your Viral Meme is Ready
          </div>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={handleButtonClick(onCopy)}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 border border-purple-700/30 ${colors.buttonColor} hover:scale-105 transform`}
            title="Copy meme text"
          >
            <Copy className="w-4 h-4" />
            <span className="hidden sm:inline">Copy</span>
          </button>
          <button
            onClick={handleButtonClick(onRegenerate)}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 border border-purple-700/30 ${colors.buttonColor} hover:scale-105 transform`}
            title="Generate new meme"
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

      {/* Meme Canvas */}
      <div className="mb-8">
        <div className="bg-gray-800/30 rounded-xl p-6 border border-purple-700/20">
          <canvas
            ref={memeCanvasRef}
            className="w-full max-w-md mx-auto rounded-lg shadow-lg border border-gray-600/50"
            style={{ maxHeight: '400px', objectFit: 'contain' }}
          />
          
          {/* Meme Info */}
          <div className="mt-4 text-center">
            <div className="text-sm text-gray-400 mb-2">
              Template: {memeTemplates[memeData.template as keyof typeof memeTemplates]?.name || 'Custom'}
            </div>
            <div className="text-lg font-bold text-white mb-2">
              "{memeData.caption}"
            </div>
            {memeData.topText && memeData.bottomText && (
              <div className="text-sm text-gray-300">
                Top: "{memeData.topText}" • Bottom: "{memeData.bottomText}"
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <button
          onClick={handleButtonClick(handleDownload)}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/50 text-emerald-300 rounded-xl transition-all duration-300 hover:scale-105 transform"
        >
          <Download className="w-5 h-5" />
          Download Meme
        </button>
        
        <button
          onClick={handleButtonClick(handleShare)}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/50 text-blue-300 rounded-xl transition-all duration-300 hover:scale-105 transform"
        >
          <Share2 className="w-5 h-5" />
          Share Meme
        </button>
        
        <button
          onClick={handleButtonClick(handleRedditShare)}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-orange-600/20 hover:bg-orange-600/30 border border-orange-500/50 text-orange-300 rounded-xl transition-all duration-300 hover:scale-105 transform"
        >
          <ExternalLink className="w-5 h-5" />
          Post to Reddit
        </button>
      </div>

      {/* Share Text Preview */}
      <div className="p-4 bg-gray-800/30 rounded-xl border border-purple-700/20">
        <div className="text-sm text-gray-400 mb-2">Share Text Preview:</div>
        <div className="text-gray-200 italic">
          "{memeData.shareText}"
        </div>
      </div>
    </div>
  );
};

export default MemeResult;