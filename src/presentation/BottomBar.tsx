import React, { Fragment } from 'react';
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import UndoIcon from '@material-ui/icons/Undo';
import RedoIcon from '@material-ui/icons/Redo';
import ClearIcon from '@material-ui/icons/Clear';
import { undo, redo, removeDigit } from '../store/actions';
import Sudoku from '../models/Sudoku';

const styles = (theme: Theme) => createStyles({
  appBar: {
    top: 'auto',
    bottom: 0,
  },
  toolbar: {
    alignItems: 'center',
    justifyContent: 'space-between',
  }
});

export interface IBottomBarProps extends WithStyles<typeof styles> {
  undo: typeof undo;
  redo: typeof redo;
  removeDigit: typeof removeDigit;
  past: Sudoku[];
  future: Sudoku[];
}

const BottomBar: React.FunctionComponent<IBottomBarProps> = (props: IBottomBarProps) => {
  const { classes } = props;
  return (
    <AppBar position="fixed" color="default" className={classes.appBar}>
      <Toolbar className={classes.toolbar}>
        <IconButton color="inherit" disabled={!props.past.length} onClick={() => props.undo()}>
          <UndoIcon />
        </IconButton>
        <IconButton color="inherit" onClick={() => props.removeDigit()}>
          <ClearIcon />
        </IconButton>
        <IconButton color="inherit" disabled={!props.future.length} onClick={() => props.redo()}>
          <RedoIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}

export default withStyles(styles)(BottomBar);
