import styles from './sudoku-option.css' with { type: 'css' };

export class SudokuOptionElement extends HTMLElement {
  constructor() {
    super();

    const $root = this.attachShadow({
      mode: 'open',
    });
    $root.adoptedStyleSheets.push(styles);
    $root.innerHTML = `
      <slot></slot>
    `;
  }
}

if (!customElements.get('sudoku-option')) {
  customElements.define('sudoku-option', SudokuOptionElement);
}
