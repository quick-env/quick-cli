/*
 * @Author: liya
 * @Date: 2023-09-09 11:47:00
 * @LastEditors: liya
 * @LastEditTime: 2023-09-09 20:35:42
 * @Description: 工程化配置
 */
import {
  ESLINT_REG,
  COMMIT_LINT_REG,
  PRETTIER_REG,
  POST_CSS_REG,
  LINT_STAGED_REG,
  TSCONFIG_REG,
  VITE_REG,
} from '../constant';

export const LINT_MAP: { [key: string]: RegExp } = {
  eslint: ESLINT_REG,
  prettier: PRETTIER_REG,
  commitlint: COMMIT_LINT_REG,
  'lint-staged': LINT_STAGED_REG,
  postcss: POST_CSS_REG,
  tsconfig: TSCONFIG_REG,
  vite: VITE_REG,
};
export const LINT_FILE_MAP: {
  [key: string]: {
    download: string;
    origin: string;
  };
} = {
  eslint: {
    origin: 'lint/eslint/.eslintrc.cjs',
    download: '.eslintrc.cjs',
  },
  eslintignore: {
    origin: 'lint/eslint/.eslintignore',
    download: '.eslintignore',
  },
  prettier: {
    origin: 'lint/prettier/.prettierrc.js',
    download: '.prettierrc.js',
  },
  prettierignore: {
    origin: 'lint/prettier/.prettierignore',
    download: '.prettierignore',
  },
  commitlint: {
    origin: 'lint/commitlint/commitlint.config.ts',
    download: 'commitlint.config.ts',
  },
  'lint-staged': {
    origin: 'lint/commitlint/commitlint.config.ts',
    download: 'commitlint.config.ts',
  },
  postcss: {
    origin: 'lint/postcss/postcss.config.js',
    download: 'postcss.config.js',
  },
  tsconfig: {
    origin: 'config/tsconfig.app.json',
    download: 'tsconfig.test.json',
  },
  vite: {
    origin: 'build/vite/vite.config.ts',
    download: 'vite.config.ts',
  },
};
