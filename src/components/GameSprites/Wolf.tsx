import { memo } from 'react';

import style from './GameSprites.module.less';
import type { SpritePositionProps } from './types';

export type WolfPose = 'topLeft' | 'bottomLeft' | 'topRight' | 'bottomRight';

type WolfProps = Omit<SpritePositionProps, 'mirrored'> & {
  pose: WolfPose | null;
};

const poseSides: Record<WolfPose, -1 | 1> = {
  topLeft: -1,
  bottomLeft: -1,
  topRight: 1,
  bottomRight: 1,
};

export const Wolf = memo(({ x, y, scale = 1, pose }: WolfProps) => {
  const side = pose ? poseSides[pose] : 1;

  return (
    <g className={style.sprite} transform={`translate(${x} ${y}) scale(${scale})`} aria-hidden="true">
      <g transform={side === -1 ? 'translate(208 0) scale(-1 1)' : undefined}>
        <image
          className={style.pixelSprite}
          href="/images/wolf-frame.png"
          x="0"
          y="0"
          width="208"
          height="200"
          preserveAspectRatio="xMidYMid meet"
        />
      </g>
    </g>
  );
});
