/*
 * @Description: 列出 quick-skills 中可安装的 skill
 */
import fs from 'fs';
import path from 'path';

import { SKILLS_MANIFESTS_DIR } from '../../constant/skills';
import { resolveSkillsRoot } from './cache';
import { loadInstallTargets } from './targets';

/** quick-skills 注册表中单个可安装 skill 的摘要 */
interface SkillListEntry {
  id: string;
  description: string;
  sourceDir: string;
}

/**
 * 列出 quick-skills 安装清单中全部可安装的 skill（含描述与源目录）。
 *
 * @param skillsRoot - 可选 quick-skills 根目录；未传时经 {@link resolveSkillsRoot} 解析
 * @returns 按 skill ID 排序的条目列表
 * @see {@link loadInstallTargets}
 */
export async function listAvailableSkills(skillsRoot?: string): Promise<SkillListEntry[]> {
  const resolvedRoot = await resolveSkillsRoot(skillsRoot);
  const targets = loadInstallTargets(resolvedRoot);
  const manifestsDir = path.join(resolvedRoot, SKILLS_MANIFESTS_DIR);

  return Object.entries(targets.skills)
    .map(([id, mapping]) => {
      let description = '';
      const manifestPath = path.join(manifestsDir, `${id}.json`);
      if (fs.existsSync(manifestPath)) {
        try {
          const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8')) as { description?: string };
          description = manifest.description || '';
        } catch (error) {
          description = '';
        }
      }

      return {
        id,
        description,
        sourceDir: mapping.sourceDir,
      };
    })
    .sort((left, right) => left.id.localeCompare(right.id));
}
