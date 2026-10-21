import style from './GameSprites.module.less';
import type { SpritePositionProps } from './types';

export const Rabbit = ({ x, y, scale = 1, mirrored = false }: SpritePositionProps) => {
  const spriteSize = 84;

  return (
    <g className={style.sprite} transform={`translate(${x} ${y}) scale(${scale})`} aria-hidden="true">
      <g transform={mirrored ? `translate(${spriteSize} 0) scale(-1 1)` : undefined}>
        <image
          className={style.pixelSprite}
          href="/images/rabbit-frame.png"
          width={spriteSize}
          height={spriteSize}
          preserveAspectRatio="xMidYMid meet"
        />
      </g>
    </g>
  );
};
