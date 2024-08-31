import { Sudoku } from '../model/Sudoku';
import { LastCell } from './strategies/LastCell';
import { Rating as RATING } from './Rating';
import { Slotting } from './strategies/Slotting';
import { NakedSingles } from './strategies/NakedSingles';
import { HiddenSingles } from './strategies/HiddenSingles';
import { PointingCandidates } from './strategies/PointingCandidates';
import { NakedTuples } from './strategies/NakedTuples';
// import { BoxLineReduction } from './strategies/BoxLineReduction';
import { HiddenTuples } from './strategies/HiddenTuples';

type strategy = LastCell;

export class Grader {
  grade(sudoku: Sudoku) {
    return this.#solve(sudoku, [
      new LastCell(),
      new Slotting(),
      new NakedSingles(),
      new HiddenSingles(),
      new PointingCandidates(),
      // new BoxLineReduction(),
      new NakedTuples(2),
      new NakedTuples(3),
      new NakedTuples(4),

      new HiddenTuples(2),
      new HiddenTuples(3),
      new HiddenTuples(4),
    ]);
  }

  #solve(sudoku: Sudoku, strategies: strategy[]) {
    let highestRating = RATING.Unrated;
    let strategyIndex = 0;
    const steps = [] as Sudoku[];
    while (true) {
      const strategy = strategies[strategyIndex];
      if (!strategy) {
        break;
      }
      const previousState = structuredClone(sudoku);
      const changed = strategy.run(sudoku);
      // const sets = [...sudoku.blocks, ...sudoku.rows, ...sudoku.columns];
      // if (
      //   sets.some((set) => {
      //     const solved = set.cells.filter((cell) => cell.value);
      //     if (solved.length === 9) {
      //       const unique = new Set(solved.map((cell) => cell.value));
      //       if (unique.size !== 9) {
      //         return true;
      //       }
      //     }
      //     return false;
      //   })
      // ) {
      //   throw new Error('fucky');
      // }
      if (changed) {
        steps.push(previousState);
        highestRating = Math.max(highestRating, strategy.rating);
        // Make sure we always try the easiest solution first.
        strategyIndex = 0;
      } else {
        strategyIndex++;
      }
      if (sudoku.emptyCells.length === 0) {
        break;
      }
    }

    const isSolved = sudoku.emptyCells.length === 0;
    if (isSolved) {
      return {
        rating: highestRating,
        steps,
      };
    }
    return {
      rating: RATING.VeryHard,
      steps,
    };
  }
}
