// Voice Service - AI-powered text-to-speech using Web Speech API
export interface VoiceOptions {
  voice?: 'savage-vc' | 'snarky-teen';
  speed?: number;
  pitch?: number;
}

export interface VoiceResponse {
  utterance?: SpeechSynthesisUtterance;
  error?: string;
}

// Voice personalities with different characteristics
const VOICE_PERSONALITIES = {
  'savage-vc': {
    name: 'Savage VC',
    description: 'Brutal venture capitalist with zero patience',
    pitch: 0.7,
    speed: 1.2,
    voicePattern: 'male',
    voiceIndex: 0 // Prefer first available male voice
  },
  'snarky-teen': {
    name: 'Snarky Teen Investor',
    description: 'Gen-Z investor with attitude',
    pitch: 1.3,
    speed: 1.4,
    voicePattern: 'female',
    voiceIndex: 0 // Prefer first available female voice
  }
};

export const generateVoiceRoast = async (
  roastText: string, 
  options: VoiceOptions = {}
): Promise<VoiceResponse> => {
  const { voice = 'savage-vc', speed = 1.0, pitch = 1.0 } = options;
  
  try {
    // Use Web Speech API for actual text-to-speech
    return await generateWithWebSpeech(roastText, voice, speed, pitch);
  } catch (error) {
    console.error('Voice generation failed:', error);
    return {
      error: 'Voice generation not supported in this browser. Try Chrome or Edge for best results!'
    };
  }
};

// Web Speech API implementation - returns utterance object for component control
const generateWithWebSpeech = async (
  text: string, 
  voice: string, 
  speed: number, 
  pitch: number
): Promise<VoiceResponse> => {
  // Check if speech synthesis is supported
  if (!('speechSynthesis' in window)) {
    return { error: 'Speech synthesis not supported in this browser' };
  }

  const utterance = new SpeechSynthesisUtterance(cleanTextForSpeech(text));
  const personality = VOICE_PERSONALITIES[voice as keyof typeof VOICE_PERSONALITIES];
  
  // Configure voice settings with personality-specific adjustments
  utterance.rate = speed * personality.speed;
  utterance.pitch = pitch * personality.pitch;
  utterance.volume = 1.0;
  
  // Get available voices and ensure they're loaded
  let voices = speechSynthesis.getVoices();
  
  // If voices aren't loaded yet, wait for them
  if (voices.length === 0) {
    await new Promise<void>((resolve) => {
      const checkVoices = () => {
        voices = speechSynthesis.getVoices();
        if (voices.length > 0) {
          resolve();
        } else {
          setTimeout(checkVoices, 100);
        }
      };
      
      speechSynthesis.onvoiceschanged = () => {
        voices = speechSynthesis.getVoices();
        if (voices.length > 0) {
          resolve();
        }
      };
      
      checkVoices();
    });
  }
  
  // Filter English voices
  const englishVoices = voices.filter(v => 
    v.lang.includes('en') || v.lang.includes('EN')
  );
  
  let selectedVoice = null;
  
  // Smart voice selection based on personality
  if (personality.voicePattern === 'female') {
    // Look for female voices first
    selectedVoice = englishVoices.find(v => 
      v.name.toLowerCase().includes('female') || 
      v.name.toLowerCase().includes('woman') ||
      v.name.toLowerCase().includes('zira') ||
      v.name.toLowerCase().includes('hazel') ||
      v.name.toLowerCase().includes('samantha') ||
      v.name.toLowerCase().includes('susan') ||
      v.name.toLowerCase().includes('karen') ||
      v.name.toLowerCase().includes('victoria')
    );
    
    // Fallback: use voices that typically sound female
    if (!selectedVoice) {
      const femaleVoices = englishVoices.filter(v => 
        !v.name.toLowerCase().includes('male') &&
        !v.name.toLowerCase().includes('man') &&
        !v.name.toLowerCase().includes('david') &&
        !v.name.toLowerCase().includes('mark') &&
        !v.name.toLowerCase().includes('alex')
      );
      selectedVoice = femaleVoices[0]; // First non-male voice
    }
  } else if (personality.voicePattern === 'male') {
    // Look for male voices first
    selectedVoice = englishVoices.find(v => 
      v.name.toLowerCase().includes('male') || 
      v.name.toLowerCase().includes('man') ||
      v.name.toLowerCase().includes('david') ||
      v.name.toLowerCase().includes('mark') ||
      v.name.toLowerCase().includes('alex') ||
      v.name.toLowerCase().includes('daniel') ||
      v.name.toLowerCase().includes('thomas') ||
      v.name.toLowerCase().includes('james')
    );
    
    // Fallback: use a different voice than female preference
    if (!selectedVoice) {
      const maleVoices = englishVoices.filter(v => 
        v.name.toLowerCase().includes('male') ||
        v.name.toLowerCase().includes('david') ||
        v.name.toLowerCase().includes('mark') ||
        v.name.toLowerCase().includes('alex')
      );
      selectedVoice = maleVoices[0] || englishVoices[englishVoices.length - 1]; // Last voice as fallback
    }
  }
  
  // Final fallback: use any English voice, but try to make them different
  if (!selectedVoice && englishVoices.length > 0) {
    const voiceIndex = personality.voiceIndex % englishVoices.length;
    selectedVoice = englishVoices[voiceIndex];
  }
  
  if (selectedVoice) {
    utterance.voice = selectedVoice;
    console.log(`Selected voice for ${voice}:`, selectedVoice.name, `(pitch: ${utterance.pitch}, rate: ${utterance.rate})`);
  } else {
    console.warn('No suitable voice found, using default');
  }

  // Return the utterance object for component to manage
  return { utterance };
};

// Clean text for better speech synthesis
const cleanTextForSpeech = (text: string): string => {
  return text
    .replace(/🔥|💯|🤑|🤡|💀|🗑️|😬|📈|🚀/g, '') // Remove emojis
    .replace(/\n\n/g, '. ') // Replace double newlines with periods
    .replace(/\n/g, ', ') // Replace single newlines with commas
    .replace(/—/g, ' - ') // Replace em dashes
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();
};

// Get available voice personalities
export const getVoicePersonalities = () => {
  return Object.entries(VOICE_PERSONALITIES).map(([key, personality]) => ({
    id: key,
    name: personality.name,
    description: personality.description
  }));
};

// Cleanup function for audio URLs (not needed for Web Speech API)
export const cleanupAudioUrl = (url: string) => {
  // No cleanup needed for Web Speech API
  return;
};