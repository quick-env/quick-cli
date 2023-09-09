/*
 * @Author: liya
 * @Date: 2023-09-08 19:05:34
 * @LastEditors: liya
 * @LastEditTime: 2023-09-09 20:35:16
 * @Description: 工程化配置
 */
export const LINT_PROMPT = [
  {
    type: 'checkbox',
    message: '请选择工程化配置',
    name: 'lintConfig',
    choices: [
      'eslint',
      'prettier',
      'commitlint',
      'husky',
      'lint-staged',
      'postcss',
      'tsconfig',
      'vite',
      'none',
    ],
  },
];
export const lintChoose = (name: string) => {
  return [
    {
      type: 'confirm',
      message: `项目中存在${name}配置, 是否覆盖本地配置`,
      name: 'lintCover',
      choices: ['Yes', 'No'],
    },
  ];
};
