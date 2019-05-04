import React from 'react';

import { setDigit, removeDigit, setMode, redo, undo } from '../store/actions';
import Sudoku from '../models/Sudoku';
import { MODE } from '../store/types';
import { Paper, createStyles, Theme, WithStyles, withStyles, LinearProgress } from '@material-ui/core';
import Chip, { ChipProps } from '@material-ui/core/Chip'
import { DIFFICULTY } from '../models/Difficulty';

const styles = (theme: Theme) => createStyles({
  container: {
    paddingTop: theme.spacing.unit,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  progress: {
    borderBottomRightRadius: theme.spacing.unit / 2,
    borderBottomLeftRadius: theme.spacing.unit / 2
  },
  errorBar: {
    backgroundColor: theme.palette.error.light
  },
  successBar: {
    backgroundColor: '#66bb6a'
  },
  chip: {
    margin: '4px 2px 4px 2px'
  }
});

interface INumbersProps extends WithStyles<typeof styles> {
  setDigit: typeof setDigit;
  removeDigit: typeof removeDigit;
  mode: MODE;
  setMode: typeof setMode;
  sudoku: Sudoku;
  difficulty: DIFFICULTY;
}

const INumbers: React.FunctionComponent<INumbersProps> = props => {
  const { classes } = props;
  const isNoteMode = props.mode === MODE.Note;
  const sudoku = props.sudoku;
  const isSolved = sudoku.isSolved();
  const showRedProgressBar = sudoku.countEmptyCells() === 0 && !isSolved;
  const progress = ((props.difficulty - props.sudoku.countEmptyCells()) / props.difficulty) * 100


  return (
    <div className={classes.container}>
      <Paper>
        {[...Array(10).keys()].slice(1).map(x => {
          let color: ChipProps['color'] = 'primary';
          if (props.sudoku.isDigitSolved(x)) {
            color = 'default';
          } else if (isNoteMode) {
            color = 'secondary';
          }
          return (
            <Chip onClick={() => props.setDigit(x)} color={color} className={classes.chip} label={x} key={x} />
          );
        })}
        <LinearProgress className={classes.progress}
          classes={{
            bar: showRedProgressBar ? classes.errorBar : ""
          }}
          variant="determinate"
          value={progress}
        />
      </Paper>
    </div >
  );
}

export default withStyles(styles)(INumbers);