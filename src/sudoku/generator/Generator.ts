import { Solver } from '../validator/Solver.js';

const BASE = [
  [3, 6, 1, 7, 2, 5, 9, 4, 8],
  [5, 8, 7, 9, 6, 4, 2, 1, 3],
  [4, 9, 2, 8, 3, 1, 6, 5, 7],
  [6, 3, 8, 2, 5, 9, 4, 7, 1],
  [1, 7, 4, 6, 8, 3, 5, 9, 2],
  [2, 5, 9, 1, 4, 7, 8, 3, 6],
  [7, 4, 6, 3, 9, 2, 1, 8, 5],
  [9, 2, 3, 5, 1, 8, 7, 6, 4],
  [8, 1, 5, 4, 7, 6, 3, 2, 9],
];

// prettier-ignore
const ALL_GIVEN: [number, number][] = [
  [0, 0], [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6], [0, 7], [0, 8], 
  [1, 0], [1, 1], [1, 2], [1, 3], [1, 4], [1, 5], [1, 6], [1, 7], [1, 8], 
  [2, 0], [2, 1], [2, 2], [2, 3], [2, 4], [2, 5], [2, 6], [2, 7], [2, 8], 
  [3, 0], [3, 1], [3, 2], [3, 3], [3, 4], [3, 5], [3, 6], [3, 7], [3, 8], 
  [4, 0], [4, 1], [4, 2], [4, 3], [4, 4], [4, 5], [4, 6], [4, 7], [4, 8], 
  [5, 0], [5, 1], [5, 2], [5, 3], [5, 4], [5, 5], [5, 6], [5, 7], [5, 8], 
  [6, 0], [6, 1], [6, 2], [6, 3], [6, 4], [6, 5], [6, 6], [6, 7], [6, 8], 
  [7, 0], [7, 1], [7, 2], [7, 3], [7, 4], [7, 5], [7, 6], [7, 7], [7, 8], 
  [8, 0], [8, 1], [8, 2], [8, 3], [8, 4], [8, 5], [8, 6], [8, 7], [8, 8], 
];

export class Generator {
  #solution: number[][];
  #puzzle: (null | number)[][];
  #given: [number, number][];

  constructor() {
    this.#solution = [];
    this.#puzzle = [];
    this.#given = [];
  }

  generate() {
    const solver = new Solver();

    // Reset internal state to make sure the generator is stateless
    this.#solution = this.#shuffle(BASE);
    this.#given = Array.from(ALL_GIVEN);
    this.#puzzle = this.#solution.map((r) => [...r]);

    // TODO: Optimize allowed attempts, 10 000 is arbitrary.
    let allowedAttempts = 10_000;
    while (allowedAttempts--) {
      const candidates = this.#getCandicates();
      const removed = [] as { value: number; row: number; column: number }[];
      for (let i = 0; i < candidates.length; i++) {
        const [row, column] = candidates[i];
        const value = this.#puzzle[row][column] as number;
        removed.push({
          row,
          column,
          value,
        });
        this.#puzzle[row][column] = null;
        this.#given = this.#given.filter((given) => !(given[0] === row && given[1] === column));
      }
      if (solver.solve(this.#puzzle).length !== 1) {
        for (let i = 0; i < removed.length; i++) {
          const { row, column, value } = removed[i];
          this.#puzzle[row][column] = value;
          this.#given.push([row, column]);
        }
        if (this.#given.length <= 28) {
          break;
        }
      }
    }

    if (allowedAttempts > 0) {
      return true;
    } else {
      this.#puzzle = [];
      return false;
    }
  }

  #getCandicates() {
    const randomIndex = ~~(Math.random() * this.#given.length);
    const firstCandidate = this.#given[randomIndex];
    // When we have few cells left we only attempt a single candidate at a time.
    if (this.#given.length <= 32) {
      return [firstCandidate];
    }

    if (firstCandidate[0] === firstCandidate[1]) {
      return [firstCandidate, [8 - firstCandidate[0], 8 - firstCandidate[1]]];
    }

    // TODO: Add additional symetries.
    // TODO: Optimize initial candidates to remove four, needs benchmark.
    return [firstCandidate, [firstCandidate[1], firstCandidate[0]]];
  }

  #shuffle(base: number[][]): number[][] {
    const data = base.map((r) => [...r]);
    for (let i = 0; i < 1000; i++) {
      this.#moveRowOrColumn(data);
    }
    return data;
  }

  getPuzzleData(): [number, boolean][][] {
    return this.#puzzle.map((r, i) =>
      r.map((y, l) => [this.#solution[i][l], this.#solution[i][l] === this.#puzzle[i][l]] as [number, boolean])
    );
  }

  #moveRowOrColumn(data: number[][]) {
    const [from, to] = this.#getFromAndTo();
    if (Math.round(Math.random())) {
      this.#moveColumn(data, from, to);
    } else {
      this.#moveRow(data, from, to);
    }
  }

  #getFromAndTo(from: number = -1): [number, number] {
    from = from === -1 ? ~~(Math.random() * 3) : from;
    const to = (from + Math.round(Math.random() * 2)) % 3;
    const block = ~~(Math.random() * 3);
    return [block * 3 + from, block * 3 + to];
  }

  #moveRow(data: number[][], from: number, to: number) {
    const temp = data[to];
    data[to] = data[from];
    data[from] = temp;
  }

  #moveColumn(data: number[][], from: number, to: number) {
    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      const temp = row[to];
      row[to] = row[from];
      row[from] = temp;
    }
  }
}
