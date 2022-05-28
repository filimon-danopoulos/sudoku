import { RatedSudoku, Rating } from '../RatedSudoku';
import { IStrategy } from './IStrategy';

export class Slotting implements IStrategy {
  public get rating() {
    return Rating.Easy;
  }
  run(sudoku: RatedSudoku): boolean {
    // console.log('Slotted Values');
    let initial = true;
    let changed = false;
    let result = changed;
    while (initial || changed) {
      if (initial) {
        initial = false;
      }
      changed = false;
      for (let blockIndex = 0; blockIndex < sudoku.blocks.length; blockIndex++) {
        const block = sudoku.blocks[blockIndex];
        if (block.cells.every(cell => !!cell.value)) {
          continue;
        }
        // console.log('Processing block', block);
        const emptyCells = block.cells.filter(cell => !cell.value);

        for (let emptyIndex = 0; emptyIndex < emptyCells.length; emptyIndex++) {
          const empty = emptyCells[emptyIndex];
          const missingNumbers = block.missingNumbers;
          for (let missingIndex = 0; missingIndex < missingNumbers.length; missingIndex++) {
            const missing = missingNumbers[missingIndex];
            const otherCells = emptyCells.filter(c => c !== empty);
            const slotted = otherCells.every(other =>
              [...other.row.cells, ...other.column.cells].some(c => c.value === missing)
            );
            if (slotted) {
              // console.log('Setting', {
              //   cell: empty,
              //   value: missing,
              // });
              empty.value = missing;
              changed = result = true;
            }
          }
        }
      }
    }
    return result;
  }
}
