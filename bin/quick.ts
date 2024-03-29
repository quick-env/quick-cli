#! /usr/bin/env node
import ora from 'ora';
import chalk from 'chalk';
import inquirer from 'inquirer';
import figlet from 'figlet';
import pkg from '../package.json';
import { Command } from 'commander';
import QuickInit, { IBootstrap } from '../core/init';
import quickAddConfig from '../core/add';
import { LINT_PROMPT } from '../prompt/lint.prompt';
import { INIT_PROMPT } from '../prompt/init.prompt';
const program = new Command();

program.version(pkg.version);

program
  .command('init <project-name>')
  .description('初始化项目模板')
  .action((name) => {
    inquirer.prompt(INIT_PROMPT).then((response: IBootstrap) => {
      const init = new QuickInit(name, response);
      init._bootstrap();
    });
  });

program
  .command('add')
  .description('添加工程配置文件')
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
