
import { DOWNLOAD_CONFIG } from './download';

export { DOWNLOAD_CONFIG };

export const BUILD_TOOL_CHOICES = ['vite', 'rspack', 'webpack', 'rollup', 'none'] as const;

export type BuildToolName = (typeof BUILD_TOOL_CHOICES)[number];

export interface BuildFileSpec {
  origin: string;
  download: string;
}

export const BUILD_FILE_MAP: Record<string, BuildFileSpec[]> = {
  vite: [
    {
      origin: 'build/vite/vite.config.ts',
      download: 'vite.config.ts',
    },
  ],
  rspack: [
    {
      origin: 'build/rspack/rspack.config.ts',
      download: 'rspack.config.ts',
    },
  ],
  rollup: [
    {
      origin: 'build/rollup/rollup.config.ts',
      download: 'rollup.config.ts',
    },
  ],
  webpack: [
    {
      origin: 'build/webpack/webpack.default.config.ts',
      download: 'webpack.default.config.ts',
    },
    {
      origin: 'build/webpack/webpack.prod.config.ts',
      download: 'webpack.prod.config.ts',
    },
    {
      origin: 'build/webpack/webpack.dev.config.ts',
      download: 'webpack.dev.config.ts',
    }
  ],
};

export const BUILD_PKG_LIST: Record<string, string[]> = {
  rspack: ['@rspack/cli', '@rspack/core'],
  webpack: ['webpack', 'webpack-cli', 'webpack-merge'],
};

export const BUILD_SCRIPTS: Record<string, string[]> = {
  rspack: [
    'npm pkg set scripts.rspack:dev="rspack serve"',
    'npm pkg set scripts.rspack:build="rspack build"',
  ],
  webpack: [
    'npm pkg set scripts.webpack:dev="webpack serve --config webpack.default.config.ts"',
    'npm pkg set scripts.webpack:build="webpack --config webpack.prod.config.ts"',
  ],
};
