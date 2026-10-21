import { useEffect, useState } from 'react';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import VolumeOffRoundedIcon from '@mui/icons-material/VolumeOffRounded';
import VolumeUpRoundedIcon from '@mui/icons-material/VolumeUpRounded';

import { addMisses, addScore, clampScore, getNextRecord, hasGameEnded } from '../../game/gameRules';
import type { GameMode } from '../../game/gameRules';
import { GameButton } from '../GameButton';
import { GameScreen } from '../GameScreen';
import type { WolfPose } from '../GameSprites';
import style from './GameConsole.module.less';
import { useGameAudio } from './audio/useGameAudio';

const movementKeys: Record<string, WolfPose> = {
  KeyQ: 'topLeft',
  KeyA: 'bottomLeft',
  KeyP: 'topRight',
  KeyL: 'bottomRight',
};

const recordStorageKey = 'nu-pogodi-record';

const loadRecord = (): number => {
  try {
    const storedRecord = Number(window.localStorage.getItem(recordStorageKey));

    return storedRecord > 0 ? clampScore(storedRecord) : 0;
  } catch {
    return 0;
  }
};

const saveRecord = (record: number) => {
  try {
    window.localStorage.setItem(recordStorageKey, String(record));
  } catch {
    return;
  }
};

export const GameConsole = () => {
  const [gameMode, setGameMode] = useState<GameMode | null>(null);
  const [wolfPose, setWolfPose] = useState<WolfPose | null>(null);
  const [isScreenOn, setIsScreenOn] = useState(true);
  const [gameSession, setGameSession] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [record, setRecord] = useState(loadRecord);
  const [misses, setMisses] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isClockMode, setIsClockMode] = useState(false);
  const { isSoundEnabled, playSound, toggleSound } = useGameAudio();

  const startGame = (mode: GameMode) => {
    if (gameMode === mode && !isGameOver) {
      if (isPaused) {
        playSound(countdown === null ? 'start' : 'pause');
        setCountdown((currentCountdown) => (currentCountdown === null ? 3 : null));
      } else {
        playSound('pause');
        setIsPaused(true);
        setCountdown(null);
      }

      return;
    }

    playSound('start');
    setIsClockMode(false);
    setGameMode(mode);
    setWolfPose(null);
    setIsPaused(false);
    setCountdown(null);
    setScore(0);
    setMisses(0);
    setIsGameOver(false);
    setGameSession((session) => session + 1);
  };

  const toggleClockMode = () => {
    playSound('screen');

    if (isClockMode) {
      setIsClockMode(false);
      setWolfPose(null);
      return;
    }

    setIsClockMode(true);
    setGameMode(null);
    setWolfPose('topRight');
    setIsPaused(false);
    setCountdown(null);
    setScore(0);
    setMisses(0);
    setIsGameOver(false);
    setGameSession((session) => session + 1);
  };

  const toggleScreen = () => {
    playSound('screen');

    if (isScreenOn) {
      setIsClockMode(false);
      setGameMode(null);
      setWolfPose(null);
      setIsPaused(false);
      setCountdown(null);
      setScore(0);
      setMisses(0);
      setIsGameOver(false);
    }

    setIsScreenOn(!isScreenOn);
  };

  useEffect(() => {
    if (!hasGameEnded(misses) || isGameOver) {
      return;
    }

    setIsPaused(false);
    setCountdown(null);
    setIsGameOver(true);

    const nextRecord = getNextRecord(record, score);
    setRecord(nextRecord);
    saveRecord(nextRecord);
    playSound('gameOver');
  }, [isGameOver, misses, playSound, record, score]);

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
    if (!isScreenOn || gameMode === null || isGameOver) {
      return undefined;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.code !== 'Escape') {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      playSound('pause');
      setIsPaused(true);
      setCountdown(null);
    };

    window.addEventListener('keydown', handleEscape, true);

    return () => window.removeEventListener('keydown', handleEscape, true);
  }, [gameMode, isGameOver, isScreenOn, playSound]);

  useEffect(() => {
    if (!isScreenOn || gameMode === null || isPaused || isGameOver) {
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
      playSound('move');
      setWolfPose(nextPose);
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameMode, isGameOver, isPaused, isScreenOn, playSound]);

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
              score={score}
              record={record}
              misses={misses}
              isGameOver={isGameOver}
              isClockMode={isClockMode}
              onClockLaneChange={setWolfPose}
              onEggCaught={(caughtEggs) => {
                playSound('catch');
                setScore((currentScore) => addScore(currentScore, caughtEggs));
              }}
              onEggMissed={(missedEggs) => {
                playSound('miss');
                setMisses((currentMisses) => addMisses(currentMisses, missedEggs));
              }}
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
            <button
              className={isSoundEnabled ? '' : style.inactiveToggle}
              type="button"
              aria-label={isSoundEnabled ? 'Выключить звук' : 'Включить звук'}
              aria-pressed={isSoundEnabled}
              onClick={toggleSound}
            >
              {isSoundEnabled ? (
                <VolumeUpRoundedIcon className={style.toggleIcon} />
              ) : (
                <VolumeOffRoundedIcon className={style.toggleIcon} />
              )}
              <i />
            </button>
            <button
              className={isClockMode ? style.activeToggle : ''}
              type="button"
              aria-label={isClockMode ? 'Выключить режим часов' : 'Включить режим часов'}
              aria-pressed={isClockMode}
              disabled={!isScreenOn}
              onClick={toggleClockMode}
            >
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
            disabled={!isScreenOn || gameMode === null || isPaused || isGameOver}
            onClick={() => {
              playSound('move');
              setWolfPose('topLeft');
            }}
          />
          <GameButton
            direction="down-left"
            label="Левая нижняя позиция"
            isActive={wolfPose === 'bottomLeft'}
            disabled={!isScreenOn || gameMode === null || isPaused || isGameOver}
            onClick={() => {
              playSound('move');
              setWolfPose('bottomLeft');
            }}
          />
        </div>
        <div className={style.rightControls}>
          <GameButton
            direction="up-right"
            label="Правая верхняя позиция"
            isActive={wolfPose === 'topRight'}
            disabled={!isScreenOn || gameMode === null || isPaused || isGameOver}
            onClick={() => {
              playSound('move');
              setWolfPose('topRight');
            }}
          />
          <GameButton
            direction="down-right"
            label="Правая нижняя позиция"
            isActive={wolfPose === 'bottomRight'}
            disabled={!isScreenOn || gameMode === null || isPaused || isGameOver}
            onClick={() => {
              playSound('move');
              setWolfPose('bottomRight');
            }}
          />
        </div>
      </div>
    </section>
  );
};
