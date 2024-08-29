import styles from './sudoku-button.css' with { type: 'css' };

export class SudokuButtonElement extends HTMLElement {
  constructor() {
    super();

    const $root = this.attachShadow({
      mode: 'open',
    });
    $root.adoptedStyleSheets.push(styles);
    $root.innerHTML = `
      <button>
        <slot></slot>
      </button>
    `;
  }
}

if (!customElements.get('sudoku-button')) {
  customElements.define('sudoku-button', SudokuButtonElement);
}
