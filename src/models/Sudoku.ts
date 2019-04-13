import Row from "./Row";
import { DIFFICULTY } from "./Difficulty";
import { DIRECTION, MODE } from "../store/types";

const BASE = [
  [3, 6, 1, 7, 2, 5, 9, 4, 8],
  [5, 8, 7, 9, 6, 4, 2, 1, 3],
  [4, 9, 2, 8, 3, 1, 6, 5, 7],
  [6, 3, 8, 2, 5, 9, 4, 7, 1],
  [1, 7, 4, 6, 8, 3, 5, 9, 2],
  [2, 5, 9, 1, 4, 7, 8, 3, 6],
  [7, 4, 6, 3, 9, 2, 1, 8, 5],
  [9, 2, 3, 5, 1, 8, 7, 6, 4],
  [8, 1, 5, 4, 7, 6, 3, 2, 9]
];

export default class Sudoku {
  private difficulty: DIFFICULTY;
  private data: ([number, boolean][])[];
  private rows: Row[];
  private activeCell: { row: number, column: number };
  private createdAt: number;

  private constructor(previous?: Sudoku) {
    this.difficulty = previous ? previous.difficulty : DIFFICULTY.Easy;
    this.data = previous ? previous.data : [];
    this.rows = previous ? previous.rows : [];
    this.activeCell = previous ? previous.activeCell : { row: -1, column: -1 }
    this.createdAt = previous ? previous.createdAt : 0;
  }

  static create(difficulty: DIFFICULTY): Sudoku {
    const sudoku = new Sudoku();
    sudoku.difficulty = difficulty;
    sudoku.createdAt = Date.now();
    sudoku.data = BASE.map(r => r.map(c => [c, true] as [number, boolean]));
    sudoku.generateSudoku();
    return sudoku
  }

  public getRows(): Row[] {
    return this.rows;
  }

  private generateSudoku() {
    for (let i = 0; i < 42e4; i++) {
      this.moveRowOrColumn();
    }
    this.removeValues();
    this.rows = this.data.map((d, i) => Row.create(d, i + 1))
  }

  private removeValues() {
    let cellsToRemove = this.difficulty as number
    while (cellsToRemove) {
      const x = Math.floor(Math.random() * 9);
      const y = Math.floor(Math.random() * 9);
      const [value, given] = this.data[x][y]
      if (given) {
        this.data[x][y] = [value, false] as [number, boolean];
        --cellsToRemove;
      }
    }
  }

  private moveRowOrColumn() {
    const [from, to] = this.getFromAndTo()
    if (!!Math.round(Math.random())) {
      this.moveColumn(from, to);
    } else {
      this.moveRow(from, to);
    }
  }

  private getFromAndTo(from: number = -1): [number, number] {
    from = from === -1 ? Math.floor(Math.random() * 3) : from;
    let to = Math.floor(Math.random() * 3);
    if (to === from) {
      return this.getFromAndTo(from);
    }
    const block = Math.floor(Math.random() * 3);
    return [block * 3 + from, block * 3 + to];
  }

  private moveRow(from: number, to: number) {
    const temp = this.data[to];
    this.data[to] = this.data[from];
    this.data[from] = temp;
  }

  private moveColumn(from: number, to: number) {
    this.data.forEach(row => {
      const temp = row[to];
      row[to] = row[from];
      row[from] = temp;
    });
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
