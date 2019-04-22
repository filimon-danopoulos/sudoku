import React, { Component } from 'react';
import { createStyles, withStyles, WithStyles, Theme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListSubheader from '@material-ui/core/ListSubheader';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { DIFFICULTY } from '../models/Difficulty';
import { changeDifficulty, validateSolution, createNewGame, toggleNightMode, resetSudoku, fillCandidates } from '../store/actions';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';

const styles = (theme: Theme) => createStyles({
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
  drawerPaper: {
    [theme.breakpoints.down('xs')]: {
      minWidth: '70%'
    },
    [theme.breakpoints.up('sm')]: {
      minWidth: '40%'
    },
    [theme.breakpoints.up('lg')]: {
      minWidth: '30%'
    }
  },
  notesToggle: {
    color: theme.palette.common.white
  },
  snackbar: {
    color: theme.palette.type === "dark" ? theme.palette.common.black : theme.palette.primary.contrastText
  }
});

export interface ITopBarProps extends WithStyles<typeof styles> {
  difficulty: DIFFICULTY;
  changeDifficulty: typeof changeDifficulty;
  validateSolution: typeof validateSolution;
  createNewGame: typeof createNewGame;
  toggleNightMode: typeof toggleNightMode;
  nightMode: boolean;
  resetSudoku: typeof resetSudoku;
  fillCandidates: typeof fillCandidates;
}
export interface ITopBarState {
  drawerOpen: boolean;
  showSnackbar: boolean;
}

const DIFFICUTIES = [{
  difficulty: DIFFICULTY.VeryEasy,
  label: "Very Easy"
}, {
  difficulty: DIFFICULTY.Easy,
  label: "Easy"
}, {
  difficulty: DIFFICULTY.Normal,
  label: "Normal"
}, {
  difficulty: DIFFICULTY.Hard,
  label: "Hard"
}, {
  difficulty: DIFFICULTY.VeryHard,
  label: "Very Hard"
}]

class TopBar extends Component<ITopBarProps, ITopBarState> {
  constructor(props: ITopBarProps) {
    super(props);
    this.state = {
      drawerOpen: false,
      showSnackbar: false
    }
  }

  public render(): JSX.Element {
    const { classes } = this.props;
    return (
      <React.Fragment>
        <AppBar position="static">
          <Toolbar>
            <IconButton className={classes.menuButton} color="inherit" onClick={() => this.openDrawer()}>
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" color="inherit" className={classes.grow}>
              {this.getBarText()}
            </Typography>
            <FormControlLabel
              classes={{ label: classes.notesToggle }}
              label="Night mode"
              labelPlacement="start"
              onClick={() => this.props.toggleNightMode()}
              control={<Switch checked={this.props.nightMode} />}
            />
          </Toolbar>
        </AppBar>
        <Drawer variant="temporary" classes={{ paper: classes.drawerPaper }} open={this.state.drawerOpen} onClose={() => this.closeDrawer()}>
          <List>
            <ListSubheader>Puzzle</ListSubheader>
            <Divider />
            <ListItem button onClick={() => this.createNewGame()}>
              <ListItemText primary="New game" />
            </ListItem>
            <ListItem button onClick={() => this.reset()} >
              <ListItemText primary="Reset" />
            </ListItem>
            <ListItem button onClick={() => this.validate()} >
              <ListItemText primary="Show invalid cells" />
            </ListItem>
            <ListItem button onClick={() => this.fillCandidates()} >
              <ListItemText primary="Add notes" />
            </ListItem>
            <Divider />
            <ListSubheader>Difficulty</ListSubheader>
            <Divider />
            {this.renderDifficulties()}
          </List>
        </Drawer>
      </React.Fragment>
    );
  }

  private openDrawer(): void {
    this.setState({
      drawerOpen: true
    });
  }

  private closeDrawer(): void {
    this.setState({
      drawerOpen: false
    });
  }

  private renderDifficulties(): JSX.Element[] {
    return DIFFICUTIES.map(option => (
      <ListItem
        button
        key={option.difficulty}
        selected={this.props.difficulty === option.difficulty}
        onClick={() => this.setDifficulty(option.difficulty)}>
        <ListItemText primary={option.label} />
      </ListItem>
    ));
  }

  private setDifficulty(difficulty: DIFFICULTY): void {
    this.closeDrawer();
    this.props.changeDifficulty(difficulty);
  }

  private validate(): void {
    this.closeDrawer();
    this.props.validateSolution();
  }

  private getBarText(): string {
    const difficulty = DIFFICUTIES.find(option => option.difficulty === this.props.difficulty);
    if (difficulty) {
      return `${difficulty.label}`;
    }
    return "";
  }
  private createNewGame(): void {
    this.closeDrawer();
    this.props.createNewGame();
  }

  private reset(): void {
    this.closeDrawer();
    this.props.resetSudoku();
  }

  private fillCandidates(): void {
    this.closeDrawer();
    this.props.fillCandidates();
  }
}

export default withStyles(styles)(TopBar);