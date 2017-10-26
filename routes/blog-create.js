var express = require('express');
var router = express.Router();
var userModel = require('../models/users');
var blogsModel = require('../models/blogs');

var checkLogin = require('../middlewares/check').checkLogin;


router.get('/b:blogId',checkLogin, function(req, res, next) {
	// 看有没有数据 有blogid就是修改，没有就是啥也没有
	if (req.session.user) {
		req.session.user = req.session.user;
	}
	var userInfo = req.session.user;
	var blogId = req.params.blogId;

	// blogId 不存在表示新建
	if (!blogId) {
		res.render('blog-create', {
			blog: 0,
			userInfo: userInfo
		});
		
	}
	// 存在blogId，搜索出来将内容填上
	else {
		blogsModel.getBlogById(blogId).then(function (data) {
			res.render('blog-create', {
				blog: data[0],
				userInfo: userInfo
			});
		});
	}

});


// POST /saveBlog 用户登录checkLogin检查
router.post('/saveBlog', checkLogin, function(req, res, next) {
	if (req.session.user) {
		req.session.user = req.session.user;
	}
	var userInfo = req.session.user;
	// update时需要的参数
	var blogId = req.body.blogId;
	// 新增的内容
	var title = req.body.title;
	var summary = req.body.summary;
	var content = req.body.content;
	var categoryId = req.body.categoryId;
	var tags = req.body.tags;

	console.log('blogIdblogId~~~~~~', blogId);

	if (+blogId > 0) {
		// 修改内容 blogId update
		blogsModel.updateBlog(title, summary, content, tags, userInfo.id, categoryId, blogId)
		.then(function (affectRows) {
			if (+affectRows > 0) {
				res.send({msg: '修改博客内容成功'});
			}
			else {
	 			res.send({msg: '服务器繁忙请稍后重试', state: 1});
	 		}
		});

	}
	else {
		// 新建
		blogsModel.saveNewBlog(userInfo.id, title, summary, content, categoryId, tags).then(function (affectRows) {
			if (+affectRows > 0) {
				res.send({msg: '新增博客成功'});
			}
			else {
	 			res.send({msg: '服务器繁忙请稍后重试', state: 1});
	 		}
		});
	}


 	console.log(req.body, userInfo);
});

module.exports = router;