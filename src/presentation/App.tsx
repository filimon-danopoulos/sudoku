import React, { Component } from "react";
import { connect } from "react-redux";

import "../layout/App.scss";
import SudokuComponent from "./Sudoku";
import Numbers from "./Numbers";
import { AppState } from "../store";
import { changeDifficulty, createNewGame, validateSolution, toggleCell, setDigit, removeDigit, navigateCells, setMode, redo, undo, toggleNightMode, resetSudoku, fillCandidates, clearCandidates } from "../store/actions";
import { DIFFICULTY } from "../models/Difficulty";
import Sudoku from "../models/Sudoku";
import { DIRECTION, MODE } from "../store/types";
import TopBar from "./TopBar";
import BottomBar from "./BottomBar";
import CssBaseline from "@material-ui/core/CssBaseline";
import CompletedDialog from "./CompletedDialog";
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import theme from "../theme";

interface IAppProps {
  changeDifficulty: typeof changeDifficulty;
  createNewGame: typeof createNewGame;
  validateSolution: typeof validateSolution;
  toggleCell: typeof toggleCell;
  setDigit: typeof setDigit;
  removeDigit: typeof removeDigit;
  navigateCells: typeof navigateCells;
  setMode: typeof setMode;
  undo: typeof undo,
  redo: typeof redo,
  mode: MODE;
  sudoku: Sudoku;
  past: Sudoku[];
  future: Sudoku[];
  difficulty: DIFFICULTY;
  nightMode: boolean;
  toggleNightMode: typeof toggleNightMode;
  resetSudoku: typeof resetSudoku;
  fillCandidates: typeof fillCandidates;
  clearCandidates: typeof clearCandidates;
}

class App extends Component<IAppProps> {
  constructor(props: IAppProps) {
    super(props);
  }

  public render(): JSX.Element {
    const t = theme(this.props.nightMode)
    return (
      <div className="App">
        <MuiThemeProvider theme={t}>
          <CssBaseline />
          <TopBar {...this.props} />
          <div className="App-content">
            <SudokuComponent {...this.props} />
            <Numbers {...this.props} />
          </div>
          <CompletedDialog {...this.props}></CompletedDialog>
          <BottomBar {...this.props} />
        </MuiThemeProvider>
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
    }
  }
}

const mapStateToProps = (state: AppState) => ({
  sudoku: state.game.sudoku.current,
  past: state.game.sudoku.past,
  future: state.game.sudoku.future,
  difficulty: state.game.difficulty,
  mode: state.game.mode,
  nightMode: state.game.nightMode
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
    setMode,
    undo,
    redo,
    toggleNightMode,
    resetSudoku,
    fillCandidates,
    clearCandidates
  }
)(App);
