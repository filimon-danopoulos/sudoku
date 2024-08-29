import { SudokuSet } from './SudokuSet';

export class SudokuCell {
  public candidates: number[] = [];
  private _value: number | null = null;
  public get value(): number | null {
    return this._value;
  }
  public set value(val: number | null) {
    if (val !== null) {
      Array.from(new Set([...this.block.cells, ...this.row.cells, ...this.column.cells]))
        .filter((cell) => !cell.value && cell !== this)
        .forEach((cell) => {
          const candidateIndex = cell.candidates.indexOf(val);
          if (candidateIndex !== -1) {
            cell.candidates.splice(candidateIndex, 1);
          }
        });
      this.candidates = [];
    }
    this._value = val;
  }
  public block: SudokuSet;
  public row: SudokuSet;
  public column: SudokuSet;

  constructor(block: SudokuSet, row: SudokuSet, column: SudokuSet, value: number | null = null) {
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
          (cell) => cell !== this && !!cell.value
        ) as SudokuCell[]
      )
    );
    influencers.forEach((cell) => result.delete(cell.value as number));
    return Array.from(result);
  }
}
