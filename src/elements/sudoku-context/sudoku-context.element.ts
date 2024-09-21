import style from './sudoku-context.css' with { type: 'css' };

import { html, LitElement } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { difficulty } from '../../storage/puzzle-storage';
import { provide } from '@lit/context';
import { difficultyContext } from './difficulty-context';
import { settingData, settings, settingsContext } from './settings-context';
import { loadSettings, saveSettings } from '../../storage/settings-storage';

@customElement('sudoku-context')
export class SudokuContextElement extends LitElement {
  static styles = [style];

  @provide({ context: difficultyContext })
  @property({ attribute: false })
  difficulty: difficulty = 'moderate';

  @provide({ context: settingsContext })
  @state()
  settings: settings;

  constructor() {
    super();
    this.settings = {
      ...loadSettings(),
      updateSettings: this.#updateSettings,
    };
  }

  render() {
    return html`<slot></slot>`;
  }

  #updateSettings = (settings: settingData) => {
    this.settings = Object.assign({}, this.settings, settings);
    saveSettings(this.settings);
  };
}
