/*
 * @Author: liya
 * @Date: 2023-09-04 18:25:55
 * @LastEditors: liya
 * @LastEditTime: 2023-09-05 10:19:43
 * @Description: 文件操作
 */
import fs from 'fs';
export default class FileHelper {
  isExit(path: string): boolean {
    return fs.existsSync(path);
  }
}
