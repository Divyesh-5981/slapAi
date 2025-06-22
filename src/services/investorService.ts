// Investor Simulator Service - Generates dynamic startup pitches and evaluates investment decisions
export interface StartupPitch {
  id: string;
  companyName: string;
  pitch: string;
  category: string;
  quality: 'great' | 'mediocre' | 'terrible';
  actualOutcome: 'success' | 'failure' | 'pivot';
  valuation: string;
  founders: string;
  traction: string;
  redFlags?: string[];
  greenFlags?: string[];
}

export interface InvestmentDecision {
  decision: 'invest' | 'pass';
  confidence: number; // 1-5 scale
  reasoning?: string;
}

export interface InvestmentResult {
  correct: boolean;
  explanation: string;
  actualOutcome: string;
  points: number;
  vcReaction: string;
}

export interface InvestorProfile {
  totalDeals: number;
  correctDecisions: number;
  accuracy: number;
  totalPoints: number;
  rank: string;
  level: number;
  streak: number;
  bestStreak: number;
}

// VC-themed investor ranks
export const INVESTOR_RANKS = [
  { level: 0, name: 'Intern with Coffee', minAccuracy: 0, minDeals: 0, icon: '☕', color: '#6b7280' },
  { level: 1, name: 'Junior Associate', minAccuracy: 30, minDeals: 5, icon: '📊', color: '#3b82f6' },
  { level: 2, name: 'Investment Analyst', minAccuracy: 45, minDeals: 15, icon: '🔍', color: '#8b5cf6' },
  { level: 3, name: 'Senior Associate', minAccuracy: 55, minDeals: 25, icon: '📈', color: '#10b981' },
  { level: 4, name: 'Principal', minAccuracy: 65, minDeals: 40, icon: '💼', color: '#f59e0b' },
  { level: 5, name: 'VP of Investments', minAccuracy: 70, minDeals: 60, icon: '🎯', color: '#ef4444' },
  { level: 6, name: 'Managing Director', minAccuracy: 75, minDeals: 80, icon: '👔', color: '#8b5cf6' },
  { level: 7, name: 'General Partner', minAccuracy: 80, minDeals: 100, icon: '🤝', color: '#059669' },
  { level: 8, name: 'Legendary VC', minAccuracy: 85, minDeals: 150, icon: '🏆', color: '#dc2626' },
  { level: 9, name: 'Unicorn Whisperer', minAccuracy: 90, minDeals: 200, icon: '🦄', color: '#7c3aed' },
  { level: 10, name: 'Warren Buffett Jr.', minAccuracy: 95, minDeals: 300, icon: '👑', color: '#fbbf24' }
];

// Pitch templates with different quality levels
const PITCH_TEMPLATES = {
  great: [
    {
      category: 'B2B SaaS',
      template: '{company} is a {product} that helps {target} {solution}. We have {traction} and {revenue}. Our team includes {founders}.',
      variables: {
        company: ['DataFlow', 'SalesForce Pro', 'WorkStream', 'CloudSync', 'TeamHub'],
        product: ['project management platform', 'CRM solution', 'analytics dashboard', 'automation tool'],
        target: ['mid-market companies', 'enterprise sales teams', 'growing startups', 'remote teams'],
        solution: ['reduce project delays by 40%', 'increase sales conversion by 60%', 'automate repetitive tasks', 'improve team collaboration'],
        traction: ['500+ paying customers', '150% YoY growth', '$2M ARR', '95% customer retention'],
        revenue: ['$50K MRR growing 15% monthly', '$100K MRR with 20% margins', 'profitable since month 6'],
        founders: ['ex-Google PM and ex-Salesforce engineer', 'former McKinsey consultant and Stanford CS PhD', 'repeat entrepreneur with previous exit']
      },
      outcome: 'success',
      greenFlags: ['Strong traction', 'Experienced team', 'Clear market need', 'Proven revenue model'],
      points: 15
    },
    {
      category: 'FinTech',
      template: '{company} democratizes {service} for {target}. We\'ve processed {volume} and have {partnerships}. Led by {founders}.',
      variables: {
        company: ['PayFlow', 'InvestSmart', 'CreditBoost', 'WealthWise', 'MoneyMind'],
        service: ['investment management', 'credit scoring', 'payment processing', 'financial planning'],
        target: ['Gen-Z consumers', 'small business owners', 'gig economy workers', 'underbanked populations'],
        volume: ['$10M in transactions', '$5M in managed assets', '50K+ users onboarded'],
        partnerships: ['partnerships with 3 major banks', 'integrations with Plaid and Stripe', 'backing from Visa'],
        founders: ['former Goldman Sachs VP and fintech veteran', 'ex-Square engineer and Wharton MBA', 'serial fintech entrepreneur']
      },
      outcome: 'success',
      greenFlags: ['Regulated industry expertise', 'Strong partnerships', 'Growing market', 'Experienced team'],
      points: 15
    }
  ],
  mediocre: [
    {
      category: 'Consumer App',
      template: '{company} is a {type} app for {target}. We have {users} and plan to monetize through {monetization}. Founded by {founders}.',
      variables: {
        company: ['SocialHub', 'ConnectMe', 'ShareSpace', 'FriendFinder', 'ChatFlow'],
        type: ['social networking', 'dating', 'productivity', 'lifestyle', 'entertainment'],
        target: ['millennials', 'college students', 'young professionals', 'busy parents'],
        users: ['10K downloads', '5K monthly active users', '2K registered users', '15K app installs'],
        monetization: ['premium subscriptions', 'in-app purchases', 'advertising', 'freemium model'],
        founders: ['recent college graduates', 'first-time entrepreneurs', 'former startup employees', 'industry newcomers']
      },
      outcome: 'pivot',
      redFlags: ['Crowded market', 'Unclear monetization', 'Limited traction', 'Inexperienced team'],
      points: 5
    },
    {
      category: 'E-commerce',
      template: '{company} sells {products} online to {target}. We\'ve done {sales} and are expanding to {expansion}. Team has {experience}.',
      variables: {
        company: ['EcoGoods', 'TechMart', 'StyleBox', 'HomeEssentials', 'GadgetHub'],
        products: ['sustainable products', 'tech accessories', 'fashion items', 'home goods', 'electronics'],
        target: ['eco-conscious consumers', 'tech enthusiasts', 'fashion-forward millennials', 'homeowners'],
        sales: ['$50K in revenue', '$25K in first quarter', '$100K lifetime sales', '$30K monthly revenue'],
        expansion: ['new product categories', 'international markets', 'B2B sales', 'retail partnerships'],
        experience: ['e-commerce background', 'retail experience', 'marketing expertise', 'operations knowledge']
      },
      outcome: 'failure',
      redFlags: ['Competitive market', 'Low margins', 'Inventory challenges', 'Customer acquisition costs'],
      points: 5
    }
  ],
  terrible: [
    {
      category: 'Blockchain/Crypto',
      template: '{company} is revolutionizing {industry} with blockchain technology. Our {token} will disrupt {target}. We\'re raising {amount} for {purpose}.',
      variables: {
        company: ['CryptoFlow', 'BlockChain Solutions', 'TokenVerse', 'DecentraApp', 'Web3 Innovations'],
        industry: ['supply chain', 'healthcare', 'education', 'real estate', 'entertainment'],
        token: ['utility token', 'governance token', 'NFT marketplace', 'DeFi protocol', 'DAO platform'],
        target: ['traditional industries', 'centralized systems', 'outdated processes', 'legacy platforms'],
        amount: ['$5M', '$10M', '$2M', '$50M', '$1M'],
        purpose: ['platform development', 'token distribution', 'marketing', 'team expansion', 'partnerships']
      },
      outcome: 'failure',
      redFlags: ['Buzzword heavy', 'No clear use case', 'Regulatory risks', 'Market timing'],
      points: -5
    },
    {
      category: 'AI Everything',
      template: '{company} uses AI to {action} for {target}. Our proprietary algorithm {capability}. We\'re the {comparison} but with AI.',
      variables: {
        company: ['AI Solutions', 'SmartTech', 'IntelliApp', 'NeuralFlow', 'AlgoMind'],
        action: ['optimize workflows', 'predict outcomes', 'automate processes', 'enhance productivity', 'revolutionize operations'],
        target: ['businesses', 'consumers', 'enterprises', 'startups', 'organizations'],
        capability: ['learns from data', 'provides insights', 'makes predictions', 'automates decisions', 'optimizes performance'],
        comparison: ['Uber', 'Airbnb', 'Netflix', 'Spotify', 'Amazon']
      },
      outcome: 'failure',
      redFlags: ['Vague AI claims', 'No technical depth', 'Overused comparisons', 'Unclear differentiation'],
      points: -5
    },
    {
      category: 'Uber for X',
      template: '{company} is the Uber for {service}. Users can {action} through our app. We take a {commission} commission and have {traction}.',
      variables: {
        company: ['ServiceFlow', 'OnDemandPro', 'QuickConnect', 'InstantService', 'AppConnect'],
        service: ['dog walking', 'lawn care', 'house cleaning', 'grocery shopping', 'laundry'],
        action: ['book services instantly', 'find providers nearby', 'schedule appointments', 'pay securely'],
        commission: ['20%', '15%', '25%', '30%', '10%'],
        traction: ['100 users', '50 service providers', '200 downloads', '10 completed bookings']
      },
      outcome: 'failure',
      redFlags: ['Oversaturated model', 'High customer acquisition cost', 'Low barriers to entry', 'Unit economics unclear'],
      points: -5
    }
  ]
};

// Generate a random startup pitch
export const generateRandomPitch = (): StartupPitch => {
  const qualities = ['great', 'mediocre', 'terrible'] as const;
  const quality = qualities[Math.floor(Math.random() * qualities.length)];
  const templates = PITCH_TEMPLATES[quality];
  const template = templates[Math.floor(Math.random() * templates.length)];
  
  let pitch = template.template;
  
  // Replace variables in template
  Object.entries(template.variables).forEach(([key, values]) => {
    const value = values[Math.floor(Math.random() * values.length)];
    pitch = pitch.replace(`{${key}}`, value);
  });
  
  // Extract company name from pitch
  const companyMatch = pitch.match(/^(\w+)/);
  const companyName = companyMatch ? companyMatch[1] : 'StartupCo';
  
  // Generate additional details
  const valuations = ['$1M', '$5M', '$10M', '$25M', '$50M', '$100M', '$500M'];
  const founderTypes = [
    'Serial entrepreneur with 2 exits',
    'Former FAANG engineer',
    'Ex-McKinsey consultant',
    'Industry veteran with 15 years experience',
    'Recent Stanford MBA',
    'First-time founder',
    'Former startup CTO',
    'Ex-Goldman Sachs VP'
  ];
  
  const tractionMetrics = [
    '10% month-over-month growth',
    '500+ beta users',
    '$50K in pre-orders',
    '95% customer satisfaction',
    '3 enterprise pilots',
    '50K app downloads',
    '$100K ARR',
    'Profitable since launch'
  ];
  
  return {
    id: generatePitchId(),
    companyName,
    pitch,
    category: template.category,
    quality,
    actualOutcome: template.outcome as 'success' | 'failure' | 'pivot',
    valuation: valuations[Math.floor(Math.random() * valuations.length)],
    founders: founderTypes[Math.floor(Math.random() * founderTypes.length)],
    traction: tractionMetrics[Math.floor(Math.random() * tractionMetrics.length)],
    redFlags: template.redFlags,
    greenFlags: template.greenFlags
  };
};

// Evaluate investment decision
export const evaluateInvestment = (pitch: StartupPitch, decision: InvestmentDecision): InvestmentResult => {
  const shouldInvest = pitch.quality === 'great' || (pitch.quality === 'mediocre' && pitch.actualOutcome === 'success');
  const correct = (decision.decision === 'invest') === shouldInvest;
  
  let points = 0;
  let explanation = '';
  let vcReaction = '';
  
  if (correct) {
    points = pitch.quality === 'great' ? 15 : pitch.quality === 'mediocre' ? 10 : 5;
    
    if (decision.decision === 'invest' && pitch.quality === 'great') {
      explanation = `Excellent call! ${pitch.companyName} became a major success. ${pitch.greenFlags?.join(', ')}.`;
      vcReaction = "🎯 You've got the golden touch! This is why you're in the big leagues.";
    } else if (decision.decision === 'pass' && pitch.quality === 'terrible') {
      explanation = `Smart pass! ${pitch.companyName} failed spectacularly. ${pitch.redFlags?.join(', ')}.`;
      vcReaction = "🧠 Your BS detector is finely tuned. You saved the fund millions!";
    } else {
      explanation = `Good instincts! You correctly identified this as a ${pitch.quality} opportunity.`;
      vcReaction = "👍 Solid decision-making. You're learning the game.";
    }
  } else {
    points = pitch.quality === 'terrible' ? -10 : -5;
    
    if (decision.decision === 'invest' && pitch.quality === 'terrible') {
      explanation = `Ouch! ${pitch.companyName} was a complete disaster. ${pitch.redFlags?.join(', ')}.`;
      vcReaction = "🤦‍♂️ Did you even read the pitch? This had red flags everywhere!";
    } else if (decision.decision === 'pass' && pitch.quality === 'great') {
      explanation = `You missed a unicorn! ${pitch.companyName} became a massive success. ${pitch.greenFlags?.join(', ')}.`;
      vcReaction = "😱 You just passed on the next Google! Time to update your resume.";
    } else {
      explanation = `Wrong call on this one. ${pitch.companyName} ${pitch.actualOutcome === 'success' ? 'succeeded' : 'failed'}.`;
      vcReaction = "📉 Your pattern recognition needs work. Study the market more!";
    }
  }
  
  return {
    correct,
    explanation,
    actualOutcome: `${pitch.companyName} ${getOutcomeDescription(pitch.actualOutcome)}`,
    points,
    vcReaction
  };
};

// Get outcome description
const getOutcomeDescription = (outcome: string): string => {
  switch (outcome) {
    case 'success':
      return 'became a major success with a successful exit';
    case 'failure':
      return 'failed and shut down within 2 years';
    case 'pivot':
      return 'pivoted to a different model with mixed results';
    default:
      return 'had an unclear outcome';
  }
};

// Generate unique pitch ID
const generatePitchId = (): string => {
  return 'pitch_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
};

// Get investor profile from localStorage
export const getInvestorProfile = (): InvestorProfile => {
  const stored = localStorage.getItem('pitchslap_investor');
  if (stored) {
    return JSON.parse(stored);
  }
  
  const newProfile: InvestorProfile = {
    totalDeals: 0,
    correctDecisions: 0,
    accuracy: 0,
    totalPoints: 0,
    rank: INVESTOR_RANKS[0].name,
    level: 0,
    streak: 0,
    bestStreak: 0
  };
  
  saveInvestorProfile(newProfile);
  return newProfile;
};

// Save investor profile
export const saveInvestorProfile = (profile: InvestorProfile): void => {
  localStorage.setItem('pitchslap_investor', JSON.stringify(profile));
};

// Update investor profile after decision
export const updateInvestorProfile = (correct: boolean, points: number): InvestorProfile => {
  const profile = getInvestorProfile();
  
  profile.totalDeals++;
  if (correct) {
    profile.correctDecisions++;
    profile.streak++;
    profile.bestStreak = Math.max(profile.bestStreak, profile.streak);
  } else {
    profile.streak = 0;
  }
  
  profile.accuracy = Math.round((profile.correctDecisions / profile.totalDeals) * 100);
  profile.totalPoints += points;
  
  // Calculate new rank
  const newRank = calculateInvestorRank(profile.accuracy, profile.totalDeals);
  profile.rank = newRank.name;
  profile.level = newRank.level;
  
  saveInvestorProfile(profile);
  return profile;
};

// Calculate investor rank
export const calculateInvestorRank = (accuracy: number, totalDeals: number) => {
  for (let i = INVESTOR_RANKS.length - 1; i >= 0; i--) {
    const rank = INVESTOR_RANKS[i];
    if (accuracy >= rank.minAccuracy && totalDeals >= rank.minDeals) {
      return rank;
    }
  }
  return INVESTOR_RANKS[0];
};

// Get rank progress
export const getRankProgress = (accuracy: number, totalDeals: number): { current: any; next: any; progress: number } => {
  const current = calculateInvestorRank(accuracy, totalDeals);
  const nextIndex = Math.min(current.level + 1, INVESTOR_RANKS.length - 1);
  const next = INVESTOR_RANKS[nextIndex];
  
  if (nextIndex === current.level) {
    return { current, next: current, progress: 100 };
  }
  
  // Calculate progress based on both accuracy and deals
  const accuracyProgress = Math.min(100, (accuracy / next.minAccuracy) * 100);
  const dealsProgress = Math.min(100, (totalDeals / next.minDeals) * 100);
  const progress = Math.min(accuracyProgress, dealsProgress);
  
  return { current, next, progress };
};