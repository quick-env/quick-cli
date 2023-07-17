#! /usr/bin/env node
'use strict';
const { Command } = require('commander');
const pkg = require('../package.json');
const chalk = require('chalk');
const figlet = require('figlet');
const program = new Command();
const Init = require('../core/init.js');

program.version(pkg.version);
program
  .command('init <project-name>')
  .description('初始化项目模板')
  .action((name) => {
    const init = new Init(name)
    init.checkProject()
    console.log(`name --->`, name);
  });

program
  .command('add')
  .description('添加配置文件')
  .action(async () => {
    
  });

program
  .command('tlist')
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
  .command('clist')
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
