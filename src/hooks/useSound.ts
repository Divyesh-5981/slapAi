import { useRef, useCallback } from 'react';

interface SoundOptions {
  volume?: number;
  playbackRate?: number;
}

export const useSound = () => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const soundEnabledRef = useRef(true);

  const initAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContextRef.current;
  }, []);

  const playBeep = useCallback((frequency: number = 800, duration: number = 100, options: SoundOptions = {}) => {
    if (!soundEnabledRef.current) return;

    try {
      const audioContext = initAudioContext();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
      oscillator.type = 'sine';

      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(options.volume || 0.1, audioContext.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration / 1000);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + duration / 1000);
    } catch (error) {
      console.warn('Sound playback failed:', error);
    }
  }, [initAudioContext]);

  const playSuccess = useCallback(() => {
    playBeep(523, 150); // C5
    setTimeout(() => playBeep(659, 150), 100); // E5
    setTimeout(() => playBeep(784, 200), 200); // G5
  }, [playBeep]);

  const playClick = useCallback(() => {
    playBeep(800, 50, { volume: 0.05 });
  }, [playBeep]);

  const playHover = useCallback(() => {
    playBeep(1000, 30, { volume: 0.03 });
  }, [playBeep]);

  const playXP = useCallback(() => {
    playBeep(440, 100); // A4
    setTimeout(() => playBeep(554, 100), 80); // C#5
    setTimeout(() => playBeep(659, 150), 160); // E5
  }, [playBeep]);

  const playLevelUp = useCallback(() => {
    const notes = [523, 659, 784, 1047]; // C5, E5, G5, C6
    notes.forEach((note, index) => {
      setTimeout(() => playBeep(note, 200, { volume: 0.15 }), index * 150);
    });
  }, [playBeep]);

  const toggleSound = useCallback(() => {
    soundEnabledRef.current = !soundEnabledRef.current;
    return soundEnabledRef.current;
  }, []);

  const isSoundEnabled = useCallback(() => soundEnabledRef.current, []);

  return {
    playSuccess,
    playClick,
    playHover,
    playXP,
    playLevelUp,
    toggleSound,
    isSoundEnabled
  };
};