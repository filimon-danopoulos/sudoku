import Row from "./Row";
import { DIRECTION, MODE } from "../store/types";

export default class Sudoku {
  private rows: Row[];
  private activeCell: { row: number, column: number };
  private createdAt: number;

  private constructor(previous?: Sudoku) {
    this.rows = previous ? previous.rows : [];
    this.activeCell = previous ? previous.activeCell : { row: -1, column: -1 }
    this.createdAt = previous ? previous.createdAt : 0;
  }

  static create(data: ([number, boolean])[][]): Sudoku {
    const sudoku = new Sudoku();
    sudoku.createdAt = Date.now();
    sudoku.rows = data.map((d, i) => Row.create(d, i + 1));
    return sudoku
  }

  public getRows(): Row[] {
    return this.rows;
  }

  public validate(): Sudoku {
    const sudoku = new Sudoku(this)
    sudoku.rows = this.rows.map(r => r.validate());
    return sudoku;
  }

  public activateCell(row: number, column: number): Sudoku {
    const sudoku = new Sudoku(this)
    sudoku.activeCell = { row, column };
    sudoku.rows = this.rows.map(r => r.toggleCell(row, column));
    return sudoku;
  }

  public setDigit(digit: number, mode: MODE): Sudoku {
    const sudoku = new Sudoku(this);
    sudoku.rows = this.rows.map(r => r.setDigit(digit, mode));
    return sudoku;
  }

  public removeDigit(): Sudoku {
    const sudoku = new Sudoku(this);
    sudoku.rows = this.rows.map(r => r.removeDigit());
    return sudoku;
  }

  public getSolvedNumbers(): number[] {
    const allNumbers = this.rows.reduce((acc: number[], next: Row) =>
      acc.concat(next.getCells().map(c => c.getValue() || 0), []),
      []
    );
    const solved = []
    for (let i = 1; i <= 9; i++) {
      if (allNumbers.filter(n => n === i).length === 9) {
        solved.push(i);
      }
    }
    return solved;
  }

  public navigate(dirrection: DIRECTION): Sudoku {
    const increment = (val: number) => val === 9 ? 1 : val + 1;
    const decrement = (val: number) => val === 1 ? 9 : val - 1;

    switch (dirrection) {
      case DIRECTION.Up:
        this.activeCell.row = decrement(this.activeCell.row);
        break;
      case DIRECTION.Down:
        this.activeCell.row = increment(this.activeCell.row);
        break;
      case DIRECTION.Right:
        this.activeCell.column = increment(this.activeCell.column);
        break;
      case DIRECTION.Left:
        this.activeCell.column = decrement(this.activeCell.column);
        break;
    }
    return this.activateCell(this.activeCell.row, this.activeCell.column);
  }

  public isSolved(): boolean {
    return this.rows.every(r => r.getCells().every(c => c.isSolved()))
  }

  public getCreationTimestamp(): number {
    return this.createdAt;
  }

  public isDigitSolved(digit: number): boolean {
    return this.rows.every(r => r.getCells().some(c => c.getValue() === digit && c.isSolved()));
  }
}
