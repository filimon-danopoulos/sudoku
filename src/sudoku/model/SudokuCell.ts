import { SudokuSet } from './SudokuSet';

export class SudokuCell {
  candidates: number[] = [];
  #value: number | null = null;

  get value(): number | null {
    return this.#value;
  }
  set value(val: number | null) {
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
    this.#value = val;
  }
  block: SudokuSet;
  row: SudokuSet;
  column: SudokuSet;

  constructor(block: SudokuSet, row: SudokuSet, column: SudokuSet, value: number = 0) {
    this.block = block;
    this.row = row;
    this.column = column;
    this.candidates = [];
    this.#value = value === 0 ? null : value;
  }

  calculateCandidates() {
    if (this.value) {
      return;
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
    this.candidates = Array.from(result);
  }
}
