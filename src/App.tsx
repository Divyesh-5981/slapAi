import React, { useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LoadingProvider, useLoading } from './context/LoadingContext';
import Header from './components/layout/Header';
import Navigation from './components/layout/Navigation';
import PageTransition from './components/layout/PageTransition';
import ParticleBackground from './components/ui/ParticleBackground';
import ElegantLoadingSpinner from './components/ui/ElegantLoadingSpinner';
import RoastMode from './pages/RoastMode';
import FixItMode from './pages/FixItMode';
import ScorecardMode from './pages/ScorecardMode';
import BrandingMode from './pages/BrandingMode';
import MemeMode from './pages/MemeMode';
import InvestorMode from './pages/InvestorMode';
import LeaderboardMode from './pages/LeaderboardMode';

const AppContent: React.FC = () => {
  const { isPageLoading, loadingMessage } = useLoading();
  const appRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Preload critical animations
    const preloadAnimations = () => {
      if (appRef.current) {
        appRef.current.style.opacity = '1';
      }
    };

    preloadAnimations();
  }, []);

  return (
    <>
      <Router>
        <motion.div 
          ref={appRef}
          className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-purple-900 relative overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          {/* Particle Background */}
          <ParticleBackground />
          
          {/* Main Content */}
          <div className="relative z-10">
            <Header />
            
            <main className="container mx-auto px-4 py-8">
              <div className="max-w-6xl mx-auto">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                >
                  <Navigation />
                </motion.div>
                
                <PageTransition>
                  <Routes>
                    <Route path="/" element={<RoastMode />} />
                    <Route path="/fixit" element={<FixItMode />} />
                    <Route path="/scorecard" element={<ScorecardMode />} />
                    <Route path="/branding" element={<BrandingMode />} />
                    <Route path="/meme" element={<MemeMode />} />
                    <Route path="/investor" element={<InvestorMode />} />
                    <Route path="/leaderboard" element={<LeaderboardMode />} />
                  </Routes>
                </PageTransition>
              </div>
            </main>

            {/* Clean Footer */}
            <motion.footer 
              className="border-t border-gray-700/50 bg-gray-900/80 backdrop-blur-xl mt-16 relative"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.6 }}
            >
              <div className="container mx-auto px-4 py-6">
                <div className="text-center">
                  <motion.p 
                    className="text-sm text-gray-400 hover:text-purple-300 transition-colors duration-300"
                    whileHover={{ scale: 1.02 }}
                  >
                     Built with 🔥 Bolt.new • Powered by Bolt's AI • 
                    <span className="ml-2 text-xs bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 py-1 rounded-full border border-purple-500/50 hover:shadow-lg hover:shadow-purple-600/25 transition-all duration-300">
                      v2.0 - Premium Edition
                    </span>
                  </motion.p>
                  
                  <motion.div 
                    className="mt-3 flex justify-center gap-4 text-xs text-gray-500"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5 }}
                  >
                    <span>🎯 AI-Powered Insights</span>
                    <span>•</span>
                    <span>🏆 Gamified Experience</span>
                  </motion.div>
                </div>
              </div>
              
              {/* Footer glow effect */}
              <div className="absolute inset-0 bg-gradient-to-t from-purple-900/10 to-transparent pointer-events-none" />
            </motion.footer>
          </div>

          {/* Elegant Loading Overlay */}
          <AnimatePresence>
            {isPageLoading && (
              <motion.div
                className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/95 backdrop-blur-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                >
                  <ElegantLoadingSpinner message={loadingMessage} size="lg" />
                </motion.div>
                
                {/* Background gradient effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-pink-900/20 pointer-events-none"
                  animate={{
                    opacity: [0.3, 0.6, 0.3],
                    scale: [1, 1.02, 1]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </Router>
    </>
  );
};

function App() {
  return (
    <LoadingProvider>
      <AppContent />
    </LoadingProvider>
  );
}

export default App;