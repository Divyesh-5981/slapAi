import React, { useState } from 'react';
import { Wrench } from 'lucide-react';
import { useLoading } from '../context/LoadingContext';
import { generateFixItPrompt } from '../utils/roastPrompt';
import { generateFixIt } from '../services/boltAI';
import StatusBanner from '../components/ui/StatusBanner';
import PitchInput from '../components/ui/PitchInput';
import ActionButton from '../components/ui/ActionButton';
import ResultCard from '../components/ui/ResultCard';

const FixItMode: React.FC = () => {
  const { setIsPageLoading, setLoadingMessage } = useLoading();
  const [pitch, setPitch] = useState('');
  const [fixedPitch, setFixedPitch] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasResult, setHasResult] = useState(false);
  const [error, setError] = useState('');

  React.useEffect(() => {
    setIsPageLoading(false);
  }, [setIsPageLoading]);

  const handleGenerate = async () => {
    if (!pitch.trim()) return;
    
    setLoadingMessage('AI is rewriting your pitch...');
    setIsPageLoading(true);
    setIsLoading(true);
    setHasResult(false);
    setError('');
    setFixedPitch('');
    
    try {
      const prompt = generateFixItPrompt(pitch);
      const response = await generateFixIt(prompt);
      
      if (response.error) {
        setError(response.error);
      }
      
      setFixedPitch(response.fixedPitch);
      setHasResult(true);
    } catch (err) {
      console.error('Error generating fix:', err);
      setError('AI temporarily offline.');
      setFixedPitch("🛠️ FixIt:\nYour pitch needs work, but our AI is taking a coffee break. Try describing your startup's core problem, solution, and target market in simple terms.");
      setHasResult(true);
    } finally {
      setIsLoading(false);
      setIsPageLoading(false);
    }
  };

  const copyResult = () => {
    navigator.clipboard.writeText(fixedPitch);
  };

  const regenerateResult = () => {
    handleGenerate();
  };

  return (
    <div className="space-y-8">
      {/* Status Banner */}
      <StatusBanner mode="fixit" />

      {/* Main Interface */}
      <div className="bg-gray-900/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-purple-800/30 overflow-hidden">
        {/* Input Section */}
        <div className="p-8 lg:p-12 border-b border-purple-800/30">
          <PitchInput 
            pitch={pitch}
            setPitch={setPitch}
            mode="fixit"
          />
          
          <div className="flex items-center justify-between mt-8">
            <div className="text-sm text-gray-400">
              💡 <strong>Pro tip:</strong> Include your target market and business model for better results
            </div>
            
            <ActionButton
              onClick={handleGenerate}
              disabled={!pitch.trim() || isLoading}
              isLoading={isLoading}
              mode="fixit"
              icon={Wrench}
              loadingText="AI is fixing..."
              actionText="Fix My Pitch"
            />
          </div>
        </div>

        {/* Results Section */}
        {(isLoading || hasResult) && (
          <div className="p-8 lg:p-12">
            <ResultCard
              mode="fixit"
              result={fixedPitch}
              isLoading={isLoading}
              error={error}
              onCopy={copyResult}
              onRegenerate={regenerateResult}
              icon={Wrench}
              title="Your Pitch Makeover is Ready"
              loadingTitle="AI is rewriting your pitch..."
              loadingDescription="Removing buzzwords and adding clarity..."
            />

            {hasResult && (
              <div className="mt-8 p-6 rounded-2xl border bg-emerald-900/20 border-emerald-700/50 backdrop-blur-sm">
                <p className="text-sm text-emerald-300">
                  <strong>Remember:</strong> This is a starting template - customize it with your specific metrics, customer names, and unique details to make it truly compelling! 📈
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FixItMode;