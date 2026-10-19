import { useEffect, useRef, useState } from 'react';

import type { WolfPose } from '../GameSprites';

export type EggMovementMode = 'A' | 'B';

type Point = {
  x: number;
  y: number;
};

type MovingEggState = {
  id: number;
  lane: WolfPose;
  step: number;
};

export type MovingEgg = Point & {
  id: number;
};

const eggPaths: Record<WolfPose, Point[]> = {
  topLeft: [
    { x: 150, y: 126 },
    { x: 160, y: 132 },
    { x: 171, y: 138 },
    { x: 181, y: 146 },
    { x: 191, y: 153 },
    { x: 201, y: 162 },
  ],
  topRight: [
    { x: 650, y: 126 },
    { x: 641, y: 133 },
    { x: 632, y: 141 },
    { x: 623, y: 149 },
    { x: 614, y: 157 },
    { x: 606, y: 164 },
  ],
  bottomLeft: [
    { x: 150, y: 232 },
    { x: 163, y: 243 },
    { x: 176, y: 254 },
    { x: 189, y: 265 },
    { x: 202, y: 275 },
    { x: 216, y: 285 },
  ],
  bottomRight: [
    { x: 650, y: 232 },
    { x: 637, y: 243 },
    { x: 624, y: 254 },
    { x: 612, y: 265 },
    { x: 599, y: 276 },
    { x: 587, y: 287 },
  ],
};

const timings: Record<EggMovementMode, { movement: number; spawn: number }> = {
  A: { movement: 320, spawn: 1400 },
  B: { movement: 220, spawn: 900 },
};

const lanes = Object.keys(eggPaths) as WolfPose[];

export const useEggMovement = (
  gameMode: EggMovementMode | null,
  gameSession: number,
  isPaused: boolean,
): MovingEgg[] => {
  const [eggs, setEggs] = useState<MovingEggState[]>([]);
  const nextId = useRef(0);
  const isPausedRef = useRef(isPaused);

  isPausedRef.current = isPaused;

  useEffect(() => {
    setEggs([]);

    if (gameMode === null) {
      return undefined;
    }

    let previousLane: WolfPose | null = null;
    const availableGameLanes = gameMode === 'A' ? lanes.filter((lane) => lane !== 'topLeft') : lanes;

    const spawnEgg = () => {
      if (isPausedRef.current) {
        return;
      }

      const availableLanes = availableGameLanes.filter((lane) => lane !== previousLane);
      const lane = availableLanes[Math.floor(Math.random() * availableLanes.length)];

      previousLane = lane;
      nextId.current += 1;
      setEggs((currentEggs) => [...currentEggs, { id: nextId.current, lane, step: 0 }]);
    };

    spawnEgg();

    const movementTimer = window.setInterval(() => {
      if (isPausedRef.current) {
        return;
      }

      setEggs((currentEggs) =>
        currentEggs
          .map((egg) => ({ ...egg, step: egg.step + 1 }))
          .filter((egg) => egg.step < eggPaths[egg.lane].length),
      );
    }, timings[gameMode].movement);

    const spawnTimer = window.setInterval(spawnEgg, timings[gameMode].spawn);

    return () => {
      window.clearInterval(movementTimer);
      window.clearInterval(spawnTimer);
    };
  }, [gameMode, gameSession]);

  return eggs.map(({ id, lane, step }) => ({ id, ...eggPaths[lane][step] }));
};
