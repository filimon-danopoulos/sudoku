import { Rating } from '../Rating';
import { Sudoku } from '../../model/Sudoku';
import { IStrategy } from './IStrategy';
import { SudokuCell } from '../../model/SudokuCell';

/**
 * A simple strategy that does not require notes.
 *
 * The strategy looks at each set and checks if only a single number is missing from that set.
 * If only a single number is missing in a set it follows that it has to be the solution for the empty cell.
 */
export class SimpleSingles implements IStrategy {
  public get rating() {
    return Rating.VeryEasy;
  }
  run(sudoku: Sudoku): boolean {
    const sets = [...sudoku.blocks, ...sudoku.rows, ...sudoku.columns];
    let initial = true;
    let changed = false;
    let result = changed;
    while (initial || changed) {
      if (initial) {
        initial = false;
      }
      changed = false;
      for (let i = 0; i < sets.length; i++) {
        const set = sets[i];
        const missing = set.missingNumbers;
        if (missing.length === 1) {
          const cell = set.cells.find((cell) => !cell.value) as SudokuCell;
          cell.value = missing[0];
          changed = result = true;
        }
      }
    }
    return result;
  }
}
