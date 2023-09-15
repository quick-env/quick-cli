/*
 * @Author: liya
 * @Date: 2023-09-04 18:34:14
 * @LastEditors: liya
 * @LastEditTime: 2023-09-04 18:35:51
 * @Description: node版本检查
 */
import semver from 'semver';

export const checkVersion = () => {
  const requiredVersion = '>=18.0.0'; // 指定所需的最低版本号
  if (!semver.satisfies(process.version, requiredVersion)) {
    console.error(
      `Required Node.js version ${requiredVersion} not satisfied with current version ${process.version}.`
    );
    process.exit(1);
  }
};
