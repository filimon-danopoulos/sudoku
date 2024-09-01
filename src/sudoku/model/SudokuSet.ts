import { SudokuCell } from './SudokuCell';

type typeOptions = 'row' | 'column' | 'block';

export class SudokuSet {
  cells: SudokuCell[];
  index: number;
  type: typeOptions;

  constructor(index: number, type: typeOptions) {
    this.cells = [];
    this.index = index;
    this.type = type;
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
