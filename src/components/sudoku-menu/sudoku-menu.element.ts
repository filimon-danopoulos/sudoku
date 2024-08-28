import styles from './sudoku-menu.css' with { type: 'css' };
import ellipsisIcon from '../../icons/ellipsis.svg';

const $template = document.createElement('template');
$template.innerHTML = `
  <button>
    ${ellipsisIcon}
  </button>
  <div class="sudoku-menu" hidden>
    <slot></slot>
  </div>
`;

export class SudokuMenuElement extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({
      mode: 'open',
    });
    this.shadowRoot?.adoptedStyleSheets.push(styles);
    const $content = document.importNode($template.content, true);
    this.shadowRoot?.appendChild($content);
  }

  connectedCallback() {
    const $button = this.shadowRoot?.querySelector('button') as HTMLElement;
    const $menu = this.shadowRoot?.querySelector('.sudoku-menu') as HTMLElement;
    $button?.addEventListener('click', () => {
      if ($menu.hidden) {
        $menu.hidden = false;
        $button.toggleAttribute('open', false);
        document.addEventListener(
          'mouseup',
          () => {
            $menu.hidden = true;
            $button.toggleAttribute('open', false);
          },
          { once: true }
        );
      } else {
        $menu.hidden = true;
        $button.toggleAttribute('open', true);
      }
    });
  }
}

if (!customElements.get('sudoku-menu')) {
  customElements.define('sudoku-menu', SudokuMenuElement);
}
