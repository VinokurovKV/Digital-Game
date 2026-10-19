import style from './GameSprites.module.less';
import { SpritePositionProps } from './types';

export type WolfPose = 'topLeft' | 'bottomLeft' | 'topRight' | 'bottomRight';

type WolfProps = Omit<SpritePositionProps, 'mirrored'> & {
  pose: WolfPose;
};

const poseSettings: Record<WolfPose, { side: -1 | 1; basketY: number; armY: number }> = {
  topLeft: { side: -1, basketY: 51, armY: 76 },
  bottomLeft: { side: -1, basketY: 118, armY: 111 },
  topRight: { side: 1, basketY: 51, armY: 76 },
  bottomRight: { side: 1, basketY: 118, armY: 111 },
};

export const Wolf = ({ x, y, scale = 1, pose }: WolfProps) => {
  const { side, basketY, armY } = poseSettings[pose];

  return (
    <g
      className={style.sprite}
      transform={`translate(${x} ${y}) scale(${scale})`}
      aria-hidden="true"
    >
      <path
        className={style.ink}
        d="M2 52 18 24l8 18L44 10l4 35c15 5 25 18 25 34 0 17-10 29-27 34l2 49 22 48H48l-14-30-12 30H0l20-52-2-49C4 102-3 91-4 78c-1-11 1-20 6-26Z"
      />
      <path className={style.ink} d="M45 51 88 68 47 82Z" />
      <circle className={style.lcdCutout} cx="43" cy="61" r="4" />
      <path
        className={style.line}
        d="M19 116-8 143m51-29 23 25M20 158-8 207m55-47 27 47"
        strokeWidth="10"
      />
      <path
        className={style.line}
        d={`M${side * 34} ${armY}L${side * 70} ${basketY + 9}`}
        strokeWidth="10"
      />
      <g transform={`translate(${side * 67} ${basketY}) scale(${side} 1)`}>
        <path
          className={style.line}
          d="M0 0h55l-8 39H10L0 0Zm7 13h45M7 26h42M18 2l3 36M37 2l-5 36"
          strokeWidth="5"
        />
      </g>
    </g>
  );
};
