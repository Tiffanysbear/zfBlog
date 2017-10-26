var express = require('express');
var router = express.Router();
var userModel = require('../models/users');

var checkNotLogin = require('../middlewares/check').checkNotLogin;

// GET /signup 注册页
router.get('/', function(req, res, next) {
  res.render('signup');
});

// POST /signup 用户注册
router.post('/', checkNotLogin, function(req, res, next) {
	var username = req.body.username;
	var password = req.body.password;

	// 先验证其密码合法性
	if (!/\w{6,18}/.test(password)) {
 		res.send({msg: '密码格式错误，6-18个字符，只能包含字符、数字和下划线', state: 1});
 	}
 	// 保存用户名密码
 	userModel.saveUserInfo(username, password).then(function (affectRows) {
 		// insert插入成功
 		if (+affectRows > 0) {
 			// 注册成功后，返回的页面
 			// resolve();
 			// res.send({msg: 'person-blog/p1'});
 		}
 		else {
 			res.send({msg: '服务器繁忙请稍后重试', state: 1});
 		}
 	}).then(function () {
 		// 通过name搜索user所有信息
 		userModel.getPassByName(username).then(function (user) {
 			// 用户信息写入 session
			delete user.passwd;
			req.session.user = user;
			res.send({msg: 'person-blog/u'+ user.id+'/p1'});
 		});
 	});

});

// 检查用户名合法性
router.post('/check', function(req, res, next) {
	var username = req.body.username;

	console.log(999999, req.body.username);
	userModel.checkValidName(username).then(function (data) {
		console.log(88888888888, data);
		if (data.length) {
			res.send({msg: '用户名重复!请重新输入！', state: 1});
		}
		else {
			res.send({msg: '用户名合法！'});
		}
	});
});

module.exports = router;