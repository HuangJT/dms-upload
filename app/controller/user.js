'use strict';

const Controller = require('egg').Controller;
const Joi = require('joi');
const moment = require('moment');
const jwt = require('jsonwebtoken');

const utils = require('../util/utils');
const constants = require('../util/constants');
const response = require('../util/response');

class UserController extends Controller {
  async create() {
    const { ctx } = this;
    const { username, password } = ctx.request.body;
    if (Joi.validate(username, Joi.string().replace(' ', '').min(3).max(16).required()).error) {
      ctx.body = response.simpleError('用户名为3~24个字符');
      return;
    }
    if (Joi.validate(password, Joi.string().regex(/^.*(?=.{6,16})(?=.*\d)(?=.*[A-Za-z]+).*$/).required()).error) {
      ctx.body = response.simpleError('密码为6~16位，必须包含数字、字母');
      return;
    }

    const isExist = await presenceDetection(ctx, username);
    if (isExist) {
      ctx.body = response.simpleError('用户名已注册');
      return;
    }
    const data = await ctx.model.User.create({
      username,
      password: utils.md5(password),
    });
    if (!data || !data.dataValues) {
      ctx.body = response.simpleError('注册失败，请重试');
      return;
    }
    ctx.body = response.success(data.dataValues);
  }

  async sign() {
    const { ctx } = this;
    const { username, password } = ctx.request.body;

    const data = await ctx.model.User.findPasswordByUsername(username);
    if (!data || !data.dataValues) {
      // 不存在该用户名
      ctx.body = response.simpleError('用户名或密码不正确');
      return;
    }
    const { dataValues } = data;
    if (dataValues.password !== utils.md5(password)) {
      // 密码不正确
      ctx.body = response.simpleError('用户名或密码不正确');
      return;
    }
    const expiration = moment(moment().add(1, 'd').format('YYYY-MM-DD 00:00:00')).unix();
    const token = jwt.sign({
      username: ctx.request.body.username,
      userId: dataValues.id,
      sub: dataValues.id,
      iat: moment().unix(),
      exp: expiration,
    }, constants.jwtSecret);
    ctx.cookies.set('token', token, {
      httpOnly: true,
      path: '/',
      expires: moment.utc(moment().add(1, 'd').format('YYYY-MM-DD 00:00:00')).toDate(),
    });
    ctx.body = response.success(token);
  }
}

async function presenceDetection(ctx, username) {
  const data = await ctx.model.User.findByUsername(username);
  return data && data.dataValues;
}

module.exports = UserController;
