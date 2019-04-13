import React, { Component } from "react";
import { connect } from "react-redux";

import "../layout/App.scss";
import SudokuComponent from "./Sudoku";
import OptionsComponent from "./Options";
import Input from "./Input";
import { AppState } from "../store";
import { changeDifficulty, createNewGame, validateSolution, toggleCell, setDigit, removeDigit, navigateCells, toggleNoteMode } from "../store/actions";
import { DIFFICULTY } from "../models/Difficulty";
import Sudoku from "../models/Sudoku";
import { DIRECTION } from "../store/types";


interface IAppProps {
  changeDifficulty: typeof changeDifficulty;
  createNewGame: typeof createNewGame;
  validateSolution: typeof validateSolution;
  toggleCell: typeof toggleCell;
  setDigit: typeof setDigit;
  removeDigit: typeof removeDigit;
  navigateCells: typeof navigateCells;
  toggleNoteMode: typeof toggleNoteMode;
  noteMode: boolean;
  sudoku: Sudoku;
  difficulty: DIFFICULTY;
}

class App extends Component<IAppProps> {
  public render(): JSX.Element {
    return (
      <div className="App">
        <header className="App-header">
          <h1>Sudoku</h1>
        </header>
        <OptionsComponent {...this.props} />
        <div className="App-content">
          <SudokuComponent {...this.props} />
          <Input {...this.props} />
        </div>
      </div>
    );
  }


  public componentDidMount(): void {
    document.addEventListener("keydown", this.handleKeyboard);
  }

  public componentWillUnmount(): void {
    document.removeEventListener("keydown", this.handleKeyboard);
  }

  private handleKeyboard = (e: KeyboardEvent) => {
    const key = e.which;
    if (key >= 49 && key <= 57) { // [1...9]
      this.props.setDigit(key - 48);
    } else if (key === 8 || key === 2) { // backspace || delete
      this.props.removeDigit()
    } else if (key === 37) { //left 
      this.props.navigateCells(DIRECTION.Left);
    } else if (key === 38) { //up
      this.props.navigateCells(DIRECTION.Up);
    } else if (key === 39) { // right
      this.props.navigateCells(DIRECTION.Right);
    } else if (key === 40) { // down
      this.props.navigateCells(DIRECTION.Down);
    } else if (key === 32) { // space
      this.props.toggleNoteMode()
    } else if (key === 27) { // esc
      this.props.toggleNoteMode(false)
    }
  }
}

const mapStateToProps = (state: AppState) => ({
  sudoku: state.game.sudoku,
  difficulty: state.game.difficulty,
  noteMode: state.game.noteMode
});

export default connect(
  mapStateToProps,
  {
    changeDifficulty,
    createNewGame,
    validateSolution,
    toggleCell,
    setDigit,
    removeDigit,
    navigateCells,
    toggleNoteMode
  }
)(App);
