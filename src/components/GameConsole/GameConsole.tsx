import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import VolumeUpRoundedIcon from '@mui/icons-material/VolumeUpRounded';

import { GameButton } from '../GameButton';
import { GameScreen } from '../GameScreen';
import style from './GameConsole.module.less';

export const GameConsole = () => (
  <section className={style.shell} aria-label="Электронная игра Ну, погоди!">
    <div className={style.cabinet}>
      <aside className={style.brand}>
        <div className={style.badge} aria-hidden="true">
          <span>ИМ</span>
        </div>
      </aside>

      <div className={style.gameArea}>
        <div className={style.displayPanel}>
          <h1>НУ, ПОГОДИ!</h1>
          <GameScreen />
          <span>ЭЛЕКТРОНИКА</span>
        </div>
      </div>

      <aside className={style.servicePanel} aria-label="Служебные кнопки">
        <div className={style.modeButtons}>
          <button type="button"><i /><span>ИГРА А</span></button>
          <button type="button"><i /><span>ИГРА Б</span></button>
          <button type="button"><i /><span>ЭКРАН</span></button>
        </div>
        <div className={style.toggles}>
          <button type="button" aria-label="Звук"><VolumeUpRoundedIcon className={style.toggleIcon} /><i /></button>
          <button type="button" aria-label="Часы"><AccessTimeRoundedIcon className={style.toggleIcon} /><i /></button>
        </div>
      </aside>

      <div className={style.leftControls}>
        <GameButton direction="up-left" label="Левая верхняя позиция" />
        <GameButton direction="down-left" label="Левая нижняя позиция" />
      </div>
      <div className={style.rightControls}>
        <GameButton direction="up-right" label="Правая верхняя позиция" />
        <GameButton direction="down-right" label="Правая нижняя позиция" />
      </div>
    </div>
  </section>
);
