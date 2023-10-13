/*
 * @Author: liya
 * @Date: 2023-09-04 18:53:33
 * @LastEditors: liya
 * @LastEditTime: 2023-10-12 14:33:31
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
  }
  /**
   * 编译Electron模板
   */
  _electronTemplate() {
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
    const envContent = await fileHelper._readFile(env);
    const compileEnvContent = handlebars.compile(envContent)({
      name: this.name,
    });
    fileHelper._writeFile(env, compileEnvContent);
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
