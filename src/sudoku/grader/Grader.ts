import { Sudoku } from '../model/Sudoku';
import { LastCell } from './strategies/LastCell';
import { Rating as RATING } from './Rating';
import { Slotting } from './strategies/Slotting';
import { NakedSingles } from './strategies/NakedSingles';
import { HiddenSingles } from './strategies/HiddenSingles';
import { PointingCandidates } from './strategies/PointingCandidates';
import { NakedTuples } from './strategies/NakedTuples';
import { BoxLineReduction } from './strategies/BoxLineReduction';
import { HiddenTuples } from './strategies/HiddenTuples';

type strategy = LastCell;

export class Grader {
  grade(sudoku: Sudoku) {
    return this.#solve(sudoku, [
      new LastCell(),
      new Slotting(),
      new NakedSingles(),
      new HiddenSingles(),
      new NakedTuples(2),
      new NakedTuples(3),
      new PointingCandidates(),
      new HiddenTuples(2),
      new HiddenTuples(3),
      new BoxLineReduction(), // Breaks on 024001007600000490805000000000000380006029000000060050000700200030108004000900010
      new NakedTuples(4),
      new HiddenTuples(4),
    ]);
  }

  #getSnapshot(sudoku: Sudoku) {
    return sudoku.cells.map((cell) => ({
      value: cell.value ? cell.value.toString() : '',
      candidates: cell.candidates.map((x) => x.toString()),
    }));
  }

  #solve(sudoku: Sudoku, strategies: strategy[]) {
    let highestRating = RATING.Unrated;
    let strategyIndex = 0;
    const steps = [
      {
        description: 'Initial',
        snapshot: this.#getSnapshot(sudoku),
      },
    ] as { description: string; snapshot: { value: string; candidates: string[] }[] }[];
    while (true) {
      const strategy = strategies[strategyIndex];
      const { changed, description } = strategy.run(sudoku);
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
        steps.push({
          description: description ?? '',
          snapshot: this.#getSnapshot(sudoku),
        });
        highestRating = Math.max(highestRating, strategy.rating);
        // Make sure we always try the easiest solution first.
        strategyIndex = 0;
      } else {
        strategyIndex++;
        if (strategyIndex >= strategies.length) {
          break;
        }
      }
      if (sudoku.emptyCells.length === 0) {
        steps.push({
          description: description ?? '',
          snapshot: this.#getSnapshot(sudoku),
        });
        break;
      }
    }

    const isSolved = sudoku.emptyCells.length === 0;
    if (isSolved) {
      return {
        grade: highestRating,
        steps,
      };
    }
    return {
      grade: RATING.Extreme,
      steps,
    };
  }
}
