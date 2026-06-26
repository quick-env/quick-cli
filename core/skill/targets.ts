/*
 * @Description: 读取 quick-skills 仓库中的 install-targets.json 安装清单
 */
import fs from 'fs';
import path from 'path';

/** preset 中文档文件的源路径与项目内目标路径映射 */
interface InstallTargetsDocMapping {
  source: string;
  target: string;
}

/** install-targets.json 中单个 preset 的定义 */
interface InstallTargetsPreset {
  description: string;
  skills: string[];
  flows?: string[];
  docs?: InstallTargetsDocMapping[];
  directories?: string[];
}

/** 单个 skill 在 quick-skills 中的源目录与各平台目录名映射 */
interface InstallTargetsSkillMapping {
  sourceDir: string;
  dirNameByPlatform: Record<string, string>;
}

/** quick-skills 安装清单完整结构 */
export interface InstallTargetsManifest {
  version: string;
  repository?: string;
  platforms?: string[];
  defaultScope?: string;
  presets: Record<string, InstallTargetsPreset>;
  skills: Record<string, InstallTargetsSkillMapping>;
}

/**
 * 从 quick-skills 根目录加载 `install-targets.json`。
 *
 * @param skillsRoot - quick-skills 缓存或本地检出根目录
 * @returns 解析后的安装清单
 * @throws 当清单文件不存在时抛出错误，提示执行 `quick skill:update`
 * @see {@link resolveSkillsRoot}
 * @see {@link installSkills}
 */
export function loadInstallTargets(skillsRoot: string): InstallTargetsManifest {
  const manifestPath = path.join(skillsRoot, 'install-targets.json');

  if (!fs.existsSync(manifestPath)) {
    throw new Error(
      `install-targets.json not found at ${manifestPath}. ` +
        'Update quick-skills cache with `quick skill:update` or set QUICK_SKILLS_ROOT.'
    );
  }

  return JSON.parse(fs.readFileSync(manifestPath, 'utf8')) as InstallTargetsManifest;
}
