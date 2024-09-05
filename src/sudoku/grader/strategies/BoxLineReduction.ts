import { Rating } from '../Rating';
import { Sudoku } from '../../model/Sudoku';
import { SudokuSet } from '../../model/SudokuSet';
import { IStrategy } from './IStrategy';

/**
 * This strategy requires notes as it eliminates candidates
 * from boxes based on the position of missing numbers in lines that block.
 *
 * If all the missing numbers of a line are in the same block then no other cells in that block
 * can have those missings numbers as candidates.
 * We could thus remove the missing number from then candidates of that box that are not in the same line.
 */
export class BoxLineReduction implements IStrategy {
  get rating() {
    return Rating.Moderate;
  }

  run(sudoku: Sudoku) {
    const lines = [...sudoku.rows, ...sudoku.columns];
    for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
      const line = lines[lineIndex];
      const missingNumbers = line.missingNumbers;
      for (let missingIndex = 0; missingIndex < missingNumbers.length; missingIndex++) {
        const missingNumber = missingNumbers[missingIndex];

        const blocks = line.cells.reduce((result, cell) => {
          if (cell.candidates.includes(missingNumber)) {
            result.add(cell.block);
          }
          return result;
        }, new Set<SudokuSet>());

        if (blocks.size === 1) {
          const block = Array.from(blocks)[0];
          const cellsToUpdateInBlock = block.cells.filter(
            (cell) => cell.candidates.includes(missingNumber) && !line.cells.includes(cell)
          );
          let dirty = false;
          for (let cellIndex = 0; cellIndex < cellsToUpdateInBlock.length; cellIndex++) {
            const cell = cellsToUpdateInBlock[cellIndex];
            const candidateIndex = cell.candidates.indexOf(missingNumber);
            if (candidateIndex !== -1) {
              cell.candidates.splice(candidateIndex, 1);
              dirty = true;
            }
          }
          if (dirty) {
            return { changed: true, description: 'box/line reduction' };
          }
        }
      }
    }
    return { changed: false };
  }
}
