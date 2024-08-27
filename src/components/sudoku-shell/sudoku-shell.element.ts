import '../sudoku-board/sudoku-board.element';
import '../sudoku-header/sudoku-header.element';
import '../sudoku-input/sudoku-input.element';
import '../sudoku-controls/sudoku-controls.element';

import styles from './sudoku-shell.css' with { type: 'css' };

const $template = document.createElement('template');
$template.innerHTML = `
  <sudoku-header></sudoku-header>
  <div class="content">
    <sudoku-board></sudoku-board>
    <sudoku-input></sudoku-input>
  </div>
  <sudoku-controls></sudoku-controls>
`;

export class SudokuShellElement extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({
      mode: 'open',
    });
    this.shadowRoot?.adoptedStyleSheets.push(styles);
    const $content = document.importNode($template.content, true);
    this.shadowRoot?.appendChild($content);
  }

  static get observedAttributes() {
    return [];
  }
}

if (!customElements.get('sudoku-shell')) {
  customElements.define('sudoku-shell', SudokuShellElement);
}
