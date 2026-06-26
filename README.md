### quick-cli

quick脚手架工具

### 功能

- 项目初始化与模板下载
- 工程化配置接入（ESLint、Prettier、Commitlint、Husky 等）
- 构建工具配置接入（vite、rspack、webpack）
- AI Coding skill 安装与使用说明

### 安装

```bash
npm install -g quick-cli
```

### 使用

基础命令：

```bash
quick init <project-name>
quick add
quick build:tools
quick template
quick config
```

AI skill 命令：

```bash
quick skill:install [--project-root <projectRoot>] [--preset ai-coding-full-flow] [--platform cursor,claude] [--scope project] [-y|--yes]
quick skill:update [--project-root <projectRoot>] [--skills-root <skillsRoot>]
quick skill:list [--skills-root <skillsRoot>]
```

init 可选参数：

```bash
quick init <project-name> [--with-ai] [--skip-ai] [-y]
```

### 智能化改造（init 流程）

1. 下载并编译项目模板，安装依赖
2. 询问是否安装 AI Coding skill 套件（`--with-ai` 跳过询问，`--skip-ai` 跳过安装）
3. 将 skill 安装到 `.cursor/skills` 与 `.claude/skills`
4. 生成 `docs/WORKFLOW.md`，终端输出首次使用指引

**CLI 不负责执行 skill**，请在 Cursor / Claude Code 中按文档顺序使用。

### 安装后项目结构

| 路径 | 说明 |
|------|------|
| `.cursor/skills/`、`.claude/skills/` | IDE 可用的 AI skill |
| `docs/WORKFLOW.md` | AI Coding 流水线与首次使用说明 |
| `docs/prd/`、`docs/design/`、`docs/testcase/` | 建议的产物目录 |
| `.quick/skills-lock.json` | skill 安装记录（供 `skill:update`） |

### 工程化与构建

- `quick add`：从 quick-config 下载 ESLint / Prettier / Commitlint / Husky 等配置
- `quick build:tools`：从 quick-config 下载 vite / rspack / webpack 构建配置

环境变量：

- `QUICK_SKILLS_ROOT`：指向本地 quick-skills 目录（远程 cache 不完整时使用）

### 更新日志

待补充

### 注意事项

> 执行工程化配置覆盖操作时，会存在多个提示，如提示信息消失，建议使用「上下键」提示出来执行后续操作
