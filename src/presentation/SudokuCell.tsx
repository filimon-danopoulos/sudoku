import React, { Component } from 'react';
import Cell from '../models/Cell';
import { toggleCell, toggleHighlight } from '../store/actions';
import { createStyles, Theme, WithStyles, withStyles } from '@material-ui/core';
import { MODE } from '../store/types';

const styles = (theme: Theme) => {
  const borderThin = `solid 1px ${theme.palette.primary.dark}`;
  const borderThick = `solid 2px ${theme.palette.primary.dark}`;

  return createStyles({
    container: {
      display: 'flex',
      position: 'relative',
      width: '11.111111%',
      paddingBottom: '11.111111%',
      textAlign: 'center',
      userSelect: 'none',
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    },
    content: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      borderRight: borderThin,
      borderBottom: borderThin,
      color: theme.palette.type === 'dark' ? theme.palette.grey[400] : theme.palette.primary.dark,
    },
    thickBorderTop: {
      borderTop: borderThick,
    },
    thickBorderBottom: {
      borderBottom: borderThick,
    },
    thickBorderLeft: {
      borderLeft: borderThick,
    },
    thickBorderRight: {
      borderRight: borderThick,
    },
    dark: {
      backgroundColor:
        theme.palette.type === 'dark' ? theme.palette.primary.light : theme.palette.grey[200],
    },
    given: {
      fontWeight: 'bold',
    },
    note: {
      position: 'absolute',
    },
    inactiveNote: {
      opacity: 0.1,
    },
    activeNote: {
      opacity: 1,
    },
    note1: {
      top: 0,
      left: 0,
      bottom: '66.666667%',
      right: '66.666667%',
    },
    note2: {
      top: '0',
      left: '33.333333%',
      bottom: '66.666667%',
      right: '33.333333%',
    },
    note3: {
      top: '0',
      left: '66.666667%',
      bottom: '66.666667%',
      right: '0',
    },
    note4: {
      top: '33.333333%',
      left: '0',
      bottom: '33.333333%',
      right: '66.666667%',
    },
    note5: {
      top: '33.333333%',
      left: '33.333333%',
      bottom: '33.333333%',
      right: '33.333333%',
    },
    note6: {
      top: '33.333333%',
      left: '66.666667%',
      bottom: '33.333333%',
      right: '0',
    },
    note7: {
      top: '66.666667%',
      left: '0',
      bottom: '0',
      right: '66.666667%',
    },
    note8: {
      top: '66.666667%',
      left: '33.333333%',
      bottom: '0',
      right: '33.333333%',
    },
    note9: {
      top: '66.666667%',
      left: '66.666667%',
      bottom: '0',
      right: '0',
    },
    invalid: {
      backgroundColor: theme.palette.error.light,
      color: theme.palette.error.contrastText,
    },
    active: {
      backgroundColor:
        theme.palette.type === 'dark' ? theme.palette.grey[900] : theme.palette.primary.main,
      color: theme.palette.grey[50],
    },
    passive: {
      backgroundColor:
        theme.palette.type === 'dark' ? theme.palette.primary.dark : theme.palette.secondary.light,
      color: theme.palette.secondary.contrastText,
    }
  });
};

export interface ISudokuCellComponentProps extends WithStyles<typeof styles> {
  highlightValue: number | null;
  cell: Cell;
  size: number;
  toggleCell: typeof toggleCell;
  toggleHighlight: typeof toggleHighlight;
  mode: MODE;
}

export interface ISudokuCellComponentState {
  longPressTimeout: number | null;
  handledByLongPress: boolean;
}

class SudokuCellComponent extends Component<ISudokuCellComponentProps, ISudokuCellComponentState> {
  
  constructor(props: ISudokuCellComponentProps) {
    super(props);
    this.state = {
      longPressTimeout: null,
      handledByLongPress: false,
    };
  }

  
  public render(): JSX.Element {
    const { classes } = this.props;
    return (
      <div className={classes.container} 
      onMouseDown={() => this.mouseDownHandler()}
      onTouchStart={() => this.mouseDownHandler()}
      onMouseUp={() => this.mouseUpHandler()}
      onTouchEnd={() => this.mouseUpHandler()} 
      onClick={() => this.handleClick()}>
        <div className={this.calculateClasses()}>{this.renderContent()}</div>
      </div>
    );
  }

  private renderContent(): JSX.Element {
    const { classes } = this.props;
    const value = this.props.cell.getValue();
    if (!!value) {
      return <span style={{ fontSize: `${this.props.size}px` }}>{value}</span>;
    }
    const notes = this.props.cell.getNotes();
    const fontSize = `${Math.ceil(this.props.size / 3)}px`;
    const cellClasses = [
      classes.note1,
      classes.note2,
      classes.note3,
      classes.note4,
      classes.note5,
      classes.note6,
      classes.note7,
      classes.note8,
      classes.note9,
    ];
    return (
      <React.Fragment>
        {notes.map((x, i) => (
          <span
            className={`${classes.note} ${cellClasses[i]} ${
              x ? classes.activeNote : classes.inactiveNote
            }`}
            key={i}
            style={{ fontSize: fontSize }}>
            {x || this.props.mode === MODE.Note ? i + 1 : ''}
          </span>
        ))}
      </React.Fragment>
    );
  }


  private mouseDownHandler() {
    const longPressTimeout = window.setTimeout(() => {
      this.props.toggleCell(this.props.cell.getRow(), this.props.cell.getColumn());
      this.props.toggleHighlight(this.props.cell.getValue())
      this.setState({
        handledByLongPress: true,
      });
    }, 200);
    this.setState({
      longPressTimeout,
    });
  }

  private mouseUpHandler() {
    if (this.state.longPressTimeout) {
      window.clearTimeout(this.state.longPressTimeout);
    }
  }

  private handleClick(): void {
    if (!this.state.handledByLongPress) {
      this.props.toggleCell(this.props.cell.getRow(), this.props.cell.getColumn());
    }
    this.setState({
      handledByLongPress: false,
    });
  }

  private calculateClasses(): string {
    const { classes } = this.props;
    const cell = this.props.cell;
    const row = cell.getRow();
    const column = cell.getColumn();
    const block = cell.getBlock();

    const result = {
      [classes.content]: true,
      [classes.thickBorderTop]: row === 1,
      [classes.thickBorderBottom]: row % 3 === 0,
      [classes.thickBorderLeft]: column === 1,
      [classes.thickBorderRight]: column % 3 === 0,
      [classes.dark]: block % 2 === 0,
      [classes.given]: cell.isGiven(),
      [classes.invalid]: !cell.isValid(),
      [classes.active]: cell.isActive(),
      [classes.passive]: !cell.isActive() && this.props.highlightValue !== null && cell.getValue() === this.props.highlightValue
    };
    return Object.keys(result)
      .filter(key => result[key])
      .join(' ');
  }
}

export default withStyles(styles)(SudokuCellComponent);
