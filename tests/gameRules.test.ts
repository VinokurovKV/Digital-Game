import { describe, expect, it } from 'vitest';

import {
  addMisses,
  addScore,
  formatScore,
  getAvailableLanes,
  getGameDelay,
  getGameLanes,
  getNextRecord,
  hasGameEnded,
  selectNextLane,
} from '../src/game/gameRules';

describe('game lanes', () => {
  it('uses three lanes in game A', () => {
    expect(getGameLanes('A')).toEqual(['bottomLeft', 'topRight', 'bottomRight']);
  });

  it('does not spawn eggs from the upper-left lane in game A', () => {
    expect(getGameLanes('A')).not.toContain('topLeft');
  });

  it('uses all four lanes in game B', () => {
    expect(getGameLanes('B')).toEqual(['topLeft', 'bottomLeft', 'topRight', 'bottomRight']);
  });

  it('excludes the previously selected lane', () => {
    expect(getAvailableLanes('B', 'topRight')).not.toContain('topRight');
  });

  it('selects the first available lane for the lowest random value', () => {
    expect(selectNextLane('A', null, 0)).toBe('bottomLeft');
  });

  it('selects the last available lane for a high random value', () => {
    expect(selectNextLane('B', null, 0.999)).toBe('bottomRight');
  });
});

describe('game speed', () => {
  it('keeps the base delay at the initial speed', () => {
    expect(getGameDelay(900, 0)).toBe(900);
  });

  it('makes the final speed three times faster', () => {
    expect(getGameDelay(900, 5)).toBe(300);
  });
});

describe('score and misses', () => {
  it('formats the score using four digits', () => {
    expect(formatScore(0)).toBe('0000');
    expect(formatScore(42)).toBe('0042');
    expect(formatScore(9999)).toBe('9999');
  });

  it('adds caught eggs and caps the score at 9999', () => {
    expect(addScore(10, 2)).toBe(12);
    expect(addScore(9998, 2)).toBe(9999);
  });

  it('ends the game on the fifth miss', () => {
    expect(hasGameEnded(addMisses(3, 1))).toBe(false);
    expect(hasGameEnded(addMisses(4, 1))).toBe(true);
    expect(addMisses(5, 2)).toBe(5);
  });

  it('updates the record only when the score is higher', () => {
    expect(getNextRecord(50, 80)).toBe(80);
    expect(getNextRecord(80, 50)).toBe(80);
  });
});
