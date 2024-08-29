import styles from './sudoku-board.css' with { type: 'css' };

export class SudokuBoardElement extends HTMLElement {
  constructor() {
    super();

    const $root = this.attachShadow({
      mode: 'open',
    });
    $root.adoptedStyleSheets.push(styles);
    $root.innerHTML = `
      <div class="sudoku-board">
        <slot></slot>
      </div>
    `;
  }
}

if (!customElements.get('sudoku-board')) {
  customElements.define('sudoku-board', SudokuBoardElement);
}
