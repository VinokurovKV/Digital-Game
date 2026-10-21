import { useEffect, useRef, useState } from 'react';

import { getGameDelay, maxSpeedLevel, selectNextLane } from '../../game/gameRules';
import type { GameMode } from '../../game/gameRules';
import type { WolfPose } from '../GameSprites';

export type EggMovementMode = GameMode;

type Point = {
  x: number;
  y: number;
};

type MovingEggState = {
  id: number;
  lane: WolfPose;
  step: number;
};

type BrokenEggState = {
  id: number;
  lane: WolfPose;
};

export type MovingEgg = Point & {
  id: number;
};

export type BrokenEggPosition = Point & {
  id: number;
};

type EggMovementState = {
  eggs: MovingEgg[];
  brokenEggs: BrokenEggPosition[];
  speedLevel: number;
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
    { x: 608, y: 162 },
  ],
  bottomLeft: [
    { x: 150, y: 267 },
    { x: 163, y: 278 },
    { x: 176, y: 289 },
    { x: 189, y: 300 },
    { x: 202, y: 310 },
    { x: 216, y: 320 },
  ],
  bottomRight: [
    { x: 650, y: 267 },
    { x: 637, y: 278 },
    { x: 624, y: 289 },
    { x: 612, y: 300 },
    { x: 599, y: 311 },
    { x: 589, y: 320 },
  ],
};

const timings: Record<EggMovementMode, { movement: number; spawn: number }> = {
  A: { movement: 320, spawn: 1400 },
  B: { movement: 220, spawn: 900 },
};

const speedUpInterval = 10_000;
const brokenEggDuration = 700;

export const useEggMovement = (
  gameMode: EggMovementMode | null,
  gameSession: number,
  isPaused: boolean,
  wolfPose: WolfPose | null,
  onEggCaught: (caughtEggs: number) => void,
  onEggMissed: (missedEggs: number) => void,
): EggMovementState => {
  const [eggs, setEggs] = useState<MovingEggState[]>([]);
  const [brokenEggs, setBrokenEggs] = useState<BrokenEggState[]>([]);
  const [speedLevel, setSpeedLevel] = useState(0);
  const eggsRef = useRef<MovingEggState[]>([]);
  const nextId = useRef(0);
  const isPausedRef = useRef(isPaused);
  const speedLevelRef = useRef(0);
  const wolfPoseRef = useRef(wolfPose);
  const onEggCaughtRef = useRef(onEggCaught);
  const onEggMissedRef = useRef(onEggMissed);

  isPausedRef.current = isPaused;
  wolfPoseRef.current = wolfPose;
  onEggCaughtRef.current = onEggCaught;
  onEggMissedRef.current = onEggMissed;

  useEffect(() => {
    eggsRef.current = [];
    setEggs([]);
    setBrokenEggs([]);

    if (gameMode === null) {
      setSpeedLevel(0);
      speedLevelRef.current = 0;
      return undefined;
    }

    setSpeedLevel(0);
    speedLevelRef.current = 0;

    let previousLane: WolfPose | null = null;
    let movementTimer: number;
    let spawnTimer: number;
    const brokenEggTimers: number[] = [];
    let activeTime = 0;
    let previousTimestamp = window.performance.now();
    const spawnEgg = () => {
      if (isPausedRef.current) {
        return;
      }

      const lane = selectNextLane(gameMode, previousLane, Math.random());

      previousLane = lane;
      nextId.current += 1;
      eggsRef.current = [...eggsRef.current, { id: nextId.current, lane, step: 0 }];
      setEggs(eggsRef.current);
    };

    spawnEgg();

    const spawnNextEgg = () => {
      spawnEgg();
      spawnTimer = window.setTimeout(spawnNextEgg, getGameDelay(timings[gameMode].spawn, speedLevelRef.current));
    };

    const resetSpeed = () => {
      activeTime = 0;
      speedLevelRef.current = 0;
      setSpeedLevel(0);
      window.clearTimeout(spawnTimer);
      spawnTimer = window.setTimeout(spawnNextEgg, timings[gameMode].spawn);
    };

    const moveEggs = () => {
      if (!isPausedRef.current) {
        let caughtEggs = 0;
        let missedEggs = 0;
        const newBrokenEggs: BrokenEggState[] = [];

        eggsRef.current = eggsRef.current.reduce<MovingEggState[]>((nextEggs, egg) => {
          const nextStep = egg.step + 1;

          if (nextStep >= eggPaths[egg.lane].length) {
            if (wolfPoseRef.current === egg.lane) {
              caughtEggs += 1;
            } else {
              missedEggs += 1;
              newBrokenEggs.push({ id: egg.id, lane: egg.lane });
            }

            return nextEggs;
          }

          nextEggs.push({ ...egg, step: nextStep });
          return nextEggs;
        }, []);

        setEggs(eggsRef.current);

        if (newBrokenEggs.length > 0) {
          setBrokenEggs((currentBrokenEggs) => [...currentBrokenEggs, ...newBrokenEggs]);

          newBrokenEggs.forEach((brokenEgg) => {
            const brokenEggTimer = window.setTimeout(() => {
              setBrokenEggs((currentBrokenEggs) =>
                currentBrokenEggs.filter((currentBrokenEgg) => currentBrokenEgg.id !== brokenEgg.id),
              );
            }, brokenEggDuration);

            brokenEggTimers.push(brokenEggTimer);
          });
        }

        if (caughtEggs > 0) {
          onEggCaughtRef.current(caughtEggs);
        }

        if (missedEggs > 0) {
          resetSpeed();
          onEggMissedRef.current(missedEggs);
        }
      }

      movementTimer = window.setTimeout(moveEggs, getGameDelay(timings[gameMode].movement, speedLevelRef.current));
    };

    movementTimer = window.setTimeout(moveEggs, timings[gameMode].movement);
    spawnTimer = window.setTimeout(spawnNextEgg, timings[gameMode].spawn);

    const accelerationTimer = window.setInterval(() => {
      const currentTimestamp = window.performance.now();

      if (!isPausedRef.current && speedLevelRef.current < maxSpeedLevel) {
        activeTime += currentTimestamp - previousTimestamp;

        if (activeTime >= speedUpInterval) {
          activeTime -= speedUpInterval;
          speedLevelRef.current += 1;
          setSpeedLevel(speedLevelRef.current);
        }
      }

      previousTimestamp = currentTimestamp;
    }, 250);

    return () => {
      window.clearTimeout(movementTimer);
      window.clearTimeout(spawnTimer);
      window.clearInterval(accelerationTimer);
      brokenEggTimers.forEach((brokenEggTimer) => window.clearTimeout(brokenEggTimer));
    };
  }, [gameMode, gameSession]);

  return {
    eggs: eggs.map(({ id, lane, step }) => ({ id, ...eggPaths[lane][step] })),
    brokenEggs: brokenEggs.map(({ id, lane }) => ({ id, ...eggPaths[lane][eggPaths[lane].length - 1] })),
    speedLevel,
  };
};
