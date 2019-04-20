import React, { Component } from "react";
import Row from "../models/Row";
import SudokuCell from "./SudokuCell";
import { createStyles, Theme, WithStyles, withStyles } from "@material-ui/core";
import { toggleCell } from "../store/actions";
import { MODE } from "../store/types";

const styles = (theme: Theme) => createStyles({
  sudokuRow: {
    display: 'flex',
    width: '100%'
  }
});

export interface ISudokuRowProps extends WithStyles<typeof styles> {
  row: Row;
  rowSize: number;
  toggleCell: typeof toggleCell;
  mode: MODE;
}

class SudokuRowComponent extends Component<ISudokuRowProps> {

  public render(): JSX.Element {
    const { classes } = this.props
    return (
      <div className={classes.sudokuRow}>
        {this.renderRow()}
      </div>
    );
  }

  private renderRow(): JSX.Element[] | null {
    return this.props.row
      .getCells()
      .map((c, i) => <SudokuCell mode={this.props.mode} toggleCell={this.props.toggleCell} cell={c} size={this.getCellSize()} key={i} />);
  }

  private getCellSize(): number {
    return this.props.rowSize / 9;
  }
}

export default withStyles(styles)(SudokuRowComponent);