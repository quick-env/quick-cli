/*
 * @Description: 将 quick-skills preset 安装到项目或全局 skill 目录
 */
import fs from 'fs';
import path from 'path';

import chalk from 'chalk';
import ora from 'ora';

import {
  AI_CODING_FULL_FLOW_PRESET,
  DEFAULT_INIT_PLATFORMS,
  DEFAULT_SKILL_DOC_DIRS,
  getSkillsLockPath,
  SKILLS_WORKFLOW_DOC,
  SkillInstallScope,
  SkillPlatformId,
} from '../../constant/skills';
import { confirmSkillOverwrite } from '../../prompt/ai-init.prompt';
import { resolveSkillsRoot } from './cache';
import { resolvePlatformInstallRoots, resolveSkillTargetDir } from './platform';
import { InstallTargetsManifest, loadInstallTargets } from './targets';

/** {@link installSkills} 入参 */
export interface InstallSkillsOptions {
  projectRoot?: string;
  skillsRoot?: string;
  preset?: string;
  platforms?: SkillPlatformId[];
  scope?: SkillInstallScope;
  skillIds?: string[];
  yes?: boolean;
}

/** {@link installSkills} 返回的安装摘要 */
export interface InstallSkillsResult {
  projectRoot: string;
  skillsRoot: string;
  preset?: string;
  installedSkillIds: string[];
  installedPlatforms: SkillPlatformId[];
  scope: SkillInstallScope;
  docs: string[];
}

/** 写入 `.quick/skills-lock.json` 的项目安装元数据 */
interface ProjectSkillsMeta {
  preset?: string;
  version: string;
  sourceRoot: string;
  installedAt: string;
  platforms: Record<string, { scope: SkillInstallScope; skills: string[] }>;
}

/** {@link installSkillBundle} 入参 */
interface InstallSkillBundleOptions {
  sourceDir: string;
  targetDir: string;
  yes?: boolean;
}

/**
 * 将可选项目根解析为绝对路径。
 *
 * @param projectRoot - CLI 或调用方传入的项目根
 * @returns 绝对路径，默认 `process.cwd()`
 */
function resolveProjectRoot(projectRoot?: string): string {
  return path.resolve(projectRoot || process.cwd());
}

/**
 * 递归复制文件或目录（文件与目录均支持）。
 *
 * @param sourcePath - 源路径
 * @param targetPath - 目标路径
 */
function copyEntry(sourcePath: string, targetPath: string): void {
  const stat = fs.statSync(sourcePath);
  if (stat.isDirectory()) {
    fs.mkdirSync(targetPath, { recursive: true });
    for (const entry of fs.readdirSync(sourcePath)) {
      copyEntry(path.join(sourcePath, entry), path.join(targetPath, entry));
    }
    return;
  }

  fs.mkdirSync(path.dirname(targetPath), { recursive: true });
  fs.copyFileSync(sourcePath, targetPath);
}

/**
 * 复制 skill 源目录到目标目录，排除 `skill.json` manifest。
 *
 * @param sourceDir - quick-skills 中的 skill 源目录
 * @param targetDir - 项目或全局 skill 目标目录
 * @throws 源目录不存在时抛出错误
 */
function copySkillBundle(sourceDir: string, targetDir: string): void {
  if (!fs.existsSync(sourceDir)) {
    throw new Error(`Skill source directory not found: ${sourceDir}`);
  }

  fs.mkdirSync(targetDir, { recursive: true });

  for (const entry of fs.readdirSync(sourceDir)) {
    if (entry === 'skill.json') {
      continue;
    }
    copyEntry(path.join(sourceDir, entry), path.join(targetDir, entry));
  }
}

/**
 * 安装单个 skill 目录，已存在时可交互确认覆盖。
 *
 * @param options - 源目录、目标目录及是否跳过覆盖确认
 * @see {@link confirmSkillOverwrite}
 */
async function installSkillBundle(options: InstallSkillBundleOptions): Promise<void> {
  if (fs.existsSync(options.targetDir)) {
    if (!options.yes) {
      const shouldOverwrite = await confirmSkillOverwrite(options.targetDir);
      if (!shouldOverwrite) {
        return;
      }
    }

    fs.rmSync(options.targetDir, { recursive: true, force: true });
  }

  copySkillBundle(options.sourceDir, options.targetDir);
}

/**
 * 批量创建 preset 要求的项目子目录。
 *
 * @param projectRoot - 项目根目录
 * @param directories - 相对路径列表
 */
function ensureDirectories(projectRoot: string, directories: string[]): void {
  directories
    .filter((dirPath) => dirPath !== '.ai' && !dirPath.startsWith('.ai/'))
    .forEach((dirPath) => {
      fs.mkdirSync(path.join(projectRoot, dirPath), { recursive: true });
    });
}

/**
 * 按 preset 文档映射从 quick-skills 复制说明文档到项目。
 *
 * @param skillsRoot - quick-skills 根目录
 * @param projectRoot - 项目根目录
 * @param docs - 源/目标路径映射列表
 * @returns 成功安装的项目内相对路径列表
 */
function installDocs(
  skillsRoot: string,
  projectRoot: string,
  docs: InstallTargetsManifest['presets'][string]['docs'] = []
): string[] {
  const installedDocs: string[] = [];

  docs.forEach((docMapping) => {
    const sourcePath = path.join(skillsRoot, docMapping.source);
    const targetPath = path.join(projectRoot, docMapping.target);

    if (!fs.existsSync(sourcePath)) {
      return;
    }

    fs.mkdirSync(path.dirname(targetPath), { recursive: true });
    fs.copyFileSync(sourcePath, targetPath);
    installedDocs.push(docMapping.target);
  });

  return installedDocs;
}

/**
 * 读取项目 `.quick/skills-lock.json` 安装元数据。
 *
 * @param projectRoot - 项目根目录
 * @returns 元数据对象；文件不存在返回 `null`
 * @see {@link writeProjectSkillsMeta}
 */
export function readProjectSkillsMeta(projectRoot: string): ProjectSkillsMeta | null {
  const metaPath = getSkillsLockPath(projectRoot);
  if (!fs.existsSync(metaPath)) {
    return null;
  }

  return JSON.parse(fs.readFileSync(metaPath, 'utf8')) as ProjectSkillsMeta;
}

/**
 * 写入 `.quick/skills-lock.json` 记录本次安装元数据。
 *
 * @param projectRoot - 项目根目录
 * @param meta - preset、平台与 skill 列表等信息
 * @see {@link readProjectSkillsMeta}
 */
function writeProjectSkillsMeta(projectRoot: string, meta: ProjectSkillsMeta): void {
  const metaPath = getSkillsLockPath(projectRoot);
  fs.mkdirSync(path.dirname(metaPath), { recursive: true });
  fs.writeFileSync(metaPath, JSON.stringify(meta, null, 2));
}

/**
 * 按 preset 或指定 skill ID 列表，将 skill 安装到项目/全局目录并初始化文档目录。
 *
 * @param options - 项目根、preset、平台、范围及覆盖确认选项
 * @returns 安装结果摘要
 * @throws preset 未知或 install-targets 缺少映射时抛出错误
 * @see {@link loadInstallTargets}
 * @see {@link resolvePlatformInstallRoots}
 * @see {@link installAiCodingFullFlowPreset}
 */
export async function installSkills(options: InstallSkillsOptions = {}): Promise<InstallSkillsResult> {
  const projectRoot = resolveProjectRoot(options.projectRoot);
  const skillsRoot = await resolveSkillsRoot(options.skillsRoot);
  const targets = loadInstallTargets(skillsRoot);
  const presetName = options.preset || AI_CODING_FULL_FLOW_PRESET;
  const preset = targets.presets[presetName];
  const scope = options.scope || (targets.defaultScope as SkillInstallScope) || 'project';
  const platforms = options.platforms && options.platforms.length > 0 ? options.platforms : [...DEFAULT_INIT_PLATFORMS];
  const skillIds = options.skillIds && options.skillIds.length > 0 ? options.skillIds : preset?.skills || [];

  if (!preset && !options.skillIds) {
    throw new Error(`Unknown skill preset: ${presetName}`);
  }

  const spinner = ora('正在安装 AI skills...').start();
  const installedSkillIds: string[] = [];
  const platformSkills: Record<string, { scope: SkillInstallScope; skills: string[] }> = {};

  try {
    if (preset?.directories) {
      ensureDirectories(projectRoot, preset.directories);
    } else {
      ensureDirectories(projectRoot, [...DEFAULT_SKILL_DOC_DIRS]);
    }

    for (const platform of platforms) {
      const installRoots = resolvePlatformInstallRoots(platform, scope, projectRoot);
      const installedOnPlatform: string[] = [];

      for (const skillId of skillIds) {
        const mapping = targets.skills[skillId];
        if (!mapping) {
          throw new Error(`Skill mapping not found in install-targets.json: ${skillId}`);
        }

        const dirName = mapping.dirNameByPlatform[platform] || path.basename(mapping.sourceDir);
        const sourceDir = path.join(skillsRoot, mapping.sourceDir);

        for (const installRoot of installRoots) {
          const targetDir = resolveSkillTargetDir(installRoot, dirName);
          await installSkillBundle({
            sourceDir,
            targetDir,
            yes: options.yes,
          });
        }

        if (!installedSkillIds.includes(skillId)) {
          installedSkillIds.push(skillId);
        }
        installedOnPlatform.push(dirName);
      }

      platformSkills[platform] = {
        scope,
        skills: installedOnPlatform,
      };
    }

    const docs = installDocs(skillsRoot, projectRoot, preset?.docs);

    writeProjectSkillsMeta(projectRoot, {
      preset: presetName,
      version: targets.version,
      sourceRoot: skillsRoot,
      installedAt: new Date().toISOString(),
      platforms: platformSkills,
    });

    spinner.succeed('AI skills 安装完成');

    return {
      projectRoot,
      skillsRoot,
      preset: presetName,
      installedSkillIds,
      installedPlatforms: platforms,
      scope,
      docs,
    };
  } catch (error) {
    spinner.fail('AI skills 安装失败');
    throw error;
  }
}

/**
 * 在终端打印 skill 安装成功摘要与首次使用步骤。
 *
 * @param result - {@link installSkills} 返回结果
 */
export function printSkillInstallSummary(result: InstallSkillsResult): void {
  const gettingStarted = result.docs.includes(SKILLS_WORKFLOW_DOC)
    ? SKILLS_WORKFLOW_DOC
    : result.docs[0];

  console.log(chalk.green('\n✓ AI Coding skill 已安装'));
  result.installedPlatforms.forEach((platform) => {
    console.log(chalk.cyan(`  - ${platform}: ${result.installedSkillIds.length} 个 skill`));
  });

  if (gettingStarted) {
    console.log(chalk.cyan(`  - 使用说明: ${gettingStarted}`));
  }

  console.log(chalk.green('\n首次使用：'));
  console.log(chalk.gray('  1. 用 Cursor 或 Claude Code 打开本项目'));
  if (gettingStarted) {
    console.log(chalk.gray(`  2. 阅读 ${gettingStarted}`));
  }
  console.log(chalk.gray('  3. 从「需求拆解」skill（quick-requirement-decomposition）开始\n'));
}
