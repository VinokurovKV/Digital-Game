import style from './GameSprites.module.less';

type BrokenEggProps = {
  x: number;
  y: number;
};

export const BrokenEgg = ({ x, y }: BrokenEggProps) => (
  <g className={`${style.sprite} ${style.brokenEgg}`} transform={`translate(${x} ${y})`} aria-hidden="true">
    <g className={style.leftShell}>
      <path className={style.line} d="M0 0-5-5-9 0l-5-4-4 6c-3 6 0 14 7 16 7 2 13-2 16-8Z" strokeWidth="4" />
    </g>
    <g className={style.rightShell}>
      <path className={style.line} d="M0 0 5-5 9 0l5-4 4 6c3 6 0 14-7 16-7 2-13-2-16-8Z" strokeWidth="4" />
    </g>
    <g className={style.eggSplash}>
      <path className={style.line} d="m-8-10-5-9M0-13v-10m8 13 5-9M-15-5l-8-4m38 4 8-4" strokeWidth="3" />
    </g>
  </g>
);
