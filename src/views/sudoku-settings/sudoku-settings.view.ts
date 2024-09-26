import '../../elements/sudoku-button/sudoku-button.element';
import '../../elements/sudoku-icon/sudoku-icon.element';

import style from './sudoku-settings.css' with { type: 'css' };

import { html, LitElement, PropertyValues } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { difficulty } from '../../storage/puzzle-storage';
import { consume } from '@lit/context';
import { difficultyContext } from '../../elements/sudoku-context/difficulty-context';
import {
  defaultSettings,
  settingData,
  settings,
  settingsContext,
} from '../../elements/sudoku-context/settings-context';

@customElement('sudoku-settings-view')
export class SudokuSettingsView extends LitElement {
  static styles = [style];

  @consume({ context: difficultyContext, subscribe: true })
  @state()
  private _difficulty: difficulty = 'moderate';

  @consume({ context: settingsContext, subscribe: true })
  @state()
  private _settings = defaultSettings;

  @state()
  private accessor _newDifficulty = 'moderate' as difficulty;

  @state()
  private accessor _newSettings = this.#createNewSettings(defaultSettings);

  protected willUpdate(changed: PropertyValues): void {
    if (changed.has('_difficulty')) {
      this._newDifficulty = this._difficulty;
    }

    if (changed.has('_settings')) {
      this._newSettings = this.#createNewSettings(this._settings);
    }
  }

  render() {
    return html`
      <sudoku-shell view="solver">
        <span slot="header-title">Settings</span>
        <div class="content" slot="content">
          <div class="title">Difficulty</div>
          ${(['easy', 'moderate', 'hard', 'extreme'] as const).map(
            (difficulty) => html`
              <div class="option" @click=${() => (this._newDifficulty = difficulty)}>
                <sudoku-icon
                  icon=${this._newDifficulty === difficulty ? 'radio-checked' : 'radio-empty'}
                ></sudoku-icon>
                <span class="difficulty">${difficulty}</span>
              </div>
            `
          )}

          <div class="title">highlights</div>
          <div
            class="option"
            @click=${() => {
              const settings = structuredClone(this._newSettings);
              settings.highlights.cell = !settings.highlights.cell;
              this._newSettings = settings;
            }}
          >
            <sudoku-icon
              icon=${this._newSettings.highlights.cell ? 'checkbox-checked' : 'checkbox-empty'}
            ></sudoku-icon>
            <span>Cells</span>
          </div>
          <div
            class="option"
            @click=${() => {
              const settings = structuredClone(this._newSettings);
              settings.highlights.candidate = !settings.highlights.candidate;
              this._newSettings = settings;
            }}
          >
            <sudoku-icon
              icon=${this._newSettings.highlights.candidate ? 'checkbox-checked' : 'checkbox-empty'}
            ></sudoku-icon>
            <span>Candidates</span>
          </div>
          <div
            class="option"
            @click=${() => {
              const settings = structuredClone(this._newSettings);
              settings.highlights.multiple = !settings.highlights.multiple;
              this._newSettings = settings;
            }}
          >
            <sudoku-icon
              icon=${this._newSettings.highlights.multiple ? 'checkbox-checked' : 'checkbox-empty'}
            ></sudoku-icon>
            <span>Multiple</span>
          </div>
        </div>

        <sudoku-button
          slot="footer-start"
          @click=${this.#discardChanges}
          ?disabled=${!this.#hasChanges}
        >
          <sudoku-icon icon="clear"></sudoku-icon>
        </sudoku-button>
        <sudoku-button slot="footer-end" @click=${this.#saveChanges} ?disabled=${!this.#hasChanges}>
          <sudoku-icon icon="checkmark"></sudoku-icon>
        </sudoku-button>
      </sudoku-shell>
    `;
  }

  #createNewSettings(settings: settings): settingData {
    return {
      candidates: settings.candidates,
      highlights: structuredClone(settings.highlights),
    };
  }

  #discardChanges() {
    window.location.hash = '#/sudoku';
  }

  #saveChanges() {
    let nextPage = '#/sudoku';
    this._settings.updateSettings(this._newSettings);
    if (this._difficulty !== this._newDifficulty) {
      nextPage = `#/sudoku/new/${this._newDifficulty}`;
    }
    window.location.hash = nextPage;
  }

  get #hasChanges() {
    return (
      JSON.stringify(this.#createNewSettings(this._settings)) !==
        JSON.stringify(this._newSettings) || this._difficulty !== this._newDifficulty
    );
  }
}
