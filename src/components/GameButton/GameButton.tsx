import NavigationRoundedIcon from '@mui/icons-material/NavigationRounded';

import style from './GameButton.module.less';

type GameButtonProps = {
  direction: 'up-left' | 'down-left' | 'up-right' | 'down-right';
  label: string;
};

const arrowRotations = {
  'up-left': -45,
  'down-left': -135,
  'up-right': 45,
  'down-right': 135,
} as const;

export const GameButton = ({ direction, label }: GameButtonProps) => {
  const side = direction.endsWith('left') ? 'left' : 'right';
  const level = direction.startsWith('up') ? 'up' : 'down';

  return (
    <div className={`${style.control} ${style[side]} ${style[level]}`}>
      <NavigationRoundedIcon
        className={style.arrow}
        style={{ transform: `rotate(${arrowRotations[direction]}deg)` }}
        aria-hidden="true"
      />
      <button type="button" aria-label={label} />
    </div>
  );
};
