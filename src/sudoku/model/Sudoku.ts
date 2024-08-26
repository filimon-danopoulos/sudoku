import { SudokuCell } from './SudokuCell';
import { SudokuSet } from './SudokuSet';

export class Sudoku {
  public blocks: SudokuSet[];
  public rows: SudokuSet[];
  public columns: SudokuSet[];
  public cells: SudokuCell[];

  constructor(rows: number[][]) {
    this.blocks = [];
    this.rows = [];
    this.columns = [];
    this.cells = [];

    for (let rowIndex = 0; rowIndex < 9; rowIndex++) {
      const cells = rows[rowIndex];
      this.rows[rowIndex] = this.rows[rowIndex] || new SudokuSet(rowIndex);

      for (let columnIndex = 0; columnIndex < 9; columnIndex++) {
        this.columns[columnIndex] =
          this.columns[columnIndex] || new SudokuSet(columnIndex);
        // ~~ faster than Math.floor?
        const blockIndex = ~~(rowIndex / 3) * 3 + ~~(columnIndex / 3);

        this.blocks[blockIndex] =
          this.blocks[blockIndex] || new SudokuSet(blockIndex);

        const ratedCell = new SudokuCell(
          this.blocks[blockIndex],
          this.rows[rowIndex],
          this.columns[columnIndex],
          cells[columnIndex]
        );
        this.cells.push(ratedCell);
        this.blocks[blockIndex].add(ratedCell);
        this.rows[rowIndex].add(ratedCell);
        this.columns[columnIndex].add(ratedCell);
      }
    }
  }

  public get emptyCells(): SudokuCell[] {
    return this.cells.filter((cell) => !cell.value);
  }
}
