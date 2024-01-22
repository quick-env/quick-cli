/*
 * @Author: liya
 * @Date: 2024-01-22 16:21:27
 * @LastEditors: liya
 * @LastEditTime: 2024-01-22 16:25:59
 * @Description: 构建工具配置
 */

export const BUILD_PROMPT = [
  {
    type: 'list',
    message: '请选择构建工具',
    name: 'buildConfig',
    choices: [
      'vite',
      'rspack',
      'webpack',
      'rollup',
      'none',
    ],
  },
];
