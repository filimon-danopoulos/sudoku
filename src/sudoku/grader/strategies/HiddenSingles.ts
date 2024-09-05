import { Rating } from '../Rating';
import { Sudoku } from '../../model/Sudoku';
import { IStrategy } from './IStrategy';

export class HiddenSingles implements IStrategy {
  get rating() {
    return Rating.Moderate;
  }

  run(sudoku: Sudoku) {
    const sets = [...sudoku.blocks, ...sudoku.rows, ...sudoku.columns];
    for (let setIndex = 0; setIndex < sets.length; setIndex++) {
      const set = sets[setIndex];
      const missingNumbers = set.missingNumbers;
      for (let missingNumberIndex = 0; missingNumberIndex < missingNumbers.length; missingNumberIndex++) {
        const missingNumber = missingNumbers[missingNumberIndex];
        const possibleCells = set.cells.filter((cell) => cell.candidates.includes(missingNumber));
        if (possibleCells.length === 1) {
          possibleCells[0].value = missingNumber;
          return { changed: true, description: 'hidden singles' };
        }
      }
    }
    return { changed: false };
  }
}
