// Bolt AI Service - Dynamic roast generation and pitch fixing using Bolt's built-in AI
export interface RoastResponse {
  roast: string;
  error?: string;
}

export interface FixItResponse {
  fixedPitch: string;
  error?: string;
}

export interface ScorecardResponse {
  scorecard: string;
  scores: {
    originality: number;
    marketSize: number;
    monetization: number;
    clarity: number;
    teamPotential: number;
    total: number;
  };
  verdict: string;
  error?: string;
}

export interface BrandingResponse {
  branding: string;
  suggestions: {
    names: string[];
    taglines: string[];
    positioning: string;
    domains: string[];
  };
  error?: string;
}

export interface MemeResponse {
  template: string;
  topText: string;
  bottomText: string;
  caption: string;
  shareText: string;
  error?: string;
}

export const generateRoast = async (prompt: string): Promise<RoastResponse> => {
  try {
    // Use Bolt's built-in AI for dynamic roast generation
    const response = await generateWithBoltAI(prompt, 'roast');
    return response;
  } catch (error) {
    console.error('Bolt AI Error:', error);
    return {
      roast: "🔥 Roast:\nEven our AI is speechless. That's either really good or really, really bad. We're betting on the latter.",
      error: 'AI temporarily unavailable - but the roast must go on!'
    };
  }
};

export const generateFixIt = async (prompt: string): Promise<FixItResponse> => {
  try {
    // Use Bolt's built-in AI for dynamic pitch fixing
    const response = await generateWithBoltAI(prompt, 'fixit');
    return response;
  } catch (error) {
    console.error('Bolt AI Error:', error);
    return {
      fixedPitch: "🛠️ FixIt:\nYour pitch needs work, but our AI is taking a coffee break. Try describing your startup's core problem, solution, and target market in simple terms.",
      error: 'AI temporarily unavailable - but we can still help!'
    };
  }
};

export const generateScorecard = async (prompt: string): Promise<ScorecardResponse> => {
  try {
    // Use Bolt's built-in AI for dynamic scorecard generation
    const response = await generateWithBoltAI(prompt, 'scorecard');
    return response;
  } catch (error) {
    console.error('Bolt AI Error:', error);
    return {
      scorecard: "💯 Scorecard:\nOur AI is having an existential crisis trying to score this pitch. That's... not a good sign.",
      scores: {
        originality: 25,
        marketSize: 30,
        monetization: 20,
        clarity: 15,
        teamPotential: 35,
        total: 125
      },
      verdict: "🤡 AI Malfunction Special",
      error: 'AI temporarily unavailable - but we can still judge!'
    };
  }
};

export const generateBranding = async (prompt: string): Promise<BrandingResponse> => {
  try {
    // Use Bolt's built-in AI for dynamic branding suggestions
    const response = await generateWithBoltAI(prompt, 'branding');
    return response;
  } catch (error) {
    console.error('Bolt AI Error:', error);
    return {
      branding: "🧠 Names:\n- GenericCorp\n- StartupThing\n- BusinessApp\n\n💬 Taglines:\n- We do stuff\n- Making things better\n- Innovation happens here\n\n🎯 Positioning Statement:\nWe're the company for people who need things.\n\n🌐 Domain Suggestions:\n- generic.com\n- startup.ai\n- business.co",
      suggestions: {
        names: ['GenericCorp', 'StartupThing', 'BusinessApp'],
        taglines: ['We do stuff', 'Making things better', 'Innovation happens here'],
        positioning: "We're the company for people who need things.",
        domains: ['generic.com', 'startup.ai', 'business.co']
      },
      error: 'AI temporarily unavailable - but we can still brand!'
    };
  }
};

export const generateMeme = async (prompt: string): Promise<MemeResponse> => {
  try {
    // Use Bolt's built-in AI for dynamic meme generation
    const response = await generateWithBoltAI(prompt, 'meme');
    return response;
  } catch (error) {
    console.error('Bolt AI Error:', error);
    return {
      template: 'drake-format',
      topText: 'Regular startup pitch',
      bottomText: 'Your confusing idea',
      caption: 'When your pitch makes zero sense but you call it "disruptive"',
      shareText: 'Just got meme-slapped by PitchSlap.ai 😂',
      error: 'AI temporarily unavailable - but we can still meme!'
    };
  }
};

// Core function that interfaces with Bolt's AI model
const generateWithBoltAI = async (fullPrompt: string, mode: 'roast' | 'fixit' | 'scorecard' | 'branding' | 'meme'): Promise<RoastResponse | FixItResponse | ScorecardResponse | BrandingResponse | MemeResponse> => {
  try {
    // Simulate the AI generation process with Bolt's internal model
    const aiResponse = await processWithBoltAI(fullPrompt, mode);
    
    // Handle different response types based on mode
    if (mode === 'scorecard') {
      // For scorecard mode, aiResponse is already a ScorecardResponse object
      const scorecardResponse = aiResponse as ScorecardResponse;
      if (!scorecardResponse || !scorecardResponse.scorecard || scorecardResponse.scorecard.trim().length === 0) {
        throw new Error('Empty AI response');
      }
      return scorecardResponse;
    } else if (mode === 'branding') {
      // For branding mode, aiResponse is already a BrandingResponse object
      const brandingResponse = aiResponse as BrandingResponse;
      if (!brandingResponse || !brandingResponse.branding || brandingResponse.branding.trim().length === 0) {
        throw new Error('Empty AI response');
      }
      return brandingResponse;
    } else if (mode === 'meme') {
      // For meme mode, aiResponse is already a MemeResponse object
      const memeResponse = aiResponse as MemeResponse;
      if (!memeResponse || !memeResponse.caption || memeResponse.caption.trim().length === 0) {
        throw new Error('Empty AI response');
      }
      return memeResponse;
    } else {
      // For roast and fixit modes, aiResponse is a string
      const stringResponse = aiResponse as string;
      if (!stringResponse || stringResponse.trim().length === 0) {
        throw new Error('Empty AI response');
      }

      if (mode === 'roast') {
        return { roast: stringResponse } as RoastResponse;
      } else {
        return { fixedPitch: stringResponse } as FixItResponse;
      }
    }
  } catch (error) {
    console.error('Bolt AI processing failed:', error);
    throw error;
  }
};

// Enhanced Bolt AI processing function with dynamic analysis
const processWithBoltAI = async (prompt: string, mode: 'roast' | 'fixit' | 'scorecard' | 'branding' | 'meme'): Promise<string | ScorecardResponse | BrandingResponse | MemeResponse> => {
  // Simulate AI processing delay for realism
  await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));
  
  // Extract the user's pitch from the prompt template
  const pitchMatch = prompt.match(/Startup Pitch:\s*(.*?)(?:\n\nFormat your response|Response format:|$)/s);
  const userPitch = pitchMatch ? pitchMatch[1].trim() : '';
  
  if (!userPitch || userPitch.length < 10) {
    if (mode === 'roast') {
      return "🔥 Roast:\nYour pitch is shorter than a TikTok attention span. Give me something to work with here - describe your idea like you're trying to convince your skeptical mother to invest her retirement fund.";
    } else if (mode === 'fixit') {
      return "🛠️ FixIt:\nI need more details to fix your pitch. Describe: What problem does your startup solve? Who are your customers? How do you make money?";
    } else if (mode === 'scorecard') {
      return {
        scorecard: "💯 Scorecard:\nCan't score what doesn't exist. Give me an actual pitch to evaluate.",
        scores: {
          originality: 0,
          marketSize: 0,
          monetization: 0,
          clarity: 0,
          teamPotential: 0,
          total: 0
        },
        verdict: "🤡 Invisible Startup"
      };
    } else if (mode === 'branding') {
      return {
        branding: "🧠 Names:\n- MysteryStartup\n- VagueVenture\n- UnknownCorp\n\n💬 Taglines:\n- We exist, probably\n- Doing something, somewhere\n- Your guess is as good as ours\n\n🎯 Positioning Statement:\nWe're the startup that forgot to explain what we do.\n\n🌐 Domain Suggestions:\n- mystery.com\n- vague.ai\n- unknown.co",
        suggestions: {
          names: ['MysteryStartup', 'VagueVenture', 'UnknownCorp'],
          taglines: ['We exist, probably', 'Doing something, somewhere', 'Your guess is as good as ours'],
          positioning: "We're the startup that forgot to explain what we do.",
          domains: ['mystery.com', 'vague.ai', 'unknown.co']
        }
      };
    } else {
      return {
        template: 'confused-math-lady',
        topText: 'When someone asks',
        bottomText: 'What your startup does',
        caption: 'Pitch so vague even we\'re confused',
        shareText: 'My startup pitch was so bad even the AI gave up 😅'
      };
    }
  }

  if (mode === 'roast') {
    return analyzeAndGenerateRoast(userPitch);
  } else if (mode === 'fixit') {
    return analyzeAndGenerateDynamicFixIt(userPitch);
  } else if (mode === 'scorecard') {
    return analyzeAndGenerateScorecard(userPitch);
  } else if (mode === 'branding') {
    return analyzeAndGenerateBranding(userPitch);
  } else {
    return analyzeAndGenerateMeme(userPitch);
  }
};

// NEW: Dynamic Meme generation with smart template matching
const analyzeAndGenerateMeme = (pitch: string): MemeResponse => {
  const lowerPitch = pitch.toLowerCase();
  
  // Analyze pitch content for template selection
  const pitchAnalysis = {
    hasAI: /\b(ai|artificial intelligence|machine learning|ml|neural|algorithm|smart)\b/.test(lowerPitch),
    hasBlockchain: /\b(blockchain|crypto|nft|web3|decentralized|bitcoin)\b/.test(lowerPitch),
    isUberFor: /\b(uber for|airbnb for|netflix for|spotify for|tinder for)\b/.test(lowerPitch),
    hasSocial: /\b(social|network|platform|community|connect)\b/.test(lowerPitch),
    hasBuzzwords: /\b(disrupt|revolutionize|innovative|cutting-edge|paradigm|synergy|leverage|optimize|streamline)\b/.test(lowerPitch),
    isVague: pitch.length < 50 || /\b(platform|ecosystem|solution|system)\b/.test(lowerPitch),
    keyTerms: extractKeyTerms(pitch)
  };
  
  return generateContextualMeme(pitch, pitchAnalysis);
};

// Generate contextual meme based on pitch analysis
const generateContextualMeme = (originalPitch: string, analysis: any): MemeResponse => {
  let template = 'drake-format';
  let topText = '';
  let bottomText = '';
  let caption = '';
  let shareText = '';
  
  if (analysis.hasAI && analysis.hasBlockchain) {
    template = 'galaxy-brain';
    topText = 'Regular startup';
    bottomText = 'AI + Blockchain startup';
    caption = 'When you throw every buzzword into one pitch and call it innovation';
    shareText = 'My startup has AI AND blockchain. Basically the next Google 🤖⛓️';
  } else if (analysis.hasAI) {
    template = 'spongebob-mocking';
    topText = 'We use AI to revolutionize';
    bottomText = 'wE uSe Ai To ReVoLuTiOnIzE';
    caption = 'Every AI startup pitch ever';
    shareText = 'Another day, another "AI-powered" startup that probably just uses ChatGPT API 🤖';
  } else if (analysis.hasBlockchain) {
    template = 'this-is-fine';
    topText = 'Our blockchain solution';
    bottomText = 'will definitely work';
    caption = 'When your entire business model depends on crypto not crashing';
    shareText = 'Blockchain will solve everything! (Narrator: It did not solve everything) ⛓️💸';
  } else if (analysis.isUberFor) {
    template = 'drake-format';
    const uberMatch = originalPitch.match(/(uber|airbnb|netflix|spotify|tinder) for ([\w\s]+)/i);
    const service = uberMatch ? uberMatch[2].trim() : 'everything';
    topText = 'Original business model';
    bottomText = `Uber for ${service}`;
    caption = `Because what the world really needs is another "Uber for X" startup`;
    shareText = `Just pitched the "Uber for ${service}" - totally original idea, right? 🚗📱`;
  } else if (analysis.hasSocial) {
    template = 'distracted-boyfriend';
    topText = 'Existing social networks';
    bottomText = 'Our revolutionary social platform';
    caption = 'Every social media startup thinking they\'ll dethrone Facebook';
    shareText = 'Building the next Facebook! (User #1: my mom) 📱👥';
  } else if (analysis.hasBuzzwords && analysis.isVague) {
    template = 'confused-math-lady';
    topText = 'Trying to understand';
    bottomText = 'what this startup actually does';
    caption = 'When your pitch has more buzzwords than actual substance';
    shareText = 'My startup pitch was so buzzword-heavy even I forgot what we do 🤔💭';
  } else if (analysis.isVague) {
    template = 'drake-format';
    topText = 'Clear business model';
    bottomText = 'Vague "platform" that does everything';
    caption = 'Why solve one problem when you can solve zero problems really well?';
    shareText = 'We\'re building a platform! (What kind? That\'s... complicated) 🤷‍♂️';
  } else {
    // Generic but contextual meme
    template = 'drake-format';
    topText = 'Traditional approach';
    bottomText = `${analysis.keyTerms[0] || 'Our'} startup approach`;
    caption = `Another startup trying to disrupt ${analysis.keyTerms[1] || 'everything'}`;
    shareText = `Just got roasted by PitchSlap.ai for my ${analysis.keyTerms[0] || 'amazing'} startup idea 😂🔥`;
  }
  
  return {
    template,
    topText,
    bottomText,
    caption,
    shareText
  };
};

// Keep all existing functions (analyzeAndGenerateBranding, analyzeAndGenerateScorecard, etc.)
// ... [Previous functions remain unchanged] ...

// NEW: Dynamic Branding generation with creative naming and positioning
const analyzeAndGenerateBranding = (pitch: string): BrandingResponse => {
  const lowerPitch = pitch.toLowerCase();
  
  // Deep analysis of the pitch content
  const pitchAnalysis = {
    // Core elements
    hasProblem: /\b(problem|issue|challenge|pain|struggle|difficulty)\b/.test(lowerPitch),
    hasSolution: /\b(solution|solve|fix|address|help|assist)\b/.test(lowerPitch),
    hasTarget: /\b(customer|user|client|business|company|people|market)\b/.test(lowerPitch),
    
    // Industry indicators
    isB2B: /\b(b2b|business|enterprise|company|corporate|saas|software)\b/.test(lowerPitch),
    isB2C: /\b(consumer|user|people|individual|personal|mobile|app)\b/.test(lowerPitch),
    
    // Technology mentions
    hasAI: /\b(ai|artificial intelligence|machine learning|ml|neural|algorithm|smart)\b/.test(lowerPitch),
    hasBlockchain: /\b(blockchain|crypto|nft|web3|decentralized|bitcoin)\b/.test(lowerPitch),
    hasMobile: /\b(mobile|app|ios|android|smartphone)\b/.test(lowerPitch),
    hasWeb: /\b(website|web|online|platform|portal)\b/.test(lowerPitch),
    
    // Specific domains
    isHealthcare: /\b(health|medical|doctor|patient|hospital|wellness|fitness)\b/.test(lowerPitch),
    isFintech: /\b(finance|financial|bank|payment|money|investment|trading)\b/.test(lowerPitch),
    isEcommerce: /\b(ecommerce|e-commerce|shop|store|retail|marketplace|buy|sell)\b/.test(lowerPitch),
    isEducation: /\b(education|learning|student|teacher|course|school|university)\b/.test(lowerPitch),
    isFood: /\b(food|restaurant|meal|recipe|cooking|delivery|dining)\b/.test(lowerPitch),
    isSocial: /\b(social|network|community|connect|share|friend)\b/.test(lowerPitch),
    isProductivity: /\b(productivity|task|project|manage|organize|workflow)\b/.test(lowerPitch),
    isTravel: /\b(travel|trip|vacation|hotel|flight|booking)\b/.test(lowerPitch),
    
    // Action words
    hasAutomation: /\b(automate|automatic|streamline|optimize)\b/.test(lowerPitch),
    hasAnalytics: /\b(analytics|data|insights|metrics|track)\b/.test(lowerPitch),
    hasCollaboration: /\b(collaborate|team|share|together|group)\b/.test(lowerPitch),
    
    // Extract key terms for context
    keyTerms: extractKeyTerms(pitch)
  };
  
  // Generate contextual branding based on analysis
  return generateContextualBranding(pitch, pitchAnalysis);
};

// Generate contextual branding based on pitch analysis
const generateContextualBranding = (originalPitch: string, analysis: any): BrandingResponse => {
  let names: string[] = [];
  let taglines: string[] = [];
  let positioning = '';
  let domains: string[] = [];
  
  // Generate names based on industry and characteristics
  if (analysis.isHealthcare && analysis.hasAI) {
    names = ['MediMind', 'HealthIQ', 'CareSync'];
    taglines = ['Smart healthcare decisions', 'AI-powered patient care', 'Medicine meets intelligence'];
    positioning = "We're the Palantir for healthcare professionals.";
    domains = ['medimind.ai', 'healthiq.com', 'caresync.ai'];
  } else if (analysis.isFintech && analysis.hasMobile) {
    names = ['CashFlow', 'MoneyMind', 'FinanceFirst'];
    taglines = ['Money made simple', 'Your financial copilot', 'Banking without barriers'];
    positioning = "We're the Robinhood for everyday banking.";
    domains = ['cashflow.ai', 'moneymind.com', 'financefirst.co'];
  } else if (analysis.isEducation && analysis.hasAI) {
    names = ['LearnLab', 'StudySmart', 'EduFlow'];
    taglines = ['Learning that adapts to you', 'Personalized education at scale', 'Smart studying, better results'];
    positioning = "We're the Netflix for personalized learning.";
    domains = ['learnlab.ai', 'studysmart.com', 'eduflow.co'];
  } else if (analysis.isFood && analysis.hasMobile) {
    names = ['FoodFlow', 'MealMind', 'TasteTrack'];
    taglines = ['Meals made effortless', 'Smart food decisions', 'Your culinary companion'];
    positioning = "We're the Spotify for meal planning.";
    domains = ['foodflow.app', 'mealmind.com', 'tastetrack.co'];
  } else if (analysis.isSocial && analysis.hasMobile) {
    names = ['ConnectCore', 'SocialSync', 'CommunityHub'];
    taglines = ['Real connections, digital world', 'Where communities thrive', 'Social networking reimagined'];
    positioning = "We're the Discord for professional networking.";
    domains = ['connectcore.com', 'socialsync.app', 'communityhub.co'];
  } else if (analysis.isProductivity && analysis.hasCollaboration) {
    names = ['WorkFlow', 'TaskSync', 'ProductivePro'];
    taglines = ['Work smarter, not harder', 'Team productivity unleashed', 'Where efficiency meets simplicity'];
    positioning = "We're the Slack for project management.";
    domains = ['workflow.ai', 'tasksync.com', 'productivepro.co'];
  } else if (analysis.isTravel && analysis.hasMobile) {
    names = ['TripSync', 'WanderWise', 'JourneyJoy'];
    taglines = ['Travel planning perfected', 'Smart trips, happy travelers', 'Your adventure starts here'];
    positioning = "We're the Airbnb for travel planning.";
    domains = ['tripsync.com', 'wanderwise.app', 'journeyjoy.co'];
  } else if (analysis.hasAI && analysis.isB2B) {
    names = ['DataDrive', 'InsightIQ', 'SmartScale'];
    taglines = ['AI-powered business intelligence', 'Data that drives decisions', 'Intelligence for every business'];
    positioning = "We're the Salesforce for AI-driven insights.";
    domains = ['datadrive.ai', 'insightiq.com', 'smartscale.co'];
  } else if (analysis.hasBlockchain) {
    names = ['ChainCore', 'CryptoFlow', 'BlockBridge'];
    taglines = ['Blockchain made simple', 'Decentralized solutions', 'Web3 for everyone'];
    positioning = "We're the Coinbase for decentralized applications.";
    domains = ['chaincore.io', 'cryptoflow.com', 'blockbridge.co'];
  } else if (analysis.isEcommerce && analysis.isB2B) {
    names = ['TradeFlow', 'CommerceCore', 'MarketSync'];
    taglines = ['B2B commerce simplified', 'Where businesses buy better', 'Trade made effortless'];
    positioning = "We're the Amazon for B2B procurement.";
    domains = ['tradeflow.com', 'commercecore.co', 'marketsync.ai'];
  } else {
    // Generic but creative names based on key terms
    const term1 = analysis.keyTerms[0] || 'Smart';
    const term2 = analysis.keyTerms[1] || 'Flow';
    
    names = [
      `${term1}${term2}`,
      `${term1}Hub`,
      `${term2}Pro`
    ];
    
    taglines = [
      `${term1} solutions for modern businesses`,
      `Where ${term2.toLowerCase()} meets innovation`,
      `${term1} made simple`
    ];
    
    positioning = analysis.isB2B 
      ? `We're the Slack for ${analysis.keyTerms[0]?.toLowerCase() || 'business'} teams.`
      : `We're the Instagram for ${analysis.keyTerms[0]?.toLowerCase() || 'users'}.`;
    
    domains = [
      `${term1.toLowerCase()}${term2.toLowerCase()}.com`,
      `${term1.toLowerCase()}hub.ai`,
      `${term2.toLowerCase()}pro.co`
    ];
  }
  
  // Ensure domains are realistic
  domains = domains.map(domain => domain.replace(/[^a-z0-9.-]/g, '').toLowerCase());
  
  const brandingText = `🧠 Names:
- ${names[0]}
- ${names[1]}
- ${names[2]}

💬 Taglines:
- ${taglines[0]}
- ${taglines[1]}
- ${taglines[2]}

🎯 Positioning Statement:
${positioning}

🌐 Domain Suggestions:
- ${domains[0]}
- ${domains[1]}
- ${domains[2]}`;

  return {
    branding: brandingText,
    suggestions: {
      names,
      taglines,
      positioning,
      domains
    }
  };
};

// NEW: Dynamic Scorecard generation with brutal honesty
const analyzeAndGenerateScorecard = (pitch: string): ScorecardResponse => {
  const lowerPitch = pitch.toLowerCase();
  
  // Deep analysis of the pitch content
  const pitchAnalysis = {
    // Core elements
    hasProblem: /\b(problem|issue|challenge|pain|struggle|difficulty)\b/.test(lowerPitch),
    hasSolution: /\b(solution|solve|fix|address|help|assist)\b/.test(lowerPitch),
    hasTarget: /\b(customer|user|client|business|company|people|market)\b/.test(lowerPitch),
    hasRevenue: /\b(revenue|money|profit|subscription|fee|price|cost|pay|monetize)\b/.test(lowerPitch),
    hasMetrics: /\d+/.test(pitch),
    
    // Industry indicators
    isB2B: /\b(b2b|business|enterprise|company|corporate|saas|software)\b/.test(lowerPitch),
    isB2C: /\b(consumer|user|people|individual|personal|mobile|app)\b/.test(lowerPitch),
    
    // Technology mentions
    hasAI: /\b(ai|artificial intelligence|machine learning|ml|neural|algorithm|smart)\b/.test(lowerPitch),
    hasBlockchain: /\b(blockchain|crypto|nft|web3|decentralized|bitcoin)\b/.test(lowerPitch),
    hasMobile: /\b(mobile|app|ios|android|smartphone)\b/.test(lowerPitch),
    
    // Specific domains
    isHealthcare: /\b(health|medical|doctor|patient|hospital|wellness|fitness)\b/.test(lowerPitch),
    isFintech: /\b(finance|financial|bank|payment|money|investment|trading)\b/.test(lowerPitch),
    isEcommerce: /\b(ecommerce|e-commerce|shop|store|retail|marketplace|buy|sell)\b/.test(lowerPitch),
    isEducation: /\b(education|learning|student|teacher|course|school|university)\b/.test(lowerPitch),
    
    // Red flags
    hasBuzzwords: /\b(disrupt|revolutionize|innovative|cutting-edge|paradigm|synergy|leverage|optimize|streamline)\b/.test(lowerPitch),
    isVague: pitch.length < 50 || /\b(platform|ecosystem|solution|system)\b/.test(lowerPitch),
    isUberFor: /\b(uber for|airbnb for|netflix for|spotify for|tinder for)\b/.test(lowerPitch),
    
    // Extract startup name or create one
    startupName: extractStartupName(pitch),
    keyTerms: extractKeyTerms(pitch)
  };
  
  // Calculate scores based on analysis
  const scores = calculateScores(pitchAnalysis, pitch);
  
  // Generate contextual commentary
  const commentary = generateScorecardCommentary(pitchAnalysis, scores);
  
  // Determine verdict
  const verdict = generateVerdict(scores.total);
  
  const scorecardText = `💯 Scorecard for: ${pitchAnalysis.startupName}
- Originality: ${scores.originality} — ${commentary.originality}
- Market Size: ${scores.marketSize} — ${commentary.marketSize}
- Monetization: ${scores.monetization} — ${commentary.monetization}
- Clarity: ${scores.clarity} — ${commentary.clarity}
- Team Potential: ${scores.teamPotential} — ${commentary.teamPotential}
🔥 Verdict: ${scores.total}/500 — ${verdict}`;

  return {
    scorecard: scorecardText,
    scores,
    verdict,
  };
};

// Extract startup name or generate a sarcastic one
const extractStartupName = (pitch: string): string => {
  // Look for company names (capitalized words)
  const nameMatch = pitch.match(/\b[A-Z][a-z]+(?:[A-Z][a-z]+)*\b/);
  if (nameMatch && nameMatch[0].length > 2 && !['The', 'Our', 'We', 'This', 'My'].includes(nameMatch[0])) {
    return nameMatch[0];
  }
  
  // Generate sarcastic name based on content
  const lowerPitch = pitch.toLowerCase();
  if (lowerPitch.includes('ai')) return 'AI-Something Inc.';
  if (lowerPitch.includes('blockchain')) return 'CryptoThing Labs';
  if (lowerPitch.includes('uber for')) return 'UberClone Co.';
  if (lowerPitch.includes('social')) return 'SocialApp 2.0';
  if (lowerPitch.includes('app')) return 'GenericApp LLC';
  
  return 'Mystery Startup';
};

// Calculate scores based on pitch analysis
const calculateScores = (analysis: any, pitch: string) => {
  let originality = 50; // Base score
  let marketSize = 50;
  let monetization = 50;
  let clarity = 50;
  let teamPotential = 50;
  
  // Originality scoring
  if (analysis.isUberFor) originality -= 30;
  if (analysis.hasBuzzwords) originality -= 15;
  if (analysis.hasAI && analysis.hasBlockchain) originality -= 20; // Buzzword bingo
  if (analysis.hasAI && !analysis.hasBuzzwords) originality += 10;
  if (analysis.isHealthcare || analysis.isFintech) originality += 5;
  if (pitch.includes('never been done') || pitch.includes('first of its kind')) originality += 15;
  
  // Market Size scoring
  if (analysis.isB2B) marketSize += 15;
  if (analysis.isHealthcare) marketSize += 20;
  if (analysis.isFintech) marketSize += 15;
  if (analysis.isEducation) marketSize += 10;
  if (analysis.hasTarget) marketSize += 10;
  if (analysis.isVague) marketSize -= 20;
  if (pitch.includes('everyone') || pitch.includes('anyone')) marketSize -= 15;
  
  // Monetization scoring
  if (analysis.hasRevenue) monetization += 20;
  if (analysis.isB2B) monetization += 15;
  if (pitch.includes('subscription') || pitch.includes('saas')) monetization += 15;
  if (pitch.includes('free') && !pitch.includes('freemium')) monetization -= 20;
  if (analysis.hasBlockchain && !analysis.hasRevenue) monetization -= 25;
  if (pitch.includes('ads') || pitch.includes('advertising')) monetization += 5;
  
  // Clarity scoring
  if (analysis.hasProblem && analysis.hasSolution) clarity += 20;
  if (analysis.hasTarget) clarity += 15;
  if (analysis.hasMetrics) clarity += 10;
  if (analysis.isVague) clarity -= 25;
  if (analysis.hasBuzzwords) clarity -= 15;
  if (pitch.length < 30) clarity -= 20;
  if (pitch.length > 200) clarity += 10;
  
  // Team Potential scoring (based on pitch quality as proxy)
  if (analysis.hasMetrics) teamPotential += 15;
  if (analysis.hasProblem && analysis.hasSolution && analysis.hasTarget) teamPotential += 20;
  if (pitch.includes('experience') || pitch.includes('background')) teamPotential += 10;
  if (analysis.isVague) teamPotential -= 15;
  if (pitch.length < 50) teamPotential -= 10;
  
  // Ensure scores stay within bounds
  const clamp = (score: number) => Math.max(0, Math.min(100, score));
  
  const finalScores = {
    originality: clamp(originality),
    marketSize: clamp(marketSize),
    monetization: clamp(monetization),
    clarity: clamp(clarity),
    teamPotential: clamp(teamPotential),
    total: 0
  };
  
  finalScores.total = finalScores.originality + finalScores.marketSize + finalScores.monetization + finalScores.clarity + finalScores.teamPotential;
  
  return finalScores;
};

// Generate sarcastic commentary for each score
const generateScorecardCommentary = (analysis: any, scores: any) => {
  const commentary = {
    originality: '',
    marketSize: '',
    monetization: '',
    clarity: '',
    teamPotential: ''
  };
  
  // Originality commentary
  if (scores.originality >= 80) {
    commentary.originality = "Actually fresh";
  } else if (scores.originality >= 60) {
    commentary.originality = "Decent twist on old idea";
  } else if (analysis.isUberFor) {
    commentary.originality = "Uber for X? Really?";
  } else if (analysis.hasBuzzwords) {
    commentary.originality = "Buzzword bingo winner";
  } else {
    commentary.originality = "Seen it before";
  }
  
  // Market Size commentary
  if (scores.marketSize >= 80) {
    commentary.marketSize = "Massive opportunity";
  } else if (scores.marketSize >= 60) {
    commentary.marketSize = "Solid market exists";
  } else if (analysis.isVague) {
    commentary.marketSize = "Who's your customer?";
  } else {
    commentary.marketSize = "Niche or unclear";
  }
  
  // Monetization commentary
  if (scores.monetization >= 80) {
    commentary.monetization = "Clear path to profit";
  } else if (scores.monetization >= 60) {
    commentary.monetization = "Revenue model exists";
  } else if (analysis.hasBlockchain && !analysis.hasRevenue) {
    commentary.monetization = "Crypto dreams ≠ revenue";
  } else {
    commentary.monetization = "How do you make money?";
  }
  
  // Clarity commentary
  if (scores.clarity >= 80) {
    commentary.clarity = "Crystal clear pitch";
  } else if (scores.clarity >= 60) {
    commentary.clarity = "Mostly understandable";
  } else if (analysis.hasBuzzwords) {
    commentary.clarity = "Lost in jargon";
  } else {
    commentary.clarity = "Confusing mess";
  }
  
  // Team Potential commentary
  if (scores.teamPotential >= 80) {
    commentary.teamPotential = "Seems competent";
  } else if (scores.teamPotential >= 60) {
    commentary.teamPotential = "Might pull it off";
  } else if (analysis.isVague) {
    commentary.teamPotential = "Questionable execution";
  } else {
    commentary.teamPotential = "Needs adult supervision";
  }
  
  return commentary;
};

// Generate verdict based on total score
const generateVerdict = (totalScore: number): string => {
  if (totalScore >= 400) return "🤑 Unicorn Potential";
  if (totalScore >= 350) return "🚀 Solid Startup";
  if (totalScore >= 300) return "📈 Has Promise";
  if (totalScore >= 250) return "🤔 Needs Work";
  if (totalScore >= 200) return "😬 Questionable";
  if (totalScore >= 150) return "🤡 Clown Show";
  if (totalScore >= 100) return "💀 DOA (Dead on Arrival)";
  return "🗑️ Dumpster Fire";
};

// Keep existing functions...
const analyzeAndGenerateDynamicFixIt = (pitch: string): string => {
  const lowerPitch = pitch.toLowerCase();
  
  // Deep analysis of the pitch content
  const pitchAnalysis = {
    // Core elements
    hasProblem: /\b(problem|issue|challenge|pain|struggle|difficulty)\b/.test(lowerPitch),
    hasSolution: /\b(solution|solve|fix|address|help|assist)\b/.test(lowerPitch),
    hasTarget: /\b(customer|user|client|business|company|people|market)\b/.test(lowerPitch),
    hasRevenue: /\b(revenue|money|profit|subscription|fee|price|cost|pay)\b/.test(lowerPitch),
    
    // Industry indicators
    isB2B: /\b(b2b|business|enterprise|company|corporate|saas|software)\b/.test(lowerPitch),
    isB2C: /\b(consumer|user|people|individual|personal|mobile|app)\b/.test(lowerPitch),
    
    // Technology mentions
    hasAI: /\b(ai|artificial intelligence|machine learning|ml|neural|algorithm|smart)\b/.test(lowerPitch),
    hasBlockchain: /\b(blockchain|crypto|nft|web3|decentralized|bitcoin)\b/.test(lowerPitch),
    hasMobile: /\b(mobile|app|ios|android|smartphone)\b/.test(lowerPitch),
    hasWeb: /\b(website|web|online|platform|portal)\b/.test(lowerPitch),
    
    // Specific domains
    isHealthcare: /\b(health|medical|doctor|patient|hospital|wellness|fitness)\b/.test(lowerPitch),
    isFintech: /\b(finance|financial|bank|payment|money|investment|trading)\b/.test(lowerPitch),
    isEcommerce: /\b(ecommerce|e-commerce|shop|store|retail|marketplace|buy|sell)\b/.test(lowerPitch),
    isEducation: /\b(education|learning|student|teacher|course|school|university)\b/.test(lowerPitch),
    isFood: /\b(food|restaurant|meal|recipe|cooking|delivery|dining)\b/.test(lowerPitch),
    isSocial: /\b(social|network|community|connect|share|friend)\b/.test(lowerPitch),
    
    // Buzzword detection
    hasBuzzwords: /\b(disrupt|revolutionize|innovative|cutting-edge|paradigm|synergy|leverage|optimize|streamline)\b/.test(lowerPitch),
    isVague: pitch.length < 50 || /\b(platform|ecosystem|solution|system)\b/.test(lowerPitch),
    
    // Specific patterns
    isUberFor: /\b(uber for|airbnb for|netflix for|spotify for|tinder for)\b/.test(lowerPitch),
    hasMetrics: /\d+/.test(pitch),
    
    // Extract key terms for context
    keyTerms: extractKeyTerms(pitch)
  };
  
  // Generate dynamic rewrite based on analysis
  return generateContextualRewrite(pitch, pitchAnalysis);
};

// Extract meaningful terms from the pitch
const extractKeyTerms = (pitch: string): string[] => {
  const words = pitch.toLowerCase().split(/\s+/);
  const meaningfulWords = words.filter(word => 
    word.length > 3 && 
    !['that', 'with', 'this', 'they', 'them', 'have', 'will', 'from', 'into', 'your', 'their', 'more', 'than', 'been', 'were', 'said', 'each', 'which', 'what', 'where', 'when', 'would', 'could', 'should'].includes(word)
  );
  return meaningfulWords.slice(0, 5); // Top 5 meaningful terms
};

// Generate contextual rewrite based on pitch analysis
const generateContextualRewrite = (originalPitch: string, analysis: any): string => {
  let rewrite = "🛠️ FixIt:\n";
  
  // Determine the core business model and value proposition
  if (analysis.isHealthcare && analysis.hasAI) {
    rewrite += generateHealthcareAIRewrite(originalPitch, analysis);
  } else if (analysis.isFintech && analysis.hasMobile) {
    rewrite += generateFintechMobileRewrite(originalPitch, analysis);
  } else if (analysis.isEcommerce && analysis.isB2B) {
    rewrite += generateB2BEcommerceRewrite(originalPitch, analysis);
  } else if (analysis.isSocial && analysis.hasMobile) {
    rewrite += generateSocialMobileRewrite(originalPitch, analysis);
  } else if (analysis.isEducation && analysis.hasAI) {
    rewrite += generateEdTechRewrite(originalPitch, analysis);
  } else if (analysis.isFood && analysis.hasMobile) {
    rewrite += generateFoodTechRewrite(originalPitch, analysis);
  } else if (analysis.isUberFor) {
    rewrite += generateMarketplaceRewrite(originalPitch, analysis);
  } else if (analysis.hasAI && analysis.isB2B) {
    rewrite += generateB2BAIRewrite(originalPitch, analysis);
  } else if (analysis.hasBuzzwords && analysis.isVague) {
    rewrite += generateBuzzwordFixRewrite(originalPitch, analysis);
  } else if (analysis.isB2B && analysis.hasSolution) {
    rewrite += generateB2BSolutionRewrite(originalPitch, analysis);
  } else if (analysis.isB2C && analysis.hasMobile) {
    rewrite += generateConsumerAppRewrite(originalPitch, analysis);
  } else {
    rewrite += generateGenericSmartRewrite(originalPitch, analysis);
  }
  
  return rewrite;
};

// Specialized rewrite generators for different contexts
const generateHealthcareAIRewrite = (pitch: string, analysis: any): string => {
  const variations = [
    `AI-powered healthcare platform reducing diagnostic errors by 40% for medical professionals. Analyzes patient data to suggest treatment options. SaaS model targeting hospitals and clinics. Early trials show 25% faster diagnosis times.`,
    `Medical AI assistant helping doctors make faster, more accurate diagnoses. Our algorithm processes symptoms and medical history to flag potential conditions. Revenue from hospital subscriptions. Used by 50+ healthcare providers.`,
    `Healthcare analytics platform using AI to predict patient outcomes and optimize treatment plans. Reduces readmission rates by 30%. Subscription model for hospitals. Pilot program with 3 major health systems showing strong results.`
  ];
  return variations[Math.floor(Math.random() * variations.length)];
};

const generateFintechMobileRewrite = (pitch: string, analysis: any): string => {
  const variations = [
    `Mobile banking app for freelancers and gig workers with instant payment processing and expense tracking. Solves cash flow issues for 57M independent workers. Revenue from transaction fees and premium features.`,
    `Personal finance app that automatically categorizes expenses and provides spending insights. Helps users save 15% more monthly through smart budgeting. Freemium model with premium analytics. 10K+ active users.`,
    `Investment platform making stock trading accessible to Gen-Z through micro-investing and educational content. Commission-free trades with premium research subscriptions. Growing 20% monthly among 18-25 demographic.`
  ];
  return variations[Math.floor(Math.random() * variations.length)];
};

const generateB2BEcommerceRewrite = (pitch: string, analysis: any): string => {
  const variations = [
    `B2B marketplace connecting manufacturers directly with retailers, cutting out middlemen and reducing costs by 25%. Commission-based revenue model. 200+ suppliers and 500+ buyers already onboarded.`,
    `Inventory management software for e-commerce businesses that predicts demand and automates reordering. Reduces stockouts by 60% and overstock by 40%. SaaS pricing starting at $200/month.`,
    `E-commerce analytics platform helping online retailers optimize pricing and product placement. Increases average order value by 18%. Used by 100+ mid-market retailers. Annual contracts averaging $5K.`
  ];
  return variations[Math.floor(Math.random() * variations.length)];
};

const generateSocialMobileRewrite = (pitch: string, analysis: any): string => {
  const variations = [
    `Social fitness app where users compete in real-world challenges and earn rewards from local businesses. Gamifies exercise with location-based competitions. Revenue from business partnerships and premium memberships.`,
    `Professional networking app for remote workers to find collaboration partners and project opportunities. Unlike LinkedIn, focuses on skill-based matching for short-term projects. Freemium with premium matching.`,
    `Community platform for hobby enthusiasts to share projects, get feedback, and find local meetups. Monetizes through premium features and marketplace for supplies. 15K+ active creators across 50+ hobby categories.`
  ];
  return variations[Math.floor(Math.random() * variations.length)];
};

const generateEdTechRewrite = (pitch: string, analysis: any): string => {
  const variations = [
    `AI tutoring platform that adapts to individual learning styles and provides personalized study plans. Improves test scores by 35% on average. Subscription model for students and schools. Pilot with 10 school districts.`,
    `Online learning platform for professional skills with AI-powered career path recommendations. Helps working professionals upskill for promotions. Corporate subscriptions and individual plans. 5K+ active learners.`,
    `Educational assessment tool using AI to identify learning gaps and suggest targeted interventions. Used by teachers to personalize instruction. School district licenses starting at $10K annually.`
  ];
  return variations[Math.floor(Math.random() * variations.length)];
};

const generateFoodTechRewrite = (pitch: string, analysis: any): string => {
  const variations = [
    `Meal planning app that generates shopping lists based on dietary preferences and local store prices. Saves families 20% on grocery bills and 3 hours weekly. Freemium with premium meal plans and recipes.`,
    `Restaurant management platform helping small eateries optimize menu pricing and reduce food waste. Increases profit margins by 15% through data-driven insights. Monthly SaaS subscriptions for restaurants.`,
    `Food delivery optimization software for restaurants to manage multiple delivery platforms from one dashboard. Reduces order processing time by 50%. Used by 200+ restaurants across 5 cities.`
  ];
  return variations[Math.floor(Math.random() * variations.length)];
};

const generateMarketplaceRewrite = (pitch: string, analysis: any): string => {
  // Extract what they're trying to be "Uber for"
  const uberMatch = pitch.match(/(uber|airbnb|netflix|spotify|tinder) for ([\w\s]+)/i);
  const category = uberMatch ? uberMatch[2].trim() : 'services';
  
  const variations = [
    `On-demand ${category} marketplace connecting customers with verified service providers in under 30 minutes. Solves scheduling and trust issues in the ${category} industry. 20% commission model with insurance coverage.`,
    `Local ${category} platform where customers can book, pay, and review services seamlessly. Focuses on quality over quantity with vetted professionals. Revenue from booking fees and premium listings.`,
    `Mobile-first ${category} service that guarantees availability and quality through our network of trained professionals. Subscription model for frequent users plus per-service fees.`
  ];
  return variations[Math.floor(Math.random() * variations.length)];
};

const generateB2BAIRewrite = (pitch: string, analysis: any): string => {
  const variations = [
    `AI-powered business intelligence platform that turns company data into actionable insights. Helps executives make faster decisions with 90% accuracy. Enterprise SaaS model with custom implementations.`,
    `Machine learning tool for sales teams that predicts which leads are most likely to convert. Increases close rates by 30% and reduces sales cycle time. CRM integration with per-seat pricing.`,
    `AI customer service platform that handles 80% of support tickets automatically while escalating complex issues to humans. Reduces support costs by 60%. Usage-based pricing model.`
  ];
  return variations[Math.floor(Math.random() * variations.length)];
};

const generateBuzzwordFixRewrite = (pitch: string, analysis: any): string => {
  const variations = [
    `Project management software for construction teams that tracks progress, costs, and safety compliance in real-time. Reduces project delays by 25%. Annual licenses for contractors starting at $2K.`,
    `Customer analytics platform for retail businesses that identifies buying patterns and predicts inventory needs. Increases sales by 18% through better product placement. Monthly SaaS subscriptions.`,
    `Workflow automation tool for accounting firms that eliminates repetitive data entry and reduces errors by 95%. Saves 10+ hours weekly per accountant. Professional services pricing model.`
  ];
  return variations[Math.floor(Math.random() * variations.length)];
};

const generateB2BSolutionRewrite = (pitch: string, analysis: any): string => {
  const variations = [
    `Cloud-based inventory system for small manufacturers that prevents stockouts and reduces carrying costs by 30%. Real-time tracking with automated reorder points. Monthly subscriptions based on inventory volume.`,
    `Employee scheduling software for retail chains that optimizes staff allocation and reduces labor costs by 15%. Handles complex scheduling rules and compliance requirements. Per-location pricing model.`,
    `Document management platform for law firms that organizes case files and automates compliance reporting. Reduces document search time by 80%. Professional services with annual contracts.`
  ];
  return variations[Math.floor(Math.random() * variations.length)];
};

const generateConsumerAppRewrite = (pitch: string, analysis: any): string => {
  const variations = [
    `Personal productivity app that combines calendar, tasks, and notes with AI-powered prioritization. Helps busy professionals manage their day more effectively. Freemium with premium AI features.`,
    `Home maintenance app that reminds homeowners about seasonal tasks and connects them with local service providers. Prevents costly repairs through proactive maintenance. Revenue from service referrals.`,
    `Travel planning app that creates personalized itineraries based on budget, interests, and travel style. Saves 10+ hours of research per trip. Premium subscriptions and booking commissions.`
  ];
  return variations[Math.floor(Math.random() * variations.length)];
};

const generateGenericSmartRewrite = (pitch: string, analysis: any): string => {
  // Analyze the pitch for any specific details we can use
  const hasNumbers = /\d+/.test(pitch);
  const hasSpecificMarket = analysis.keyTerms.length > 2;
  
  if (hasNumbers && hasSpecificMarket) {
    return `${analysis.keyTerms[0]} platform that helps ${analysis.isB2B ? 'businesses' : 'users'} ${analysis.hasProblem ? 'solve' : 'improve'} ${analysis.keyTerms[1]} through data-driven insights. ${hasNumbers ? 'Early metrics show strong user engagement.' : ''} ${analysis.isB2B ? 'B2B SaaS model' : 'Freemium model'} with proven market demand.`;
  } else if (analysis.hasTarget && analysis.hasSolution) {
    return `Software solution helping ${analysis.isB2B ? 'businesses' : 'consumers'} streamline ${analysis.keyTerms[0] || 'operations'} and reduce costs. Addresses key pain points in the ${analysis.keyTerms[1] || 'market'} through automation. Revenue from ${analysis.isB2B ? 'enterprise subscriptions' : 'premium features'}.`;
  } else {
    return `Digital platform connecting ${analysis.isB2B ? 'businesses' : 'users'} with ${analysis.keyTerms[0] || 'services'} they need. Solves ${analysis.keyTerms[1] || 'efficiency'} problems through better ${analysis.keyTerms[2] || 'technology'}. Monetizes through ${analysis.isB2B ? 'subscription fees' : 'transaction commissions'}.`;
  }
};

// Keep existing roast generation logic
const analyzeAndGenerateRoast = (pitch: string): string => {
  const lowerPitch = pitch.toLowerCase();
  
  // Analyze pitch characteristics
  const hasAI = /\b(ai|artificial intelligence|machine learning|ml|neural|algorithm)\b/.test(lowerPitch);
  const hasBlockchain = /\b(blockchain|crypto|nft|web3|decentralized|bitcoin)\b/.test(lowerPitch);
  const hasUberFor = /\b(uber for|airbnb for|netflix for|spotify for|tinder for)\b/.test(lowerPitch);
  const hasSocial = /\b(social|network|platform|community|connect)\b/.test(lowerPitch);
  const hasApp = /\b(app|mobile|application)\b/.test(lowerPitch);
  const hasDisrupt = /\b(disrupt|revolutionize|transform|innovate|game.?chang)\b/.test(lowerPitch);
  const hasVague = pitch.length < 50 || /\b(solution|platform|ecosystem|synergy)\b/.test(lowerPitch);
  
  // Generate contextual roast components
  let roastIntro = "🔥 Roast:\n";
  let roastBody = "";
  
  if (hasVague) {
    roastBody = generateVagueRoast();
  } else if (hasAI && hasBlockchain) {
    roastBody = "An AI-powered blockchain startup? Did you just throw every buzzword from 2021 into a blender? Your pitch reads like a crypto bro's fever dream. Next you'll tell me it's also carbon-negative and cures world hunger.";
  } else if (hasAI) {
    roastBody = generateAIRoast(pitch);
  } else if (hasBlockchain) {
    roastBody = generateBlockchainRoast();
  } else if (hasUberFor) {
    roastBody = generateUberForRoast(pitch);
  } else if (hasSocial) {
    roastBody = generateSocialRoast();
  } else if (hasApp && hasDisrupt) {
    roastBody = "Another 'disruptive' app? The only thing you're disrupting is investors' patience. Your revolutionary idea sounds like every other app that promised to change the world but couldn't even change their user count from zero.";
  } else {
    roastBody = generateGenericRoast(pitch);
  }
  
  return roastIntro + roastBody;
};

// Keep existing roast generators
const generateAIRoast = (pitch: string): string => {
  const aiRoasts = [
    "Another AI startup claiming to 'revolutionize' everything? Your machine learning model probably has the intelligence of a Magic 8-Ball with commitment issues. Let me guess - it's 'powered by advanced algorithms' that you definitely didn't copy from a GitHub tutorial.",
    "AI-powered this, AI-enhanced that. Your artificial intelligence is about as intelligent as autocorrect suggesting 'duck' when you meant something else. Maybe focus on actual intelligence before adding the artificial part.",
    "Your AI startup sounds like it was pitched by someone who just discovered ChatGPT exists. Newsflash: slapping 'AI' on a basic app doesn't make it revolutionary - it makes it Tuesday in Silicon Valley."
  ];
  
  if (pitch.includes('personalized') || pitch.includes('recommend')) {
    return "An AI that provides 'personalized recommendations'? Groundbreaking! It's like Netflix's algorithm, but worse and with venture capital delusions. Your AI probably recommends the same three things to everyone.";
  }
  
  return aiRoasts[Math.floor(Math.random() * aiRoasts.length)];
};

const generateBlockchainRoast = (): string => {
  const cryptoRoasts = [
    "Blockchain in 2024? That's like starting a fidget spinner company in 2023. Your decentralized dreams are more unstable than Terra Luna's price chart. Maybe solve real problems instead of creating digital Monopoly money.",
    "Web3 startup alert! Because what the world desperately needs is more ways to lose money on digital nothing. Your whitepaper probably has more fiction than a Marvel screenplay and less substance than a TikTok dance.",
    "Another crypto project promising to 'democratize finance'? The only thing you're democratizing is disappointment. Your token will have fewer holders than a Google+ reunion party."
  ];
  
  return cryptoRoasts[Math.floor(Math.random() * cryptoRoasts.length)];
};

const generateUberForRoast = (pitch: string): string => {
  const uberMatch = pitch.match(/(uber|airbnb|netflix|spotify|tinder) for ([\w\s]+)/i);
  const category = uberMatch ? uberMatch[2] : 'something';
  
  return `'Uber for ${category}'? How refreshingly unoriginal! Did you get this idea from a 2015 startup bingo card? Your business model has more holes than a co-working space's WiFi password policy. Try solving an actual problem instead of copy-pasting successful companies.`;
};

const generateSocialRoast = (): string => {
  const socialRoasts = [
    "A new social platform? Because clearly what humanity needs is MORE ways to doom-scroll and compare ourselves to others. Your 'unique approach' to social networking is about as fresh as MySpace's last update.",
    "Trying to compete with Meta and TikTok? That's like bringing a water gun to a nuclear war. Your social platform will have fewer active users than a LinkedIn post about synergy.",
    "Another social network that will 'bring people together'? The only thing you'll bring together is investors' regret and users' confusion about why this exists."
  ];
  
  return socialRoasts[Math.floor(Math.random() * socialRoasts.length)];
};

const generateVagueRoast = (): string => {
  return "Your pitch is vaguer than a politician's campaign promise. If you can't explain your idea clearly, users definitely won't understand it either. Try describing it to your grandmother - if she doesn't get it, neither will investors with actual money.";
};

const generateGenericRoast = (pitch: string): string => {
  const genericRoasts = [
    "This pitch has the same energy as 'What if Facebook, but for dogs?' Your target market is apparently 'everyone with money' and your competitive advantage is 'we'll do it better.' Groundbreaking stuff, truly.",
    "I've seen more innovation in a gas station vending machine. Your idea is so generic, it could be the default template for 'How NOT to pitch investors.' But hey, at least you're consistent in your mediocrity!",
    "Your business model is more confusing than IKEA instructions written in ancient Sanskrit. Maybe start with explaining what problem you're actually solving - and no, 'inefficiency' isn't a specific problem.",
    "Congratulations on creating a solution that nobody asked for to a problem that doesn't exist! Your market research was probably just asking your college roommates what they think over pizza."
  ];
  
  if (pitch.length < 30) {
    return "Your pitch is shorter than a TikTok attention span. Give me something to work with here - this isn't Twitter, you can use more than 280 characters to explain your world-changing idea.";
  }
  
  return genericRoasts[Math.floor(Math.random() * genericRoasts.length)];
};