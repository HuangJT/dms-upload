'use strict';

const { Controller } = require('egg');
const fs = require('fs');
const makeDir = require('make-dir');
const pump = require('mz-modules/pump');

const response = require('../util/response');
const { md5 } = require('../util/utils');

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
        await makeDir(currentDir);
        const writeStream = fs.createWriteStream(`${currentDir}/${newFile}`);
        await pump(part, writeStream);
        ctx.body = response.success(`${cdnUrlPrefix}/${newFile}`);
      }
    }
  }
}

module.exports = PutController;
