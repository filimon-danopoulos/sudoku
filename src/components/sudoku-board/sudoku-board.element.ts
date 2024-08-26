import '../sudoku-cell/sudoku-cell.element';
import type { SudokuCelllement } from '../sudoku-cell/sudoku-cell.element';
import styles from './sudoku-board.css' with { type: 'css' };

const $template = document.createElement('template');
$template.innerHTML = `
  <div class="sudoku-board">
    ${Array.from({ length: 81 }, (_, i) => `<sudoku-cell column="${i % 9}" row="${Math.floor(i / 9)}" ></sudoku-cell>`).join('\n')}
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

  static get observedAttributes() {
    return ['puzzle'];
  }

  get puzzle() {
    return this.getAttribute('puzzle') ?? '';
  }
  set puzzle(puzzle: string) {
    this.setAttribute('puzzle', puzzle);
  }

  connectedCallback() {
    // if (this.hasAttribute('puzzle')) {
    // }
    this.#render();
  }

  #render() {
    const cells: SudokuCelllement[] = Array.from(
      this.shadowRoot?.querySelectorAll('sudoku-cell') ?? []
    );
    cells.forEach((cell, index) => {
      cell.value = Math.round(Math.random()) ? index.toString() : '';
      cell.solution = index.toString();
      cell.given = cell.value === cell.solution;
    });
  }
}

if (!customElements.get('sudoku-board')) {
  customElements.define('sudoku-board', SudokuBoardElement);
}
