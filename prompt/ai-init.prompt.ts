/*
 * @Description: `quick init` 时 AI skill 安装相关的交互式确认
 */
import inquirer from 'inquirer';

/**
 * 询问用户是否在新项目中安装「AI Coding 全流程」skill preset。
 *
 * @returns 用户确认安装返回 `true`，否则 `false`
 * @see {@link installAiCodingFullFlowPreset}
 * @see {@link ../init} `QuickInit._afterInstallSuccess`
 */
export async function confirmAiCodingFullFlowPrompt(): Promise<boolean> {
  const answer = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'installAiSkills',
      message:
        '检测到这是新项目。是否安装 AI Coding skill 套件？\n' +
        '（将 skill 安装到 .cursor/skills 与 .claude/skills，并生成 docs/WORKFLOW.md 使用说明）',
      default: true,
    },
  ]);

  return answer.installAiSkills as boolean;
}

/**
 * 当目标 skill 目录已存在时，询问是否覆盖安装。
 *
 * @param targetPath - 即将写入的 skill 目录路径
 * @returns 用户确认覆盖返回 `true`
 * @see {@link installSkillBundle}
 */
export async function confirmSkillOverwrite(targetPath: string): Promise<boolean> {
  const answer = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'overwrite',
      message: `Skill 目录 "${targetPath}" 已存在，是否覆盖？`,
      default: false,
    },
  ]);

  return answer.overwrite as boolean;
}
