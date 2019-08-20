import { MODE } from '../store/types';
import { DIFFICULTY } from './Difficulty';

const SETTINGS_KEY = 'SETTINGS';

export default class Settings {
  private notesEnabled: boolean;
  private nightModeEnabled: boolean;
  private inputMode: MODE;
  private difficulty: DIFFICULTY;
  private progressEnabled: boolean;
  private markCompletedNumbersEnabled: boolean;

  constructor() {
    this.notesEnabled = true;
    this.nightModeEnabled = false;
    this.inputMode = MODE.Input;
    this.difficulty = DIFFICULTY.Normal;
    this.progressEnabled = true;
    this.markCompletedNumbersEnabled = true;
    this.readSettingsFromLocalStorage();
  }

  public get NotesEnabled(): boolean {
    return this.notesEnabled;
  }

  public get NightModeEnabled(): boolean {
    return this.nightModeEnabled;
  }

  public get ProgressEnabled(): boolean {
    return this.progressEnabled;
  }

  public get MarkCompletedNumbersEnabled(): boolean {
    return this.markCompletedNumbersEnabled;
  }

  public get InputMode(): MODE {
    return this.inputMode;
  }

  public get Difficulty(): DIFFICULTY {
    return this.difficulty;
  }

  private readSettingsFromLocalStorage() {
    let settingsString = window.localStorage[SETTINGS_KEY];
    if (!settingsString) {
      this.saveSettingsToLocalStorage();
    } else {
      const settings = JSON.parse(settingsString);
      Object.keys(settings).forEach(key => {
        switch (key) {
          case 'notesEnabled':
            return (this.notesEnabled = settings[key] === true);
          case 'nightModeEnabled':
            return (this.nightModeEnabled = settings[key] === true);
          case 'progressEnabled':
            return (this.progressEnabled = settings[key] === true);
          case 'markCompletedNumbersEnabled':
            return (this.markCompletedNumbersEnabled = settings[key] === true);
          case 'inputMode':
            return (this.inputMode = +settings[key] as MODE);
          case 'difficulty':
            return (this.difficulty = +settings[key] as DIFFICULTY);
        }
      });
    }
  }

  public toggleNotesEnabled(): Settings {
    this.notesEnabled = !this.notesEnabled;
    if (!this.notesEnabled) {
      this.inputMode = MODE.Input;
    }
    this.saveSettingsToLocalStorage();
    return new Settings();
  }

  public toggleNightModeEnabled(): Settings {
    this.nightModeEnabled = !this.nightModeEnabled;
    this.saveSettingsToLocalStorage();
    return new Settings();
  }

  public toggleProgressEnabled(): Settings {
    this.progressEnabled = !this.progressEnabled;
    this.saveSettingsToLocalStorage();
    return new Settings();
  }

  public toggleMarkCompletedNumbersEnabled(): Settings {
    this.markCompletedNumbersEnabled = !this.markCompletedNumbersEnabled;
    this.saveSettingsToLocalStorage();
    return new Settings();
  }

  public setInputMode(mode: MODE): Settings {
    this.inputMode = mode;
    this.saveSettingsToLocalStorage();
    return new Settings();
  }

  public setDifficulty(difficulty: DIFFICULTY): Settings {
    this.difficulty = difficulty;
    this.saveSettingsToLocalStorage();
    return new Settings();
  }

  private saveSettingsToLocalStorage(): void {
    window.localStorage.setItem(
      SETTINGS_KEY,
      JSON.stringify({
        notesEnabled: this.notesEnabled,
        nightModeEnabled: this.nightModeEnabled,
        progressEnabled: this.progressEnabled,
        markCompletedNumbersEnabled: this.markCompletedNumbersEnabled,
        inputMode: this.inputMode,
        difficulty: this.difficulty
      })
    );
  }
}
