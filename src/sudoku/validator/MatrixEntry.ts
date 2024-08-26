export default class MatrixEntry {
  private size: number;
  private left: MatrixEntry;
  private right: MatrixEntry;
  private up: MatrixEntry;
  private down: MatrixEntry;

  constructor(
    private x: number,
    private y: number
  ) {
    this.size = 0;

    this.left = this;
    this.right = this;
    this.up = this;
    this.down = this;
  }

  public get X(): number {
    return this.x;
  }

  public get Y(): number {
    return this.y;
  }

  public get Left(): MatrixEntry {
    return this.left;
  }

  public get Right(): MatrixEntry {
    return this.right;
  }

  public get Up(): MatrixEntry {
    return this.up;
  }

  public get Down(): MatrixEntry {
    return this.down;
  }

  public get Size(): number {
    return this.size;
  }

  public incrementSize(): void {
    ++this.size;
  }

  public decrementSize(): void {
    --this.size;
  }

  public horizontalExclude(): void {
    this.left.right = this.right;
    this.right.left = this.left;
  }

  public verticalExclude(): void {
    this.up.down = this.down;
    this.down.up = this.up;
  }

  public horizontalInclude(): void {
    this.left.right = this;
    this.right.left = this;
  }

  public verticalInclude(): void {
    this.up.down = this;
    this.down.up = this;
  }

  public horizontalInsert(entry: MatrixEntry): void {
    entry.left = this.left;
    entry.right = this;

    this.left.right = entry;
    this.left = entry;
  }

  public verticalInsert(entry: MatrixEntry): void {
    entry.up = this.up;
    entry.down = this;

    this.up.down = entry;
    this.up = entry;
  }
}
