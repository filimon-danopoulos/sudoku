import Cell from "./Cell";
import { DIRECTION } from "../store/types";

export default class Row {
  private cells: Cell[];
  private index: number;
  private active: boolean;

  private constructor(previous?: Row) {
    this.index = previous ? previous.index : -1;
    this.active = previous ? previous.active : false;
    this.cells = previous ? previous.cells : [];
  }

  static create(data: [number, boolean][], index: number): Row {
    const row = new Row();
    row.cells = [...data.map(([value, given], i) => Cell.create(value, index, i + 1, given))];
    row.index = index;
    return row;
  }

  public getCells(): Cell[] {
    return this.cells;
  }

  public validate(): Row {
    const row = new Row(this);
    row.cells = this.cells.map(c => c.validate());
    return row;
  }

  public getIndex(): number {
    return this.index;
  }

  public toggleCell(index: number, column: number): Row {
    if (this.index !== index && !this.active) {
      return this;
    }
    const row = new Row(this);

    if (this.active) {
      if (this.index === index) {
        row.cells = this.cells.map(c => {
          return c.setActive(c.isActive() ? false : c.getColumn() === column);
        });
      } else {
        row.active = false;
        row.cells = this.cells.map(c => c.isActive() ? c.setActive(false) : c);
      }
    } else if (this.index === index) {
      row.active = true;
      row.cells = this.cells.map(c => c.getColumn() === column ? c.setActive(true) : c);
    }
    return row;
  }

  public isActive(): boolean {
    return this.active;
  }

  public setDigit(digit: number): Row {
    if (!this.active) {
      return this;
    }
    this.cells = this.cells.map(c => c.setDigit(digit));
    return new Row(this);
  }

  public removeDigit(): Row {
    if (!this.active) {
      return this;
    }
    this.cells = this.cells.map(c => c.removeDigit());
    return new Row(this);
  }

}
