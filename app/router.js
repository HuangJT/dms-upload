'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.post('/api/putFileByPath', controller.put.putFileByPath);
  router.post('/api/sign', controller.user.sign);
  router.post('/api/create', controller.user.create);
};
