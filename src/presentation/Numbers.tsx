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
    '@media (orientation: portrait)': {
      width: '100%',
    },
    '@media (orientation: landscape)': {
      width: 'calc(100vh - 2*64px - 100px)',
    },
  },
  progress: {
    borderBottomRightRadius: theme.spacing.unit / 2,
    borderBottomLeftRadius: theme.spacing.unit / 2
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
  if (props.sudoku.isSolved()) {
    return null;
  }

  const { classes } = props
  return (
    <div className={classes.container}>
      <Paper>
        {[...Array(10).keys()].slice(1).map(x => {
          let color: ChipProps['color'] = 'primary';
          if (props.sudoku.isDigitSolved(x)) {
            color = 'default';
          } else if (props.mode === MODE.Note) {
            color = 'secondary';
          }
          return (
            <Chip onClick={() => props.setDigit(x)} color={color} className={classes.chip} label={x} key={x} />
          );
        })}
        <LinearProgress className={classes.progress}
          variant="determinate"
          color={props.mode === MODE.Note ? "secondary" : "primary"}
          value={(props.sudoku.countSolvedCells() / props.difficulty) * 100}
        />
      </Paper>
    </div >
  );
}

export default withStyles(styles)(INumbers);