import React, { useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Flame, Wrench, BarChart3, Palette, Image, Trophy, TrendingUp } from 'lucide-react';
import { useSound } from '../../hooks/useSound';
import { useLoading } from '../../context/LoadingContext';
import GlassmorphismCard from '../ui/GlassmorphismCard';

const Navigation: React.FC = () => {
  const location = useLocation();
  const { playHover, playClick } = useSound();
  const { setIsPageLoading, setLoadingMessage } = useLoading();

  const navItems = [
    {
      path: '/',
      label: 'Roast Mode',
      icon: Flame,
      description: 'Brutal honesty activated',
      color: 'red',
      gradient: 'from-red-500 to-pink-500',
      available: true
    },
    {
      path: '/fixit',
      label: 'FixIt Mode',
      icon: Wrench,
      description: 'Pitch doctor online',
      color: 'blue',
      gradient: 'from-blue-500 to-cyan-500',
      available: true
    },
    {
      path: '/scorecard',
      label: 'Scorecard',
      icon: BarChart3,
      description: 'Rate your startup idea',
      color: 'green',
      gradient: 'from-green-500 to-emerald-500',
      available: true
    },
    {
      path: '/branding',
      label: 'Branding Doctor',
      icon: Palette,
      description: 'Name & positioning help',
      color: 'purple',
      gradient: 'from-purple-500 to-violet-500',
      available: true
    },
    {
      path: '/meme',
      label: 'Meme Mode',
      icon: Image,
      description: 'Turn pitch into memes',
      color: 'pink',
      gradient: 'from-pink-500 to-rose-500',
      available: true
    },
    {
      path: '/investor',
      label: 'Investor Simulator',
      icon: TrendingUp,
      description: 'Play VC, make deals',
      color: 'indigo',
      gradient: 'from-indigo-500 to-blue-500',
      available: true
    },
    {
      path: '/leaderboard',
      label: 'Leaderboard',
      icon: Trophy,
      description: 'Compete & rank up',
      color: 'yellow',
      gradient: 'from-yellow-500 to-orange-500',
      available: true
    }
  ];

  const modeMessages = {
    '/': 'Preparing brutal roasts...',
    '/fixit': 'Loading pitch doctor...',
    '/scorecard': 'Initializing scoring system...',
    '/branding': 'Starting creative engine...',
    '/meme': 'Generating meme magic...',
    '/investor': 'Entering VC simulation...',
    '/leaderboard': 'Loading global rankings...'
  };

  const handleNavClick = (e: React.MouseEvent, available: boolean) => {
    if (available) {
      playClick();
      
      // Get the target path from the link
      const target = e.currentTarget as HTMLAnchorElement;
      const href = target.getAttribute('href') || '/';
      
      // Set loading message based on destination
      const message = modeMessages[href as keyof typeof modeMessages] || 'Loading...';
      setLoadingMessage(message);
      setIsPageLoading(true);
      
      // Clear loading after navigation
      setTimeout(() => {
        setIsPageLoading(false);
      }, 800);
    } else {
      e.preventDefault();
    }
  };

  const handleNavHover = () => {
    playHover();
  };

  return (
    <GlassmorphismCard className="p-4 mb-8">
      <div className="grid grid-cols-2 lg:grid-cols-7 gap-3">
        {navItems.map((item, index) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          
          const content = (
            <motion.div 
              className={`
                relative flex flex-col items-center gap-3 py-6 px-4 rounded-2xl font-semibold 
                transition-all duration-300 transform cursor-pointer overflow-hidden
                ${isActive 
                  ? `bg-gradient-to-br ${item.gradient} text-white shadow-2xl scale-105` 
                  : 'text-gray-300 hover:bg-white/5 hover:text-white hover:scale-105'
                }
                ${!item.available ? 'opacity-50 cursor-not-allowed' : ''}
              `}
              onClick={(e) => handleNavClick(e, item.available)}
              onMouseEnter={handleNavHover}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ 
                delay: index * 0.1,
                duration: 0.5,
                type: "spring",
                stiffness: 100
              }}
              whileHover={item.available ? { 
                y: -5,
                transition: { duration: 0.2 }
              } : undefined}
              whileTap={item.available ? { 
                scale: 0.95,
                transition: { duration: 0.1 }
              } : undefined}
            >
              {/* Background glow effect */}
              {isActive && (
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-20 rounded-2xl blur-xl`}
                  animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0.2, 0.4, 0.2]
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              )}

              {/* Icon with animation */}
              <motion.div 
                className="relative z-10"
                animate={isActive ? { 
                  rotate: [0, 5, -5, 0],
                  scale: [1, 1.1, 1]
                } : {}}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Icon className="w-7 h-7" />
                
                {/* Active indicator */}
                {isActive && (
                  <motion.div
                    className="absolute -inset-2 bg-white/20 rounded-full"
                    animate={{ 
                      scale: [1, 1.3, 1],
                      opacity: [0.5, 0.8, 0.5]
                    }}
                    transition={{ 
                      duration: 1.5, 
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                )}
              </motion.div>

              {/* Text content */}
              <div className="text-center relative z-10">
                <div className="text-sm font-bold leading-tight">{item.label}</div>
                <div className={`text-xs mt-1 ${isActive ? 'text-white/90' : 'text-gray-400'}`}>
                  {item.description}
                </div>
              </div>

              {/* Coming soon badge */}
              {!item.available && (
                <motion.div 
                  className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 text-xs px-2 py-1 rounded-full font-bold shadow-lg z-20"
                  animate={{ 
                    y: [0, -2, 0],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  Soon
                </motion.div>
              )}

              {/* Shimmer effect for active items */}
              {isActive && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent rounded-2xl"
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 3,
                    ease: "linear"
                  }}
                />
              )}
            </motion.div>
          );

          return item.available ? (
            <Link key={item.path} to={item.path}>
              {content}
            </Link>
          ) : (
            <div key={item.path}>
              {content}
            </div>
          );
        })}
      </div>
    </GlassmorphismCard>
  );
};

export default Navigation;