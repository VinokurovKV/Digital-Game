import PauseRoundedIcon from '@mui/icons-material/PauseRounded';

import style from './GameScreen.module.less';
import { BrokenEgg, Chicken, Egg, Rabbit, Wolf } from '../GameSprites';
import type { WolfPose } from '../GameSprites';
import { useEggMovement } from './useEggMovement';
import type { EggMovementMode } from './useEggMovement';

type GameScreenProps = {
  wolfPose: WolfPose | null;
  isScreenOn: boolean;
  gameMode: EggMovementMode | null;
  gameSession: number;
  isPaused: boolean;
  countdown: number | null;
  score: number;
  record: number;
  misses: number;
  isGameOver: boolean;
  onEggCaught: (caughtEggs: number) => void;
  onEggMissed: (missedEggs: number) => void;
};

const wolfPositions: Record<WolfPose, { x: number; y: number }> = {
  topLeft: { x: 228, y: 90 },
  bottomLeft: { x: 243, y: 215 },
  topRight: { x: 510, y: 90 },
  bottomRight: { x: 491, y: 215 },
};

const speedSteps = [8, 12, 16, 20, 24];
const missSteps = [0, 1, 2, 3, 4];
const formatScore = (value: number) => `0000${value}`.slice(-4);

const SpeedScale = ({ level }: { level: number }) => (
  <g transform="translate(625 49)" aria-hidden="true">
    {speedSteps.map((height, index) => (
      <rect
        key={height}
        className={index < level ? style.speedStepActive : style.speedStep}
        x={index * 12}
        y={-height}
        width="8"
        height={height}
        rx="1"
      />
    ))}
  </g>
);

const Ramp = ({
  x,
  y,
  mirror = false,
  gentle = false,
}: {
  x: number;
  y: number;
  mirror?: boolean;
  gentle?: boolean;
}) => (
  <g transform={`translate(${x} ${y}) ${mirror ? 'scale(-1 1)' : ''}`}>
    <path d="M0 0h142l-9 9H0z" />
    <path d={gentle ? 'm78 7 82 41-6 8-84-43z' : 'm91 7 55 42-6 7L82 10z'} />
    <path d="M17 6v54M40 6v39" fill="none" stroke="currentColor" strokeWidth="7" />
  </g>
);

export const GameScreen = ({
  wolfPose,
  isScreenOn,
  gameMode,
  gameSession,
  isPaused,
  countdown,
  score,
  record,
  misses,
  isGameOver,
  onEggCaught,
  onEggMissed,
}: GameScreenProps) => {
  const wolfPosition = wolfPose ? wolfPositions[wolfPose] : { x: 390, y: 145 };
  const formattedScore = formatScore(score);
  const formattedRecord = formatScore(record);
  const {
    eggs: movingEggs,
    brokenEggs,
    speedLevel,
  } = useEggMovement(gameMode, gameSession, isPaused || isGameOver, wolfPose, onEggCaught, onEggMissed);

  return (
    <div className={style.frame}>
      <svg
        className={style.screen}
        viewBox="0 0 800 440"
        preserveAspectRatio="none"
        role="img"
        aria-label={isScreenOn ? 'Игровой LCD-экран с волком, четырьмя лотками и яйцами' : 'Выключенный игровой экран'}
      >
        <defs>
          <filter id="soft-lcd">
            <feGaussianBlur stdDeviation="0.25" />
          </filter>
          <filter id="screen-noise" x="0" y="0" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.75 0.18" numOctaves="2" seed="7" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <pattern id="scanlines" width="8" height="8" patternUnits="userSpaceOnUse">
            <rect width="8" height="2" fill="#d9dfdb" opacity="0.16" />
          </pattern>
        </defs>

        {!isScreenOn ? (
          <g className={style.interference}>
            <rect className={style.screenOff} width="800" height="440" />
            <rect className={style.noise} width="800" height="440" filter="url(#screen-noise)" />
            <rect className={style.scanlines} width="800" height="440" />
          </g>
        ) : (
          <g filter="url(#soft-lcd)">
            <SpeedScale level={speedLevel} />
            <text className={style.recordLabel} x="245" y="16" textAnchor="middle">
              РЕКОРД
            </text>
            <text className={style.score} x="245" y="55" textAnchor="middle">
              {formattedRecord}
            </text>
            <text className={style.score} x="400" y="55" textAnchor="middle">
              {formattedScore}
            </text>
            <g className={style.misses} transform="translate(503 38)">
              {missSteps.map((missStep) => (
                <circle
                  key={missStep}
                  className={missStep < misses ? style.missActive : style.miss}
                  cx={missStep * 24}
                  cy="0"
                  r="9"
                />
              ))}
            </g>

            <Rabbit x={110} y={17} scale={0.52} />
            <Chicken x={8} y={27} />
            <Ramp x={0} y={88} />
            <Chicken x={8} y={145} />
            <Ramp x={0} y={206} gentle />
            <Chicken x={792} y={27} mirrored />
            <Ramp x={800} y={88} mirror />
            <Chicken x={792} y={145} mirrored />
            <Ramp x={800} y={206} mirror gentle />

            {movingEggs.map((egg) => (
              <Egg key={egg.id} x={egg.x} y={egg.y} />
            ))}

            {brokenEggs.map((egg) => (
              <BrokenEgg key={egg.id} x={egg.x} y={egg.y} />
            ))}

            <Wolf x={wolfPosition.x} y={wolfPosition.y} scale={0.98} pose={wolfPose} />

            <path
              className={style.grass}
              d="M0 427c19-22 30-28 35 0 18-33 28-30 37 0 19-28 27-24 35 0 24-31 34-27 42 0 25-30 38-28 46 0 20-27 32-25 40 0 26-34 38-30 48 0 22-30 34-27 43 0 22-28 34-25 43 0 26-34 40-29 49 0 22-31 36-28 45 0 28-35 40-30 49 0 24-31 35-28 44 0 26-33 40-29 49 0 22-28 34-24 42 0 20-30 32-25 40 0 20-27 30-22 36 0H0Z"
            />
          </g>
        )}
      </svg>
      {isScreenOn && (isPaused || isGameOver) && (
        <div className={`${style.pauseOverlay} ${isGameOver ? style.gameOver : ''}`} role="status" aria-live="polite">
          {isGameOver ? (
            <span>
              Игра окончена
              <br />
              Ваш счёт: {formattedScore}
            </span>
          ) : countdown === null ? (
            <PauseRoundedIcon aria-hidden="true" />
          ) : (
            <span className={style.countdown}>{countdown}</span>
          )}
          {!isGameOver && (
            <span className={style.visuallyHidden}>
              {countdown === null ? 'Игра на паузе' : `Игра продолжится через ${countdown}`}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
