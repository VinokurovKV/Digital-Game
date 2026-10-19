import style from './GameScreen.module.less';
import { Chicken, Egg, Rabbit, Wolf } from '../GameSprites';
import type { WolfPose } from '../GameSprites';

type GameScreenProps = {
  wolfPose: WolfPose | null;
  isScreenOn: boolean;
};

const wolfPositions: Record<WolfPose, { x: number; y: number }> = {
  topLeft: { x: 228, y: 90 },
  bottomLeft: { x: 243, y: 190 },
  topRight: { x: 510, y: 90 },
  bottomRight: { x: 491, y: 190 },
};

const Ramp = ({ x, y, mirror = false }: { x: number; y: number; mirror?: boolean }) => (
  <g transform={`translate(${x} ${y}) ${mirror ? 'scale(-1 1)' : ''}`}>
    <path d="M0 0h142l-9 9H0z" />
    <path d="m91 7 55 42-6 7L82 10z" />
    <path d="M17 6v54M40 6v39" fill="none" stroke="currentColor" strokeWidth="7" />
  </g>
);

export const GameScreen = ({ wolfPose, isScreenOn }: GameScreenProps) => {
  const wolfPosition = wolfPose ? wolfPositions[wolfPose] : { x: 390, y: 145 };

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
            <text className={style.score} x="400" y="55" textAnchor="middle">
              0230
            </text>
            <g className={style.misses} transform="translate(503 27)">
              <circle cx="0" cy="0" r="10" />
              <circle cx="30" cy="0" r="10" />
              <circle cx="60" cy="0" r="10" />
              <circle cx="90" cy="0" r="9" fill="none" stroke="currentColor" strokeWidth="3" />
            </g>

            <Rabbit x={110} y={17} scale={0.52} />
            <Chicken x={8} y={27} />
            <Ramp x={0} y={88} />
            <Chicken x={8} y={179} />
            <Ramp x={0} y={240} />
            <Chicken x={792} y={27} mirrored />
            <Ramp x={800} y={88} mirror />
            <Chicken x={792} y={179} mirrored />
            <Ramp x={800} y={240} mirror />

            <Egg x={201} y={162} />
            <Egg x={606} y={164} />
            <Egg x={216} y={260} />
            <Egg x={587} y={262} />

            <Wolf x={wolfPosition.x} y={wolfPosition.y} scale={0.98} pose={wolfPose} />

            <path
              className={style.grass}
              d="M0 427c19-22 30-28 35 0 18-33 28-30 37 0 19-28 27-24 35 0 24-31 34-27 42 0 25-30 38-28 46 0 20-27 32-25 40 0 26-34 38-30 48 0 22-30 34-27 43 0 22-28 34-25 43 0 26-34 40-29 49 0 22-31 36-28 45 0 28-35 40-30 49 0 24-31 35-28 44 0 26-33 40-29 49 0 22-28 34-24 42 0 20-30 32-25 40 0 20-27 30-22 36 0H0Z"
            />
          </g>
        )}
      </svg>
    </div>
  );
};
