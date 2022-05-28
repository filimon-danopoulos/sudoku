import { RatedSudoku, Rating } from '../RatedSudoku';
import { IStrategy } from './IStrategy';

export class NakedSingles implements IStrategy {
  public get rating() {
    return Rating.Normal;
  }
  run(sudoku: RatedSudoku): boolean {
    // console.log('Singles');

    let initial = true;
    let changed = false;
    let result = changed;
    while (initial || changed) {
      if (initial) {
        initial = false;
      }
      changed = false;
      for (let cellIndex = 0; cellIndex < sudoku.cells.length; cellIndex++) {
        const cell = sudoku.cells[cellIndex];
        if (cell.candidates.length === 1) {
          cell.value = cell.candidates[0];
          changed = result = true;
        }
      }
    }
    return result;
  }
}
