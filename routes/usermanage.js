var express = require('express');
var router = express.Router();
var userModel = require('../models/users');

var checkLogin = require('../middlewares/check').checkLogin;

// GET 暂时移除checkLogin
router.get('/', checkLogin, function(req, res, next) {
	if (req.session.user) {
		req.session.user = req.session.user;
	}
	var userInfo = req.session.user;

	if (userInfo.role_id == 2) {
		userModel.getAllUser().then(function (users) {
			users.forEach(function (item) {
				delete item.passwd;
				
			});
			res.render('usermanage', {
				users: users,
				userInfo: userInfo
			});
		});
	}
	else {
		res.redirect('/index');
	}

});

// 用户禁言 remark_right
router.post('/setremark', checkLogin, function (req, res, next) {
	var userId = req.body.userId;
	var setRight = req.body.setRight;

	userModel.setUserRight(userId, setRight).then(function (affectRows) {
		if (+affectRows > 0) {
			res.send({msg: '禁言权限设置成功！'});
		}
		else {
 			res.send({msg: '服务器繁忙请稍后重试', state: 1});
 		}

	});

});

module.exports = router;