/*
 * @Author: liya
 * @Date: 2023-09-08 19:07:05
 * @LastEditors: liya
 * @LastEditTime: 2023-10-11 11:54:34
 * @Description: 初始化项目模板配置
 */
import os from 'os';
export const INIT_PROMPT = [
  {
    type: 'list',
    message: '请选择工程模板[默认使用Typescript]',
    name: 'template',
    choices: [
      'Vue3中后台工程模板',
      'Vue3移动端工程模板',
      'Electron工程模板',
      '组件工程模板',
    ],
    filter: (val: string) => {
      if (val.indexOf('Vue3中后台') > -1) {
        return 'Vue3Admin';
      }
      if (val.indexOf('Vue3移动端') > -1) {
        return 'Vue3Mobile';
      }
      if (val.indexOf('Electron') > -1) {
        return 'Electron';
      }
      if (val.indexOf('组件') > -1) {
        return 'Component';
      }
    },
  },
  {
    type: 'input',
    message: '创建者',
    name: 'author',
    default: os.userInfo().username,
  },
  {
    type: 'input',
    message: '当前版本',
    name: 'version',
    default: '1.0.0',
  },
  {
    type: 'input',
    message: '项目描述',
    name: 'description',
    default: (des: { template: string }) => {
      const { template } = des;
      switch (template) {
        case 'Vue3Admin':
          return 'Vue3中后台项目';
        case 'Vue3Mobile':
          return 'Vue3移动端项目';
        case 'Electron':
          return 'Electron项目';
        case 'Component':
          return '组件库项目';
        default:
          return '项目描述'
      }
    },
  },
];
