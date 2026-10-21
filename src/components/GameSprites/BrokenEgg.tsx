import style from './GameSprites.module.less';

type BrokenEggProps = {
  x: number;
  y: number;
};

export const BrokenEgg = ({ x, y }: BrokenEggProps) => (
  <g className={`${style.sprite} ${style.brokenEgg}`} transform={`translate(${x} ${y})`} aria-hidden="true">
    <g className={style.leftShell}>
      <image href="/images/egg-half.png" x="-31" y="-12" width="34" height="26" preserveAspectRatio="xMidYMid meet" />
    </g>
    <g className={style.rightShell}>
      <image href="/images/egg-half.png" x="-3" y="-12" width="34" height="26" preserveAspectRatio="xMidYMid meet" />
    </g>
    <g className={style.eggSplash}>
      <path className={style.line} d="m-8-10-5-9M0-13v-10m8 13 5-9M-15-5l-8-4m38 4 8-4" strokeWidth="3" />
    </g>
  </g>
);
