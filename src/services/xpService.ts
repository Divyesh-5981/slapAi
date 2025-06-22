// XP Service - Manages user experience points and ranking system
export interface UserProfile {
  id: string;
  alias: string;
  xp: number;
  level: number;
  rank: string;
  totalPitches: number;
  totalRoasts: number;
  totalFixIts: number;
  totalMemes: number;
  totalVoiceRoasts: number;
  mostRoastedPitch: string;
  joinDate: string;
  lastActivity: string;
}

export interface XPAction {
  type: 'pitch_submit' | 'roast_generate' | 'fixit_generate' | 'scorecard_generate' | 'branding_generate' | 'meme_generate' | 'voice_roast' | 'regenerate' | 'share_meme';
  xp: number;
  description: string;
}

// XP rewards for different actions
export const XP_REWARDS: Record<string, XPAction> = {
  pitch_submit: { type: 'pitch_submit', xp: 10, description: 'Submitted a pitch' },
  roast_generate: { type: 'roast_generate', xp: 15, description: 'Generated a roast' },
  fixit_generate: { type: 'fixit_generate', xp: 20, description: 'Used FixIt mode' },
  scorecard_generate: { type: 'scorecard_generate', xp: 25, description: 'Generated scorecard' },
  branding_generate: { type: 'branding_generate', xp: 25, description: 'Used Branding Doctor' },
  meme_generate: { type: 'meme_generate', xp: 30, description: 'Created a meme' },
  voice_roast: { type: 'voice_roast', xp: 35, description: 'Generated voice roast' },
  regenerate: { type: 'regenerate', xp: 5, description: 'Regenerated content' },
  share_meme: { type: 'share_meme', xp: 10, description: 'Shared a meme' }
};

// Startup-themed rank system
export const STARTUP_RANKS = [
  { level: 0, name: 'Pre-Seedling', minXP: 0, icon: '🌱', color: '#10b981' },
  { level: 1, name: 'Idea Haver', minXP: 50, icon: '💡', color: '#f59e0b' },
  { level: 2, name: 'MVP Builder', minXP: 150, icon: '🔨', color: '#3b82f6' },
  { level: 3, name: 'Beta Tester', minXP: 300, icon: '🧪', color: '#8b5cf6' },
  { level: 4, name: 'Product Hunter', minXP: 500, icon: '🎯', color: '#ef4444' },
  { level: 5, name: 'Growth Hacker', minXP: 750, icon: '📈', color: '#06b6d4' },
  { level: 6, name: 'Series A Hopeful', minXP: 1100, icon: '💰', color: '#84cc16' },
  { level: 7, name: 'VC Bait', minXP: 1500, icon: '🎣', color: '#f97316' },
  { level: 8, name: 'Unicorn Hunter', minXP: 2000, icon: '🦄', color: '#ec4899' },
  { level: 9, name: 'Startup Sensei', minXP: 2750, icon: '🥋', color: '#6366f1' },
  { level: 10, name: 'Exit Strategy', minXP: 3500, icon: '🚀', color: '#14b8a6' },
  { level: 11, name: 'Pitch Slap Legend', minXP: 5000, icon: '👑', color: '#fbbf24' }
];

// Get current user profile from localStorage
export const getCurrentUser = (): UserProfile => {
  const stored = localStorage.getItem('pitchslap_user');
  if (stored) {
    return JSON.parse(stored);
  }
  
  // Create new user
  const newUser: UserProfile = {
    id: generateUserId(),
    alias: generateRandomAlias(),
    xp: 0,
    level: 0,
    rank: STARTUP_RANKS[0].name,
    totalPitches: 0,
    totalRoasts: 0,
    totalFixIts: 0,
    totalMemes: 0,
    totalVoiceRoasts: 0,
    mostRoastedPitch: '',
    joinDate: new Date().toISOString(),
    lastActivity: new Date().toISOString()
  };
  
  saveUser(newUser);
  return newUser;
};

// Save user profile to localStorage
export const saveUser = (user: UserProfile): void => {
  localStorage.setItem('pitchslap_user', JSON.stringify(user));
  
  // Also save to global leaderboard
  saveToLeaderboard(user);
};

// Award XP for an action
export const awardXP = (actionType: keyof typeof XP_REWARDS, pitchTitle?: string): { user: UserProfile; leveledUp: boolean; newRank?: string } => {
  const user = getCurrentUser();
  const action = XP_REWARDS[actionType];
  const oldLevel = user.level;
  
  // Add XP
  user.xp += action.xp;
  user.lastActivity = new Date().toISOString();
  
  // Update counters
  switch (actionType) {
    case 'pitch_submit':
      user.totalPitches++;
      if (pitchTitle) user.mostRoastedPitch = pitchTitle;
      break;
    case 'roast_generate':
      user.totalRoasts++;
      break;
    case 'fixit_generate':
      user.totalFixIts++;
      break;
    case 'meme_generate':
      user.totalMemes++;
      break;
    case 'voice_roast':
      user.totalVoiceRoasts++;
      break;
  }
  
  // Calculate new level and rank
  const newRank = calculateRank(user.xp);
  user.level = newRank.level;
  user.rank = newRank.name;
  
  const leveledUp = user.level > oldLevel;
  
  saveUser(user);
  
  return { 
    user, 
    leveledUp, 
    newRank: leveledUp ? newRank.name : undefined 
  };
};

// Calculate rank based on XP
export const calculateRank = (xp: number) => {
  for (let i = STARTUP_RANKS.length - 1; i >= 0; i--) {
    if (xp >= STARTUP_RANKS[i].minXP) {
      return STARTUP_RANKS[i];
    }
  }
  return STARTUP_RANKS[0];
};

// Get XP needed for next level
export const getXPToNextLevel = (currentXP: number): { needed: number; nextRank: any } => {
  const currentRank = calculateRank(currentXP);
  const nextRankIndex = Math.min(currentRank.level + 1, STARTUP_RANKS.length - 1);
  const nextRank = STARTUP_RANKS[nextRankIndex];
  
  if (nextRankIndex === currentRank.level) {
    return { needed: 0, nextRank: currentRank }; // Max level
  }
  
  return {
    needed: nextRank.minXP - currentXP,
    nextRank
  };
};

// Generate random user ID
const generateUserId = (): string => {
  return 'user_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
};

// Generate random startup-themed alias
const generateRandomAlias = (): string => {
  const adjectives = [
    'Disruptive', 'Innovative', 'Agile', 'Lean', 'Viral', 'Scalable', 'Pivotal', 'Stealth',
    'Unicorn', 'Rocket', 'Ninja', 'Guru', 'Maverick', 'Visionary', 'Serial', 'Angel'
  ];
  
  const nouns = [
    'Founder', 'Builder', 'Hustler', 'Dreamer', 'Maker', 'Hacker', 'Pitcher', 'Validator',
    'Disruptor', 'Innovator', 'Entrepreneur', 'Visionary', 'Strategist', 'Pioneer'
  ];
  
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const number = Math.floor(Math.random() * 999) + 1;
  
  return `${adjective}${noun}${number}`;
};

// Global leaderboard management (localStorage-based for demo)
export const saveToLeaderboard = (user: UserProfile): void => {
  const leaderboard = getGlobalLeaderboard();
  const existingIndex = leaderboard.findIndex(u => u.id === user.id);
  
  if (existingIndex >= 0) {
    leaderboard[existingIndex] = user;
  } else {
    leaderboard.push(user);
  }
  
  // Sort by XP descending
  leaderboard.sort((a, b) => b.xp - a.xp);
  
  // Keep top 100 users
  const topUsers = leaderboard.slice(0, 100);
  
  localStorage.setItem('pitchslap_leaderboard', JSON.stringify(topUsers));
};

export const getGlobalLeaderboard = (): UserProfile[] => {
  const stored = localStorage.getItem('pitchslap_leaderboard');
  if (stored) {
    return JSON.parse(stored);
  }
  return [];
};

// Get user's rank position on leaderboard
export const getUserRankPosition = (userId: string): number => {
  const leaderboard = getGlobalLeaderboard();
  const position = leaderboard.findIndex(u => u.id === userId);
  return position >= 0 ? position + 1 : -1;
};

// Update user alias
export const updateUserAlias = (newAlias: string): UserProfile => {
  const user = getCurrentUser();
  user.alias = newAlias.trim() || generateRandomAlias();
  saveUser(user);
  return user;
};

// Get progress to next level as percentage
export const getLevelProgress = (currentXP: number): number => {
  const currentRank = calculateRank(currentXP);
  const nextRankIndex = Math.min(currentRank.level + 1, STARTUP_RANKS.length - 1);
  
  if (nextRankIndex === currentRank.level) {
    return 100; // Max level
  }
  
  const nextRank = STARTUP_RANKS[nextRankIndex];
  const currentLevelXP = currentXP - currentRank.minXP;
  const xpNeededForLevel = nextRank.minXP - currentRank.minXP;
  
  return Math.min(100, (currentLevelXP / xpNeededForLevel) * 100);
};