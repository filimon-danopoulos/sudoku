import style from './sudoku-controls.css' with { type: 'css' };

import { html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('sudoku-controls')
export class SudokuControlsElement extends LitElement {
  static styles = [style];
  render() {
    return html`
      <slot name="start"></slot>
      <slot name="middle"></slot>
      <slot name="end"></slot>
    `;
  }
}
