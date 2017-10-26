var express = require('express');
var router = express.Router();
var blogsModel = require('../models/blogs');
var userModel = require('../models/users');
var Promise = require('bluebird');
var userModel = require('../models/users');
var fs = require('fs');
var formidable = require('formidable');

var checkLogin = require('../middlewares/check').checkLogin;

// GET /person-blog/u:userId/p:page 某个人博客分页展示
router.get('/u:userId/p:page', function(req, res, next) {
	// var pageAllCnt = 2;
	var nowPage = req.params.page || 1;
	var userId = req.params.userId;
	var isSelf = false;

	if (req.session.user) {
		req.session.user = req.session.user;
		var loginInfo = req.session.user;
		var loginId = loginInfo.id;
		if (+loginId === +userId) {
			isSelf = true;
		}
	}

	var blogsPromise = blogsModel.getTrunkBlog(userId, nowPage);
	var blogsCountPromise = blogsModel.getPageCount(userId);
	var userPromise = userModel.getUserById(+userId);
	
	
	Promise.all([blogsPromise, blogsCountPromise, userPromise]).then(function ([personBlog, pageAllCnt, userInfo]) {
		try {
			res.render('person-blog', {
	 			blog: personBlog,
	 			pagecnt: pageAllCnt,
	 			currentPage:nowPage,
	 			userInfo: userInfo,
	 			isSelf: isSelf
	 		});

		}
		catch (err) {
			res.render('error');
		}
	}).catch(function (err) {
		res.render('signin');
	});

});

router.post('/del', checkLogin, function (req, res, next) {
	var blogId = req.body.blogId;

	blogsModel.deleteBlog(+blogId).then(function (affectRows) {
		if (+affectRows > 0) {
			res.send({msg: '删除成功！'});
		}
		else {
			res.send({msg: '服务器繁忙请稍后重试', state: 1});
		}
	});
});

router.post('/saveInfo', checkLogin, function (req, res, next) {
	var username = req.body.username;
	var signature = req.body.signature;

	if (req.session.user) {
		req.session.user = req.session.user;
	}
	var userInfo = req.session.user;
	var userId = userInfo.id;

	userModel.updateNameSign(username, signature, userId).then(function (affectRows) {
		if (+affectRows > 0) {
			res.send({msg: '修改成功！'});
		}
		else {
			res.send({msg: '服务器繁忙请稍后重试', state: 1});
		}
	});

});

router.post('/favour', function (req, res, next) {
	var blogId = req.body.blogId;

	blogsModel.addZanCount(+blogId).then(function (affectRows) {
		if (+affectRows > 0) {
			res.send({msg: '点赞成功！'});
		}
		else {
			res.send({msg: '服务器繁忙请稍后重试', state: 1});
		}
	});

});

// 后端 用户图片头像上传
router.post('/saveUserImg', function (req, res, next) {
	var form = new formidable.IncomingForm();
	var userId = req.session.user.id;
 	form.uploadDir = './public/images/user-photo/'; //改变临时目录
 	res.setHeader('content-type', 'text/html');

 	form.parse(req, function(error, fields, files) {
 		for (var key in files) {
 			var file = files[key];
 			var fName = (new Date()).getTime();
 			switch (file.type) {
 		 		case 'image/jpeg':
 				fName = fName + '.jpg';
 				break;
 				case 'image/png':
 				fName = fName + '.png';
 				break;
 				case 'image/bmp':
 				fName = fName + '.bmp'
 				default:
 				fName = fName + '.png';
 				break;
 			}
 			console.log(file, file.size);
 			var uploadDir = './public/images/user-photo/' + fName;
 			fs.rename(file.path, uploadDir, function(err) {
 				if (err) {
 					res.write(err + "\n");
 					res.end();
 				}
 			});
 			var imgUrl = '../../images/user-photo/' + fName;
 			req.session.user.image = imgUrl;
 			console.log('imgUrl', 'images/user-photo/' + fName);
 			// 将图片地址存入数据库
 			blogsModel.saveUserImage(imgUrl, userId).then(function (affectRows) {
 				if (+affectRows > 0) {
 					res.json({
 					 	imgUrl: '../../images/user-photo/' + fName
 					});
 				}
 				else {
 					res.send({msg: '服务器繁忙请稍后重试', state: 1});
 				}
 			});
 		}
 	});

});

module.exports = router;