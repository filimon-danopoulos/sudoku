// @ts-check

import eslint from '@eslint/js';
import tslint from 'typescript-eslint';
import prettier from 'eslint-config-prettier';
import globals from 'globals';

export default tslint.config(
  {
    ignores: ['node_modules/*', 'dist/*', 'package-lock.json'],
  },
  eslint.configs.recommended,
  ...tslint.configs.strict,
  prettier,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.browser,
      },
    },
  }
);
