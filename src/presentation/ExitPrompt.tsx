import React from 'react';
import {
  withStyles,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  createStyles,
  WithStyles,
  Typography
} from '@material-ui/core';

const styles = () => createStyles({});

export interface IExitPromptProps extends WithStyles<typeof styles> {
  open: boolean;
  toggle: () => void;
}

const ExitPrompt: React.FunctionComponent<IExitPromptProps> = (props: IExitPromptProps) => {
  return (
    <Dialog maxWidth="xl" open={props.open} fullWidth={true}>
      <DialogTitle id="confirmation-dialog-title">Quit?</DialogTitle>
      <DialogContent>
        <Typography variant="body1">
          If you exit the application the current puzzle will be discarded. To quit the application
          press the back button again.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            window.history.pushState({}, '');
            props.toggle();
          }}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default withStyles(styles)(ExitPrompt);
