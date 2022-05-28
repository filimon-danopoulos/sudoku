import { RatedSudoku, Rating } from '../RatedSudoku';
import { IStrategy } from './IStrategy';

export class SimpleSingles implements IStrategy {
  public get rating() {
    return Rating.VeryEasy;
  }
  run(sudoku: RatedSudoku): boolean {
    // console.log('Simple Singles');
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
          const cell = set.cells.find(cell => !cell.value)!;
          // console.log('Setting cell: ', { cell, value: missing[0] });
          cell.value = missing[0];
          changed = result = true;
        }
      }
    }
    return result;
  }
}
