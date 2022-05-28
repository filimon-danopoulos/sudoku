import Sudoku from '../../models/Sudoku';

export enum Rating {
  Unrated = 0,
  VeryEasy = 1,
  Easy = 2,
  Normal = 3,
  Hard = 4,
  VeryHard = 5,
}

export class RatedSudoku {
  public blocks: RatedSet[];
  public rows: RatedSet[];
  public columns: RatedSet[];
  public cells: RatedCell[];

  constructor(sudoku: Sudoku) {
    this.blocks = [];
    this.rows = [];
    this.columns = [];
    this.cells = [];

    const rows = sudoku.getRows();
    for (let rowIndex = 0; rowIndex < 9; rowIndex++) {
      const cells = rows[rowIndex].getCells();
      this.rows[rowIndex] = this.rows[rowIndex] || new RatedSet(rowIndex);

      for (let columnIndex = 0; columnIndex < 9; columnIndex++) {
        this.columns[columnIndex] = this.columns[columnIndex] || new RatedSet(columnIndex);
        // ~~ faster than Math.floor?
        const blockIndex = ~~(rowIndex / 3) * 3 + ~~(columnIndex / 3);

        this.blocks[blockIndex] = this.blocks[blockIndex] || new RatedSet(blockIndex);

        const ratedCell = new RatedCell(
          this.blocks[blockIndex],
          this.rows[rowIndex],
          this.columns[columnIndex],
          cells[columnIndex].getValue()
        );
        this.cells.push(ratedCell);
        this.blocks[blockIndex].add(ratedCell);
        this.rows[rowIndex].add(ratedCell);
        this.columns[columnIndex].add(ratedCell);
      }
    }
  }

  public get emptyCells(): RatedCell[] {
    return this.cells.filter(cell => !cell.value);
  }
}

export class RatedSet {
  public cells: RatedCell[];

  constructor(public index: number) {
    this.cells = [];
  }

  public add(cell: RatedCell) {
    this.cells.push(cell);
  }

  public get missingNumbers(): number[] {
    const result = [] as number[];
    for (let value = 1; value <= 9; value++) {
      if (this.cells.every(cell => cell.value !== value)) {
        result.push(value);
      }
    }
    return result;
  }
}

export class RatedCell {
  public candidates: number[] = [];
  private _value: number | null = null;
  public get value(): number | null {
    return this._value;
  }
  public set value(val: number | null) {
    if (val !== null) {
      Array.from(new Set([...this.block.cells, ...this.row.cells, ...this.column.cells]))
        .filter(cell => !cell.value && cell !== this)
        .forEach(cell => {
          const candidateIndex = cell.candidates.indexOf(val);
          if (candidateIndex !== -1) {
            cell.candidates.splice(candidateIndex, 1);
          }
        });
      this.candidates = [];
    }
    this._value = val;
  }
  public block: RatedSet;
  public row: RatedSet;
  public column: RatedSet;

  constructor(block: RatedSet, row: RatedSet, column: RatedSet, value: number | null = null) {
    this.block = block;
    this.row = row;
    this.column = column;
    this.candidates = this.calculateCandidates(value);
    this.value = value;
  }

  private calculateCandidates(value: number | null) {
    if (value !== null) {
      return [];
    }
    const result = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    const influencers = Array.from(
      new Set(
        [...this.block.cells, ...this.row.cells, ...this.column.cells].filter(
          cell => cell !== this && !!cell.value
        ) as RatedCell[]
      )
    );
    influencers.forEach(cell => result.delete(cell.value!));
    return Array.from(result);
  }
}
