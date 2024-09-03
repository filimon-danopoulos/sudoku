export const loadUnsolvedPuzzle = (): { puzzle: string; solution: string } | null => {
  const unsolved = JSON.parse(localStorage.getItem('ungraded-registry') ?? '[]') as string[];
  const data = unsolved.pop();
  if (data) {
    localStorage.setItem('ungraded-registry', JSON.stringify(unsolved));
    const [puzzle, solution] = data.split('|');
    return {
      puzzle,
      solution,
    };
  }
  return null;
};

export const saveUnsolvedPuzzle = (puzzle: string, solution: string) => {
  const unsolved = JSON.parse(localStorage.getItem('ungraded-registry') ?? '[]') as string[];
  unsolved.push(`${puzzle}|${solution}`);
  localStorage.setItem('ungraded-registry', JSON.stringify(unsolved));
};

export const countUnsolvedPuzzles = (): number => {
  const unsolved = JSON.parse(localStorage.getItem('ungraded-registry') ?? '[]') as string[];
  return unsolved.length;
};
