import style from './sudoku-footer.css' with { type: 'css' };

import { html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('sudoku-footer')
export class SudokuFooterElement extends LitElement {
  static styles = [style];
  render() {
    return html`
      <slot name="start"></slot>
      <slot name="middle"></slot>
      <slot name="end"></slot>
    `;
  }
}
