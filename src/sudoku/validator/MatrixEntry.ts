export default class MatrixEntry {
  #size: number;
  #left: MatrixEntry;
  #right: MatrixEntry;
  #up: MatrixEntry;
  #down: MatrixEntry;
  #x: number;
  #y: number;

  constructor(x: number, y: number) {
    this.#size = 0;

    this.#left = this;
    this.#right = this;
    this.#up = this;
    this.#down = this;
    this.#x = x;
    this.#y = y;
  }

  get X(): number {
    return this.#x;
  }

  get Y(): number {
    return this.#y;
  }

  get Left(): MatrixEntry {
    return this.#left;
  }

  get Right(): MatrixEntry {
    return this.#right;
  }

  get Up(): MatrixEntry {
    return this.#up;
  }

  get Down(): MatrixEntry {
    return this.#down;
  }

  get Size(): number {
    return this.#size;
  }

  incrementSize(): void {
    ++this.#size;
  }

  decrementSize(): void {
    --this.#size;
  }

  horizontalExclude(): void {
    this.#left.#right = this.#right;
    this.#right.#left = this.#left;
  }

  verticalExclude(): void {
    this.#up.#down = this.#down;
    this.#down.#up = this.#up;
  }

  horizontalInclude(): void {
    this.#left.#right = this;
    this.#right.#left = this;
  }

  verticalInclude(): void {
    this.#up.#down = this;
    this.#down.#up = this;
  }

  horizontalInsert(entry: MatrixEntry): void {
    entry.#left = this.#left;
    entry.#right = this;

    this.#left.#right = entry;
    this.#left = entry;
  }

  verticalInsert(entry: MatrixEntry): void {
    entry.#up = this.#up;
    entry.#down = this;

    this.#up.#down = entry;
    this.#up = entry;
  }
}
