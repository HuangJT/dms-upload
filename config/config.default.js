'use strict';

module.exports = appInfo => {
  const config = exports = {
    sequelize: {
      dialect: 'mysql',
      database: 'winwinfe_dms_upload',
      host: '127.0.0.1',
      port: '3306',
      username: 'root',
      password: 'root1234',
      timezone: '+08:00',
    },
    multipart: {
      autoFields: false,
      defaultCharset: 'utf8',
      fieldNameSize: 100,
      fieldSize: '100kb',
      fields: 10,
      fileSize: '10mb',
      files: 10,
      fileExtensions: [],
      whitelist: null,
    },
  };

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1548236823708_8874';

  config.middleware = [
    'auth',
  ];

  config.security = {
    csrf: {
      enable: false,
      ignoreJSON: true,
    },
  };

  config.cors = {
    origin: '*',
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH',
  };

  config.bodyParser = {
    enable: true,
    encoding: 'utf8',
    formLimit: '10mb',
    jsonLimit: '1mb',
    strict: true,
    queryString: {
      arrayLimit: 100,
      depth: 5,
      parameterLimit: 1000,
    },
  };

  // CDN服务器目录
  config.cdnDir = '/usr/local/services/cdn/dms';
  // 需更换为cdn前缀
  config.cdnPrefix = '//cdn-example.com/dms';

  config.middleware = [];

  return config;
};
