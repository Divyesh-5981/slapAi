import React, { useState } from 'react';
import { Palette } from 'lucide-react';
import { useLoading } from '../context/LoadingContext';
import { generateBrandingPrompt } from '../utils/roastPrompt';
import { generateBranding } from '../services/boltAI';
import StatusBanner from '../components/ui/StatusBanner';
import PitchInput from '../components/ui/PitchInput';
import ActionButton from '../components/ui/ActionButton';
import BrandingResult from '../components/ui/BrandingResult';

const BrandingMode: React.FC = () => {
  const { setIsPageLoading, setLoadingMessage } = useLoading();
  const [pitch, setPitch] = useState('');
  const [brandingData, setBrandingData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasResult, setHasResult] = useState(false);
  const [error, setError] = useState('');

  React.useEffect(() => {
    setIsPageLoading(false);
  }, [setIsPageLoading]);

  const handleGenerate = async () => {
    if (!pitch.trim()) return;
    
    setLoadingMessage('AI is crafting your brand identity...');
    setIsPageLoading(true);
    setIsLoading(true);
    setHasResult(false);
    setError('');
    setBrandingData(null);
    
    try {
      const prompt = generateBrandingPrompt(pitch);
      const response = await generateBranding(prompt);
      
      if (response.error) {
        setError(response.error);
      }
      
      setBrandingData(response);
      setHasResult(true);
    } catch (err) {
      console.error('Error generating branding:', err);
      setError('AI temporarily offline.');
      setBrandingData({
        branding: "🧠 Names:\n- GenericCorp\n- StartupThing\n- BusinessApp\n\n💬 Taglines:\n- We do stuff\n- Making things better\n- Innovation happens here\n\n🎯 Positioning Statement:\nWe're the company for people who need things.\n\n🌐 Domain Suggestions:\n- generic.com\n- startup.ai\n- business.co",
        suggestions: {
          names: ['GenericCorp', 'StartupThing', 'BusinessApp'],
          taglines: ['We do stuff', 'Making things better', 'Innovation happens here'],
          positioning: "We're the company for people who need things.",
          domains: ['generic.com', 'startup.ai', 'business.co']
        }
      });
      setHasResult(true);
    } finally {
      setIsLoading(false);
      setIsPageLoading(false);
    }
  };

  const copyResult = () => {
    if (brandingData) {
      navigator.clipboard.writeText(brandingData.branding);
    }
  };

  const regenerateResult = () => {
    handleGenerate();
  };

  return (
    <div className="space-y-8">
      {/* Status Banner */}
      <StatusBanner mode="branding" />

      {/* Main Interface */}
      <div className="bg-gray-900/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-purple-800/30 overflow-hidden">
        {/* Input Section */}
        <div className="p-8 lg:p-12 border-b border-purple-800/30">
          <PitchInput 
            pitch={pitch}
            setPitch={setPitch}
            mode="branding"
          />
          
          <div className="flex items-center justify-between mt-8">
            <div className="text-sm text-gray-400">
              💡 <strong>Pro tip:</strong> Include your target market and industry for better name suggestions
            </div>
            
            <ActionButton
              onClick={handleGenerate}
              disabled={!pitch.trim() || isLoading}
              isLoading={isLoading}
              mode="branding"
              icon={Palette}
              loadingText="AI is branding..."
              actionText="Generate Branding"
            />
          </div>
        </div>

        {/* Results Section */}
        {(isLoading || hasResult) && (
          <div className="p-8 lg:p-12">
            <BrandingResult
              brandingData={brandingData}
              isLoading={isLoading}
              error={error}
              onCopy={copyResult}
              onRegenerate={regenerateResult}
            />

            {hasResult && (
              <div className="mt-8 p-6 rounded-2xl border bg-purple-900/20 border-purple-700/50 backdrop-blur-sm">
                <p className="text-sm text-purple-300">
                  <strong>Remember:</strong> These are creative starting points! Check domain availability, trademark conflicts, and test names with your target audience before making final decisions. 🎨
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BrandingMode;