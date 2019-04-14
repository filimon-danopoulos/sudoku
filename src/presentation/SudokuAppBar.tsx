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
import { changeDifficulty, validateSolution, createNewGame, setMode } from '../store/actions';
import MenuItem from '@material-ui/core/MenuItem';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { MODE } from '../store/types';

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
  }
});

export interface ISudokuAppBarProps extends WithStyles<typeof styles> {
  difficulty: DIFFICULTY;
  mode: MODE;

  changeDifficulty: typeof changeDifficulty;
  validateSolution: typeof validateSolution;
  createNewGame: typeof createNewGame;
  setMode: typeof setMode;
}
export interface ISudokuAppBarState {
  drawerOpen: boolean;
}

const DIFFICUTIES = [{
  difficulty: DIFFICULTY.Easy,
  label: "Easy"
}, {
  difficulty: DIFFICULTY.VeryEasy,
  label: "Very Easy"
}, {
  difficulty: DIFFICULTY.Normal,
  label: "Normal"
}, {
  difficulty: DIFFICULTY.Hard,
  label: "Hard"
}, {
  difficulty: DIFFICULTY.VeryHard,
  label: "Very Hard"
}, {
  difficulty: DIFFICULTY.Insane,
  label: "Insane"
}]

class SudokuAppBar extends Component<ISudokuAppBarProps, ISudokuAppBarState> {
  constructor(props: ISudokuAppBarProps) {
    super(props);
    this.state = {
      drawerOpen: false
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
              label="Take Notes"
              labelPlacement="start"
              onClick={() => this.toggleMode()}
              control={
                <Switch checked={this.props.mode === MODE.Note} />
              }
            />
          </Toolbar>
        </AppBar>
        <Drawer variant="temporary" classes={{ paper: classes.drawerPaper }} open={this.state.drawerOpen} onClose={() => this.closeDrawer()}>
          <List>
            <ListSubheader inset>Puzzle</ListSubheader>
            <Divider />
            <ListItem button onClick={() => this.props.createNewGame()}>
              <ListItemText primary="New game" />
            </ListItem>
            <ListItem button>
              <ListItemText primary="Reset" />
            </ListItem>
            <ListItem button>
              <ListItemText primary="Validate" onClick={() => this.validate()} />
            </ListItem>
            <Divider />
            <ListSubheader inset>Difficulty</ListSubheader>
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
    this.props.validateSolution()
  }

  private getBarText(): string {
    const difficulty = DIFFICUTIES.find(option => option.difficulty === this.props.difficulty);
    if (difficulty) {
      return `${difficulty.label} Puzzle`;
    }
    return "";
  }

  private toggleMode(): void {
    if (this.props.mode === MODE.Note) {
      this.props.setMode(MODE.Input);
    } else {
      this.props.setMode(MODE.Note);
    }
  }
}

export default withStyles(styles)(SudokuAppBar);