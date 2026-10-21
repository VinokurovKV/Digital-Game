import { useCallback, useRef, useState } from 'react';

export type GameSound = 'catch' | 'gameOver' | 'miss' | 'move' | 'pause' | 'screen' | 'start';

const soundSources: Record<GameSound, string> = {
  start: '/audio/gamestart.mp3',
  move: '/audio/moving.mp3',
  catch: '/audio/eggcatch.mp3',
  miss: '/audio/eggbreak.mp3',
  pause: '/audio/pause.mp3',
  screen: '/audio/moving.mp3',
  gameOver: '/audio/game-over.mp3',
};

const audioElements: Partial<Record<GameSound, HTMLAudioElement>> = {};

const getAudio = (sound: GameSound) => {
  if (audioElements[sound] === undefined) {
    const audio = new Audio(soundSources[sound]);

    audio.preload = 'auto';
    audioElements[sound] = audio;
  }

  return audioElements[sound] as HTMLAudioElement;
};

export const useGameAudio = () => {
  const isSoundEnabledRef = useRef(true);
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);

  const playSound = useCallback((sound: GameSound) => {
    if (!isSoundEnabledRef.current) {
      return;
    }

    const audio = getAudio(sound);

    audio.pause();

    if (audio.readyState > 0) {
      audio.currentTime = 0;
    }

    audio.play().catch((error: unknown) => {
      console.warn(`Не удалось воспроизвести звук «${sound}»`, error);
    });
  }, []);

  const toggleSound = useCallback(() => {
    const nextIsSoundEnabled = !isSoundEnabledRef.current;

    isSoundEnabledRef.current = nextIsSoundEnabled;
    setIsSoundEnabled(nextIsSoundEnabled);

    if (nextIsSoundEnabled) {
      playSound('start');
      return;
    }

    (Object.keys(audioElements) as GameSound[]).forEach((sound) => {
      const audio = audioElements[sound];

      if (audio !== undefined) {
        audio.pause();

        if (audio.readyState > 0) {
          audio.currentTime = 0;
        }
      }
    });
  }, [playSound]);

  return { isSoundEnabled, playSound, toggleSound };
};
