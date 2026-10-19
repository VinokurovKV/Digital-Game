import style from './App.module.less';
import { GameConsole } from '../GameConsole';

export const App = () => {
  return (
    <main className={style.page}>
      <GameConsole />
    </main>
  );
};
