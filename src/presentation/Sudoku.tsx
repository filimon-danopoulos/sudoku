import React, { Component, CSSProperties } from "react";
import "../layout/Sudoku.scss";
import Sudoku from "../models/Sudoku";
import SudokuRow from "./SudokuRow";
import { ISudokuCellComponentActions } from "./SudokuCell";
import { INPUT_HEIGHT } from "./Input";
import { createNewGame } from "../store/actions";
import { DIFFICULTY } from "../models/Difficulty";

export interface ISudokuProps extends ISudokuCellComponentActions {
  sudoku: Sudoku;
  difficulty: DIFFICULTY;
  createNewGame: typeof createNewGame;
}

export interface ISudokuState {
  rowSize: number;
}

export default class SudokuComponent extends Component<ISudokuProps, ISudokuState> {
  private containerRef: React.RefObject<HTMLDivElement>;

  constructor(props: ISudokuProps) {
    super(props);
    this.containerRef = React.createRef();
    this.state = {
      rowSize: 0
    };
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

    const difficulty = this.getDifficultyText();
    const endTime = Date.now()
    const ellapsedTime = endTime - this.props.sudoku.getCreationTimestamp();
    return (
      <div className="Sudoku-solved" style={{
        width: `${this.state.rowSize}px`,
        height: `${this.state.rowSize}px`,
        marginLeft: `-${this.state.rowSize / 2}px`
      }}>
        <div className="Sudoku-solved-message">
          <h1>You solved {difficulty} puzzle!</h1>
          <p>Ellapsed time: <span className="Sudoku-ellapsed">{this.formatMillisecons(ellapsedTime)}</span></p>
          <button onClick={() => this.props.createNewGame()}>Start a new game</button>
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

  private getDifficultyText(): string {
    switch (this.props.difficulty) {
      case DIFFICULTY.VeryEasy:
        return 'a very easy';
      case DIFFICULTY.Easy:
        return 'an easy';
      case DIFFICULTY.Normal:
        return 'a normal';
      case DIFFICULTY.Hard:
        return 'a hard';
      case DIFFICULTY.VeryHard:
        return 'a very hard';
      case DIFFICULTY.Insane:
        return 'an insane';
      default:
        return 'an unknown';
    }
  }
}
