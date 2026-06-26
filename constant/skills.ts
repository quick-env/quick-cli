import os from 'os';
import path from 'path';

export const SKILLS_DOWNLOAD_CONFIG = {
  USER: 'liya3719',
  REPO: 'quick-skills',
  BRANCH: 'main',
  URL: 'https://github.com/liya3719/quick-skills',
} as const;

export const SKILLS_CACHE_BASE_DIR = path.join(os.homedir(), '.quick', 'skills-cache');

export const SKILLS_INCREMENTAL_DIR = 'incremental-project-skills';
export const SKILLS_FLOWS_DIR = 'flows';
export const SKILLS_GOVERNANCE_DIR = 'stock-project-governance';
export const SKILLS_MANIFESTS_DIR = 'manifests/skills';

export const AI_CODING_FULL_FLOW_PRESET = 'ai-coding-full-flow';

export const QUICK_DIR = '.quick';
export const SKILLS_LOCK_FILE = 'skills-lock.json';
export const SKILLS_WORKFLOW_DOC = 'docs/WORKFLOW.md';

export const DEFAULT_SKILL_DOC_DIRS = ['docs/prd/_snapshots', 'docs/prd', 'docs/design', 'docs/testcase', 'docs/ai'] as const;

export const DEFAULT_INIT_PLATFORMS = ['cursor', 'claude'] as const;

export function getSkillsLockPath(projectRoot: string): string {
  return path.join(projectRoot, QUICK_DIR, SKILLS_LOCK_FILE);
}

export type SkillPlatformId = 'cursor' | 'claude' | 'agents';
export type SkillInstallScope = 'project' | 'global' | 'both';

export const SKILL_PLATFORMS: Record<
  SkillPlatformId,
  {
    projectSkillsDir: string;
    globalSkillsDir: string;
  }
> = {
  cursor: {
    projectSkillsDir: '.cursor/skills',
    globalSkillsDir: path.join(os.homedir(), '.cursor/skills'),
  },
  claude: {
    projectSkillsDir: '.claude/skills',
    globalSkillsDir: path.join(os.homedir(), '.claude/skills'),
  },
  agents: {
    projectSkillsDir: '.agents/skills',
    globalSkillsDir: path.join(os.homedir(), '.agents/skills'),
  },
};

export function getSkillsCacheBaseDir(): string {
  return process.env.QUICK_SKILLS_CACHE_BASE_DIR || SKILLS_CACHE_BASE_DIR;
}

export function getSkillsCacheDir(branch: string = SKILLS_DOWNLOAD_CONFIG.BRANCH): string {
  return path.join(getSkillsCacheBaseDir(), branch);
}

export function getSkillsRepoCloneSpec(branch: string = SKILLS_DOWNLOAD_CONFIG.BRANCH): string {
  return `${SKILLS_DOWNLOAD_CONFIG.USER}/${SKILLS_DOWNLOAD_CONFIG.REPO}#${branch}`;
}

export function parsePlatformList(value?: string): SkillPlatformId[] {
  if (!value) {
    return [...DEFAULT_INIT_PLATFORMS];
  }

  return value
    .split(',')
    .map((item) => item.trim())
    .filter((item): item is SkillPlatformId => item === 'cursor' || item === 'claude' || item === 'agents');
}
