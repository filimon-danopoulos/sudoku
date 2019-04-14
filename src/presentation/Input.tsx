import React from 'react';

import { setDigit, removeDigit, setMode, redo, undo } from '../store/actions';
import Sudoku from '../models/Sudoku';
import { MODE } from '../store/types';
import { Chip, Paper, createStyles, Theme, WithStyles, withStyles } from '@material-ui/core';

const styles = (theme: Theme) => createStyles({
  container: {
    paddingTop: 15,
    marginLeft: 'auto',
    marginRight: 'auto',
    '@media (orientation: portrait)': {
      width: '100%',
    },
    '@media (orientation: landscape)': {
      width: 'calc(100vh - 2*64px - 100px)',
    },
  },
  chip: {
    margin: '4px 2px 4px 2px'
  }
});

interface InputComponentProps extends WithStyles<typeof styles> {
  setDigit: typeof setDigit;
  removeDigit: typeof removeDigit;
  mode: MODE;
  setMode: typeof setMode;
  sudoku: Sudoku;
}

export const INPUT_HEIGHT = 100;

const InputComponent: React.FunctionComponent<InputComponentProps> = props => {
  if (props.sudoku.isSolved()) {
    return null;
  }

  const { classes } = props
  return (
    <div className={classes.container}>
      <Paper>
        {[...Array(10).keys()].slice(1).map(x => {
          if (props.sudoku.isDigitSolved(x)) {
            return (<Chip clickable={false} color="default" className={classes.chip} label={x} key={x} />);
          }
          return (<Chip onClick={() => props.setDigit(x)} color="primary" className={classes.chip} label={x} key={x} />);
        })}
      </Paper>
    </div >
  );
}

export default withStyles(styles)(InputComponent);