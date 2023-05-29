#! /usr/bin/env node
'use strict';
import { Command } from 'commander';
import pkg from '../package.json' assert { type: 'json' };
import chalk from 'chalk';
import figlet from 'figlet';
const program = new Command();

program.version(pkg.version);
program
  .command('init <project-name>')
  .description('初始化项目模板')
  .action((cmd) => {
    console.log(`...args --->`, cmd);
  });

program
  .command('add')
  .description('安装配置文件')
  .action(() => {});

program
  .command('tlist')
  .description('查看已支持的模板列表')
  .action(() => {});

program
  .command('clist')
  .description('查看可加载的配置列表')
  .action(() => {});


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
