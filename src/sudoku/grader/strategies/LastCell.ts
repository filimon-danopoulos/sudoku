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
export class LastCell implements IStrategy {
  get rating() {
    return Rating.Easy;
  }

  run(sudoku: Sudoku) {
    const sets = [...sudoku.blocks, ...sudoku.rows, ...sudoku.columns];
    for (let i = 0; i < sets.length; i++) {
      const set = sets[i];
      const missingNumber = set.missingNumbers;
      if (missingNumber.length === 1) {
        const cell = set.cells.find((cell) => !cell.value) as SudokuCell;
        cell.value = missingNumber[0];
        return {
          changed: true,
          description: `<last cell> The cell at row ${cell.row.index + 1} and column ${cell.column.index + 1} is the last empty cell of ${set.type} ${set.index + 1} and has to be the missing number ${missingNumber}.`,
        };
      }
    }
    return { changed: false };
  }
}
