CREATE DATABASE IF NOT EXISTS `winwinfe_dms_upload`;

USE winwinfe_dms_upload;

CREATE TABLE `du_user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `employee_id` int(11) DEFAULT '0' COMMENT '工号',
  `nickname` varchar(64) DEFAULT NULL COMMENT '昵称（自动生成）',
  `real_name` varchar(64) DEFAULT NULL COMMENT '真实姓名',
  `phone_number` varchar(32) DEFAULT NULL COMMENT '手机号',
  `username` varchar(64) NOT NULL COMMENT '用户名',
  `password` varchar(32) NOT NULL COMMENT '登录密码',
  `type` tinyint(3) unsigned NOT NULL DEFAULT '2' COMMENT '用户类型：1：超管，2: 普通前端用户，3: 普通后端用户，4: 普通移动端用户',
  `avatar` varchar(1024) DEFAULT NULL COMMENT '头像图片地址',
  `wechat` varchar(1024) DEFAULT NULL COMMENT '绑定微信',
  `email` varchar(1024) DEFAULT NULL COMMENT '绑定点子邮箱',
  `gender` tinyint(3) unsigned NOT NULL DEFAULT '0' COMMENT '性别：1：男，2：女',
  `soft_delete` tinyint(3) unsigned DEFAULT '0' COMMENT '未删除/已删除：0/1',
  `create_time` datetime NOT NULL COMMENT '创建时间',
  `update_time` datetime NOT NULL COMMENT '最后修改时间',
  `create_guid` varchar(36) NOT NULL COMMENT '全局数据唯一标识',
  PRIMARY KEY (`id`),
  KEY `username` (`username`,`soft_delete`),
  KEY `username_2` (`username`,`password`,`soft_delete`),
  KEY `phone_number` (`phone_number`,`soft_delete`),
  KEY `phone_number_2` (`phone_number`,`password`,`soft_delete`),
  KEY `nickname` (`nickname`,`soft_delete`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8 COMMENT='用户表'
