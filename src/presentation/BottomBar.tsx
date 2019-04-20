import React, { Fragment } from 'react';
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import UndoIcon from '@material-ui/icons/Undo';
import RedoIcon from '@material-ui/icons/Redo';
import ClearIcon from '@material-ui/icons/Clear';
import { undo, redo, removeDigit, setMode } from '../store/actions';
import Sudoku from '../models/Sudoku';
import { MODE } from '../store/types';
import Fab from '@material-ui/core/Fab';
import PenIcon from "@material-ui/icons/Edit";
import PenIconOutline from "@material-ui/icons/EditOutlined";
import { Typography } from '@material-ui/core';

const styles = (theme: Theme) => createStyles({
  appBar: {
    top: 'auto',
    bottom: 0,
  },
  toolbar: {
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modeFab: {
    position: 'absolute',
    zIndex: 1,
    top: -30,
    left: 0,
    right: 0,
    margin: '0 25% 0 auto'
  },
  clearFab: {
    position: 'absolute',
    zIndex: 1,
    top: -30,
    left: 0,
    right: 0,
    margin: '0 auto 0 25%'
  },
});

export interface IBottomBarProps extends WithStyles<typeof styles> {
  undo: typeof undo;
  redo: typeof redo;
  removeDigit: typeof removeDigit;
  past: Sudoku[];
  future: Sudoku[];
  mode: MODE;
  setMode: typeof setMode;
}

const BottomBar: React.FunctionComponent<IBottomBarProps> = (props: IBottomBarProps) => {
  const isNoteMode = props.mode === MODE.Note
  const toggleMode = () => {
    if (isNoteMode) {
      props.setMode(MODE.Input);
    } else {
      props.setMode(MODE.Note);
    }
  }


  const { classes } = props;
  return (
    <AppBar position="fixed" color="default" className={classes.appBar}>
      <Toolbar className={classes.toolbar}>
        <Fab color="primary" className={classes.clearFab} onClick={() => props.removeDigit()}>
          <ClearIcon />
        </Fab>
        <IconButton color="inherit" disabled={!props.past.length} onClick={() => props.undo()}>
          <UndoIcon />
        </IconButton>
        {isNoteMode ? <Typography variant="subheading">Taking notes</Typography> : null}
        <IconButton color="inherit" disabled={!props.future.length} onClick={() => props.redo()}>
          <RedoIcon />
        </IconButton>
        <Fab color={isNoteMode ? 'secondary' : 'default'} className={classes.modeFab} onClick={() => toggleMode()}>
          {isNoteMode ? <PenIconOutline /> : <PenIcon />}
        </Fab>
      </Toolbar>
    </AppBar>
  );
}

export default withStyles(styles)(BottomBar);
