import Sudoku from '../../models/Sudoku';
import { SimpleSingles } from './strategies/SimpleSingles';
import { RatedSudoku, Rating as RATING } from './RatedSudoku';
import { Slotting } from './strategies/Slotting';
import { NakedSingles } from './strategies/NakedSingles';
import { HiddenSingles } from './strategies/HiddenSingles';
import { LockedCandidates } from './strategies/LockedCandidates';
import { NakedDoubles } from './strategies/NakedDoubles';

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
        new LockedCandidates(),
        new NakedSingles(),
        new NakedDoubles(),
        // new NakedTripples(),
        // new NakedQuads(),
      ],
      solution
    );
  }

  private solve(sudoku: Sudoku, strategies: strategy[], solution: (number | ' ')[][]) {
    let rating = RATING.Unrated;
    const ratedSudoku = new RatedSudoku(sudoku);

    let changed = false;
    do {
      for (let strategyIndex = 0; strategyIndex < strategies.length; strategyIndex++) {
        const strategy = strategies[strategyIndex];
        const dirty = strategy.run(ratedSudoku);

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
      if (ratedSudoku.cells.every(cell => !!cell.value)) {
        break;
      }
    } while (changed);
    console.log(ratedSudoku);
    ratedSudoku.rows.forEach(row =>
      solution.push(row.cells.map(cell => (cell.value ? cell.value : ' ')))
    );
    if (ratedSudoku.cells.every(cell => !!cell.value)) {
      return rating;
    }
    return RATING.VeryHard;
  }
}
