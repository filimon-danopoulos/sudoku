import styles from './sudoku-input.css' with { type: 'css' };

export class SudokuInputElement extends HTMLElement {
  constructor() {
    super();

    const $root = this.attachShadow({
      mode: 'open',
    });
    $root.adoptedStyleSheets.push(styles);
    $root.innerHTML = `
      <div class="buttons">
      
        <button>1</button>
        <button>2</button>
        <button>3</button>
        <button>4</button>
        <button>5</button>
        <button>6</button>
        <button>7</button>
        <button>8</button>
        <button>9</button>
      </div>
      <div class="progress">
        <div class="indicator" style="width: 50%"></div>
      </div>
    `;
  }

  connectedCallback() {
    this.shadowRoot
      ?.querySelectorAll<HTMLButtonElement>('button')
      .forEach(($button) => {
        $button.addEventListener('pointerdown', () => {
          let isCandidate = false;
          // eslint-disable-next-line prefer-const
          let timeout: ReturnType<typeof setTimeout>;
          const emitInputEvent = () => {
            this.dispatchEvent(
              new CustomEvent(isCandidate ? 'input-candidate' : 'input-value', {
                detail: +($button.textContent as string),
              })
            );
            clearTimeout(timeout);
          };

          timeout = setTimeout(() => {
            isCandidate = true;
            emitInputEvent();
            $button.removeEventListener('pointerup', emitInputEvent);
          }, 200);

          $button.addEventListener('pointerup', emitInputEvent, {
            once: true,
          });
        });
      });
  }
}

if (!customElements.get('sudoku-input')) {
  customElements.define('sudoku-input', SudokuInputElement);
}
