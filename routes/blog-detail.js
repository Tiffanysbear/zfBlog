var express = require('express');
var router = express.Router();
var blogsModel = require('../models/blogs');
var userModel = require('../models/users');

var checkLogin = require('../middlewares/check').checkLogin;

// GET /signin 登录页, 暂时拿掉登录信息
router.get('/d:blogId', function(req, res, next) {
	// var userId = req.session.user.id;
	// var userId = 1;
	var blogId = req.params.blogId;

	console.log(username, req.session.user);

	if (!req.session.user) {
		// 对某个博客浏览数进行 +1
		blogsModel.addWatchCount(+blogId);

		var commentPro = blogsModel.getCommentsById(blogId);
		var blogDetailPro = blogsModel.getBlogById(blogId);

		Promise.all([commentPro, blogDetailPro]).then(function ([comment, content]) {
			res.render('blog-detail', {
				comment: comment,
				content: content,
				userInfo: 0
			});
		});

	}
	else {
		// 对某个博客浏览数进行 +1
		var username = req.session.user.user_name;
		blogsModel.addWatchCount(+blogId);

		var commentPro = blogsModel.getCommentsById(blogId);
		var blogDetailPro = blogsModel.getBlogById(blogId);
		var userInfoPro = userModel.getPassByName(username);

		Promise.all([commentPro, blogDetailPro, userInfoPro]).then(function ([comment, content, user]) {
			delete user.passwd;
			req.session.user = user;

			res.render('blog-detail', {
				comment: comment,
				content: content,
				userInfo: user
			});
		});	
		
	}


});

// 添加评论
router.post('/saveRemark', function (req, res, next) {
	var blogId = req.body.blogId;
	var userId = req.body.userId;
	var remarkContent = req.body.remarkContent;

	if (remarkContent.length > 140) {
		return res.send({msg: '评论字数超过140字，评论失败', state: 1});
	}

	blogsModel.saveRemark(remarkContent, userId, blogId).then(function (affectRows) {
		if (+affectRows > 0) {
			res.send({msg: '评论添加成功'});
		}
		else {
 			res.send({msg: '服务器繁忙请稍后重试', state: 1});
 		}
	});

});

module.exports = router;