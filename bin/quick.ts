#! /usr/bin/env node
import ora from 'ora';
import chalk from 'chalk';
import inquirer from 'inquirer';
import figlet from 'figlet';
import pkg from '../package.json';
import { Command } from 'commander';
import QuickInit from '../core/init';
import quickAddConfig from '../core/add';
import { LINT_PROMPT } from '../prompt/lint.prompt';
const program = new Command();

program.version(pkg.version);

program
  .command('init <project-name>')
  .description('初始化项目模板')
  .action((name) => {
    const init = new QuickInit(name);
    init._checkProject();
    console.log(`name --->`, name);
  });

program
  .command('add')
  .description('添加配置文件')
  .action(async () => {
    inquirer.prompt(LINT_PROMPT).then((response: {lintConfig: string[]}) => {
      const { lintConfig } = response;
      const hasNone = lintConfig.includes('none');
      if (hasNone) {
        console.log(chalk.red(`选项包含none选项, 暂不配置`));
        console.log(chalk.green(`${JSON.stringify(lintConfig)}`));
        process.exit(1);
      }
      lintConfig.map((conf: string) => quickAddConfig._download(conf));
    });
  });

program
  .command('template')
  .description('查看已支持的模板列表')
  .action(() => {
    console.log(
      chalk.magentaBright(
        `\n`,
        `\b Vue3中后台开发模板\n`,
        `Vue3移动端开发模板\n`,
        `Vue低代码工程开发模板\n`,
        `Electron桌面客户端开发模板\n`,
        `组件开发开发模板\n`,
        `Nest工程开发模板\n`,
        `React低代码工程开发模板\n`
      )
    );
  });

program
  .command('config')
  .description('查看可加载的配置列表')
  .action(() => {
    console.log(
      chalk.hex('#FFA500')(
        `\n`,
        `\b eslint\n`,
        `stylelint\n`,
        `commitlint\n`,
        `husky + lint-stage\n`,
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
