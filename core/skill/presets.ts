/*
 * @Description: AI Coding 全流程 preset 的便捷安装与引导输出
 */
import {
  AI_CODING_FULL_FLOW_PRESET,
  DEFAULT_INIT_PLATFORMS,
  SkillInstallScope,
  SkillPlatformId,
} from '../../constant/skills';
import { installSkills, InstallSkillsResult, printSkillInstallSummary } from './install';

/** {@link installAiCodingFullFlowPreset} 入参 */
interface InstallPresetOptions {
  projectRoot: string;
  template?: string;
  skillsRoot?: string;
  platforms?: SkillPlatformId[];
  scope?: SkillInstallScope;
  yes?: boolean;
}

/**
 * 安装默认 preset「AI Coding 全流程」到指定项目。
 *
 * @param options - 项目根、平台、范围及是否跳过覆盖确认
 * @returns 安装结果摘要
 * @see {@link AI_CODING_FULL_FLOW_PRESET}
 * @see {@link installSkills}
 */
export async function installAiCodingFullFlowPreset(options: InstallPresetOptions): Promise<InstallSkillsResult> {
  return installSkills({
    projectRoot: options.projectRoot,
    skillsRoot: options.skillsRoot,
    preset: AI_CODING_FULL_FLOW_PRESET,
    platforms: options.platforms || [...DEFAULT_INIT_PLATFORMS],
    scope: options.scope || 'project',
    yes: options.yes,
  });
}

/**
 * 在终端打印 skill 安装摘要与首次使用引导。
 *
 * @param result - {@link installSkills} 或本模块安装函数的返回结果
 * @see {@link printSkillInstallSummary}
 */
export function printAiCodingOnboardingHint(result: InstallSkillsResult): void {
  printSkillInstallSummary(result);
}
