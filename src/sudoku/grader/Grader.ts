import { Sudoku } from '../model/Sudoku';
import { SimpleSingles } from './strategies/SimpleSingles';
import { Rating as RATING } from './Rating';
import { Slotting } from './strategies/Slotting';
import { NakedSingles } from './strategies/NakedSingles';
import { HiddenSingles } from './strategies/HiddenSingles';
import { PointingCandidates } from './strategies/PointingCandidates';
import { NakedTuples } from './strategies/NakedTuples';

type strategy = SimpleSingles;

export class SudokuRater {
  public rate(sudoku: Sudoku, solution: (number | ' ')[][]): RATING {
    return this.solve(
      sudoku,
      [
        new SimpleSingles(),
        new Slotting(),
        new NakedSingles(),
        new HiddenSingles(),
        new PointingCandidates(),
        new NakedTuples(2),
        new NakedTuples(3),
        new NakedTuples(4),
      ],
      solution
    );
  }

  private solve(
    sudoku: Sudoku,
    strategies: strategy[],
    solution: (number | ' ')[][]
  ) {
    let rating = RATING.Unrated;

    let changed = false;
    do {
      for (
        let strategyIndex = 0;
        strategyIndex < strategies.length;
        strategyIndex++
      ) {
        const strategy = strategies[strategyIndex];
        const dirty = strategy.run(sudoku);

        changed = dirty;
        if (dirty) {
          if (rating < strategy.rating) {
            // console.log('Changing rating', rating, strategy.rating);
            rating = strategy.rating;
          }
          break;
        }
        // console.log('----------------------------');
      }
      if (sudoku.cells.every((cell) => !!cell.value)) {
        break;
      }
    } while (changed);
    console.log(sudoku);
    sudoku.rows.forEach((row) =>
      solution.push(row.cells.map((cell) => (cell.value ? cell.value : ' ')))
    );
    if (sudoku.cells.every((cell) => !!cell.value)) {
      return rating;
    }
    return RATING.VeryHard;
  }
}
