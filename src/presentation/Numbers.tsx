import React from 'react';

import { setDigit, removeDigit, setMode } from '../store/actions';
import Sudoku from '../models/Sudoku';
import {
  Paper,
  createStyles,
  Theme,
  WithStyles,
  withStyles,
  LinearProgress,
} from '@material-ui/core';
import Chip, { ChipProps } from '@material-ui/core/Chip';
import Settings from '../models/Settings';

const styles = (theme: Theme) =>
  createStyles({
    container: {
      paddingTop: theme.spacing.unit,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
    progress: {
      borderBottomRightRadius: theme.spacing.unit / 2,
      borderBottomLeftRadius: theme.spacing.unit / 2,
    },
    errorBar: {
      backgroundColor: theme.palette.error.light,
    },
    successBar: {
      backgroundColor: '#66bb6a',
    },
    chip: {
      margin: '4px 2px 4px 2px',
    },
  });

interface INumbersProps extends WithStyles<typeof styles> {
  setDigit: typeof setDigit;
  removeDigit: typeof removeDigit;
  setMode: typeof setMode;
  sudoku: Sudoku;
  settings: Settings;
}

interface INumbersState {
  longPressTimeout: number | null;
  clickHandledByLongPress: boolean;
}

class INumbers extends React.Component<INumbersProps, INumbersState> {
  constructor(props: INumbersProps) {
    super(props);
    this.state = {
      longPressTimeout: null,
      clickHandledByLongPress: false,
    };
  }

  private mouseDownHandler(value: number) {
    const longPressTimeout = window.setTimeout(() => {
      this.props.setDigit(value, this.props.settings.NotesEnabled);
      this.setState({
        clickHandledByLongPress: true,
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

  private getProgress() {
    const cellsLeft = this.props.settings.Difficulty - this.props.sudoku.countEmptyCells();
    const completionRatio = cellsLeft / this.props.settings.Difficulty;
    return completionRatio * 100;
  }

  public render(): JSX.Element {
    const { classes } = this.props;
    const sudoku = this.props.sudoku;
    const isSolved = sudoku.isSolved();
    const showRedProgressBar = sudoku.countEmptyCells() === 0 && !isSolved;
    return (
      <div className={classes.container}>
        <Paper>
          {[...Array(10).keys()].slice(1).map(x => {
            let color: ChipProps['color'] = 'primary';
            if (
              this.props.sudoku.isDigitCompleted(x) &&
              this.props.settings.MarkCompletedNumbersEnabled
            ) {
              color = 'default';
            }
            return (
              <Chip
                onMouseDown={() => this.mouseDownHandler(x)}
                onTouchStart={() => this.mouseDownHandler(x)}
                onMouseUp={() => this.mouseUpHandler()}
                onTouchEnd={() => this.mouseUpHandler()}
                onClick={() => {
                  if (!this.state.clickHandledByLongPress) {
                    this.props.setDigit(x);
                  }
                  this.setState({
                    clickHandledByLongPress: false,
                  });
                }}
                color={color}
                className={classes.chip}
                label={x}
                key={x}
              />
            );
          })}
          {!this.props.settings.ProgressEnabled ? null : (
            <LinearProgress
              className={classes.progress}
              classes={{
                bar: showRedProgressBar ? classes.errorBar : '',
              }}
              variant="determinate"
              value={this.getProgress()}
            />
          )}
        </Paper>
      </div>
    );
  }
}

export default withStyles(styles)(INumbers);
