/*
 * @Author: liya
 * @Date: 2023-09-09 11:47:00
 * @LastEditors: liya
 * @LastEditTime: 2023-09-14 16:15:14
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
} from '.'
// 检查项目中是否存在的正则
export const LINT_MAP: { [key: string]: RegExp } = {
	eslint: ESLINT_REG,
	prettier: PRETTIER_REG,
	commitlint: COMMIT_LINT_REG,
	'lint-staged': LINT_STAGED_REG,
	postcss: POST_CSS_REG,
	tsconfig: TSCONFIG_REG,
	vite: VITE_REG,
}
// lint配置文件github地址
export const LINT_FILE_MAP: {
	[key: string]: {
		download: string
		origin: string
	}
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
}
// set lint在package.json的执行命令
export const LINT_SCRIPTS: {
	[key: string]: string[]
} = {
	eslint: [
		`npm pkg set scripts.lint="eslint . --ext .vue,.js,.jsx,.mjs,.ts,.tsx,.cts,.mts --fix --ignore-path .eslintignore"`,
	],
	prettier: [`npm pkg set scripts.format="prettier --write src"`],
	commitlint: [
		`npm pkg set scripts.cm="git add . && git cz"`,
		`npm pkg set scripts.changelog="conventional-changelog -p angular -i CHANGELOG.md -s"`,
		`npm pkg set config.commitizen.path="./node_modules/cz-emoji-chinese"`,
	],
	'lint-staged': [
		`npm pkg set lint-staged='{"src/**/*.{ts,js,tsx,vue}": ["pnpm lint","pnpm format","pnpm changelog","git add ."]}' --json`,
	],
	husky: [
		'npx husky install',
		'npm pkg set scripts.prepare="husky install"',
		`npx husky add .husky/commit-msg 'npx --no -- commitlint --edit "$1"'`,
		`npx husky add .husky/pre-commit 'npx lint-staged'`,
	],
	vite: [
		`npm pkg set scripts.vite:dev="cross-env=dev vite"`,
		`npm pkg set scripts.vite:build="cross-env=prod vite build"`,
	],
}
// lint 安装包列表
export const LINT_PKG_LIST: { [key: string]: string[] } = {
	eslint: [
		'eslint@8',
		'eslint-config-prettier@9',
		'eslint-config-standard-with-typescript@39',
		'eslint-plugin-prettier@5',
		'eslint-plugin-vue@9',
		'@typescript-eslint/eslint-plugin@6',
		'@typescript-eslint/parser@6',
		'@vue/eslint-config-prettier@7',
		'@vue/eslint-config-typescript@11',
	],
	prettier: ['prettier@2'],
	commitlint: [
		'commitizen@4',
		'conventional-changelog-cli@4',
		'cz-emoji-chinese',
		'@commitlint/cli@17',
		'@commitlint/config-conventional@17',
	],
	'lint-staged': ['lint-staged@14'],
	husky: ['husky@8'],
	tsconfig: ['typescript@5', '@tsconfig/node18@2'],
	postcss: ['autoprefixer@10', 'postcss@8', 'postcss-nested@6', 'cssnano@6'],
	vite: [
		'@vitejs/plugin-legacy@4',
		'@vitejs/plugin-vue@4',
		'@vitejs/plugin-vue-jsx@3',
		'unplugin-auto-import',
		'unplugin-vue-components',
		'vite@4',
		'vite-plugin-html@3',
		'vite-plugin-remove-console@2',
	],
}
// 包含ignore的配置
export const hasIgnored: string[] = ['eslint', 'prettier'];
// 不需要设置script的工具
export const notRequired: string[] = ['tsconfig', 'postcss'];
// 无需下载配置文件的工具
export const notDownloadConfig: string[] = ['lint-staged', 'husky'];