import style from './GameSprites.module.less';
import { SpritePositionProps } from './types';

export const Chicken = ({
  x,
  y,
  scale = 1,
  mirrored = false,
}: SpritePositionProps) => {
  const direction = mirrored ? -scale : scale;

  return (
    <g
      className={style.sprite}
      transform={`translate(${x} ${y}) scale(${direction} ${scale})`}
      aria-hidden="true"
    >
      <path
        className={style.ink}
        d="M15 52c-7-7-10-17-7-27l13 7C18 21 21 12 29 5l8 14c3-10 10-16 19-19l2 18c10-6 23-5 32 2-7 2-11 6-13 12 12-2 23 3 28 12l-15 4c-5 13-18 20-38 20-19 0-31-5-37-16Z"
      />
      <path className={style.ink} d="m96 37 24 9-25 9Z" />
      <circle className={style.lcdCutout} cx="84" cy="35" r="3.2" />
      <path
        className={style.line}
        d="M42 64v19m23-18 2 18M31 84h23m2 0h24"
        strokeWidth="5"
      />
    </g>
  );
};
