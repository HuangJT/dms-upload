'use strict';

const { Controller } = require('egg');
const fs = require('fs');
// const makeDir = require('make-dir');
const pump = require('mz-modules/pump');

const response = require('../util/response');
const { md5 } = require('../util/utils');
const { refreshRes } = require('../util/azure');

class PutController extends Controller {
  async putFileByPath() {
    const { ctx, config } = this;
    // 环境、唯一标示（id）
    const parts = ctx.multipart();
    const formFields = {};
    let part;
    while ((part = await parts()) != null) {
      if (part.length) {
        formFields[part[0]] = part[1];
      } else {
        if (!part.filename) {
          return;
        }
        const currentDir = config.cdnDir;
        const cdnUrlPrefix = config.cdnPrefix;
        const fileInfo = part.filename.split('.');
        const fileType = fileInfo[fileInfo.length - 1];
        const datetime = new Date().getTime();
        const fileName = md5(`${fileInfo[0]}${datetime}${fileType}`);
        const newFile = `${fileName}.${fileType}`;
        // 手动创建`${config.cdnDir}/res`目录
        // await makeDir(currentDir);
        const writeStream = fs.createWriteStream(`${currentDir}/res/${newFile}`);
        await pump(part, writeStream);
        ctx.body = response.success(`${cdnUrlPrefix}/res/${newFile}`);
      }
    }
  }

  async saveData2CDN() {
    const { ctx, config } = this;
    const { params, data } = ctx.request.body;
    const fileName = `${md5(params)}.json`;
    // 手动创建`${config.cdnDir}/data`目录
    try {
      fs.writeFileSync(`${config.cdnDir}/data/${fileName}`, data, 'utf8');
      const fileUrl = `${config.cdnPrefix}/data/${fileName}`;
      // Azure CDN刷新
      const refresh = await refreshRes(fileUrl);
      if (refresh) {
        ctx.body = response.success(fileUrl);
        return;
      }
      ctx.body = response.simpleError(`CDN刷新失败，请手动刷新:${fileUrl}`);
    } catch (e) {
      console.error(e);
    }
  }
}

module.exports = PutController;
