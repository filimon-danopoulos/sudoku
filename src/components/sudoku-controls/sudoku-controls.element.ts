import styles from './sudoku-controls.css' with { type: 'css' };

export class SudokuControlsElement extends HTMLElement {
  constructor() {
    super();
    const $root = this.attachShadow({
      mode: 'open',
    });
    $root.adoptedStyleSheets.push(styles);
    $root.innerHTML = `
      <slot name="start"></slot>
      <slot name="middle"></slot>
      <slot name="end"></slot>
    `;
  }
}

if (!customElements.get('sudoku-controls')) {
  customElements.define('sudoku-controls', SudokuControlsElement);
}
