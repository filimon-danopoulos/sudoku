import React, { Component, CSSProperties } from "react";
import "../layout/Sudoku.scss";
import Sudoku from "../models/Sudoku";
import SudokuRow from "./SudokuRow";
import { ISudokuCellComponentActions } from "./SudokuCell";
import { INPUT_HEIGHT } from "./Input";

export interface ISudokuProps extends ISudokuCellComponentActions {
  sudoku: Sudoku;
}

export interface ISudokuState {
  rowSize: number;
}

export default class SudokuComponent extends Component<ISudokuProps, ISudokuState> {
  private containerRef: React.RefObject<HTMLDivElement>;
  private startTime: number;

  constructor(props: ISudokuProps) {
    super(props);
    this.containerRef = React.createRef();
    this.state = {
      rowSize: 0
    };
    this.startTime = Date.now();
  }

  public render(): JSX.Element {
    return (
      <div className="Sudoku-container" ref={this.containerRef} style={this.calculateStyles()}>
        {this.renderRows()}
        {this.renderSolvedOverlay()}
      </div>
    );
  }

  private calculateStyles(): CSSProperties {
    if (!this.state.rowSize) {
      return {};
    }
    return {
      height: `${this.state.rowSize}px`
    };
  }

  public componentDidMount(): void {
    this.setCellSize();
    window.addEventListener("resize", this.setCellSize);
  }

  public componentWillUnmount(): void {
    window.removeEventListener("resize", this.setCellSize);
  }

  private setCellSize = () => {
    const rowDOM = this.containerRef.current;
    if (rowDOM) {
      const boundingRectangle = rowDOM.getBoundingClientRect();
      const height = boundingRectangle.height - INPUT_HEIGHT;
      const width = boundingRectangle.width
      const smallestDimmesion = height < width ? height : width;
      const fittedDimmension = 9 * Math.floor(smallestDimmesion / 9)
      this.setState({
        rowSize: fittedDimmension
      });
    } else {
      requestAnimationFrame(() => {
        this.setCellSize();
      });
    }
  }

  private renderRows(): JSX.Element[] | null {
    if (!this.state.rowSize) {
      return null;
    }
    return this.props.sudoku.getRows().map((r, i) => (
      <SudokuRow row={r} key={i} rowSize={this.state.rowSize} {...this.props} />
    ));
  }

  private renderSolvedOverlay(): JSX.Element | null {
    if (!this.props.sudoku.isSolved()) {
      return null;
    }
    const endTime = Date.now()
    const ellapsedTime = endTime - this.startTime
    return (
      <div className="Sudoku-solved" style={{
        width: `${this.state.rowSize}px`,
        height: `${this.state.rowSize}px`,
        marginLeft: `-${this.state.rowSize / 2}px`
      }}>
        <div className="Sudoku-solved-message">
          <h1>You solved the puzzle!</h1>
          <p>Ellapsed time: <span className="Sudoku-ellapsed">{this.formatMillisecons(ellapsedTime)}</span></p>
        </div>
      </div>
    );
  }

  private formatMillisecons(milliSeconds: number): string {
    const pad = (num: number) => Math.round(num).toString().padStart(2, '0');

    const seconds = pad((milliSeconds / 1000) % 60);
    const minutes = pad((milliSeconds / (1000 * 60)) % 60);
    const hours = pad((milliSeconds / (1000 * 60 * 60)) % 24);

    return `${hours}:${minutes}:${seconds}`;
  }
}
