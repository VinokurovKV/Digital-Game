import style from './GameSprites.module.less';
import type { SpritePositionProps } from './types';

export const Chicken = ({ x, y, scale = 1, mirrored = false }: SpritePositionProps) => {
  const spriteSize = 64;
  const direction = mirrored ? scale : -scale;
  const translatedX = mirrored ? x - spriteSize * scale : x + spriteSize * scale;

  return (
    <g
      className={style.sprite}
      transform={`translate(${translatedX} ${y}) scale(${direction} ${scale})`}
      aria-hidden="true"
    >
      <image
        className={style.pixelSprite}
        href="/images/chicken.png"
        y="0"
        width={spriteSize}
        height={spriteSize}
        preserveAspectRatio="xMidYMid meet"
      />
    </g>
  );
};
