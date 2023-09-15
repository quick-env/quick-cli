/*
 * @Author: liya
 * @Date: 2023-09-04 18:37:52
 * @LastEditors: liya
 * @LastEditTime: 2023-09-15 16:37:01
 * @Description: 添加工程化配置
 */
import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import { fileRequest } from 'down-git-files';
import { lintChoose } from '../prompt/lint.prompt';
import {
  LINT_FILE_MAP,
  LINT_MAP,
  LINT_PKG_LIST,
  LINT_SCRIPTS,
  hasIgnored,
  notDownloadConfig,
  notRequired,
} from '../config/lint';
import ora from 'ora';
import shell from 'shelljs';
import symbols from 'log-symbols';
import quickInstall from './install';
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
    const exits = dirs.filter((file) => reg.test(file));
    return exits;
  }
  /**
   * 下载配置文件
   * @param  { string } task 通过命令行获取的配置名称
   */
  async _download(task: string[]) {
    if (!this._isRoot()) {
      console.log(chalk.red(`请在项目根目录执行`));
      process.exit(1);
    }
    task.map(async (name) => {
      const conf = LINT_MAP[name];
      const notDownload = notDownloadConfig.includes(name);
      if (notDownload) {
        this._runAction(name);
        return;
      }
      const { download = '', origin = '' } = LINT_FILE_MAP[name];
      const exits = this._isExit(conf);
      if (exits.length) {
        const [fileName] = exits;
        const lintCover = await lintChoose(fileName);
        if (!lintCover) {
          console.log(chalk.red(`${fileName}不执行覆盖操作`));
          return;
        }
        await this._coverOriginFIle(fileName, name);
        await this._downloadIgnoreFile(name);
        await this._runAction(name);
      } else {
        await fileRequest({
          user: 'quick-env',
          repo: 'quick-config',
          path: origin,
          branch: 'feature/init',
          file: download,
        })
          .then(() => {
            this._downloadIgnoreFile(name);
            this._runAction(name)
          })
          .catch((error: Error) => {
            console.log(chalk.red(`下载配置失败`));
          });
      }
    });
  }
  /**
   * 下载ignore配置<eslint/prettier>
   * @param { string } confName 通过命令行获取的配置名称
   */
  async _downloadIgnoreFile(confName: string) {
    const ignoreType = hasIgnored.includes(confName);
    if (ignoreType) {
      const ignoreName = ignoreType && `${confName}ignore`;
      const isExits = fs.existsSync(`${root}/.${ignoreName}`);
      if (isExits) {
        this.unlinkFile(`.${ignoreName}`);
      }
      const { download, origin } = LINT_FILE_MAP[ignoreName];
      await fileRequest({
        user: 'quick-env',
        repo: 'quick-config',
        path: origin,
        branch: 'feature/init',
        file: download,
      })
        .then(() => {
          ora(`.${ignoreName}覆盖完毕!`).succeed();
          isExits && fs.unlinkSync(`${root}/.${ignoreName}_bak`);
        })
        .catch((error: Error) => {
          console.log(chalk.red(`.${ignoreName} 下载配置失败`));
          isExits &&
            fs.renameSync(
              `${root}/.${ignoreName}_bak`,
              `${root}/.${ignoreName}`
            );
        });
    }
  }
  /**
   * 选择覆盖，删除本地配置文件，删除后下载配置到本地
   * @param { string } fileName 项目中存在的配置文件
   * @param { string } confName 命令行名称
   */
  async _coverOriginFIle(fileName: string, confName: string) {
    this.unlinkFile(fileName);
    const { download, origin } = LINT_FILE_MAP[confName];
    await fileRequest({
      user: 'quick-env',
      repo: 'quick-config',
      path: origin,
      branch: 'feature/init',
      file: download,
    })
      .then(() => {
        ora(`${fileName}覆盖完毕!`).succeed();
        fs.unlinkSync(`${root}/${fileName}_bak`);
      })
      .catch((error: Error) => {
        console.log(chalk.red(`_coverOriginFIle 下载配置失败`));
        fs.renameSync(`${root}/${fileName}_bak`, `${root}/${fileName}`);
      });
  }
  /**
   * 删除本地配置文件
   * @param { string } localFile 本地项目配置文件
   */
  unlinkFile(localFile: string) {
    fs.copyFileSync(`${root}/${localFile}`, `${root}/${localFile}_bak`);
    fs.unlink(`${root}/${localFile}`, async (err) => {
      if (err) {
        console.log(chalk.yellow(`覆盖本地文件失败`));
        fs.renameSync(`${root}/${localFile}_bak`, `${root}/${localFile}`);
        process.exit(1);
      }
    });
  }
  /**
   * 获取命令行配置，set各个配置的scripts或config
   * @param { string } name
   */
  async _runAction(name: string) {
    if (!notRequired.includes(name)) {
      const actions = LINT_SCRIPTS[name];
      actions.map((action) => shell.exec(action));
    }
    console.log(`能执行到这吗？`)
    await this._install(name);
  }
  /**
   * 获取命令行配置，安装依赖
   * @param { string } name
   */
  async _install(name: string) {
    const pkg = LINT_PKG_LIST[name];
    quickInstall.execCmd(['install', ...pkg, '-D'], () => {
      console.log(symbols.success, chalk.green(`${pkg} installed`));
    });
  }
}

export default new QuickAddConfig();
