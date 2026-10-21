import { Navigate, Route, Routes } from 'react-router-dom';

import { GameConsole } from '../GameConsole';
import { WelcomeScreen } from '../WelcomeScreen';

import style from './App.module.less';

export const App = () => (
  <Routes>
    <Route path="/" element={<WelcomeScreen />} />
    <Route
      path="/game"
      element={
        <main className={style.page}>
          <GameConsole />
        </main>
      }
    />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);
