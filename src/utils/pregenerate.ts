import { DIFFICULTY } from '../models/Difficulty';
import Generator from '../models/Generator';

export default function pregenerate(count: number): string {
  const puzzles: { [key: string]: [number, boolean][][][] } = {
    [DIFFICULTY[DIFFICULTY.VeryEasy]]: [],
    [DIFFICULTY[DIFFICULTY.Easy]]: [],
    [DIFFICULTY[DIFFICULTY.Normal]]: [],
    [DIFFICULTY[DIFFICULTY.Hard]]: [],
    [DIFFICULTY[DIFFICULTY.VeryHard]]: []
  };

  [
    DIFFICULTY.VeryEasy,
    DIFFICULTY.Easy,
    DIFFICULTY.Normal,
    DIFFICULTY.Hard,
    DIFFICULTY.VeryHard
  ].forEach(d => {
    while (puzzles[DIFFICULTY[d]].length < count) {
      const g = new Generator(d);
      if (g.generate()) {
        puzzles[DIFFICULTY[d]].push(g.getPuzzleData());
      }
    }
  });

  // Paste the result into puzzles.json to set the default puzzles
  return JSON.stringify(puzzles);
}
