import NavigationRoundedIcon from '@mui/icons-material/NavigationRounded';

import style from './GameButton.module.less';

type GameButtonProps = {
  direction: 'upLeft' | 'downLeft' | 'upRight' | 'downRight';
  label: string;
  isActive: boolean;
  disabled?: boolean;
  onClick: () => void;
};

const arrowRotations = {
  upLeft: -45,
  downLeft: -135,
  upRight: 45,
  downRight: 135,
} as const;

export const GameButton = ({ direction, label, isActive, disabled = false, onClick }: GameButtonProps) => {
  const side = direction.endsWith('Left') ? 'left' : 'right';
  const level = direction.startsWith('up') ? 'up' : 'down';

  return (
    <div
      className={`${style.control} ${style[side]} ${style[level]} ${isActive ? style.active : ''} ${
        disabled ? style.disabled : ''
      }`}
    >
      <NavigationRoundedIcon
        className={style.arrow}
        style={{ transform: `rotate(${arrowRotations[direction]}deg)` }}
        aria-hidden="true"
      />
      <button type="button" aria-label={label} aria-pressed={isActive} disabled={disabled} onClick={onClick} />
    </div>
  );
};
