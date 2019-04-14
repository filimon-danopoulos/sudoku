import React, { Component, CSSProperties } from "react";
import Sudoku from "../models/Sudoku";
import SudokuRow from "./SudokuRow";
import { INPUT_HEIGHT } from "./Input";
import { createNewGame, toggleCell } from "../store/actions";
import { DIFFICULTY } from "../models/Difficulty";
import Paper from "@material-ui/core/Paper";
import { withStyles, WithStyles, createStyles, Theme } from "@material-ui/core";

const styles = (theme: Theme) => createStyles({
  container: {
    position: 'relative',
    marginLeft: 'auto',
    marginRight: 'auto',
    '@media (orientation: portrait)': {
      width: '100%',
      paddingBottom: '100%',
    },
    '@media (orientation: landscape)': {
      height: 'calc(100vh - 2*64px - 100px)',
      width: 'calc(100vh - 2*64px - 100px)',
    },
  },
  sudokuPaper: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    padding: theme.spacing.unit
  }
});

export interface ISudokuProps extends WithStyles<typeof styles> {
  sudoku: Sudoku;
  difficulty: DIFFICULTY;
  createNewGame: typeof createNewGame;
  toggleCell: typeof toggleCell

}

export interface ISudokuState {
  rowSize: number;
}

class SudokuComponent extends Component<ISudokuProps, ISudokuState> {
  private containerRef: React.RefObject<HTMLDivElement>;

  constructor(props: ISudokuProps) {
    super(props);
    this.containerRef = React.createRef();
    this.state = {
      rowSize: 0
    };
  }

  public render(): JSX.Element {
    const { classes } = this.props;
    return (
      <div className={classes.container} ref={this.containerRef}>
        <Paper className={classes.sudokuPaper} >
          {this.renderRows()}
        </Paper>
      </div>
    );
  }

  public componentDidMount(): void {
    this.setCellSize();
  }

  private setCellSize = () => {
    const rowDOM = this.containerRef.current;
    if (rowDOM) {
      const boundingRectangle = rowDOM.getBoundingClientRect();
      const height = boundingRectangle.height - INPUT_HEIGHT;
      const width = boundingRectangle.width
      const smallestDimmesion = height < width ? height : width;
      const fittedDimmension = 9 * Math.floor(smallestDimmesion / 9);
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
      <SudokuRow row={r} key={i} rowSize={this.state.rowSize} toggleCell={this.props.toggleCell} />
    ));
  }

  private formatMillisecons(milliSeconds: number): string {
    const pad = (num: number) => Math.round(num).toString().padStart(2, '0');

    const seconds = pad((milliSeconds / 1000) % 60);
    const minutes = pad((milliSeconds / (1000 * 60)) % 60);
    const hours = pad((milliSeconds / (1000 * 60 * 60)) % 24);

    return `${hours}:${minutes}:${seconds}`;
  }
}


export default withStyles(styles)(SudokuComponent);