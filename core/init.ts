/*
 * @Author: liya
 * @Date: 2023-09-04 18:17:36
 * @LastEditors: liya
 * @LastEditTime: 2026-06-17 16:11:03
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
import { installAiCodingFullFlowPreset, printAiCodingOnboardingHint } from './skill/presets';
import { confirmAiCodingFullFlowPrompt } from '../prompt/ai-init.prompt';

const baseDir = process.cwd();
const fileHelper = new FileHelper();

export interface IBootstrap {
  template: string;
  author: string;
  version: string;
  description: string;
}

export interface InitOptions {
  withAi?: boolean;
  skipAi?: boolean;
  yes?: boolean;
}

export interface InitCompletionContext {
  projectRoot: string;
  meta: IBootstrap;
}

export type InitCompletionHandler = (context: InitCompletionContext) => Promise<void> | void;

export default class QuickInit {
  private projectName: string;
  private rootDir: string;
  private meta!: IBootstrap;
  private initOptions: InitOptions;
  private onInstallSuccess?: InitCompletionHandler;

  constructor(name: string, meta: IBootstrap, onInstallSuccess?: InitCompletionHandler, initOptions: InitOptions = {}) {
    this.meta = meta;
    this.projectName = name;
    this.rootDir = path.join(baseDir, name);
    this.onInstallSuccess = onInstallSuccess;
    this.initOptions = initOptions;
  }

  _bootstrap() {
    const isExit = fileHelper.isExit(this.rootDir);
    if (isExit) {
      console.log(chalk.red(`${this.projectName} already exists`));
      process.exit(1);
    } else {
      this._download();
    }
  }

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

  private async shouldInstallAiSkills(): Promise<boolean> {
    if (this.initOptions.skipAi) {
      return false;
    }

    if (this.initOptions.withAi) {
      return true;
    }

    return confirmAiCodingFullFlowPrompt();
  }

  private async _afterInstallSuccess() {
    if (this.onInstallSuccess) {
      await this.onInstallSuccess({
        projectRoot: this.rootDir,
        meta: this.meta,
      });
      return;
    }

    const shouldInstall = await this.shouldInstallAiSkills();
    if (!shouldInstall) {
      return;
    }

    const result = await installAiCodingFullFlowPreset({
      projectRoot: this.rootDir,
      template: this.meta.template,
      yes: this.initOptions.yes,
    });
    printAiCodingOnboardingHint(result);
  }

  _install() {
    console.log(`this.rootDir -------`, this.rootDir);
    shell.cd(this.rootDir);
    shell.exec('git init');
    const spinner = ora('start installing dependencies \n').start();
    install.execCmd(['install'], async (code) => {
      if (code !== 0) {
        spinner.fail(`dependencies install failed with code ${code} \n`);
        return;
      }
      spinner.succeed('dependencies install done! \n');
      try {
        await this._afterInstallSuccess();
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        console.warn('Post-install AI skill setup failed', message);
      }
    });
  }
}
