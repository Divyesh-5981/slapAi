import React, { useState } from 'react';
import { Image } from 'lucide-react';
import { useLoading } from '../context/LoadingContext';
import { generateMemePrompt } from '../utils/roastPrompt';
import { generateMeme } from '../services/boltAI';
import StatusBanner from '../components/ui/StatusBanner';
import PitchInput from '../components/ui/PitchInput';
import ActionButton from '../components/ui/ActionButton';
import MemeResult from '../components/ui/MemeResult';

const MemeMode: React.FC = () => {
  const { setIsPageLoading, setLoadingMessage } = useLoading();
  const [pitch, setPitch] = useState('');
  const [memeData, setMemeData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasResult, setHasResult] = useState(false);
  const [error, setError] = useState('');

  React.useEffect(() => {
    setIsPageLoading(false);
  }, [setIsPageLoading]);

  const handleGenerate = async () => {
    if (!pitch.trim()) return;
    
    setLoadingMessage('AI is creating your viral meme...');
    setIsPageLoading(true);
    setIsLoading(true);
    setHasResult(false);
    setError('');
    setMemeData(null);
    
    try {
      const prompt = generateMemePrompt(pitch);
      const response = await generateMeme(prompt);
      
      if (response.error) {
        setError(response.error);
      }
      
      setMemeData(response);
      setHasResult(true);
    } catch (err) {
      console.error('Error generating meme:', err);
      setError('AI temporarily offline.');
      setMemeData({
        template: 'drake-format',
        topText: 'Regular startup pitch',
        bottomText: 'Your confusing idea',
        caption: 'When your pitch makes zero sense but you call it "disruptive"',
        shareText: 'Just got meme-slapped by PitchSlap.ai 😂'
      });
      setHasResult(true);
    } finally {
      setIsLoading(false);
      setIsPageLoading(false);
    }
  };

  const copyResult = () => {
    if (memeData) {
      const memeText = `${memeData.caption}\n\nTop: ${memeData.topText}\nBottom: ${memeData.bottomText}`;
      navigator.clipboard.writeText(memeText);
    }
  };

  const regenerateResult = () => {
    handleGenerate();
  };

  return (
    <div className="space-y-8">
      {/* Status Banner */}
      <StatusBanner mode="meme" />

      {/* Main Interface */}
      <div className="bg-gray-900/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-purple-800/30 overflow-hidden">
        {/* Input Section */}
        <div className="p-8 lg:p-12 border-b border-purple-800/30">
          <PitchInput 
            pitch={pitch}
            setPitch={setPitch}
            mode="meme"
          />
          
          <div className="flex items-center justify-between mt-8">
            <div className="text-sm text-gray-400">
              💡 <strong>Pro tip:</strong> More buzzwords = funnier memes
            </div>
            
            <ActionButton
              onClick={handleGenerate}
              disabled={!pitch.trim() || isLoading}
              isLoading={isLoading}
              mode="meme"
              icon={Image}
              loadingText="AI is meme-ing..."
              actionText="Generate Meme"
            />
          </div>
        </div>

        {/* Results Section */}
        {(isLoading || hasResult) && (
          <div className="p-8 lg:p-12">
            <MemeResult
              memeData={memeData}
              isLoading={isLoading}
              error={error}
              onCopy={copyResult}
              onRegenerate={regenerateResult}
            />

            {hasResult && (
              <div className="mt-8 p-6 rounded-2xl border bg-pink-900/20 border-pink-700/50 backdrop-blur-sm">
                <p className="text-sm text-pink-300">
                  <strong>Remember:</strong> Memes are meant for fun! Share responsibly and remember that even the worst ideas can become unicorns with the right execution. 🦄
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MemeMode;