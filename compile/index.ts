/*
 * @Author: liya
 * @Date: 2023-09-04 18:53:33
 * @LastEditors: liya
 * @LastEditTime: 2026-07-13 14:29:00
 * @Description: vue模板编译
 */
import { IBootstrap } from 'core/init';
import handlebars from 'handlebars';
import FileHelper from '../utils/file';
const fileHelper = new FileHelper();
export default class CompileTemplate {
  private root: string;
  private name: string;
  private meta!: IBootstrap;
  constructor(name: string, meta: IBootstrap) {
    this.name = name;
    this.meta = meta;
    this.root = `${process.cwd()}/${name}`;
  }
  /**
   * 编译vue模板
   */
  _vueTemplate() {
    this._compileRouter();
    this._compilePkg();
    this._compileEnv();
    this._compileVite();
    this._compileAiDocs();
  }
  /**
   * 编译Electron模板
   */
  _electronTemplate() {
    this._compileElectronRouter()
    this._compilePkg();
  }
  /**
   * 编译组件模板
   */
  _componentsTemplate() {}
  /**
   * 编译react模板
   */
  _reactTemplate() {}
  /**
   * 编译nest模板
   */
  _nestTemplate() {}
  /**
   * 编译路由
   */
  async _compileRouter() {
    const router = `${this.root}/src/router/index.ts`;
    const content = await fileHelper._readFile(router);
    const compileContent = handlebars.compile(content)({
      name: this.name,
    });
    fileHelper._writeFile(router, compileContent);
  }
  /**
   * 编译Electron Router
   */
  async _compileElectronRouter() {
    const router = `${this.root}/render/routes/index.ts`;
    const content = await fileHelper._readFile(router);
    const compileContent = handlebars.compile(content)({
      name: this.name,
    });
    fileHelper._writeFile(router, compileContent);
  }
  /**
   * 编译 AI 文档 AGENT.md + CLAUDE.md
   */
  async _compileAiDocs() {
    const docs = [`${this.root}/AGENT.md`, `${this.root}/CLAUDE.md`];
    await Promise.all(
      docs.map(async (doc) => {
        const content = await fileHelper._readFile(doc);
        const compileContent = handlebars.compile(content)({
          name: this.name,
        });
        fileHelper._writeFile(doc, compileContent);
      })
    );
  }
  /**
   * 编译pkg + Readme
   */
  async _compilePkg() {
    const pkg = `${this.root}/package.json`;
    const readme = `${this.root}/README.md`;
    const pkgContent = await fileHelper._readFile(pkg);
    const readmeContent = await fileHelper._readFile(readme);
    const compilePkgContent = handlebars.compile(pkgContent)({
      name: this.name,
      ...this.meta,
    });
    const compileReadmeContent = handlebars.compile(readmeContent)({
      name: this.name,
    });
    fileHelper._writeFile(pkg, compilePkgContent);
    fileHelper._writeFile(readme, compileReadmeContent);
  }
  /**
   * 编译环境变量[用于Vue3]
   */
  async _compileEnv() {
    const env = `${this.root}/.env.production`;
    const envDev = `${this.root}/.env.development`;
    const envContent = await fileHelper._readFile(env);
    const envDevContent = await fileHelper._readFile(envDev);
    const compileEnvDevContent = handlebars.compile(envDevContent)({
      name: this.name,
    });
    const compileEnvContent = handlebars.compile(envContent)({
      name: this.name,
    });
    fileHelper._writeFile(env, compileEnvContent);
    fileHelper._writeFile(envDev, compileEnvDevContent);
  }
  /**
   * 编译vite config
   */
  async _compileVite() {
    const viteConfig = `${this.root}/vite.config.ts`;
    const viteConfigContent = await fileHelper._readFile(viteConfig);
    const compileViteContent = handlebars.compile(viteConfigContent)({
      name: this.name,
    });
    fileHelper._writeFile(viteConfig, compileViteContent);
  }
}
