/*
 * @Author: liya
 * @Date: 2023-09-04 18:25:55
 * @LastEditors: liya
 * @LastEditTime: 2023-12-13 15:52:41
 * @Description: 文件操作
 */
import fs from 'fs';
import chalk from 'chalk';

export default class FileHelper {
  /**
   * 路径是否存在
   * @param { string } path
   * @returns <boolean>
   */
  isExit(path: string): boolean {
    return fs.existsSync(path);
  }
  /**
   * 读取文件内容
   * @param { string } path
   * @returns fileData
   */
  _readFile(path: string) {
    if (!path) {
      console.log(chalk.red(`路径不存在`));
      return;
    }
    if (this.isExit(path)) {
      return new Promise((resolve, reject) => {
        fs.readFile(path, (error, data) => {
          if (error) {
            console.log(chalk.red(`读取${path}内容错误`));
            reject(error);
            return;
          }
          resolve(data.toString());
        });
      });
    } else {
      console.log(chalk.red(`文件不存在`));
    }
  }
  /**
   * 写内容到文件
   * @param { string } path
   * @param { string } data
   */
  _writeFile(path: string, data: string) {
    if (!path) {
      console.log(chalk.red(`路径不存在`));
      return;
    }
    fs.writeFile(path, data, 'utf8', (error) => {
      if (error) {
        console.log(chalk.red(`写入文件失败，文件路径: ${path}`));
        return;
      }
    });
  }
  /**
   * 拷贝文件
   * @param { string } from 源位置
   * @param { string } to 目标位置
   */
  _copyFile(from: string, to: string) {
    if (this.isExit(from)) {
      fs.copyFile(from, to, (error) => {
        if (error) {
          throw error;
        }
        console.log(chalk.green(`拷贝文件成功`));
      });
    } else {
      console.log(chalk.yellow(`目标路径: ${from} 不存在`));
    }
  }
}
