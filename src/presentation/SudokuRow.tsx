import React, { Component } from "react";
import ReactDOM from "react-dom";
import Row from "../models/Row";
import "../layout/SudokuRow.scss";
import SudokuCell, { ISudokuCellComponentActions } from "./SudokuCell";

export interface ISudokuRowProps extends ISudokuCellComponentActions {
  row: Row;
  rowSize: number;
}

export default class SudokuRowComponent extends Component<
  ISudokuRowProps
  > {

  public render(): JSX.Element {
    return (
      <div className="SudokuRow-container" style={this.getRowStyle()}>
        {this.renderRow()}
      </div>
    );
  }

  private getRowStyle(): React.CSSProperties {
    return {
      width: `${this.props.rowSize}px`,
      height: `${this.getCellSize()}px`
    };
  }

  private renderRow(): JSX.Element[] | null {
    return this.props.row
      .getCells()
      .map((c, i) => <SudokuCell {...this.props} cell={c} size={this.getCellSize()} key={i} />);
  }

  private getCellSize(): number {
    return this.props.rowSize / 9;
  }
}
