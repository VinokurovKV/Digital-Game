import { memo } from 'react';

import style from './GameSprites.module.less';
import type { SpritePositionProps } from './types';

type RoboRabbitProps = Omit<SpritePositionProps, 'mirrored'>;

export const RoboRabbit = memo(({ x, y, scale = 1 }: RoboRabbitProps) => (
  <g className={style.sprite} transform={`translate(${x} ${y}) scale(${scale})`} aria-hidden="true">
    <image
      className={style.pixelSprite}
      href="/images/robo-rabbit.png"
      x="-56"
      y="-60"
      width="320"
      height="320"
      preserveAspectRatio="xMidYMid meet"
    />
  </g>
));
