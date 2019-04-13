import React, { Component, CSSProperties } from "react";
import "../layout/SudokuCell.scss";
import Cell from "../models/Cell";
import { toggleCell } from "../store/actions";

export interface ISudokuCellComponentActions {
  toggleCell: typeof toggleCell
}

export interface ISudokuCellComponentProps extends ISudokuCellComponentActions {
  cell: Cell;
  size: number;
}

export default class SudokuCellComponent extends Component<
  ISudokuCellComponentProps
  > {

  public render(): JSX.Element {
    return (
      <div
        className={`SudokuCell-container ${this.calculateClasses()}`}
        style={this.calculateStyles()}
        ref="cell"
        onClick={() => this.handleClick()}
      >
        {this.renderContent()}
      </div>
    );
  }

  private renderContent(): JSX.Element {
    const value = this.props.cell.getValue();
    if (!!value) {
      return (
        <span className="SudokuCell-value">{value}</span>
      );
    }
    const notes = this.props.cell.getNotes();
    const fontSize = `${Math.ceil((this.props.size / 3)) * 0.76}px`;
    return (
      <div className="SudokuCell-notes">
        {notes.map((x, i) => (
          <span className="SudokuCell-note" key={i} style={{ fontSize: fontSize }}>
            {x ? i + 1 : ''}
          </span>
        ))}
      </div>
    );
  }

  private handleClick(): void {
    this.props.toggleCell(this.props.cell.getRow(), this.props.cell.getColumn())
  }

  private calculateStyles(): CSSProperties {
    const size = `${this.props.size}px`;
    const fontSize = `${Math.floor(this.props.size * 0.68)}px`;
    return {
      height: size,
      width: size,
      fontSize: fontSize
    };
  }

  private calculateClasses(): string {
    const cell = this.props.cell;
    const row = cell.getRow();
    const classes: { [key: string]: boolean } = {
      "even-block-cell": cell.getBlock() % 2 === 0,
      "given-cell": cell.isGiven(),
      "invalid-cell": cell.isValid() !== true,
      "active-cell": cell.isActive()
    };
    [...Array(10)].forEach((x, i) => classes[`row-${i}-cell`] = row === i);

    return Object.keys(classes).filter(key => classes[key]).join(" ");
  }
}
