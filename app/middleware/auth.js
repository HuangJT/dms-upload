'use strict';

const utils = require('../util/utils');
const response = require('../util/response');

module.exports = () => {
  return async function auth(ctx, next) {
    // 暂时去掉权限验证（一般部署在内网），需要上传权限验证，请去掉 ctx.url.substr(0, 4) !== '/api'
    if (ctx.url === '/api/sign' || ctx.url.substr(0, 4) !== '/api' || ctx.url === '/api/create') {
      await next();
      return;
    }
    // 需要权限验证
    let { token } = ctx.headers;
    if (!token) {
      token = ctx.cookies.get('token', {
        signed: false,
      });
    }
    const data = utils.checkAuth(token);
    if (!data) {
      ctx.status = 401;
      ctx.body = response.error(401, '权限不足');
      return;
    }
    ctx.base = data;
    await next();
  };
};
