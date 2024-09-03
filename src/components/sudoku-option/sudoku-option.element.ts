import style from './sudoku-option.css' with { type: 'css' };

import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('sudoku-option')
export class SudokuOptionElement extends LitElement {
  static styles = [style];

  @property({ attribute: 'disabled', type: Boolean })
  accessor disabled = false;

  render() {
    return html` <slot></slot> `;
  }
}
