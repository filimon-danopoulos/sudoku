import style from './sudoku-board.css' with { type: 'css' };
import { html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('sudoku-board')
export class SudokuBoardElement extends LitElement {
  static styles = [style];

  render() {
    return html`
      <div class="sudoku-board">
        <slot></slot>
      </div>
    `;
  }
}
