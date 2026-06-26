/*
 * @Author: liya
 * @Date: 2024-01-22 16:27:45
 * @LastEditors: liya
 * @LastEditTime: 2026-06-17 18:10:00
 * @Description: 添加构建工具
 */
import fs from 'fs';
import path from 'path';

import chalk from 'chalk';
import { fileRequest } from 'down-git-files';
import ora from 'ora';
import shell from 'shelljs';
import symbols from 'log-symbols';

import {
  BUILD_FILE_MAP,
  BUILD_PKG_LIST,
  BUILD_SCRIPTS,
  DOWNLOAD_CONFIG,
} from '../constant/build';
import { lintChoose } from '../prompt/lint.prompt';
import quickInstall from './install';

class BuildTools {
  private root: string = process.cwd();

  checkIsRoot(): boolean {
    return fs.existsSync(path.join(this.root, 'package.json'));
  }

  checkHasSourceEntry(): boolean {
    return fs.existsSync(path.join(this.root, 'src'));
  }

  private async downloadFile(spec: { origin: string; download: string }): Promise<void> {
    await fileRequest({
      user: DOWNLOAD_CONFIG.USER,
      repo: DOWNLOAD_CONFIG.REPO,
      path: spec.origin,
      branch: DOWNLOAD_CONFIG.BRANCH,
      file: spec.download,
    });
  }

  private async installPackages(toolName: string): Promise<void> {
    const packages = BUILD_PKG_LIST[toolName];
    if (!packages || !packages.length) {
      return;
    }

    await new Promise<void>((resolve) => {
      quickInstall.execCmd(['install', ...packages, '-D'], () => {
        console.log(symbols.success, chalk.green(`${packages.join(' ')} installed`));
        resolve();
      });
    });
  }

  private runScripts(toolName: string): void {
    const scripts = BUILD_SCRIPTS[toolName] || [];
    scripts.forEach((command) => shell.exec(command));
  }

  async _download(toolName: string): Promise<void> {
    if (toolName === 'none') {
      console.log(chalk.yellow('未选择构建工具，跳过安装。'));
      return;
    }

    if (toolName === 'rollup') {
      console.log(chalk.yellow('quick-config 暂未提供 rollup 配置，请先使用 vite / rspack / webpack。'));
      return;
    }

    if (!this.checkIsRoot()) {
      console.log(chalk.red('当前执行目录不是项目根目录'));
      process.exit(1);
    }

    if (!this.checkHasSourceEntry()) {
      console.log(chalk.red('src 目录不存在，无法添加构建工具配置'));
      process.exit(1);
    }

    const fileSpecs = BUILD_FILE_MAP[toolName];
    if (!fileSpecs || !fileSpecs.length) {
      console.log(chalk.red(`未知构建工具: ${toolName}`));
      process.exit(1);
    }

    const spinner = ora(`正在下载 ${toolName} 构建配置...`).start();
    try {
      for (const spec of fileSpecs) {
        const targetPath = path.join(this.root, spec.download);
        if (fs.existsSync(targetPath)) {
          spinner.stop();
          const shouldCover = await lintChoose(spec.download);
          spinner.start();
          if (!shouldCover) {
            console.log(chalk.yellow(`${spec.download} 未覆盖，跳过`));
            continue;
          }
        }

        await this.downloadFile(spec);
      }

      this.runScripts(toolName);
      await this.installPackages(toolName);
      spinner.succeed(`${toolName} 构建配置安装完成`);
    } catch (error) {
      spinner.fail(`${toolName} 构建配置下载失败`);
      const message = error instanceof Error ? error.message : String(error);
      console.log(chalk.red(message));
      process.exit(1);
    }
  }
}

export default new BuildTools();
