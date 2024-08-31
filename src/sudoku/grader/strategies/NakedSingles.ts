import { Rating } from '../Rating';
import { Sudoku } from '../../model/Sudoku';
import { IStrategy } from './IStrategy';

export class NakedSingles implements IStrategy {
  get name() {
    return `naked singles`;
  }

  description = '';

  get rating() {
    return Rating.Easy;
  }

  run(sudoku: Sudoku): boolean {
    for (let cellIndex = 0; cellIndex < sudoku.cells.length; cellIndex++) {
      const cell = sudoku.cells[cellIndex];
      if (cell.candidates.length === 1) {
        cell.value = cell.candidates[0];
        return true;
      }
    }
    return false;
  }
}
