import styles from './sudoku-header.css' with { type: 'css' };

export class SudokuHeaderElement extends HTMLElement {
  constructor() {
    super();

    const $root = this.attachShadow({
      mode: 'open',
    });
    $root.adoptedStyleSheets.push(styles);
    $root.innerHTML = `
      <slot name="difficulty"></slot>
      <slot name="action"></slot>
    `;
  }
}

if (!customElements.get('sudoku-header')) {
  customElements.define('sudoku-header', SudokuHeaderElement);
}
