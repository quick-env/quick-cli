/*
 * @Author: liya
 * @Date: 2023-09-04 18:17:36
 * @LastEditors: liya
 * @LastEditTime: 2024-01-11 14:10:54
 * @Description: 创建工程模板
 */
import ora from 'ora';
import path from 'path';
import chalk from 'chalk';
import shell from 'shelljs';
import symbols from 'log-symbols';
import FileHelper from '../utils/file';
import download from 'download-git-repo';
import { TEMPLATE_LIST } from '../constant/template';
import CompileTemplate from '../compile';
import install from './install';
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
    const spinner = ora('start downloading project template \n').start();
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
          spinner.fail('project template download failed \n');
          process.exit(1);
        }
        spinner.succeed('successfully downloaded the project template \n');
        this._compile();
      }
    );
  }
  /**
   * compile project template
   */
  _compile() {
    const spinner = ora('start compiling project template \n').start();
    const isVue = this.meta.template.indexOf('Vue') > -1;
    const isElectron = this.meta.template.indexOf('Electron') > -1;
    const isComponent = this.meta.template.indexOf('Component') > -1;
    const isReact = this.meta.template.indexOf('React') > -1;
    const isNest = this.meta.template.indexOf('Nest') > -1;
    const compile = new CompileTemplate(this.projectName, this.meta);
    isVue && compile._vueTemplate();
    isElectron && compile._electronTemplate();
    isComponent && compile._componentsTemplate();
    isReact && compile._reactTemplate();
    isNest && compile._nestTemplate();
    spinner.succeed('compiled project template successfully \n');
    this._install();
  }
  /**
   * 安装项目依赖
   */
  _install() {
    shell.cd(this.rootDir)
    const spinner = ora('start installing dependencies \n').start();
    install.execCmd(['install'], () => {
      spinner.succeed('dependencies install done! \n');
    })
  }
}
