/*
 * @Author: liya
 * @Date: 2023-09-04 18:17:36
 * @LastEditors: liya
 * @LastEditTime: 2023-10-12 14:37:38
 * @Description: 创建工程模板
 */
import ora from 'ora';
import path from 'path';
import chalk from 'chalk';
import shell from 'shelljs';
import symbols from 'log-symbols';
import QuickInstall from './install';
import FileHelper from '../utils/file';
import { checkVersion } from '../utils/check';
import download from 'download-git-repo';
import { TEMPLATE_LIST } from '../constant/template';
import CompileTemplate from '../compile';
const baseDir = process.cwd();
const fileHelper = new FileHelper();
export interface IBootstrap {
  template: string;
  author: string;
  version: string;
  description: string;
}
export default class QuickInit {
  private projectName: string;
  private rootDir: string;
  private meta!: IBootstrap;
  constructor(name: string, meta: IBootstrap) {
    this.meta = meta;
    this.projectName = name;
    this.rootDir = path.join(baseDir, name);
    checkVersion();
  }
  /**
   * init action bootstrap
   */
  _bootstrap() {
    const isExit = fileHelper.isExit(this.rootDir);
    if (isExit) {
      console.log(chalk.red(`${this.projectName} already exists`));
      process.exit(1);
    } else {
      this._download();
    }
  }
  /**
   * Download project templates to local location
   */
  _download() {
    const spinner = ora('start downloading project template').start();
    const { template } = this.meta;
    const url = TEMPLATE_LIST[template];
    download(
      url,
      this.rootDir,
      {
        clone: true,
      },
      (error: Error) => {
        if (error) {
          console.log(symbols.error, error);
          spinner.fail('project template download failed');
          process.exit(1);
        }
        spinner.succeed('successfully downloaded the project template');
        this._compile();
      }
    );
  }
  /**
   * compile project template
   */
  _compile() {
    const spinner = ora('start compile project template').start();
    const isVue = this.meta.template.indexOf('Vue') > -1;
    const isElectron = this.meta.template.indexOf('Electron') > -1;
    const isComponent = this.meta.template.indexOf('Component') > -1;
    const isReact = this.meta.template.indexOf('React') > -1;
    const isNest = this.meta.template.indexOf('Nest') > -1;
    const compile = new CompileTemplate(this.projectName, this.meta);
    isVue && compile._vueTemplate();
    isElectron && compile._electronTemplate()
    this._install();
    spinner.succeed('compiled project template successfully');
  }
  /**
   * 安装项目依赖
   */
  _install() {
    const spinner = ora('start install project template').start();
    spinner.succeed('install done!');
  }
}
