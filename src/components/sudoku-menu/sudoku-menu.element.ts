import '../sudoku-button/sudoku-button.element';

import styles from './sudoku-menu.css' with { type: 'css' };
import ellipsisIcon from '../../icons/ellipsis.svg';

export class SudokuMenuElement extends HTMLElement {
  constructor() {
    super();

    const $root = this.attachShadow({
      mode: 'open',
    });
    $root.adoptedStyleSheets.push(styles);
    $root.innerHTML = `
      <sudoku-button>
        ${ellipsisIcon}
      </sudoku-button>
      <div class="sudoku-menu" hidden>
        <slot></slot>
      </div>
    `;
  }

  connectedCallback() {
    const $button = this.shadowRoot?.querySelector(
      'sudoku-button'
    ) as HTMLElement;
    const $menu = this.shadowRoot?.querySelector('.sudoku-menu') as HTMLElement;
    $button?.addEventListener('click', () => {
      if ($menu.hidden) {
        $menu.hidden = false;
        $button.toggleAttribute('toggled', false);
        document.addEventListener(
          'mouseup',
          () => {
            $menu.hidden = true;
            $button.toggleAttribute('toggled', false);
          },
          { once: true }
        );
      } else {
        $menu.hidden = true;
        $button.toggleAttribute('toggled', true);
      }
    });
  }
}

if (!customElements.get('sudoku-menu')) {
  customElements.define('sudoku-menu', SudokuMenuElement);
}
