export const loadUngradedPuzzle = (): { puzzle: string } | null => {
  const ungraded = JSON.parse(localStorage.getItem('ungraded-registry') ?? '[]') as string[];
  const puzzle = ungraded.pop();
  if (puzzle) {
    localStorage.setItem('ungraded-registry', JSON.stringify(ungraded));
    return {
      puzzle,
    };
  }
  return null;
};

export const saveUngradedPuzzle = (puzzle: string) => {
  const ungraded = JSON.parse(localStorage.getItem('ungraded-registry') ?? '[]') as string[];
  ungraded.push(`${puzzle}`);
  localStorage.setItem('ungraded-registry', JSON.stringify(ungraded));
};

export const countUnsolvedPuzzles = (): number => {
  const unsolved = JSON.parse(localStorage.getItem('ungraded-registry') ?? '[]') as string[];
  return unsolved.length;
};

export const loadGradedPuzzle = (difficulty: 'easy' | 'moderate' | 'hard' | 'extreme'): { puzzle: string } | null => {
  const graded = JSON.parse(localStorage.getItem('graded-registry') ?? '[]') as Record<
    'easy' | 'moderate' | 'hard' | 'extreme',
    string[]
  >;
  const puzzle = graded[difficulty].pop();
  if (puzzle) {
    localStorage.setItem('graded-registry', JSON.stringify(graded));
    return {
      puzzle,
    };
  }
  return null;
};

export const saveGradedPuzzle = (difficulty: 'easy' | 'moderate' | 'hard' | 'extreme', puzzle: string) => {
  const graded = JSON.parse(localStorage.getItem('graded-registry') ?? '[]') as Record<
    'easy' | 'moderate' | 'hard' | 'extreme',
    string[]
  >;
  graded[difficulty].push(`${puzzle}`);
  localStorage.setItem('ungraded-registry', JSON.stringify(graded));
};
