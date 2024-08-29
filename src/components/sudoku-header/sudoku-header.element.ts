import style from './sudoku-header.css' with { type: 'css' };

import { html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('sudoku-header')
export class SudokuHeaderElement extends LitElement {
  static styles = [style];
  render() {
    return html`
      <slot name="difficulty"></slot>
      <slot name="action"></slot>
    `;
  }
}
