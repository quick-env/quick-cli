/*
 * @Description: quick-skills 远程缓存下载、校验与根目录解析
 */
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

import download from 'download-git-repo';

import {
  getSkillsCacheDir,
  getSkillsRepoCloneSpec,
  SKILLS_DOWNLOAD_CONFIG,
  SKILLS_INCREMENTAL_DIR,
} from '../../constant/skills';

const downloadRepo = promisify(download) as (
  repo: string,
  dest: string,
  options: { clone?: boolean }
) => Promise<void>;

/** `.quick-skills-cache.json` 元数据结构 */
interface SkillsCacheMeta {
  branch: string;
  cloneSpec: string;
  cacheDir: string;
  updatedAt: string;
}

/** quick-skills 根目录结构校验结果 */
interface SkillsRootValidation {
  valid: boolean;
  missing: string[];
}

/**
 * 返回缓存目录内元数据文件路径。
 *
 * @param cacheDir - skills 缓存目录
 * @returns `.quick-skills-cache.json` 绝对路径
 */
function getCacheMetaPath(cacheDir: string): string {
  return path.join(cacheDir, '.quick-skills-cache.json');
}

/**
 * 读取环境变量 `QUICK_SKILLS_ROOT` 配置值。
 *
 * @returns 环境变量字符串；未设置时返回空字符串
 */
export function getConfiguredSkillsRootFromEnv(): string {
  return process.env.QUICK_SKILLS_ROOT || '';
}

/**
 * 校验 quick-skills 根目录是否包含必需子目录与 `install-targets.json`。
 *
 * @param skillsRoot - 待校验的根目录
 * @returns 校验结果及缺失项列表
 */
function validateSkillsRoot(skillsRoot: string): SkillsRootValidation {
  const resolvedRoot = path.resolve(skillsRoot);
  const requiredEntries = [SKILLS_INCREMENTAL_DIR, 'install-targets.json'];
  const missing = requiredEntries.filter((entry) => {
    const targetPath = path.join(resolvedRoot, entry);
    return !fs.existsSync(targetPath);
  });

  return {
    valid: missing.length === 0,
    missing,
  };
}

/**
 * 根据校验结果生成可读错误信息。
 *
 * @param skillsRoot - 无效的 skills 根目录
 * @param context - 错误场景：下载缓存、CLI 参数或环境变量
 * @returns 多行提示字符串
 */
function formatSkillsRootValidationError(
  skillsRoot: string,
  context: 'downloaded cache' | 'configured root' | 'QUICK_SKILLS_ROOT'
): string {
  const validation = validateSkillsRoot(skillsRoot);
  const missingText = validation.missing.join(', ') || `${SKILLS_INCREMENTAL_DIR}/, install-targets.json`;
  const envHint =
    context === 'QUICK_SKILLS_ROOT'
      ? 'Fix QUICK_SKILLS_ROOT or unset it to use the remote cache.'
      : 'Set QUICK_SKILLS_ROOT to a local quick-skills checkout and retry.';

  return (
    `${context === 'downloaded cache' ? 'Downloaded quick-skills cache is invalid' : 'AI skills root is misconfigured'} ` +
    `at ${skillsRoot}. Missing: ${missingText}. ` +
    `The remote repo (${SKILLS_DOWNLOAD_CONFIG.URL}) may be incomplete — push incremental-project-skills/, install-targets.json, and WORKFLOW.md to main. ` +
    envHint
  );
}

/**
 * 判断 skills 根目录是否通过结构校验。
 *
 * @param skillsRoot - 待判断目录
 * @returns 结构完整返回 `true`
 * @see {@link validateSkillsRoot}
 */
export function isValidSkillsRoot(skillsRoot: string): boolean {
  return validateSkillsRoot(skillsRoot).valid;
}

/**
 * 将缓存元数据写入 `.quick-skills-cache.json`。
 *
 * @param cacheDir - 缓存目录
 * @param meta - 分支、clone 规格与时间戳
 */
function writeCacheMeta(cacheDir: string, meta: SkillsCacheMeta): void {
  fs.mkdirSync(cacheDir, { recursive: true });
  fs.writeFileSync(getCacheMetaPath(cacheDir), JSON.stringify(meta, null, 2));
}

/**
 * 确保本地存在有效的 quick-skills 缓存，必要时从 GitHub 重新 clone。
 *
 * @param options - `force` 强制刷新；`branch` 指定分支，默认 main
 * @returns 校验通过的缓存目录绝对路径
 * @throws 下载失败或缓存结构不完整时抛出错误
 * @see {@link resolveSkillsRoot}
 * @see {@link SKILLS_DOWNLOAD_CONFIG}
 */
export async function ensureSkillsCache(options: { force?: boolean; branch?: string } = {}): Promise<string> {
  const branch = options.branch || SKILLS_DOWNLOAD_CONFIG.BRANCH;
  const cacheDir = getSkillsCacheDir(branch);
  const cloneSpec = getSkillsRepoCloneSpec(branch);

  if (!options.force && isValidSkillsRoot(cacheDir)) {
    return cacheDir;
  }

  if (fs.existsSync(cacheDir)) {
    fs.rmSync(cacheDir, { recursive: true, force: true });
  }

  fs.mkdirSync(path.dirname(cacheDir), { recursive: true });

  try {
    await downloadRepo(cloneSpec, cacheDir, { clone: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(
      `Failed to download quick-skills from ${SKILLS_DOWNLOAD_CONFIG.URL} (${cloneSpec}): ${message}. ` +
        'Set QUICK_SKILLS_ROOT to a local quick-skills directory and retry.'
    );
  }

  if (!isValidSkillsRoot(cacheDir)) {
    throw new Error(formatSkillsRootValidationError(cacheDir, 'downloaded cache'));
  }

  writeCacheMeta(cacheDir, {
    branch,
    cloneSpec,
    cacheDir,
    updatedAt: new Date().toISOString(),
  });

  return cacheDir;
}

/**
 * 解析最终使用的 quick-skills 根目录：CLI 参数 > 环境变量 > 远程缓存。
 *
 * @param skillsRoot - CLI `--skills-root` 传入的可选路径
 * @returns 校验通过的 skills 根目录绝对路径
 * @throws 路径无效时抛出 {@link formatSkillsRootValidationError} 描述的错误
 * @see {@link ensureSkillsCache}
 * @see {@link getConfiguredSkillsRootFromEnv}
 */
export async function resolveSkillsRoot(skillsRoot?: string): Promise<string> {
  if (skillsRoot) {
    const resolved = path.resolve(skillsRoot);
    if (!isValidSkillsRoot(resolved)) {
      throw new Error(formatSkillsRootValidationError(resolved, 'configured root'));
    }
    return resolved;
  }

  const envRoot = getConfiguredSkillsRootFromEnv();
  if (envRoot) {
    const resolvedEnvRoot = path.resolve(envRoot);
    if (!isValidSkillsRoot(resolvedEnvRoot)) {
      throw new Error(formatSkillsRootValidationError(resolvedEnvRoot, 'QUICK_SKILLS_ROOT'));
    }
    return resolvedEnvRoot;
  }

  return ensureSkillsCache();
}
