import style from './sudoku-button.css' with { type: 'css' };

import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('sudoku-button')
export class SudokuButtonElement extends LitElement {
  static styles = [style];

  @property({ attribute: 'disabled', type: Boolean })
  accessor disabled = false;

  render() {
    return html`
      <button ?disabled=${this.disabled}>
        <slot></slot>
      </button>
    `;
  }
}
