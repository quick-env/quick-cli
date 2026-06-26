/*
 * @Description: Skill 安装目标平台路径解析
 */
import path from 'path';

import { SKILL_PLATFORMS, SkillInstallScope, SkillPlatformId } from '../../constant/skills';

/**
 * 根据平台与安装范围，解析 skill 应写入的根目录列表。
 *
 * @param platform - 目标 IDE 平台（cursor / claude / agents）
 * @param scope - 安装范围：仅项目、仅全局或两者
 * @param projectRoot - 项目根目录
 * @returns skill 安装根路径数组（可能包含项目内与全局各一条）
 * @see {@link resolveSkillTargetDir}
 * @see {@link installSkills}
 */
export function resolvePlatformInstallRoots(
  platform: SkillPlatformId,
  scope: SkillInstallScope,
  projectRoot: string
): string[] {
  const platformConfig = SKILL_PLATFORMS[platform];
  const roots: string[] = [];

  if (scope === 'project' || scope === 'both') {
    roots.push(path.join(projectRoot, platformConfig.projectSkillsDir));
  }

  if (scope === 'global' || scope === 'both') {
    roots.push(platformConfig.globalSkillsDir);
  }

  return roots;
}

/**
 * 拼接单个 skill 在项目或全局下的目标目录路径。
 *
 * @param installRoot - {@link resolvePlatformInstallRoots} 返回的安装根目录
 * @param dirName - install-targets 中配置的平台目录名
 * @returns skill 完整目标路径
 */
export function resolveSkillTargetDir(installRoot: string, dirName: string): string {
  return path.join(installRoot, dirName);
}
