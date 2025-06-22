import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

// Custom hook for managing GSAP animations
export const useAnimations = () => {
  const prefersReducedMotion = useRef(
    typeof window !== 'undefined' 
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false
  );

  const animateIn = (element: HTMLElement | string, options: gsap.TweenVars = {}) => {
    if (prefersReducedMotion.current) return;
    
    const defaultOptions = {
      duration: 0.6,
      ease: "power2.out",
      ...options
    };
    
    return gsap.fromTo(element, 
      { opacity: 0, y: 30, ...options.from },
      { opacity: 1, y: 0, ...defaultOptions }
    );
  };

  const staggerIn = (elements: HTMLElement[] | string, options: gsap.TweenVars = {}) => {
    if (prefersReducedMotion.current) return;
    
    const defaultOptions = {
      duration: 0.5,
      ease: "power2.out",
      stagger: 0.1,
      ...options
    };
    
    return gsap.fromTo(elements,
      { opacity: 0, y: 20, scale: 0.95, ...options.from },
      { opacity: 1, y: 0, scale: 1, ...defaultOptions }
    );
  };

  const pulseHover = (element: HTMLElement | string) => {
    if (prefersReducedMotion.current) return;
    
    return gsap.to(element, {
      scale: 1.05,
      duration: 0.2,
      ease: "power2.out",
      yoyo: true,
      repeat: 1
    });
  };

  const bounceIn = (element: HTMLElement | string, options: gsap.TweenVars = {}) => {
    if (prefersReducedMotion.current) return;
    
    return gsap.fromTo(element,
      { scale: 0, rotation: -180, opacity: 0 },
      { 
        scale: 1, 
        rotation: 0, 
        opacity: 1, 
        duration: 0.8, 
        ease: "back.out(1.7)",
        ...options 
      }
    );
  };

  // Fixed typewriter effect - only runs once, doesn't interfere with user typing
  const typewriterEffect = (element: HTMLElement, text: string, speed: number = 50) => {
    if (prefersReducedMotion.current) {
      element.placeholder = text;
      return;
    }
    
    // Only run if element is empty and not focused
    if (element.value || document.activeElement === element) {
      element.placeholder = text;
      return;
    }
    
    element.placeholder = '';
    let i = 0;
    
    const typeInterval = setInterval(() => {
      // Stop if user starts typing or focuses the element
      if (element.value || document.activeElement === element) {
        clearInterval(typeInterval);
        element.placeholder = text;
        return;
      }
      
      if (i < text.length) {
        element.placeholder += text.charAt(i);
        i++;
      } else {
        clearInterval(typeInterval);
      }
    }, speed);
    
    return () => clearInterval(typeInterval);
  };

  const flameEffect = (element: HTMLElement | string) => {
    if (prefersReducedMotion.current) return;
    
    const tl = gsap.timeline();
    
    tl.fromTo(element, 
      { opacity: 0, scale: 0.8, y: 20 },
      { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: "power2.out" }
    )
    .to(element, {
      y: -5,
      duration: 0.3,
      ease: "power2.inOut",
      yoyo: true,
      repeat: 1
    });
    
    return tl;
  };

  const slideUpReveal = (element: HTMLElement | string, options: gsap.TweenVars = {}) => {
    if (prefersReducedMotion.current) return;
    
    return gsap.fromTo(element,
      { opacity: 0, y: 50, clipPath: 'inset(100% 0 0 0)' },
      { 
        opacity: 1, 
        y: 0, 
        clipPath: 'inset(0% 0 0 0)',
        duration: 0.7,
        ease: "power3.out",
        ...options
      }
    );
  };

  const stickyNoteFlip = (element: HTMLElement | string, delay: number = 0) => {
    if (prefersReducedMotion.current) return;
    
    return gsap.fromTo(element,
      { rotationY: -90, opacity: 0, transformOrigin: "left center" },
      { 
        rotationY: 0, 
        opacity: 1, 
        duration: 0.6, 
        ease: "back.out(1.2)",
        delay 
      }
    );
  };

  const progressBarFill = (element: HTMLElement | string, width: string, delay: number = 0) => {
    if (prefersReducedMotion.current) {
      gsap.set(element, { width });
      return;
    }
    
    return gsap.fromTo(element,
      { width: '0%' },
      { 
        width, 
        duration: 1.2, 
        ease: "power2.out",
        delay 
      }
    );
  };

  const waveformAnimation = (element: HTMLElement | string, isPlaying: boolean = false) => {
    if (prefersReducedMotion.current) return;
    
    const bars = typeof element === 'string' 
      ? document.querySelectorAll(`${element} .wave-bar`)
      : element.querySelectorAll('.wave-bar');
    
    if (isPlaying) {
      bars.forEach((bar, index) => {
        gsap.to(bar, {
          scaleY: () => Math.random() * 2 + 0.5,
          duration: 0.3,
          repeat: -1,
          yoyo: true,
          delay: index * 0.05,
          ease: "power2.inOut"
        });
      });
    } else {
      gsap.killTweensOf(bars);
      gsap.to(bars, {
        scaleY: 0.3,
        duration: 0.3,
        ease: "power2.out"
      });
    }
  };

  const voiceGenerationPulse = (element: HTMLElement | string) => {
    if (prefersReducedMotion.current) return;
    
    return gsap.to(element, {
      scale: 1.1,
      opacity: 0.8,
      duration: 1,
      ease: "power2.inOut",
      yoyo: true,
      repeat: -1
    });
  };

  const audioVisualizerBars = (container: HTMLElement | string, audioData?: number[]) => {
    if (prefersReducedMotion.current) return;
    
    const bars = typeof container === 'string' 
      ? document.querySelectorAll(`${container} .audio-bar`)
      : container.querySelectorAll('.audio-bar');
    
    bars.forEach((bar, index) => {
      const height = audioData ? audioData[index] || 0.2 : Math.random() * 0.8 + 0.2;
      gsap.to(bar, {
        scaleY: height,
        duration: 0.1,
        ease: "power2.out"
      });
    });
  };

  return {
    animateIn,
    staggerIn,
    pulseHover,
    bounceIn,
    typewriterEffect,
    flameEffect,
    slideUpReveal,
    stickyNoteFlip,
    progressBarFill,
    waveformAnimation,
    voiceGenerationPulse,
    audioVisualizerBars,
    prefersReducedMotion: prefersReducedMotion.current
  };
};

// Animation timeline helpers
export const createStaggerTimeline = (elements: (HTMLElement | string)[], options: gsap.TweenVars = {}) => {
  const tl = gsap.timeline();
  
  elements.forEach((element, index) => {
    tl.fromTo(element,
      { opacity: 0, y: 30, scale: 0.9 },
      { 
        opacity: 1, 
        y: 0, 
        scale: 1, 
        duration: 0.5, 
        ease: "power2.out",
        ...options
      },
      index * 0.1
    );
  });
  
  return tl;
};