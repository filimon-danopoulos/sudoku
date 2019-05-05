import React from 'react';
import { withStyles, Dialog, DialogTitle, DialogContent, RadioGroup, FormControlLabel, Radio, DialogActions, Button, createStyles, Theme, WithTheme, WithStyles, Typography } from "@material-ui/core";
import { createNewGame } from '../store/actions';
import Sudoku from '../models/Sudoku';
import { DIFFICULTY } from '../models/Difficulty';
import Settings from '../models/Settings';

const styles = (theme: Theme) => createStyles({

})

export interface ICompletedDialogProps extends WithStyles<typeof styles> {
  createNewGame: typeof createNewGame;
  sudoku: Sudoku;
  settings: Settings;
}

const CompletedDialog: React.FunctionComponent<ICompletedDialogProps> = (props: ICompletedDialogProps) => {
  const formatMillisecons = (milliSeconds: number) => {
    const pad = (num: number) => Math.round(num).toString().padStart(2, '0');

    const seconds = pad((milliSeconds / 1000) % 60);
    const minutes = pad((milliSeconds / (1000 * 60)) % 60);
    const hours = pad((milliSeconds / (1000 * 60 * 60)) % 24);

    return `${hours}:${minutes}:${seconds}`;
  }

  const difficultyText = () => {
    switch (props.settings.Difficulty) {
      case DIFFICULTY.VeryEasy:
        return 'a very easy';
      case DIFFICULTY.Easy:
        return 'an easy';
      case DIFFICULTY.Normal:
        return 'a medium';
      case DIFFICULTY.Hard:
        return 'a hard';
      case DIFFICULTY.VeryHard:
        return 'a very hard';
      default:
        return 'an unknown';
    }
  }

  const ellapsedTime = formatMillisecons(Date.now() - props.sudoku.getCreationTimestamp())

  return (
    <Dialog
      disableBackdropClick
      disableEscapeKeyDown
      maxWidth="xl"
      open={props.sudoku.isSolved()}
      fullWidth={true}
    >
      <DialogTitle id="confirmation-dialog-title">Done!</DialogTitle>
      <DialogContent>
        <Typography variant="body1" gutterBottom>
          You completed {difficultyText()} puzzle.
        </Typography>
        <Typography variant="body1">
          Elapsed time: {ellapsedTime}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => { props.createNewGame() }}>
          New Game
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default withStyles(styles)(CompletedDialog);