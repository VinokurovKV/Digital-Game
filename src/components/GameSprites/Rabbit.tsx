import style from './GameSprites.module.less';
import { SpritePositionProps } from './types';

export const Rabbit = ({ x, y, scale = 1, mirrored = false }: SpritePositionProps) => {
  const direction = mirrored ? -scale : scale;

  return (
    <g
      className={style.sprite}
      transform={`translate(${x} ${y}) scale(${direction} ${scale})`}
      aria-hidden="true"
    >
      <path
        className={style.line}
        d="M22 43C8 13 13 0 24 2c10 2 15 21 14 38M55 40C58 11 67-1 77 5c9 6 0 27-10 40"
        strokeWidth="7"
      />
      <path
        className={style.ink}
        d="M10 70c0-22 14-38 37-38s39 16 39 38c0 20-15 33-38 33S10 90 10 70Z"
      />
      <circle className={style.lcdCutout} cx="37" cy="65" r="3.5" />
      <circle className={style.lcdCutout} cx="62" cy="65" r="3.5" />
      <path
        className={style.line}
        d="m45 76 7 5-7 5m-16 10c6-8 13-9 19-3 6-6 14-5 21 3"
        strokeWidth="4"
      />
      <path className={style.ink} d="M2 103h94l-12 11H15Z" />
    </g>
  );
};
