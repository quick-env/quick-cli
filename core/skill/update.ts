/*
 * @Description: 刷新 quick-skills 缓存并按项目 preset 重新安装
 */
import path from 'path';

import ora from 'ora';

import { ensureSkillsCache, resolveSkillsRoot } from './cache';
import { installSkills, InstallSkillsOptions, readProjectSkillsMeta } from './install';

/** {@link updateSkills} 入参 */
interface UpdateSkillsOptions {
  projectRoot?: string;
  skillsRoot?: string;
  forceCache?: boolean;
}

/**
 * 强制更新 quick-skills 远程缓存，并在当前项目已安装 preset 时重新安装 skill。
 *
 * @param options - 可选项目根、skills 根与是否强制刷新缓存
 * @returns Promise，重装完成或跳过后 resolve
 * @see {@link ensureSkillsCache}
 * @see {@link installSkills}
 */
export async function updateSkills(options: UpdateSkillsOptions = {}): Promise<void> {
  const spinner = ora('正在更新 quick-skills 缓存...').start();
  const skillsRoot = options.skillsRoot
    ? await resolveSkillsRoot(options.skillsRoot)
    : await ensureSkillsCache({ force: options.forceCache !== false });
  spinner.succeed(`quick-skills 缓存已更新: ${skillsRoot}`);

  const projectRoot = options.projectRoot ? path.resolve(options.projectRoot) : process.cwd();
  const projectMeta = readProjectSkillsMeta(projectRoot);

  if (!projectMeta || !projectMeta.preset) {
    console.log('当前项目未安装 skill preset，跳过项目内 skill 更新。');
    return;
  }

  const reinstallOptions: InstallSkillsOptions = {
    projectRoot,
    skillsRoot,
    preset: projectMeta.preset,
    yes: true,
    platforms: Object.keys(projectMeta.platforms) as InstallSkillsOptions['platforms'],
    scope: projectMeta.platforms[Object.keys(projectMeta.platforms)[0]]?.scope || 'project',
  };

  await installSkills(reinstallOptions);
}
