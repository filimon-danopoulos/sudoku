import { puzzleCell } from '../app/types';

export type difficulty = 'easy' | 'moderate' | 'hard' | 'extreme';
export const loadPuzzles = (): Record<difficulty, string[]> => {
  return (
    JSON.parse(localStorage.getItem('puzzles') ?? 'null') ??
    ({
      easy: [],
      moderate: [],
      hard: [],
      extreme: [],
    } as Record<difficulty, string[]>)
  );
};

export const savePuzzles = (puzzles: Record<difficulty, string[]>) => {
  localStorage.setItem('puzzles', JSON.stringify(puzzles));
};

export const saveCurrentPuzzle = (puzzle: string, cells: puzzleCell[], difficulty: difficulty) => {
  localStorage.setItem(
    'current',
    JSON.stringify({
      puzzle,
      cells,
      difficulty,
    })
  );
};

export const loadCurrentPuzzle = (): {
  puzzle: string;
  cells: puzzleCell[];
  difficulty: difficulty;
} => {
  return JSON.parse(localStorage.getItem('current') ?? '{}');
};
