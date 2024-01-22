#! /usr/bin/env node
import chalk from 'chalk';
import inquirer from 'inquirer';
import figlet from 'figlet';
import pkg from '../package.json';
import { Command } from 'commander';
import QuickInit, { IBootstrap } from '../core/init';
import quickAddConfig from '../core/add';
import buildTools from '../core/tools';
import { LINT_PROMPT } from '../prompt/lint.prompt';
import { INIT_PROMPT } from '../prompt/init.prompt';
import install from '../core/install';
import { checkVersion } from '../utils/check';
import { BUILD_PROMPT } from '../prompt/build.prompt';
const program = new Command();

program.version(pkg.version);

program
  .command('init <project-name>')
  .description('初始化项目模板')
  .action((name) => {
    checkVersion();
    inquirer.prompt(INIT_PROMPT).then((response: IBootstrap) => {
      const init = new QuickInit(name, response);
      init._bootstrap();
    });
  });

program
  .command('add')
  .description('添加工程配置文件, ESLint/husky/prettier/commitlint等')
  .action(async () => {
    inquirer.prompt(LINT_PROMPT).then((response: { lintConfig: string[] }) => {
      const { lintConfig } = response;
      const hasNone = lintConfig.includes('none');
      if (hasNone) {
        console.log(chalk.red(`选项包含none选项, 暂不配置`));
        console.log(chalk.green(lintConfig.join('\n')));
        process.exit(1);
      }
      quickAddConfig._download(lintConfig);
    });
  });
program
  .command('build:tools')
  .description('添加构建工具')
  .action(() => {
    inquirer.prompt(BUILD_PROMPT).then((response: { buildConfig: string }) => {
      const { buildConfig } = response
      console.log(`buildConfig: ${buildConfig}`)
      buildTools._download(buildConfig)
    }) 
  });
program
  .command('download')
  .description('下载git模块')
  .action(() => {
    install.execShell(() => {
      console.log(chalk.green(`git 模块下载完毕，请进入项目执行npm install`));
    });
  });

program
  .command('template')
  .description('查看开发模板列表')
  .action(() => {
    console.log(
      chalk.cyanBright(
        `\n`,
        `Vue3中后台开发模板\n`,
        `Vue3移动端开发模板\n`,
        `Vue组件开发开发模板\n`,
        `NestJS开发模板\n`,
        `React中后台开发模板\n`,
        `React移动端开发模板\n`,
        `Electron桌面端开发模板\n`
      )
    );
  });

program
  .command('config')
  .description('查看工程化列表')
  .action(() => {
    console.log(
      chalk.hex('#FFA500')(
        `\n`,
        `husky\n`,
        `postcss\n`,
        `eslint\n`,
        `prettier\n`,
        `commitlint\n`,
        `lint-staged\n`,
        `webpack构建配置\n`,
        `rollup构建配置\n`,
        `vite构建配置\n`
      )
    );
  });

program.parse(process.argv);
if (!program.args.length) {
  console.log(chalk.red(`\n`));
  console.log(
    figlet.textSync('quick cli', {
      horizontalLayout: 'default',
      verticalLayout: 'default',
      width: 80,
      whitespaceBreak: true,
    })
  );
  console.log(chalk.red(`\n`));
  program.help();
}
