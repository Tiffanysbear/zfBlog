var express = require('express');
var router = express.Router();
var blogModel = require('../models/blogs');

var checkLogin = require('../middlewares/check').checkLogin;

// GET 暂时移除checkLogin
router.get('/', checkLogin, function(req, res, next) {
	if (req.session.user) {
		req.session.user = req.session.user;
	}
	var userInfo = req.session.user;

	if (userInfo.role_id == 2) {
		blogModel.getBlogInfo().then(function (blogs) {
			res.render('backmanage', {
				blogs: blogs,
				userInfo: userInfo
			});
		});
	}
	else {
		res.redirect('/index');
	}


});

// 管理员删除博客
router.post('/delete', checkLogin, function (req, res, next) {
	var blogId = req.body.blogId;

	blogModel.deleteBlog(blogId).then(function (affectRows) {
		if (+affectRows > 0) {
			res.send({msg: '删除成功'});
		}
		else {
 			res.send({msg: '服务器繁忙请稍后重试', state: 1});
 		}
	});
});

// 博客文章管理 首页展示设置
router.post('/updateRecommend', checkLogin, function (req, res, next) {
	var blogId = req.body.blogId;
	var isUp = req.body.isUp;

	blogModel.updateRecommend(blogId, isUp).then(function (affectRows) {
		if (+affectRows > 0) {
			res.send({msg: '置顶设置成功！'});
		}
		else {
 			res.send({msg: '服务器繁忙请稍后重试', state: 1});
 		}
	});
});


module.exports = router;

var fs = require('fs');
fs.readFile('/path', function (err, file) {
	console.log('had been read');
});
console.log('To read...');
