import React, { Component, CSSProperties } from "react";
import Sudoku from "../models/Sudoku";
import SudokuRow from "./SudokuRow";
import { createNewGame, toggleCell, undo, redo, removeDigit, resetSudoku } from "../store/actions";
import { DIFFICULTY } from "../models/Difficulty";
import { withStyles, WithStyles, createStyles, Theme, Card, CardActions, CardContent, IconButton, CardHeader, Menu, MenuItem } from "@material-ui/core";
import UndoIcon from '@material-ui/icons/Undo';
import RedoIcon from '@material-ui/icons/Redo';
import ClearIcon from '@material-ui/icons/Clear';
import { MODE } from "../store/types";
import MenuIcon from '@material-ui/icons/MoreVert';

const styles = (theme: Theme) => createStyles({
  cardContent: {
    padding: 0
  },
  container: {
    position: 'relative',
    marginLeft: 'auto',
    marginRight: 'auto',
    '@media (orientation: portrait)': {
      height: `calc(100vw - ${2.5 * theme.spacing.unit}px)`,
      width: `calc(100vw - ${2.5 * theme.spacing.unit}px)`,
    },
    '@media (orientation: landscape)': {
      height: 'calc(100vh - 2*64px - 100px)',
      width: 'calc(100vh - 2*64px - 100px)',
    },
  },
  sudoku: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    padding: theme.spacing.unit
  },
  toolbar: {
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: `0 ${theme.spacing.unit}px`
  },
  toolbarButton: {
    padding: theme.spacing.unit
  },
  header: {
    padding: theme.spacing.unit,
    paddingBottom: 0
  },
  headerButton: {
    padding: theme.spacing.unit

  }
});

export interface ISudokuProps extends WithStyles<typeof styles> {
  sudoku: Sudoku;
  difficulty: DIFFICULTY;
  createNewGame: typeof createNewGame;
  toggleCell: typeof toggleCell;
  mode: MODE;
  undo: typeof undo;
  redo: typeof redo;
  removeDigit: typeof removeDigit;
  past: Sudoku[];
  future: Sudoku[];
}

export interface ISudokuState {
  rowSize: number;
  menuAnchor: any
}

class SudokuComponent extends Component<ISudokuProps, ISudokuState> {
  private containerRef: React.RefObject<HTMLDivElement>;

  constructor(props: ISudokuProps) {
    super(props);
    this.containerRef = React.createRef();
    this.state = {
      rowSize: 0,
      menuAnchor: null
    };
  }

  public render(): JSX.Element {
    const { classes } = this.props;
    return (
      <React.Fragment>
        <Card>
          <CardContent className={classes.cardContent}>
            <div className={classes.container} ref={this.containerRef}>
              <div className={classes.sudoku} >
                {this.renderRows()}
              </div>
            </div>
          </CardContent>
          <CardActions className={classes.toolbar}>
            <IconButton className={classes.toolbarButton} color="inherit" disabled={!this.props.past.length} onClick={() => this.props.undo()}>
              <UndoIcon />
            </IconButton>
            <IconButton className={classes.toolbarButton} onClick={() => this.props.removeDigit()}>
              <ClearIcon />
            </IconButton>
            <IconButton className={classes.toolbarButton} color="inherit" disabled={!this.props.future.length} onClick={() => this.props.redo()}>
              <RedoIcon />
            </IconButton>
          </CardActions>
        </Card>
      </React.Fragment>
    );
  }
  public componentDidMount(): void {
    this.setCellSize();
  }

  private setCellSize = () => {
    const rowDOM = this.containerRef.current;
    if (rowDOM) {
      const boundingRectangle = rowDOM.getBoundingClientRect();
      const height = boundingRectangle.height - 100;
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
      <SudokuRow mode={this.props.mode} row={r} key={i} rowSize={this.state.rowSize} toggleCell={this.props.toggleCell} />
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