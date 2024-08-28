import styles from './sudoku-board.css' with { type: 'css' };

const $template = document.createElement('template');
$template.innerHTML = `
  <div class="sudoku-board">
    <slot></slot>
  </div>
`;

export class SudokuBoardElement extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({
      mode: 'open',
    });
    this.shadowRoot?.adoptedStyleSheets.push(styles);
    const $content = document.importNode($template.content, true);
    this.shadowRoot?.appendChild($content);
  }
}

if (!customElements.get('sudoku-board')) {
  customElements.define('sudoku-board', SudokuBoardElement);
}
