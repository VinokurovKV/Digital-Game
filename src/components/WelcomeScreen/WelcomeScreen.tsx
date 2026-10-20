import { Link } from 'react-router-dom';

import style from './WelcomeScreen.module.less';

export const WelcomeScreen = () => (
  <main className={style.welcome}>
    <section className={style.panel} aria-labelledby="welcome-title">
      <header className={style.header}>
        <span className={style.badge} aria-hidden="true">
          ИМ
        </span>
        <p>ЭЛЕКТРОННАЯ ИГРА</p>
      </header>

      <div className={style.content}>
        <p className={style.greeting}>ДОБРО ПОЖАЛОВАТЬ!</p>
        <h1 id="welcome-title">НУ, ПОГОДИ!</h1>
        <p className={style.description}>Помогите Волку поймать все яйца и установите новый рекорд</p>

        <ul className={style.gameInfo} aria-label="Правила игры">
          <li>
            <strong>РЕКОРД</strong>
            <span>Лучший счёт сохраняется в этом браузере после окончания игры</span>
          </li>
          <li>
            <strong>ИГРА А / ИГРА Б</strong>
            <span>
              В игре А — три дорожки, заяц лишь подсматривает. В игре Б — все четыре и более высокий стартовый темп
            </span>
          </li>
          <li>
            <strong>ПАУЗА</strong>
            <span>Нажмите активную кнопку режима ещё раз или Esc. Продолжение — после обратного отсчёта</span>
          </li>
        </ul>

        <Link className={style.startButton} to="/game">
          НАЧАТЬ ИГРУ
        </Link>
      </div>

      <div className={style.onboarding}>
        <div className={style.desktopHint}>
          <strong>УПРАВЛЕНИЕ</strong>
          <span>
            <kbd>Q</kbd>
            <kbd>A</kbd> слева
          </span>
          <span>
            <kbd>P</kbd>
            <kbd>L</kbd> справа
          </span>
        </div>

        <div className={style.tabletHint}>
          <strong>УПРАВЛЕНИЕ</strong>
          <span>Нажимайте четыре зелёные кнопки по краям приставки</span>
        </div>

        <div className={style.phoneHint}>
          <strong>ПОВЕРНИТЕ ТЕЛЕФОН</strong>
          <span>Играйте в горизонтальном положении</span>
        </div>
      </div>
    </section>
  </main>
);
