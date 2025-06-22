import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Mic, Play, Pause, Volume2, VolumeX, RotateCcw } from 'lucide-react';
import { generateVoiceRoast, getVoicePersonalities, VoiceOptions } from '../../services/voiceService';
import { useLoading } from '../../context/LoadingContext';
import { useAnimations } from '../../hooks/useAnimations';

interface VoiceRoastProps {
  roastText: string;
  onError?: (error: string) => void;
}

const VoiceRoast: React.FC<VoiceRoastProps> = ({ roastText, onError }) => {
  const { setIsPageLoading, setLoadingMessage } = useLoading();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState<string>('savage-vc');
  const [error, setError] = useState<string>('');
  const [hasGenerated, setHasGenerated] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const waveformRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);
  const currentUtterance = useRef<SpeechSynthesisUtterance | null>(null);
  const { animateIn, pulseHover } = useAnimations();

  const voicePersonalities = getVoicePersonalities();

  useEffect(() => {
    if (!hasAnimated.current && containerRef.current) {
      hasAnimated.current = true;
      animateIn(containerRef.current, {
        from: { opacity: 0, y: 20 },
        duration: 0.6
      });
    }
  }, [animateIn]);

  // Animate waveform when playing
  useEffect(() => {
    if (!isPlaying || !waveformRef.current) return;

    const bars = waveformRef.current.querySelectorAll('.wave-bar');
    const intervals: NodeJS.Timeout[] = [];

    bars.forEach((bar, index) => {
      const element = bar as HTMLElement;
      const delay = index * 50;
      
      const interval = setInterval(() => {
        if (isPlaying) {
          element.style.height = `${Math.random() * 80 + 20}%`;
        } else {
          element.style.height = '20%';
        }
      }, 150 + delay);
      
      intervals.push(interval);
    });

    return () => {
      intervals.forEach(interval => clearInterval(interval));
    };
  }, [isPlaying]);

  const handleGenerateVoice = async () => {
    if (!roastText.trim()) {
      setError('No roast text to convert to voice');
      return;
    }

    // Cancel any ongoing speech before starting new one
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
    }
    
    // Clear previous utterance
    if (currentUtterance.current) {
      currentUtterance.current = null;
    }

    setLoadingMessage('AI is generating voice roast...');
    setIsPageLoading(true);
    setIsGenerating(true);
    setError('');
    setIsPlaying(false);
    
    try {
      const options: VoiceOptions = {
        voice: selectedVoice as any,
        speed: 1.0,
        pitch: 1.0
      };
      
      const response = await generateVoiceRoast(roastText, options);
      
      if (response.error) {
        setError(response.error);
        onError?.(response.error);
      } else if (response.utterance) {
        // Store the utterance for component control
        currentUtterance.current = response.utterance;
        
        // Set up event handlers
        response.utterance.onstart = () => {
          setIsPlaying(true);
          setHasGenerated(true);
        };
        
        response.utterance.onend = () => {
          setIsPlaying(false);
        };
        
        response.utterance.onerror = (event) => {
          setIsPlaying(false);
          
          // Only show error if it's not an interruption (which is expected when cancelling)
          if (event.error !== 'interrupted') {
            console.error('Speech synthesis error:', event);
            const errorMessage = 'Speech synthesis failed. Try again!';
            setError(errorMessage);
            onError?.(errorMessage);
          }
        };
        
        response.utterance.onpause = () => {
          setIsPlaying(false);
        };
        
        response.utterance.onresume = () => {
          setIsPlaying(true);
        };
        
        // Start speaking
        speechSynthesis.speak(response.utterance);
        setError('');
      }
    } catch (err) {
      const errorMessage = 'Voice generation failed. Our AI is having a moment.';
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setIsGenerating(false);
      setIsPageLoading(false);
    }
  };

  const handlePlayPause = useCallback(() => {
    if (!('speechSynthesis' in window)) {
      setError('Speech synthesis not supported in this browser');
      return;
    }

    try {
      if (currentUtterance.current && speechSynthesis.speaking) {
        if (speechSynthesis.paused) {
          speechSynthesis.resume();
        } else {
          speechSynthesis.pause();
        }
      } else {
        // Start new speech
        handleGenerateVoice();
      }
    } catch (error) {
      console.error('Play/pause error:', error);
      setError('Speech control failed. Try refreshing.');
    }
  }, [roastText, selectedVoice]);

  const handleStop = useCallback(() => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
    }
    if (currentUtterance.current) {
      currentUtterance.current = null;
    }
    setIsPlaying(false);
  }, []);

  const handleButtonClick = useCallback((callback: () => void) => (e: React.MouseEvent) => {
    const target = e.currentTarget;
    pulseHover(target);
    callback();
  }, [pulseHover]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        speechSynthesis.cancel();
      }
      if (currentUtterance.current) {
        currentUtterance.current = null;
      }
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="mt-6 p-6 bg-gradient-to-br from-purple-900/20 to-pink-900/20 rounded-2xl border border-purple-700/30 backdrop-blur-sm"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center shadow-lg">
          <Mic className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">
            🎤 VoiceRoast
          </h3>
          <p className="text-sm text-gray-400">Turn your roast into speech</p>
        </div>
      </div>

      {/* Voice Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-300 mb-3">
          Choose Your Sarcastic Voice:
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {voicePersonalities.map((voice) => (
            <button
              key={voice.id}
              onClick={() => setSelectedVoice(voice.id)}
              className={`p-3 rounded-xl border transition-all duration-300 text-left hover:scale-105 transform ${
                selectedVoice === voice.id
                  ? 'bg-purple-600/30 border-purple-500 text-purple-200'
                  : 'bg-gray-800/30 border-gray-700/50 text-gray-300 hover:bg-purple-900/20 hover:border-purple-600/50'
              }`}
            >
              <div className="font-medium text-sm">{voice.name}</div>
              <div className="text-xs opacity-75 mt-1">{voice.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Generate/Control Buttons */}
      <div className="mb-6">
        {!hasGenerated ? (
          <button
            onClick={handleButtonClick(handleGenerateVoice)}
            disabled={isGenerating || !roastText.trim()}
            className="w-full inline-flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold rounded-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg shadow-purple-600/25"
          >
            {isGenerating ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Generating Voice...
              </>
            ) : (
              <>
                <Volume2 className="w-5 h-5" />
                Generate VoiceRoast
              </>
            )}
          </button>
        ) : (
          <div className="space-y-4">
            {/* Waveform Visualization */}
            <div 
              ref={waveformRef}
              className="flex items-end justify-center gap-1 h-16 bg-gray-800/30 rounded-xl p-4"
            >
              {Array.from({ length: 30 }).map((_, index) => (
                <div
                  key={index}
                  className="wave-bar w-1 bg-gradient-to-t from-purple-600 to-pink-500 rounded-full transition-all duration-200"
                  style={{ 
                    height: '20%',
                    opacity: isPlaying ? 1 : 0.3
                  }}
                />
              ))}
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-4">
              {/* Play/Pause */}
              <button
                onClick={handleButtonClick(handlePlayPause)}
                className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 flex items-center justify-center text-white transition-all duration-300 transform hover:scale-110 shadow-lg"
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
              </button>

              {/* Stop */}
              <button
                onClick={handleButtonClick(handleStop)}
                className="w-10 h-10 rounded-full bg-gray-700/50 hover:bg-red-600/50 flex items-center justify-center text-gray-300 hover:text-white transition-all duration-300 transform hover:scale-110"
                title="Stop speech"
              >
                <div className="w-3 h-3 bg-current rounded-sm" />
              </button>

              {/* Regenerate */}
              <button
                onClick={handleButtonClick(handleGenerateVoice)}
                disabled={isGenerating}
                className="w-10 h-10 rounded-full bg-gray-700/50 hover:bg-purple-600/50 flex items-center justify-center text-gray-300 hover:text-white transition-all duration-300 transform hover:scale-110 disabled:opacity-50"
                title="Regenerate voice"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-900/20 border border-red-700/50 rounded-xl backdrop-blur-sm">
          <div className="flex items-center gap-2 text-red-300 text-sm">
            <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
            {error}
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="p-3 bg-blue-900/20 border border-blue-700/50 rounded-xl backdrop-blur-sm">
        <p className="text-sm text-blue-300">
          <strong>💡 Pro tip:</strong> This uses your browser's built-in text-to-speech. 
          For best results, use Chrome or Edge. Choose between our two distinct voice personalities! 🔥
        </p>
      </div>
    </div>
  );
};

export default VoiceRoast;