import { defaultSettings, settingData } from '../elements/sudoku-context/settings-context';

export const loadSettings = (): settingData => {
  return (
    JSON.parse(localStorage.getItem('settings') ?? 'null') ?? {
      candidates: defaultSettings.candidates,
      highlights: structuredClone(defaultSettings.highlights),
    }
  );
};

export const saveSettings = (settings: settingData) => {
  return localStorage.setItem('settings', JSON.stringify(settings));
};
