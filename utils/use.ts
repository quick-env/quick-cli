/*
 * @Author: liya
 * @Date: 2023-12-13 15:54:24
 * @LastEditors: liya
 * @LastEditTime: 2023-12-13 15:59:39
 * @Description: 方法调用
 */

import FileHelper from "./file";
const fileHelper = new FileHelper();
const root = process.cwd();
fileHelper._copyFile(`${root}/core/download.sh`, `${root}/dist/core/download.sh`)