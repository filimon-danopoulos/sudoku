import { SudokuCell } from './SudokuCell';
import { SudokuSet } from './SudokuSet';

export class Sudoku {
  blocks: SudokuSet[];
  rows: SudokuSet[];
  columns: SudokuSet[];
  cells: SudokuCell[];

  constructor(cells: string) {
    const rawRows = cells.split('').reduce(
      (result, next) => {
        if (result.at(-1)?.length === 9) {
          result.push([]);
        }
        result.at(-1)?.push(+next);
        return result;
      },
      [[]] as number[][]
    );

    this.blocks = [];
    this.rows = [];
    this.columns = [];
    this.cells = [];

    for (let rowIndex = 0; rowIndex < 9; rowIndex++) {
      const cells = rawRows[rowIndex];
      this.rows[rowIndex] = this.rows[rowIndex] || new SudokuSet(rowIndex, 'row');

      for (let columnIndex = 0; columnIndex < 9; columnIndex++) {
        this.columns[columnIndex] = this.columns[columnIndex] || new SudokuSet(columnIndex, 'column');
        // ~~ faster than Math.floor?
        const blockIndex = ~~(rowIndex / 3) * 3 + ~~(columnIndex / 3);

        this.blocks[blockIndex] = this.blocks[blockIndex] || new SudokuSet(blockIndex, 'block');

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

    this.cells.forEach((cell) => cell.calculateCandidates());
  }

  get emptyCells(): SudokuCell[] {
    return this.cells.filter((cell) => !cell.value);
  }
}
