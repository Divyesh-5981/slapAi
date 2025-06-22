import React, { useState } from 'react';
import { BarChart3 } from 'lucide-react';
import { useLoading } from '../context/LoadingContext';
import { generateScorecardPrompt } from '../utils/roastPrompt';
import { generateScorecard } from '../services/boltAI';
import StatusBanner from '../components/ui/StatusBanner';
import PitchInput from '../components/ui/PitchInput';
import ActionButton from '../components/ui/ActionButton';
import ScorecardResult from '../components/ui/ScorecardResult';

const ScorecardMode: React.FC = () => {
  const { setIsPageLoading } = useLoading();
  const [pitch, setPitch] = useState('');
  const [scorecardData, setScorecardData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasResult, setHasResult] = useState(false);
  const [error, setError] = useState('');

  React.useEffect(() => {
    setIsPageLoading(false);
  }, [setIsPageLoading]);

  const handleGenerate = async () => {
    if (!pitch.trim()) return;
    
    setIsLoading(true);
    setHasResult(false);
    setError('');
    setScorecardData(null);
    
    try {
      const prompt = generateScorecardPrompt(pitch);
      const response = await generateScorecard(prompt);
      
      if (response.error) {
        setError(response.error);
      }
      
      setScorecardData(response);
      setHasResult(true);
    } catch (err) {
      console.error('Error generating scorecard:', err);
      setError('AI temporarily offline.');
      setScorecardData({
        scorecard: "💯 Scorecard:\nOur AI is having an existential crisis trying to score this pitch. That's... not a good sign.",
        scores: {
          originality: 25,
          marketSize: 30,
          monetization: 20,
          clarity: 15,
          teamPotential: 35,
          total: 125
        },
        verdict: "🤡 AI Malfunction Special"
      });
      setHasResult(true);
    } finally {
      setIsLoading(false);
    }
  };

  const copyResult = () => {
    if (scorecardData) {
      navigator.clipboard.writeText(scorecardData.scorecard);
    }
  };

  const regenerateResult = () => {
    handleGenerate();
  };

  return (
    <div className="space-y-8">
      {/* Status Banner */}
      <StatusBanner mode="scorecard" />

      {/* Main Interface */}
      <div className="bg-gray-900/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-purple-800/30 overflow-hidden">
        {/* Input Section */}
        <div className="p-8 lg:p-12 border-b border-purple-800/30">
          <PitchInput 
            pitch={pitch}
            setPitch={setPitch}
            mode="scorecard"
          />
          
          <div className="flex items-center justify-between mt-8">
            <div className="text-sm text-gray-400">
              💡 <strong>Pro tip:</strong> Include metrics and specifics for more accurate scoring
            </div>
            
            <ActionButton
              onClick={handleGenerate}
              disabled={!pitch.trim() || isLoading}
              isLoading={isLoading}
              mode="scorecard"
              icon={BarChart3}
              loadingText="AI is scoring..."
              actionText="Score My Pitch"
            />
          </div>
        </div>

        {/* Results Section */}
        {(isLoading || hasResult) && (
          <div className="p-8 lg:p-12">
            <ScorecardResult
              scorecardData={scorecardData}
              isLoading={isLoading}
              error={error}
              onCopy={copyResult}
              onRegenerate={regenerateResult}
            />

            {hasResult && (
              <div className="mt-8 p-6 rounded-2xl border bg-blue-900/20 border-blue-700/50 backdrop-blur-sm">
                <p className="text-sm text-blue-300">
                  <strong>Remember:</strong> These scores are based on your pitch quality, not your actual startup potential. A great idea poorly explained will score low - work on your pitch clarity! 📊
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ScorecardMode;