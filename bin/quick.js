#! /usr/bin/env node
'use strict';
import { Command } from 'commander';
import pkg from '../package.json' assert { type: 'json' };
import chalk from 'chalk';
import figlet from 'figlet';
const program = new Command();

program.version(pkg.version);

program.parse(process.argv);
if (!program.args.length) {
  console.log(chalk.red(`\n`));
  console.log(
    figlet.textSync('quick cli', {
      font: 'Ghost',
      horizontalLayout: 'default',
      verticalLayout: 'default',
      width: 80,
      whitespaceBreak: true,
    })
  );
  program.help();
}
