var express = require('express');
var router = express.Router();
var blogsModel = require('../models/blogs');
var config = require('config-lite');
var everyPage = config.indexPageBean; // 每页展示条数

var checkNotLogin = require('../middlewares/check').checkNotLogin;

// navList count 获得每类的数量
router.post('/navList', function(req, res, next) {
	// 
	blogsModel.getCategoryCount().then(function (data) {
		console.log('121212', data);
		res.send({list: data});
	});

});

// 根据种类，设置分页
router.post('/pageBean', function (req, res, next) {
	// 0 全部
	var categoryId = req.body.categoryId;

	blogsModel.getCategoryPage(categoryId).then(function (data) {
		// 页数
		var count = 0;
		if (data.count % everyPage == 0) {
			count = Math.floor(data.count / everyPage);
		}
		else {
			count = Math.floor(data.count / everyPage) + 1;
		}

		res.send({count: count});
	});

});

router.post('/indexInfo', function (req, res, next) {
	var categoryId = req.body.categoryId;
	var pageIndex = req.body.page;// 请求第几页的内容

	console.log(typeof +categoryId, typeof +pageIndex);
	blogsModel.getIndexPage(+categoryId, +pageIndex).then(function (data) {
		// 请求
		res.send({blogList: data});
	});

});

// 获取nav点击后的分页信息
router.post('/getNavInfo', function (req, res, next) {
	var type = req.body.navType;
	var page = req.body.page;

	// 推荐分页信息
	if (+type == 2) {
		blogsModel.getRecommendPage(+page).then(function (data) {
			// page 
			res.send({blogList: data});
		});
	}
	else if (+type == 1) {
		blogsModel.getIndexPage(0, +page).then(function (data) {
			// 请求
			res.send({blogList: data});
		});
	}
	else if (+type == 3 || +type == 4) {
		blogsModel.getNewlyPage(+type, +page).then(function (data) {
			res.send({blogList: data});
		});
	}


});

// 获取nav top 主页信息
router.post('/myRemarkCount', function (req, res, next) {
	if (!req.session.user) {
		console.log('请先登录');
	}
	else {
		var userId = req.session.user.id;
		console.log('memeda', userId);
		blogsModel.getMyRemarkCount(userId).then(function (data) {
			// 页数
			var count = 0;
			if (data.count % everyPage == 0) {
				count = Math.floor(data.count / everyPage);
			}
			else {
				count = Math.floor(data.count / everyPage) + 1;
			}

			res.send({count: count});
		});
	}

});

// 获得我评的分页信息啦~
router.post('/getMyRemarkBlog', function (req, res, next) {
	var page = req.body.page;
	
	if (!req.session.user) {
		console.log('请先登录');
	}
	else {
		var userId = req.session.user.id;

		blogsModel.getMyRemarkBlog(+page, userId).then(function (data) {
			// 页数
			console.log('damimi', data);
			res.send({blogList: data});
		});
	}
});


// 设置导航条的分页
router.post('/navBean', function (req, res, next) {
	var type = req.body.navType;

	if (+type == 2) {
		// 推荐的
		blogsModel.getRecommendCount().then(function (data) {
			// 页数
			var count = 0;
			if (data.count % everyPage == 0) {
				count = Math.floor(data.count / everyPage);
			}
			else {
				count = Math.floor(data.count / everyPage) + 1;
			}

			res.send({count: count});
		});
	}
	else if (+type == 5) {
		// 3 最新 4 最热有pageBean接口解决, 5 我评

	}


});
module.exports = router;