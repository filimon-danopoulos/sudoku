import { createContext } from '@lit/context';

export const defaultSettings = {
  candidates: true,
  highlights: {
    candidate: true,
    cell: true,
    multiple: true,
  },
  updateSettings() {},
} as settings;

export type settingData = {
  candidates: boolean;
  highlights: {
    candidate: boolean;
    cell: boolean;
    multiple: boolean;
  };
};

export type settings = settingData & {
  updateSettings(settings: settingData): void;
};

export const settingsContext = createContext<settings>(Symbol('settings-context'));
