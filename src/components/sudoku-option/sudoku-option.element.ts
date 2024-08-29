import style from './sudoku-option.css' with { type: 'css' };

import { html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('sudoku-option')
export class SudokuOptionElement extends LitElement {
  static styles = [style];
  render() {
    return html` <slot></slot> `;
  }
}
