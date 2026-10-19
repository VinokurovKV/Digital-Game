import style from './GameSprites.module.less';
import { SpritePositionProps } from './types';

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

export const Wolf = ({ x, y, scale = 1, pose }: WolfProps) => {
  const basketSide = pose ? poseSides[pose] : null;

  return (
    <g className={style.sprite} transform={`translate(${x} ${y}) scale(${scale})`} aria-hidden="true">
      <g transform={basketSide === -1 ? 'translate(68 0) scale(-1 1)' : undefined}>
        <path
          className={style.ink}
          d="M2 52 18 24l8 18L44 10l4 35c15 5 25 18 25 34 0 17-12 29-31 31-19 2-36-7-44-23-6-12-5-25 4-35Z"
        />
        <path className={style.ink} d="M45 53 82 68 47 80Z" />
        <circle className={style.lcdCutout} cx="43" cy="61" r="4" />
      </g>
      <path className={style.line} d="M35 106v57M35 120 8 145m27-25 27 25M35 162 12 207m23-45 25 45" strokeWidth="9" />

      {basketSide !== null && (
        <g transform={`translate(${basketSide === -1 ? 0 : 70} 96) scale(${basketSide} 1)`}>
          <path className={style.line} d="M0 0h55l-8 39H10L0 0Zm7 13h45M7 26h42M18 2l3 36M37 2l-5 36" strokeWidth="5" />
        </g>
      )}
    </g>
  );
};
