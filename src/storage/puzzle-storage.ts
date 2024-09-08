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
