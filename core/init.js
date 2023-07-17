/*
 * @Author: liya
 * @Date: 2023-05-18 19:08:48
 * @LastEditors: liya
 * @LastEditTime: 2023-06-01 09:54:11
 * @Description: 创建工程模板
 */
const baseDir = process.cwd();
const chalk = require('chalk')
const shell = require('shelljs')
const install = require('./install.js')
const download = require('download-git-repo')
const { TEMPLATE_LIST } = require('../config/template.js')
const fileHelper = require('../utils/file.js')
class Init {
  constructor(projectName) {
    this.projectName = projectName;
    this.path = `${baseDir}/${projectName}`;
  }
  /**
   * 检查本地是否存在同名项目
   */
  async checkProject() {
    const isExit = await fileHelper.isExit(this.path)
    console.log(`isExit ---->`, isExit)
  }
  /**
   * 下载工程模板到本地
   */
  generateTpl() {}
  /**
   * 编译对应的工程模板
   */
  compileTpl() {}
  /**
   * 安装依赖
   */
  install() {}
}

module.exports = Init