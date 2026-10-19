import style from './GameSprites.module.less';

type EggProps = {
  x: number;
  y: number;
  scale?: number;
};

export const Egg = ({ x, y, scale = 1 }: EggProps) => (
  <g
    className={style.sprite}
    transform={`translate(${x} ${y}) scale(${scale})`}
    aria-hidden="true"
  >
    <circle className={style.line} cx="0" cy="0" r="12" strokeWidth="4" />
  </g>
);
