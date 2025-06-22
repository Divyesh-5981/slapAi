import React from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, Zap, Rocket, Brain } from 'lucide-react';

interface PitchSuggestionChipsProps {
  onSuggestionClick: (suggestion: string) => void;
  mode: 'roast' | 'fixit' | 'scorecard' | 'branding' | 'meme';
}

const PitchSuggestionChips: React.FC<PitchSuggestionChipsProps> = ({ onSuggestionClick, mode }) => {
  const suggestions = {
    roast: [
      "We're building an AI-powered blockchain solution that revolutionizes how people share photos of their food using machine learning algorithms.",
      "It's like Uber for dog walking, but with cryptocurrency and NFTs. We're disrupting the pet industry through decentralized autonomous organizations.",
      "Our platform leverages cutting-edge artificial intelligence to optimize synergistic paradigms in the B2B enterprise space.",
      "We're creating a social network for introverts who want to connect without actually talking to people.",
      "It's a subscription box for people who collect subscription boxes. Meta-commerce is the future."
    ],
    fixit: [
      "We help businesses do things better with our platform that uses technology to solve problems and create value for stakeholders.",
      "Our app connects people who need stuff with people who have stuff using algorithms and data science.",
      "We're disrupting the traditional industry by leveraging innovative solutions to optimize workflows and maximize ROI.",
      "It's a marketplace for services where users can find providers and providers can find users through our proprietary matching system.",
      "We use AI and machine learning to automate processes and improve efficiency for companies in various sectors."
    ],
    scorecard: [
      "TaskFlow is a project management platform for remote teams that reduces project delays by 40% through AI-powered task prioritization. We have 500+ paying customers and $50K MRR.",
      "MealMind helps families save 20% on grocery bills through smart meal planning and automated shopping lists. Freemium model with 10K+ active users.",
      "CreditBoost democratizes credit scoring for underbanked populations using alternative data sources. We've processed $5M in loan applications.",
      "EduFlow provides personalized learning paths for professional skills with AI tutoring. Corporate subscriptions averaging $5K annually.",
      "HealthSync reduces diagnostic errors by 30% for medical professionals through AI-powered patient data analysis."
    ],
    branding: [
      "We help small restaurants optimize their menu pricing and reduce food waste through data analytics. Our platform increases profit margins by 15%.",
      "AI-powered fitness app that creates personalized workout plans and tracks progress. Gamifies exercise with social challenges and rewards.",
      "B2B marketplace connecting manufacturers directly with retailers, cutting costs by 25%. Commission-based model with 200+ suppliers.",
      "Personal finance app for freelancers with instant payment processing and expense tracking. Solves cash flow issues for gig workers.",
      "Online learning platform for coding bootcamps with AI-powered career path recommendations and job placement assistance."
    ],
    meme: [
      "We're revolutionizing the blockchain space with our AI-powered NFT marketplace that uses machine learning to predict the next viral meme.",
      "It's like Uber for everything - dog walking, grocery shopping, finding your soulmate, and delivering existential crisis solutions.",
      "Our platform leverages synergistic paradigms to disrupt traditional industries through innovative solutions and cutting-edge technology.",
      "We're building the Netflix of education meets the Airbnb of workspaces with a dash of TikTok's algorithm for maximum engagement.",
      "Introducing the world's first blockchain-based social network for AI-generated content creators who only communicate through interpretive dance."
    ]
  };

  const icons = [Lightbulb, Zap, Rocket, Brain];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.6 }}
      className="mt-6"
    >
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb className="w-4 h-4 text-yellow-400" />
        <span className="text-sm font-medium text-gray-300">
          Try these examples:
        </span>
      </div>
      
      <div className="flex flex-wrap gap-3">
        {suggestions[mode].slice(0, 3).map((suggestion, index) => {
          const Icon = icons[index % icons.length];
          return (
            <motion.button
              key={index}
              onClick={() => onSuggestionClick(suggestion)}
              className="group relative flex items-start gap-3 p-4 bg-gray-800/30 hover:bg-purple-900/20 border border-gray-700/50 hover:border-purple-600/50 rounded-xl transition-all duration-300 text-left max-w-sm"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + index * 0.1 }}
            >
              <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <Icon className="w-4 h-4 text-white" />
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-300 group-hover:text-white transition-colors line-clamp-3">
                  {suggestion.length > 120 ? suggestion.substring(0, 120) + '...' : suggestion}
                </p>
              </div>
              
              {/* Hover glow effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-pink-600/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
                initial={false}
              />
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
};

export default PitchSuggestionChips;