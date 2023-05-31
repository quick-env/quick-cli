/*
 * @Author: liya
 * @Date: 2023-05-30 10:11:22
 * @LastEditors: liya
 * @LastEditTime: 2023-05-30 19:54:33
 * @Description: 文件操作工具集，包括删、读、写
 */
const fs = require('fs-extra');
class FileHelper {
  /**
   * 判断文件是否存在
   * @param { string } path
   * @returns boolean
   */
  async isExit(path) {
    const isExit = await fs.existsSync(path);
    return isExit;
  }
  /**
   * 读取文件内容
   * @param { string } path 文件路径
   * @returns { string } 文件内容
   */
  read(path) {
    const isExit = this.isExit(path);
    if (isExit) {
      const content = fs.readFileSync(path).toString();
      return content;
    }
    return '';
  }
  /**
   * 文件写入
   * @param { string} path 写入路径
   * @param { data } data 写入内容
   */
  write(path, data) {
    fs.writeFile(path, data, (error) => {
      if (error) {
        throw Error(error);
      }
    });
  }
  /**
   * 删除文件
   * @param { string } path 删除路径
   */
  del(path) {
    const isExit = this.isExit(path);
    isExit && fs.removeSync(path);
  }
}
module.exports = new FileHelper()