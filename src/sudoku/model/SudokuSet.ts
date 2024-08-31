import { SudokuCell } from './SudokuCell';

export class SudokuSet {
  cells: SudokuCell[];
  index: number;

  constructor(index: number) {
    this.cells = [];
    this.index = index;
  }

  add(cell: SudokuCell) {
    this.cells.push(cell);
  }

  get missingNumbers(): number[] {
    const result = [] as number[];
    for (let value = 1; value <= 9; value++) {
      if (this.cells.every((cell) => cell.value !== value)) {
        result.push(value);
      }
    }
    return result;
  }
}
