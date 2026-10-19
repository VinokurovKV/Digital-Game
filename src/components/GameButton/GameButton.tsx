import NavigationRoundedIcon from '@mui/icons-material/NavigationRounded';

import style from './GameButton.module.less';

type GameButtonProps = {
  direction: 'up-left' | 'down-left' | 'up-right' | 'down-right';
  label: string;
  isActive: boolean;
  disabled?: boolean;
  onClick: () => void;
};

const arrowRotations = {
  'up-left': -45,
  'down-left': -135,
  'up-right': 45,
  'down-right': 135,
} as const;

export const GameButton = ({ direction, label, isActive, disabled = false, onClick }: GameButtonProps) => {
  const side = direction.endsWith('left') ? 'left' : 'right';
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
