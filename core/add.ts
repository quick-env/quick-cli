/*
 * @Author: liya
 * @Date: 2023-09-04 18:37:52
 * @LastEditors: liya
 * @LastEditTime: 2023-09-09 20:54:55
 * @Description: 添加工程化配置
 */
import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import inquirer from 'inquirer';
import { fileRequest } from 'down-git-files';
import { lintChoose } from '../prompt/lint.prompt';
import { LINT_FILE_MAP, LINT_MAP } from '../config/lint';
import ora from 'ora';
const root = process.cwd();

class QuickAddConfig {
  /**
   * 是否为项目根目录
   * @returns <boolean>
   */
  _isRoot() {
    const pkg = path.join(root, 'package.json');
    const isRoot = fs.existsSync(pkg);
    return isRoot;
  }
  /**
   * 检查文件是否存在
   * @param { RegExp } 正则表达式
   * @returns <boolean>
   */
  _isExit(reg: RegExp) {
    const dirs = fs.readdirSync(root);
    console.log(`dirs ------>`, dirs);
    const exits = dirs.filter((file) => reg.test(file));
    return exits;
  }
  /**
   * 下载配置文件
   * @param  { string } name 通过命令行获取的配置名称
   */
  async _download(name: string) {
    if (!this._isRoot()) {
      console.log(chalk.red(`请在项目根目录执行`));
      process.exit(1);
    }
    const conf = LINT_MAP[name];
    const { download, origin } = LINT_FILE_MAP[name];
    const exits = this._isExit(conf);
    if (exits.length) {
      const fileName = exits[0];
      const LINT_CHOOSE = lintChoose(fileName);
      inquirer.prompt(LINT_CHOOSE).then((resp: { lintCover: boolean }) => {
        const { lintCover } = resp;
        if (!lintCover) {
          process.exit(1);
        }
        this._deleteOriginFile(fileName, origin, download);
      });
    } else {
      await fileRequest({
        user: 'quick-env',
        repo: 'quick-config',
        path: origin,
        branch: 'feature/init',
        file: download,
      })
        .then(() => {
          console.log(chalk.green(`下载完毕!`));
        })
        .catch((error: Error) => {
          console.log(chalk.red(`下载配置失败`));
        });
    }
  }
  /**
   * 选择覆盖，删除本地配置文件，删除后下载配置到本地
   * @param { string } file 项目中存在的配置文件
   * @param { string } origin github上文件地址
   * @param { string } download 下载到本地的文件名
   */
  _deleteOriginFile(file: string, origin: string, download: string) {
    fs.copyFileSync(`${root}/${file}`, `${root}/${file}_bak`);
    fs.unlink(`${root}/${file}`, async (err) => {
      if (err) {
        console.log(chalk.yellow(`覆盖本地文件失败`));
        process.exit(1);
      }
      await fileRequest({
        user: 'quick-env',
        repo: 'quick-config',
        path: origin,
        branch: 'feature/init',
        file: download,
      })
        .then(() => {
          ora('覆盖完毕!').stop();
          fs.unlinkSync(`${root}/${file}_bak`);
        })
        .catch((error: Error) => {
          console.log(chalk.red(`下载配置失败`));
          fs.renameSync(`${root}/${file}_bak`, `${root}/${file}`);
        });
    });
  }
  /**
   * 获取命令行配置，执行action
   * @param { string } name
   */
  _runAction(name: string) {}
}

const quickAddConfig = new QuickAddConfig();
export default quickAddConfig;
