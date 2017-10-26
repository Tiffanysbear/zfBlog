var express = require('express');
var router = express.Router();
var userModel = require('../models/users');

var checkNotLogin = require('../middlewares/check').checkNotLogin;

// GET /signin 登录页
router.get('/', function(req, res, next) {
	var loginRefer = '/index';
	if (req.headers['referer']) {
		if (req.headers['referer'].indexOf('signin') == -1) {
			loginRefer = req.headers['referer'];
			req.session.loginRefer = loginRefer;
		}
		
	}
	else {
		req.session.loginRefer = loginRefer;
	}
	console.log('the back page', req.headers['referer']);
	console.log('req.session.loginRefer', req.session.loginRefer);
	res.render('signin');
});

// POST /signin 用户登录
router.post('/', function(req, res, next) {
	var username = req.body.username;
	var password = req.body.password;

	var userPromise = userModel.getPassByName(username);

	userPromise.then(function (user) {
		if (user.passwd) {
			if (user.passwd === password) {
				// 用户信息写入 session
				delete user.passwd;
				req.session.user = user;
				
				if (user.role_id === 2) {
					res.send({state: 1, href: '/backmanage'});
				}
				else {
					// 获取之前的一个网页
					console.log('@@@@@@@@', req.session.loginRefer, req.session.loginRefer.indexOf('/backmanage'));
					if (req.session.loginRefer.indexOf('/backmanage')) {
						res.send({state: 1, href: req.session.loginRefer });
					}
					else {
						res.send({state: 1, href: '/index' });
					}
				}
			}
			else {
				// 密码错误
				res.send({msg: '*用户名或密码错误'});
			}
		}

	}, function (err) {
		// 用户不存在
		res.send({msg: '*用户不存在'});
	});
});

module.exports = router;