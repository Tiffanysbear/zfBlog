var Blog = require('../lib/mysqldb').Blog;
var Promise = require('bluebird');
var config = require('config-lite');
var everyPage = config.pagecount; // 每页展示条数
var indexPage = config.indexPageBean; // 主页展示条数

module.exports = {
	// 某个人的所有博客
	getTrunkBlog: function (userId, nowPage) {
		var startIndex = everyPage * (nowPage - 1);

		return Blog.getPersonBlogs(userId, startIndex, everyPage);
	},
	getPageCount: function (userId) {
		return Blog.getBlogAllcount(userId, everyPage);
	},
	getCommentsById: function (blogId) {
		return Blog.getCommentsById(blogId);
	},
	getBlogById: function (blogId) {
		return Blog.getBlogById(blogId);
	},
	addWatchCount: function (blogId) {
		return Blog.addWatchCount(blogId);
	},
	addZanCount: function (blogId) {
		return Blog.addZanCount(blogId);
	},
	getBlogInfo: function () {
		return Blog.getBlogInfo();
	},
	deleteBlog: function (blogId) {
		return Blog.deleteBlog(blogId);
	},
	updateRecommend: function (blogId, isUp) {
		return Blog.updateRecommend(blogId, isUp);
	},
	saveRemark: function (content, userId, blogId) {
		return Blog.saveRemark(content, userId, blogId);
	},
	saveNewBlog: function (userId, title, summary, content, categoryId, tags) {
		return Blog.saveNewBlog(userId, title, summary, content, categoryId, tags);
	},
	updateBlog: function (title, summary, content, tags, userId, categoryId, blogId) {
		return Blog.updateBlog(title, summary, content, tags, userId, categoryId, blogId);
	},
	getCategoryCount: function () {
		return Blog.getCategoryCount();
	},
	getCategoryPage: function (categoryId) {
		return Blog.getCategoryPage(categoryId);
	},
	getIndexPage: function (categoryId, pageIndex) {
		var startIndex = indexPage * (pageIndex - 1);

		return Blog.getIndexPage(categoryId, startIndex, indexPage);
	},
	getRecommendCount: function () {
		return Blog.getRecommendCount();
	},
	getRecommendPage: function (pageIndex) {
		var startIndex = indexPage * (pageIndex - 1);

		return Blog.getRecommendPage(startIndex, indexPage);
	},
	getNewlyPage: function (type, pageIndex) {
		var startIndex = indexPage * (pageIndex - 1);

		return Blog.getNewlyPage(type, startIndex, indexPage);
	},
	getMyRemarkCount: function (userId) {
		return Blog.getMyRemarkCount(userId);
	},
	getMyRemarkBlog: function (pageIndex, userId) {
		var startIndex = indexPage * (pageIndex - 1);

		return Blog.getMyRemarkBlog(userId, startIndex, indexPage);
	},
	saveUserImage: function (imgUrl, userId) {
		return Blog.saveUserImage(imgUrl, userId);
	}

};