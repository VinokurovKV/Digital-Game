import { memo } from 'react';

import style from './GameSprites.module.less';
import type { SpritePositionProps } from './types';

type PeekingWolfProps = Omit<SpritePositionProps, 'mirrored'>;

export const PeekingWolf = memo(({ x, y, scale = 1 }: PeekingWolfProps) => (
  <g className={style.sprite} transform={`translate(${x} ${y}) scale(${scale})`} aria-hidden="true">
    <image
      className={style.pixelSprite}
      href="/images/sided-wolf.png"
      width="100"
      height="100"
      preserveAspectRatio="xMidYMid meet"
    />
  </g>
));
