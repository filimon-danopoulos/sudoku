import { MODE } from "../store/types";

const NO_NOTES = [false, false, false, false, false, false, false, false, false];

export default class Cell {
  private value: number | null;
  private valid: boolean;
  private solution: number;
  private row: number;
  private column: number;
  private given: boolean;
  private active: boolean;
  private notes: boolean[];
  private guess: boolean;

  private constructor(previous?: Cell) {
    this.value = previous ? previous.value : null;
    this.solution = previous ? previous.solution : -1;
    this.row = previous ? previous.row : -1;
    this.column = previous ? previous.column : -1;
    this.given = previous ? previous.given : false;
    this.active = previous ? previous.active : false;
    this.valid = previous ? previous.valid : true;
    this.notes = previous ? previous.notes : [...NO_NOTES];
    this.guess = previous ? previous.guess : false;
  }

  static create(solution: number, row: number, column: number, given: boolean): Cell {
    const cell = new Cell();
    cell.solution = solution;
    cell.row = row;
    cell.column = column;
    cell.given = given;
    cell.value = given ? solution : null;
    return cell;
  }

  public getSolution(): number {
    return this.solution;
  }

  public getValue(): number | null {
    return this.value;
  }

  public getRow(): number {
    return this.row;
  }

  public getColumn(): number {
    return this.column;
  }

  public isActive(): boolean {
    return this.active;
  }

  public getBlock(): number {
    if (this.row <= 3) {
      return this.calculateBlock(0);
    } else if (this.row >= 4 && this.row <= 6) {
      return this.calculateBlock(1);
    } else {
      return this.calculateBlock(2);
    }
  }

  private calculateBlock(modifier: number): number {
    if (this.column <= 3) {
      return modifier + 1;
    } else if (this.column >= 4 && this.column <= 6) {
      return modifier + 2;
    } else {
      return modifier + 3;
    }
  }

  public isGiven(): boolean {
    return this.given;
  }

  public validate(): Cell {
    const cell = new Cell(this)
    cell.valid = this.value === null || this.value === this.solution;
    if (!cell.valid) {
      cell.active = false;
    }
    return cell;
  }

  public isValid(): boolean {
    return this.valid;
  }

  public setActive(active: boolean): Cell {
    const cell = new Cell(this);
    cell.active = active;
    return cell;
  }

  public setDigit(digit: number, mode: MODE): Cell {
    if (!this.active || this.given) {
      return this;
    }
    const cell = new Cell(this);
    if (mode === MODE.Note) {
      cell.notes = this.notes.map((x, i) => i === (digit - 1) ? !x : x)
      cell.value = null
    } else {
      if (cell.guess) {
        cell.value = digit;
      } else {
        cell.value = this.value === digit ? null : digit;
      }
    }
    cell.guess = mode === MODE.Guess;
    cell.valid = true;
    return cell;
  }

  public removeDigit(): Cell {
    if (!this.active || this.given) {
      return this;
    }
    const cell = new Cell(this);
    cell.notes = [...NO_NOTES];
    cell.value = null;
    cell.valid = true;
    return cell;
  }

  public isSolved(): boolean {
    return this.value === this.solution;
  }

  public getNotes(): boolean[] {
    return this.notes;
  }

  public isGuess(): boolean {
    return this.guess;
  }

  public clearNotes(): Cell {
    const cell = new Cell(this);
    cell.notes = cell.notes.map(n => false);
    return cell;
  }
}
