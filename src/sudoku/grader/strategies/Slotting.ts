import { Rating } from '../Rating';
import { Sudoku } from '../../model/Sudoku';
import { IStrategy } from './IStrategy';

/**
 * A simple strategy that does not require notes.
 * The strategy looks at blocks the values in the lines that affect that block.
 *
 * A value is considered to be slotted into an empty cell when no other empty cell
 * in the block can take the value since one of the affecting lines contains that value.
 */
export class Slotting implements IStrategy {
  get name() {
    return 'slotting';
  }

  description = '';

  get rating() {
    return Rating.Easy;
  }

  run(sudoku: Sudoku): boolean {
    for (let blockIndex = 0; blockIndex < sudoku.blocks.length; blockIndex++) {
      const block = sudoku.blocks[blockIndex];
      if (block.cells.every((cell) => !!cell.value)) {
        continue;
      }
      const emptyCellsInBlock = block.cells.filter((cell) => !cell.value);

      for (let emptyIndex = 0; emptyIndex < emptyCellsInBlock.length; emptyIndex++) {
        const emptyCell = emptyCellsInBlock[emptyIndex];
        const missingNumbers = block.missingNumbers;
        for (let missingIndex = 0; missingIndex < missingNumbers.length; missingIndex++) {
          const missingNumber = missingNumbers[missingIndex];
          const otherEmptyCellsInBLock = emptyCellsInBlock.filter((c) => c !== emptyCell);

          /**
           * This calculates that every other empty cell in the block can't have the missing value.
           * It does this by veryfying that the other cell is part of either a column
           * or row that already has the missing value in it, and thus could not have the missing value.
           *
           * Since no other cell can have the value it has to be the solution for this empty cell.
           */
          const isMissingNumberSlotted = otherEmptyCellsInBLock.every((c) =>
            [...c.row.cells, ...c.column.cells].some((c) => c.value === missingNumber)
          );

          if (isMissingNumberSlotted) {
            emptyCell.value = missingNumber;
            return true;
          }
        }
      }
    }
    return false;
  }
}
