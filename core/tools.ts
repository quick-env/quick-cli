/*
 * @Author: liya
 * @Date: 2024-01-22 16:27:45
 * @LastEditors: liya
 * @LastEditTime: 2024-01-22 17:32:02
 * @Description: 添加构建工具
 */
import fs from 'fs';
import chalk from 'chalk';
class BuildTools {
  private root: string = process.cwd();
  /**
   * 检查是否为根目录
   * @returns boolean
   */
  checkIsRoot(): boolean {
    if (fs.existsSync(`${this.root}/package.json`)) {
      return true;
    }
    return false;
  }
  /**
   * 检查是否为src/main为入口
   * @returns boolean
   */
  checkIsMain(): boolean {
    if(fs.existsSync(`${this.root}/src`)) {
      return true
    }
    if(fs.existsSync(`${this.root}/src/main.ts`)) {
      return true
    }
    return false;
  }
  /**
   * 下载文件到构建配置到本地
   * @param { string } tool
   */
  _download(tool: string) {
    const isRoot = this.checkIsRoot();
    const isMain = this.checkIsMain();
    if (!isRoot) {
      console.log(chalk.red(`当前执行目录不是根目录`));
      process.exit(1);
    }
    if (!isMain) {
      console.log(chalk.red(`src目录不存在main.ts文件`));
      process.exit(1);
    }
  }
}

export default new BuildTools();
