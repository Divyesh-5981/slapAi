export type Mode = 'roast' | 'fixit' | 'scorecard' | 'branding' | 'meme';

export interface RoastResponse {
  roast: string;
  error?: string;
}

export interface FixItResponse {
  fixedPitch: string;
  error?: string;
}

export interface ScorecardResponse {
  scores: {
    clarity: number;
    marketFit: number;
    monetization: number;
    originality: number;
    overall: number;
  };
  feedback: string;
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