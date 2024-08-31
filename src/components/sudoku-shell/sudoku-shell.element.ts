import '../sudoku-header/sudoku-header.element';
import '../sudoku-footer/sudoku-footer.element';

import style from './sudoku-shell.css' with { type: 'css' };

import { html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('sudoku-shell')
export class SudokuShellElement extends LitElement {
  static styles = [style];

  render() {
    return html`
      <sudoku-header>
        <slot name="header-title" slot="title"></slot>
        <slot name="header-actions" slot="actions"></slot>
      </sudoku-header>
      <div class="content">
        <slot name="content"></slot>
      </div>
      <sudoku-footer>
        <slot name="footer-start" slot="start"></slot>
        <slot name="footer-middle" slot="middle"></slot>
        <slot name="footer-end" slot="end"></slot>
      </sudoku-footer>
    `;
  }
}
