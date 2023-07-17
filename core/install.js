/*
 * @Author: liya
 * @Date: 2023-05-18 19:08:54
 * @LastEditors: liya
 * @LastEditTime: 2023-07-17 20:33:35
 * @Description: 安装项目依赖、其他安装包
 */
'use strict';
const chalk = require('chalk');
const which = require('which');
const { spawn } = require('child_process');
class installService {
  /**
   * @description 检查本地是否安装了包管理工具，设置包管理工具源
   */
  static checkNpm() {
    let installTools = ['npm', 'cnpm', 'pnpm', 'yarn'];
    for (let i = 0, len = installTools.length; i < len; i++) {
      try {
        which.sync(installTools[i]);
        console.log(`npm used ${installTools[i]}`);
        return installTools[i];
      } catch (error) {
        console.error(`please install ${installTools[i]}`);
      }
    }
  }

  /**
   * @description: 检查某个安装包是否存在
   * @param {*} pkgName npm包名  code: 0：成功  1-255：失败
   * @return {Boolean} 是否已安装
   */
  static checkNpmInstalled(pkgName) {
    const { code = 1 } = this.execCmd(['ls', pkgName]);
    return !code;
  }

  /**
   * @description 开启子进程执行安装任务
   * @param { string[] } args 命令参数
   * @param { function } fn 回调函数
   */
  static execCmd(args, fn) {
    const cmd = this.checkNpm();
    args = args || [];
    let runner = spawn(cmd, args, {
      stdio: 'inherit',
    });
    runner.on('close', (code) => {
      if (fn) {
        fn(code);
      }
    });
  }
  /**
   * @description 执行shell脚本
   * @param { string[] } args 入参
   * @param { function } fn 执行回调
   */
  static execShell(fn) {
    let runner = spawn('sh', [download], {
      stdio: 'inherit',
    });
    runner.on('close', (code) => {
      if (fn) {
        fn(code);
      }
    });
  }
  /**
   * 检测安装包是否已安装，已安装输出提示，没安装执行安装操作
   */
  static handleCheckDependencies(pkg) {
    if (this.checkNpmInstalled(pkg)) {
      console.log(symbols.info, chalk.green(`${pkg} has already installed`));
      return;
    }
    this.execCmd(['install', pkg, '-D'], () => {
      console.log(symbols.success, chalk.green(`${pkg} installed`));
    });
  }
}

module.exports = installService;
