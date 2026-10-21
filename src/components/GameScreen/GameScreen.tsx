import { memo, useEffect, useState } from 'react';
import PauseRoundedIcon from '@mui/icons-material/PauseRounded';

import style from './GameScreen.module.less';
import { formatScore } from '../../game/gameRules';
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
  isClockMode: boolean;
  onEggCaught: (caughtEggs: number) => void;
  onEggMissed: (missedEggs: number) => void;
  onClockLaneChange: (lane: WolfPose) => void;
};

const wolfPositions: Record<WolfPose, { x: number; y: number }> = {
  topLeft: { x: 147, y: 60 },
  bottomLeft: { x: 160, y: 225 },
  topRight: { x: 460, y: 60 },
  bottomRight: { x: 440, y: 225 },
};

const speedSteps = [8, 12, 16, 20, 24];
const missSteps = [0, 1, 2, 3, 4];
const groundTilePositions = [0, 166, 332, 498, 664];
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

const Ramp = ({ x, y, mirror = false }: { x: number; y: number; mirror?: boolean }) => (
  <g className={style.woodRamp} transform={`translate(${x} ${y}) ${mirror ? 'scale(-1 1)' : ''}`}>
    <rect width="142" height="12" rx="2" />
    <path d="m91 8 57 42-8 10L82 15z" />
    <rect x="14" y="10" width="9" height="51" rx="2" />
    <rect x="36" y="10" width="9" height="36" rx="2" />
  </g>
);

const StaticScene = memo(() => (
  <>
    <Rabbit x={60} y={4} />
    <Chicken x={8} y={27} />
    <Ramp x={0} y={88} />
    <Chicken x={8} y={180} />
    <Ramp x={0} y={241} />
    <Chicken x={792} y={27} mirrored />
    <Ramp x={800} y={88} mirror />
    <Chicken x={792} y={180} mirrored />
    <Ramp x={800} y={241} mirror />

    <g className={style.ground}>
      {groundTilePositions.map((x) => (
        <svg key={x} x={x} y="400" width="166" height="40" viewBox="0 0 160 40" overflow="hidden">
          <image href="/images/ground.png" width="160" height="160" preserveAspectRatio="none" />
        </svg>
      ))}
    </g>
  </>
));

type GameHudProps = {
  formattedRecord: string;
  formattedScore: string;
  misses: number;
  speedLevel: number;
};

const GameHud = memo(({ formattedRecord, formattedScore, misses, speedLevel }: GameHudProps) => (
  <>
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
  </>
));

const formatTimePart = (value: number) => (value < 10 ? `0${value}` : String(value));

const ClockHud = ({ time }: { time: Date }) => (
  <text className={`${style.score} ${style.clock}`} x="400" y="55" textAnchor="middle">
    {formatTimePart(time.getHours())}:{formatTimePart(time.getMinutes())}:{formatTimePart(time.getSeconds())}
  </text>
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
  isClockMode,
  onEggCaught,
  onEggMissed,
  onClockLaneChange,
}: GameScreenProps) => {
  const [currentTime, setCurrentTime] = useState(() => new Date());
  const wolfPosition = wolfPose ? wolfPositions[wolfPose] : { x: 294, y: 120 };
  const formattedScore = formatScore(score);
  const formattedRecord = formatScore(record);
  const {
    eggs: movingEggs,
    brokenEggs,
    speedLevel,
  } = useEggMovement(
    isClockMode ? 'clock' : gameMode,
    gameSession,
    isPaused || isGameOver,
    wolfPose,
    onEggCaught,
    onEggMissed,
    onClockLaneChange,
  );

  useEffect(() => {
    if (!isClockMode || !isScreenOn) {
      return undefined;
    }

    setCurrentTime(new Date());
    const clockTimer = window.setInterval(() => setCurrentTime(new Date()), 1000);

    return () => window.clearInterval(clockTimer);
  }, [isClockMode, isScreenOn]);

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
          <pattern id="scanlines" width="8" height="8" patternUnits="userSpaceOnUse">
            <rect width="8" height="2" fill="#d9dfdb" opacity="0.16" />
          </pattern>
          <pattern id="screen-noise" width="24" height="18" patternUnits="userSpaceOnUse">
            <rect width="3" height="2" x="2" y="3" />
            <rect width="2" height="1" x="13" y="8" />
            <rect width="4" height="1" x="18" y="14" />
            <rect width="1" height="2" x="8" y="15" />
          </pattern>
          <pattern id="wood-tile" width="16" height="16" patternUnits="userSpaceOnUse">
            <image href="/images/woodtiles2.png" width="64" height="39" preserveAspectRatio="none" />
          </pattern>
        </defs>

        {!isScreenOn ? (
          <g className={style.interference}>
            <rect className={style.screenOff} width="800" height="440" />
            <rect className={style.noise} width="800" height="440" />
            <rect className={style.scanlines} width="800" height="440" />
          </g>
        ) : (
          <g>
            {isClockMode ? (
              <ClockHud time={currentTime} />
            ) : (
              <GameHud
                formattedRecord={formattedRecord}
                formattedScore={formattedScore}
                misses={misses}
                speedLevel={speedLevel}
              />
            )}
            <StaticScene />

            {movingEggs.map((egg) => (
              <Egg key={egg.id} x={egg.x} y={egg.y} />
            ))}

            {brokenEggs.map((egg) => (
              <BrokenEgg key={egg.id} x={egg.x} y={egg.y} />
            ))}

            <Wolf x={wolfPosition.x} y={wolfPosition.y} pose={wolfPose} />
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
