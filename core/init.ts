/*
 * @Author: liya
 * @Date: 2023-09-04 18:17:36
 * @LastEditors: liya
 * @LastEditTime: 2023-09-04 19:00:45
 * @Description: 创建工程模板
 */
import path from 'path';
import chalk from 'chalk';
import shell from 'shelljs';
import QuickInstall from './install';
import FileHelper from '../utils/file';
import { checkVersion } from '../utils/check';
import download from 'download-git-repo';
import { TEMPLATE_LIST } from '../config/template';
import compileVue from '../compile/vue';
import compileNest from '../compile/nest';
import compileReact from '../compile/react';
const baseDir = process.cwd();
const fileHelper = new FileHelper();

export default class QuickInit {
  private projectName: string;
  private rootDir: string;
  constructor(name: string) {
    this.projectName = name;
    this.rootDir = path.join(baseDir, name);
  }
  /**
   * 检查当前目录下是否存在相同的文件名称
   */
  _checkProject() {
    const isExit = fileHelper.isExit(this.rootDir);
    if (isExit) {
      chalk.red(`${this.projectName} already exists`);
    }
  }
  /**
   * 下载工程模板到本地
   */
  _download() {}
  /**
   * 编译工程模板
   */
  _compile() {}
  /**
   * 安装项目依赖
   */
  _install() {}
}
