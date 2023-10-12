/*
 * @Author: liya
 * @Date: 2023-09-04 18:34:14
 * @LastEditors: liya
 * @LastEditTime: 2023-10-10 18:13:22
 * @Description: node版本检查
 */
import semver from 'semver';
import chalk from 'chalk';
export const checkVersion = () => {
  const requiredVersion = '>=18.0.0'; // 指定所需的最低版本号
  if (!semver.satisfies(process.version, requiredVersion)) {
    console.error(
      '\n',
      chalk.red.bold(
        `Required Node.js version ${requiredVersion} not satisfied with current version ${process.version}.`
      ),
      '\n'
    );
    process.exit(1);
  }
};
