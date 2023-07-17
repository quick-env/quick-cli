/*
 * @Author: liya
 * @Date: 2023-05-30 10:11:13
 * @LastEditors: liya
 * @LastEditTime: 2023-07-17 20:53:57
 * @Description: 下载github配置到本地
 */
const { fileRequest } = require('down-git-files');
const pathMap = {
  rollup: 'rollup',
  webpack: 'webpack',
  vite: 'vite',
  eslint: 'eslint',
  electronBuilder: 'electron-builder',
  stylelint: 'stylelint',
  commitlint: 'commitlint',
  husky: 'husky',
};
/**
 * 加载github配置到本地
 * @param { string } name
 */
export const addConfig = async (name) => {
  const path = pathMap[name];
  const response = await fileRequest({
    user: 'lee3719',
    repo: 'quick-env/quick-config',
    path: 'commitlint.config.js',
    branch: 'main',
  });
  console.log(`response --->`, response);
};
