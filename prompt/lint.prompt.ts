/*
 * @Author: liya
 * @Date: 2023-09-08 19:05:34
 * @LastEditors: liya
 * @LastEditTime: 2023-09-11 16:53:47
 * @Description: 工程化配置
 */
import inquirer from 'inquirer';
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
export const lintChoose = async (name: string) => {
  const answer = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'overwrite',
      message: `The "${name}" already exists. Do you want to overwrite it?`
    }
  ]);
  return answer.overwrite;
};
