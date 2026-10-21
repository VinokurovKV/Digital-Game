import type { WolfPose } from '../components/GameSprites';

export type GameMode = 'A' | 'B';

const lanesByMode: Record<GameMode, readonly WolfPose[]> = {
  A: ['bottomLeft', 'topRight', 'bottomRight'],
  B: ['topLeft', 'bottomLeft', 'topRight', 'bottomRight'],
};

const speedFactors = [1, 1.4, 1.8, 2.2, 2.6, 3] as const;

export const maxSpeedLevel = speedFactors.length - 1;

export const getGameLanes = (mode: GameMode): WolfPose[] => [...lanesByMode[mode]];

export const getAvailableLanes = (mode: GameMode, previousLane: WolfPose | null): WolfPose[] =>
  lanesByMode[mode].filter((lane) => lane !== previousLane);

export const selectNextLane = (mode: GameMode, previousLane: WolfPose | null, randomValue: number): WolfPose => {
  const availableLanes = getAvailableLanes(mode, previousLane);
  const index = Math.min(Math.floor(Math.max(randomValue, 0) * availableLanes.length), availableLanes.length - 1);

  return availableLanes[index];
};

export const getGameDelay = (baseDelay: number, speedLevel: number): number => {
  const normalizedLevel = Math.min(Math.max(Math.floor(speedLevel), 0), maxSpeedLevel);

  return Math.round(baseDelay / speedFactors[normalizedLevel]);
};

export const clampScore = (score: number): number => Math.min(Math.max(Math.floor(score), 0), 9999);

export const formatScore = (score: number): string => `0000${clampScore(score)}`.slice(-4);

export const addScore = (score: number, caughtEggs: number): number => clampScore(score + caughtEggs);

export const addMisses = (misses: number, missedEggs: number): number =>
  Math.min(Math.max(Math.floor(misses + missedEggs), 0), 5);

export const hasGameEnded = (misses: number): boolean => misses >= 5;

export const getNextRecord = (record: number, score: number): number => Math.max(clampScore(record), clampScore(score));
