import { useCallback } from 'react';
import confetti from 'canvas-confetti';

export const useConfetti = () => {
  const fireConfetti = useCallback((options?: confetti.Options) => {
    const defaults: confetti.Options = {
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#8b5cf6', '#ec4899', '#06b6d4', '#10b981', '#f59e0b']
    };

    confetti({
      ...defaults,
      ...options
    });
  }, []);

  const fireSuccessConfetti = useCallback(() => {
    // Multiple bursts for extra celebration
    fireConfetti({
      particleCount: 50,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.8 }
    });
    
    fireConfetti({
      particleCount: 50,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.8 }
    });

    // Center burst
    setTimeout(() => {
      fireConfetti({
        particleCount: 100,
        spread: 100,
        origin: { y: 0.6 }
      });
    }, 200);
  }, [fireConfetti]);

  const fireLevelUpConfetti = useCallback(() => {
    // Epic level up celebration
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ['#fbbf24', '#f59e0b', '#d97706']
      });
      
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ['#8b5cf6', '#7c3aed', '#6d28d9']
      });
    }, 250);
  }, []);

  const fireXPConfetti = useCallback(() => {
    fireConfetti({
      particleCount: 30,
      spread: 45,
      origin: { y: 0.3 },
      colors: ['#8b5cf6', '#a855f7', '#c084fc']
    });
  }, [fireConfetti]);

  return {
    fireConfetti,
    fireSuccessConfetti,
    fireLevelUpConfetti,
    fireXPConfetti
  };
};