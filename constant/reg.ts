/*
 * @Author: liya
 * @Date: 2023-09-08 11:11:49
 * @LastEditors: liya
 * @LastEditTime: 2023-09-08 18:50:00
 * @Description: lint相关文件检查
 */
// 匹配commitlint正则
export const COMMIT_LINT_REG =
  /^\.commitlintrc(\.(json|yaml|yml|js|cjs|ts|cts))|^commitlint\.config\.(js|cjs|mjs|ts)$/;
// 匹配eslint正则
export const ESLINT_REG = /\.eslintrc\.(js|cjs|yaml|yml|json)$/;
// 匹配prettier正则
export const PRETTIER_REG =
  /^\.prettierrc\.(json|yml|yaml|json5|js|cjs|ts)$|^prettier\.config\.(js|cjs|ts)$/;
//
export const POST_CSS_REG =
  /^\.postcssrc\.(json|yml|yaml|json5|js|cjs|ts|mjs)$|^postcss\.config\.(js|cjs|mjs|ts)$/;
//
export const LINT_STAGED_REG =
  /^\.lint-stagedrc\.(js|yml|json5|yaml|cjs|mjs|ts)$|^lint-staged\.config\.(js|ts|mjs|cjs)$/;
// 匹配tsconfig正则
export const TSCONFIG_REG = /^tsconfig(\.app)?\.json$/;
// 匹配vite正则
export const VITE_REG = /^vite.config.(js|ts)$/;
