import { SudokuCell } from './SudokuCell';

export class SudokuSet {
  public cells: SudokuCell[];

  constructor(public index: number) {
    this.cells = [];
  }

  public add(cell: SudokuCell) {
    this.cells.push(cell);
  }

  public get missingNumbers(): number[] {
    const result = [] as number[];
    for (let value = 1; value <= 9; value++) {
      if (this.cells.every((cell) => cell.value !== value)) {
        result.push(value);
      }
    }
    return result;
  }
}
