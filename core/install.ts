/*
 * @Author: liya
 * @Date: 2023-09-04 18:23:56
 * @LastEditors: liya
 * @LastEditTime: 2023-09-14 19:15:03
 * @Description:
 */
import chalk from 'chalk';
import which from 'which';
import { spawn } from 'child_process';
class QuickInstall {
  checkNpm() {
    let installTools = ['pnpm', 'npm', 'cnpm', 'yarn'];
    for (let i = 0, len = installTools.length; i < len; i++) {
      try {
        which.sync(installTools[i]);
        console.log(chalk.green(`npm used ${installTools[i]}`));
        return installTools[i];
      } catch (error) {
        console.error(`please install ${installTools[i]}`);
        return 'npm';
      }
    }
  }
  /**
   * @description 开启子进程执行安装任务
   * @param { string[] } args 命令参数
   * @param { function } fn 回调函数
   */
  execCmd(args: string[], fn?: (code: number) => void) {
    const isWin = process.platform === 'win32'
    const cmd = this.checkNpm() || 'npm';
    args = args || [];
    const options = isWin ? { shell: true } : { shell: false };
    let runner = spawn(cmd, args, options);
    runner.on('error', (code) => {
      console.log(chalk.red(`error code ${code}`))
    })
    runner.on('exit', (code: number) => {
      console.log(chalk.green(`exec command code: ${code}`))
      if (fn) {
        fn(code);
      }
    });
  }
}
export default new QuickInstall();
