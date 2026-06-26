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
import { checkVersion } from '../utils/check';
import { BUILD_PROMPT } from '../prompt/build.prompt';
import { installSkills, printSkillInstallSummary } from '../core/skill/install';
import { listAvailableSkills } from '../core/skill/list';
import { updateSkills } from '../core/skill/update';
import { AI_CODING_FULL_FLOW_PRESET, parsePlatformList } from '../constant/skills';

const program = new Command();

program.version(pkg.version);

program
  .command('init <project-name>')
  .description('初始化项目模板')
  .option('--with-ai', '安装 AI Coding skill 套件')
  .option('--skip-ai', '跳过 AI skill 安装')
  .option('-y, --yes', '安装 skill 时跳过覆盖确认')
  .action((name, options: { withAi?: boolean; skipAi?: boolean; yes?: boolean }) => {
    checkVersion();
    inquirer.prompt(INIT_PROMPT).then((response: IBootstrap) => {
      const init = new QuickInit(name, response, undefined, {
        withAi: options.withAi,
        skipAi: options.skipAi,
        yes: options.yes,
      });
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
  .description('添加构建工具 (vite / rspack / webpack)')
  .action(async () => {
    const response = await inquirer.prompt(BUILD_PROMPT);
    await buildTools._download(response.buildConfig);
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

program
  .command('skill:install')
  .description('安装 AI skills 到项目（默认 AI Coding 全流程 preset）')
  .option('--project-root <projectRoot>', '项目根目录')
  .option('--skills-root <skillsRoot>', 'quick-skills 根目录')
  .option('--preset <preset>', 'skill preset 名称', AI_CODING_FULL_FLOW_PRESET)
  .option('--platform <platforms>', '目标平台，逗号分隔，如 cursor,claude')
  .option('--scope <scope>', '安装范围 project|global|both', 'project')
  .option('--skills <skillIds>', '指定 skill id，逗号分隔')
  .option('-y, --yes', '跳过覆盖确认')
  .action(async (options) => {
    const result = await installSkills({
      projectRoot: options.projectRoot,
      skillsRoot: options.skillsRoot,
      preset: options.preset,
      platforms: parsePlatformList(options.platform),
      scope: options.scope,
      skillIds: options.skills ? options.skills.split(',').map((item: string) => item.trim()) : undefined,
      yes: options.yes,
    });
    printSkillInstallSummary(result);
  });

program
  .command('skill:update')
  .description('更新 quick-skills 缓存并重新安装项目 preset')
  .option('--project-root <projectRoot>', '项目根目录')
  .option('--skills-root <skillsRoot>', 'quick-skills 根目录')
  .action(async (options) => {
    await updateSkills({
      projectRoot: options.projectRoot,
      skillsRoot: options.skillsRoot,
      forceCache: true,
    });
  });

program
  .command('skill:list')
  .description('查看 quick-skills 中可安装的 skill 列表')
  .option('--skills-root <skillsRoot>', 'quick-skills 根目录')
  .action(async (options) => {
    const skills = await listAvailableSkills(options.skillsRoot);
    console.log(chalk.cyan('AI skills:'));
    if (!skills.length) {
      console.log(chalk.yellow('none'));
      return;
    }
    skills.forEach((skill) => {
      console.log(`${skill.id} - ${skill.description || skill.sourceDir}`);
    });
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
