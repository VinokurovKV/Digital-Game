import { useEffect, useState } from 'react';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import VolumeUpRoundedIcon from '@mui/icons-material/VolumeUpRounded';

import { GameButton } from '../GameButton';
import { GameScreen } from '../GameScreen';
import type { WolfPose } from '../GameSprites';
import style from './GameConsole.module.less';

type GameMode = 'A' | 'B';

const movementKeys: Record<string, WolfPose> = {
  KeyQ: 'topLeft',
  KeyA: 'bottomLeft',
  KeyP: 'topRight',
  KeyL: 'bottomRight',
};

export const GameConsole = () => {
  const [gameMode, setGameMode] = useState<GameMode | null>(null);
  const [wolfPose, setWolfPose] = useState<WolfPose | null>(null);
  const [isScreenOn, setIsScreenOn] = useState(true);
  const [gameSession, setGameSession] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);

  const startGame = (mode: GameMode) => {
    if (gameMode === mode) {
      if (isPaused) {
        setCountdown((currentCountdown) => (currentCountdown === null ? 3 : null));
      } else {
        setIsPaused(true);
        setCountdown(null);
      }

      return;
    }

    setGameMode(mode);
    setWolfPose(null);
    setIsPaused(false);
    setCountdown(null);
    setGameSession((session) => session + 1);
  };

  const toggleScreen = () => {
    if (isScreenOn) {
      setGameMode(null);
      setWolfPose(null);
      setIsPaused(false);
      setCountdown(null);
    }

    setIsScreenOn(!isScreenOn);
  };

  useEffect(() => {
    if (countdown === null) {
      return undefined;
    }

    const countdownTimer = window.setTimeout(() => {
      if (countdown === 1) {
        setCountdown(null);
        setIsPaused(false);
        return;
      }

      setCountdown(countdown - 1);
    }, 1000);

    return () => window.clearTimeout(countdownTimer);
  }, [countdown]);

  useEffect(() => {
    if (!isScreenOn || gameMode === null) {
      return undefined;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.code !== 'Escape') {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      setIsPaused(true);
      setCountdown(null);
    };

    window.addEventListener('keydown', handleEscape, true);

    return () => window.removeEventListener('keydown', handleEscape, true);
  }, [gameMode, isScreenOn]);

  useEffect(() => {
    if (!isScreenOn || gameMode === null || isPaused) {
      return undefined;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.altKey || event.ctrlKey || event.metaKey) {
        return;
      }

      const nextPose = movementKeys[event.code];

      if (!nextPose) {
        return;
      }

      event.preventDefault();
      setWolfPose(nextPose);
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameMode, isPaused, isScreenOn]);

  return (
    <section className={style.shell} aria-label="Электронная игра Ну, погоди!">
      <div className={style.cabinet}>
        <aside className={style.brand}>
          <div className={style.badge} aria-hidden="true">
            <span>ИМ</span>
          </div>
        </aside>

        <div className={style.gameArea}>
          <div className={style.displayPanel}>
            <h1>НУ, ПОГОДИ!</h1>
            <GameScreen
              wolfPose={wolfPose}
              isScreenOn={isScreenOn}
              gameMode={gameMode}
              gameSession={gameSession}
              isPaused={isPaused}
              countdown={countdown}
            />
            <span>ЭЛЕКТРОНИКА</span>
          </div>
        </div>

        <aside className={style.servicePanel} aria-label="Служебные кнопки">
          <div className={style.modeButtons}>
            <button
              className={gameMode === 'A' ? style.activeMode : ''}
              type="button"
              aria-pressed={gameMode === 'A'}
              disabled={!isScreenOn}
              onClick={() => startGame('A')}
            >
              <i />
              <span>ИГРА А</span>
            </button>
            <button
              className={gameMode === 'B' ? style.activeMode : ''}
              type="button"
              aria-pressed={gameMode === 'B'}
              disabled={!isScreenOn}
              onClick={() => startGame('B')}
            >
              <i />
              <span>ИГРА Б</span>
            </button>
            <button type="button" aria-label={isScreenOn ? 'Выключить экран' : 'Включить экран'} onClick={toggleScreen}>
              <i />
              <span>ЭКРАН</span>
            </button>
          </div>
          <div className={style.toggles}>
            <button type="button" aria-label="Звук">
              <VolumeUpRoundedIcon className={style.toggleIcon} />
              <i />
            </button>
            <button type="button" aria-label="Часы">
              <AccessTimeRoundedIcon className={style.toggleIcon} />
              <i />
            </button>
          </div>
        </aside>

        <div className={style.leftControls}>
          <GameButton
            direction="up-left"
            label="Левая верхняя позиция"
            isActive={wolfPose === 'topLeft'}
            disabled={!isScreenOn || gameMode === null || isPaused}
            onClick={() => setWolfPose('topLeft')}
          />
          <GameButton
            direction="down-left"
            label="Левая нижняя позиция"
            isActive={wolfPose === 'bottomLeft'}
            disabled={!isScreenOn || gameMode === null || isPaused}
            onClick={() => setWolfPose('bottomLeft')}
          />
        </div>
        <div className={style.rightControls}>
          <GameButton
            direction="up-right"
            label="Правая верхняя позиция"
            isActive={wolfPose === 'topRight'}
            disabled={!isScreenOn || gameMode === null || isPaused}
            onClick={() => setWolfPose('topRight')}
          />
          <GameButton
            direction="down-right"
            label="Правая нижняя позиция"
            isActive={wolfPose === 'bottomRight'}
            disabled={!isScreenOn || gameMode === null || isPaused}
            onClick={() => setWolfPose('bottomRight')}
          />
        </div>
      </div>
    </section>
  );
};
