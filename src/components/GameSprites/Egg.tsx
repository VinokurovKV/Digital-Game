import style from './GameSprites.module.less';

type EggProps = {
  x: number;
  y: number;
  scale?: number;
};

export const Egg = ({ x, y, scale = 1 }: EggProps) => (
  <g className={style.sprite} transform={`translate(${x} ${y}) scale(${scale})`} aria-hidden="true">
    <image
      href="/images/egg-whole.png"
      x="-17"
      y="-20"
      width="34"
      height="40"
      preserveAspectRatio="xMidYMid meet"
      transform="rotate(180)"
    />
  </g>
);
