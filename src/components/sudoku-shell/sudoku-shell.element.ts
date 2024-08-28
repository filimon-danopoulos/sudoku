import '../sudoku-board/sudoku-board.element';
import '../sudoku-cell/sudoku-cell.element';
import '../sudoku-header/sudoku-header.element';
import '../sudoku-input/sudoku-input.element';
import '../sudoku-controls/sudoku-controls.element';

import styles from './sudoku-shell.css' with { type: 'css' };

import type { SudokuInputElement } from '../sudoku-input/sudoku-input.element';
import { SudokuCelllement } from '../sudoku-cell/sudoku-cell.element';

const $template = document.createElement('template');
$template.innerHTML = `
  <sudoku-header></sudoku-header>
  <div class="content">
    <sudoku-board>
      ${Array.from({ length: 81 }, (_, i) => `<sudoku-cell column="${i % 9}" row="${Math.floor(i / 9)}" ></sudoku-cell>`).join('\n')}
    </sudoku-board>
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

  loadPuzzle(puzzle: { solution: string; value: string }[]) {
    const cells: SudokuCelllement[] = Array.from(
      this.shadowRoot?.querySelectorAll('sudoku-cell') ?? []
    );
    cells.forEach((cell, index) => {
      cell.active = index === 0;
      cell.value = puzzle[index].value.toString();
      cell.solution = puzzle[index].solution.toString();
      cell.given = cell.value === cell.solution;
      cell.addEventListener('cell-activated', (e: Event) => {
        const $target = e.target as SudokuCelllement;
        cells.forEach(($cell) => {
          if ($cell !== $target) {
            $cell.active = false;
          }
        });
      });
    });

    const $input =
      this.shadowRoot?.querySelector<SudokuInputElement>('sudoku-input');
    $input?.addEventListener('input-value', (e: Event) => {
      const $cell = this.shadowRoot?.querySelector<SudokuCelllement>(
        'sudoku-cell[active]'
      );
      if ($cell) {
        $cell.value = (e as CustomEvent).detail;
      }
    });
    $input?.addEventListener('input-candidate', (e: Event) => {
      const $cell = this.shadowRoot?.querySelector<SudokuCelllement>(
        'sudoku-cell[active]'
      );
      if ($cell) {
        const candidate = (e as CustomEvent).detail;
        if ($cell.candidates.includes(candidate)) {
          $cell.candidates = $cell.candidates.filter((c) => c !== candidate);
        } else {
          $cell.candidates = $cell.candidates.concat([candidate]);
        }
      }
    });

    const $controls =
      this.shadowRoot?.querySelector<SudokuInputElement>('sudoku-controls');
    $controls?.addEventListener('clear', () => {
      const $cell = this.shadowRoot?.querySelector<SudokuCelllement>(
        'sudoku-cell[active]'
      );
      if ($cell) {
        $cell.value = '';
        $cell.candidates = [];
      }
    });
  }
}

if (!customElements.get('sudoku-shell')) {
  customElements.define('sudoku-shell', SudokuShellElement);
}
