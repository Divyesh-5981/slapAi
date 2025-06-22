import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Flame } from 'lucide-react';
import { useLoading } from '../context/LoadingContext';
import { generateRoastPrompt } from '../utils/roastPrompt';
import { generateRoast } from '../services/boltAI';
import { awardXP } from '../services/xpService';
import { useSound } from '../hooks/useSound';
import { useConfetti } from '../hooks/useConfetti';
import StatusBanner from '../components/ui/StatusBanner';
import PitchInput from '../components/ui/PitchInput';
import AnimatedButton from '../components/ui/AnimatedButton';
import ResultCard from '../components/ui/ResultCard';
import PitchSuggestionChips from '../components/ui/PitchSuggestionChips';
import GlassmorphismCard from '../components/ui/GlassmorphismCard';

const RoastMode: React.FC = () => {
  const { setIsPageLoading, setLoadingMessage } = useLoading();
  const [pitch, setPitch] = useState('');
  const [roast, setRoast] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasResult, setHasResult] = useState(false);
  const [error, setError] = useState('');
  
  const { playSuccess } = useSound();
  const { fireSuccessConfetti } = useConfetti();

  React.useEffect(() => {
    setIsPageLoading(false);
  }, [setIsPageLoading]);

  const handleGenerate = async () => {
    if (!pitch.trim()) return;
    
    setLoadingMessage('AI is crafting your personalized roast...');
    setIsPageLoading(true);
    setIsLoading(true);
    setHasResult(false);
    setError('');
    setRoast('');
    
    try {
      const prompt = generateRoastPrompt(pitch);
      const response = await generateRoast(prompt);
      
      if (response.error) {
        setError(response.error);
      } else {
        // Award XP for generating roast
        awardXP('roast_generate', pitch.substring(0, 50));
        
        // Play success sound and confetti
        playSuccess();
        fireSuccessConfetti();
      }
      
      setRoast(response.roast);
      setHasResult(true);
    } catch (err) {
      console.error('Error generating roast:', err);
      setError('AI temporarily offline.');
      setRoast("🔥 Roast:\nEven our AI is speechless. That's either really good or really, really bad. We're betting on the latter.");
      setHasResult(true);
    } finally {
      setIsLoading(false);
      setIsPageLoading(false);
    }
  };

  const copyResult = () => {
    navigator.clipboard.writeText(roast);
    playSuccess();
  };

  const regenerateResult = () => {
    awardXP('regenerate');
    handleGenerate();
  };

  const handleSuggestionClick = (suggestion: string) => {
    setPitch(suggestion);
  };

  return (
    <motion.div 
      className="space-y-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Status Banner */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <StatusBanner mode="roast" />
      </motion.div>

      {/* Main Interface */}
      <GlassmorphismCard className="overflow-hidden" delay={0.4}>
        {/* Input Section */}
        <div className="p-8 lg:p-12 border-b border-white/10">
          <PitchInput 
            pitch={pitch}
            setPitch={setPitch}
            mode="roast"
          />
          
          <motion.div 
            className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <div className="text-sm text-gray-400 flex items-center gap-2">
              <span className="text-yellow-400">💡</span>
              <strong>Pro tip:</strong> More details = more creative roasts
            </div>
            
            <AnimatedButton
              onClick={handleGenerate}
              disabled={!pitch.trim() || isLoading}
              isLoading={isLoading}
              variant="primary"
              size="lg"
              icon={Flame}
            >
              {isLoading ? 'AI is roasting...' : 'Generate Fresh Roast'}
            </AnimatedButton>
          </motion.div>

          {/* Pitch Suggestions */}
          {!hasResult && (
            <PitchSuggestionChips 
              onSuggestionClick={handleSuggestionClick}
              mode="roast"
            />
          )}
        </div>

        {/* Results Section */}
        {(isLoading || hasResult) && (
          <motion.div 
            className="p-8 lg:p-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <ResultCard
              mode="roast"
              result={roast}
              isLoading={isLoading}
              error={error}
              onCopy={copyResult}
              onRegenerate={regenerateResult}
              icon={Flame}
              title="Your Fresh AI Roast is Served"
              loadingTitle="AI is crafting your personalized roast..."
              loadingDescription="Analyzing your pitch for maximum roast potential..."
            />

            {hasResult && (
              <motion.div 
                className="mt-8 p-6 rounded-2xl border bg-blue-900/20 border-blue-700/50 backdrop-blur-sm"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
              >
                <p className="text-sm text-blue-300">
                  <strong>Remember:</strong> This AI-generated roast is meant to help you think critically about your idea. Every successful startup started with someone believing in a "crazy" idea! 🚀
                </p>
              </motion.div>
            )}
          </motion.div>
        )}
      </GlassmorphismCard>
    </motion.div>
  );
};

export default RoastMode;