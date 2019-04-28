import MatrixEntry from "./MatrixEntry";

/**
 * A sparse matrix where each element is douply linked in both the row and column direction. 
 */
export default class LinkedSparseMatrix {
  private root: MatrixEntry;
  private columnHeaders: MatrixEntry[];


  constructor(data: boolean[][]) {
    this.root = new MatrixEntry(-1, -1);
    this.columnHeaders = [];
    const sparseRepresentation = this.convertDenseMatrixToSparseRepresentation(data)
    this.generateRows(sparseRepresentation);
  }

  public getColumnIndexOf(columnHeader: MatrixEntry): number {
    return this.columnHeaders.indexOf(columnHeader);
  }

  public get Root(): MatrixEntry {
    return this.root;
  }

  /**
   * Converts matrix of ones and zeroes where most elements are
   * zeroes, i.e. a sparse matrix to a representation where each element
   * correponds to the index of a one. This greatly reduces the ammount
   * of elements we are required to keep track of. 
   */
  private convertDenseMatrixToSparseRepresentation(data: boolean[][]): number[][] {
    return data.map(row => row.reduce((sparse, value, index) => {
      if (value) {
        sparse.push(index)
      }
      return sparse
    }, [] as number[]), [] as number[][])
  }

  /**
   * All rows that have an entry at the provided column index are excluded from the linked matrix.
   * They are not removed from the columns array so that they can be added gain. 
   * This is made possible by the way the data in structured. An entry is linked to a column 
   * header only if it has an entry in the corresponding column. By itterating through
   * the Down link all rows can be found. All entries in the entrire row can then 
   * be found and excluded through the Right link. 
   */
  public cover(index: number): void {
    const columnHeader = this.columnHeaders[index]

    columnHeader.horizontalExclude();
    for (let row = columnHeader.Down; row !== columnHeader; row = row.Down) {
      for (let entry = row.Right; entry !== row; entry = entry.Right) {
        entry.verticalExclude()
        this.columnHeaders[entry.X].decrementSize()
      }
    }
  }

  /**
   * All rows that have an entry at the provided column index are included in the linked matrix.
   * The same approach is taken as in the cover method but the Up and Left are used instead. 
   * That way the original order is maintained. 
   */
  public uncover(index: number): void {
    const columnHeader = this.columnHeaders[index];

    columnHeader.horizontalInclude();
    for (let row = columnHeader.Up; row !== columnHeader; row = row.Up) {
      for (let entry = row.Left; entry !== row; entry = entry.Left) {
        entry.verticalInclude()
        this.columnHeaders[entry.X].incrementSize()
      }
    }
  }

  /**
   * Creates each row of the data. Each row is built on temporary entry that is later removed. 
   * Each element in each row is also linked to a column. This methods makes sure that 
   * all required column headers exist. By linking the entries in both the row and column
   * direction the time it takes to traverse the matrix to find ones is greatly reduced. 
   */
  private generateRows(sparseRepresentation: number[][]) {
    sparseRepresentation.forEach((dataRow, i) => {
      const temporaryRowRoot = new MatrixEntry(-1, i)
      dataRow.forEach((dataPoint) => {
        const entry = new MatrixEntry(dataPoint, i)

        if (this.columnHeaders.length <= dataPoint) {
          this.appendColumnHeaders(dataPoint - this.columnHeaders.length + 1)
        }
        const currentColumnHeader = this.columnHeaders[dataPoint]
        currentColumnHeader.verticalInsert(entry);
        currentColumnHeader.incrementSize();
        temporaryRowRoot.horizontalInsert(entry);
      })
      temporaryRowRoot.horizontalExclude();
    })
  }

  /**
   * Appends new MatrixEntries called headers (they are not part of the data). 
   * These linked to the root element, each element in a row is also part of a linked list that 
   * is based of a column header.
   */
  private appendColumnHeaders(count: number): void {
    while (count--) {
      const columnHeader = new MatrixEntry(this.columnHeaders.length, -1)
      this.root.horizontalInsert(columnHeader);
      this.columnHeaders.push(columnHeader);
    }
  }
}