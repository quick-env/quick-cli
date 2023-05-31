/*
 * @Author: liya
 * @Date: 2023-05-18 19:08:48
 * @LastEditors: liya
 * @LastEditTime: 2023-05-31 10:04:45
 * @Description: 创建工程模板
 */
const baseDir = process.cwd();
const chalk = require('chalk')
const shell = require('shelljs')
const install = require('./install.js')
const download = require('download-git-repo')
const { TEMPLATE_LIST } = require('../config/template.js')

class Init {
  constructor(projectName) {
    this.projectName = projectName;
    this.path = `${baseDir}/${projectName}`;
  }
  /**
   * 检查本地是否存在同名项目
   */
  checkProject() {}
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