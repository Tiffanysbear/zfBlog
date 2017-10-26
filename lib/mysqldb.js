var config = require('config-lite');
var mysql = require('mysql');
var Promise = require('bluebird');
var moment = require('moment');
// 连接数据库
var connection = mysql.createConnection(config.mysql);

// 有关blog表的操作
var Blog = {};

Blog.getPersonBlogs = function (userId, startIndex, everyPage) {

	var sql = 'select * from (select * from blogs where user_id = ' + connection.escape(userId) + ' order by create_time desc) order_blog  limit ' +
        connection.escape(startIndex) + ',' + connection.escape(everyPage);
    // 获取当页博客内容

	return new Promise(function (resolve, reject) {
		connection.query(sql, function (err, results, fields) {
			if (err) {
			    throw err;
			}
			if (results) {
			    for (var i = 0; i < results.length; i++) {
                    results[i].create_time = moment(results[i].create_time).format('YYYY-MM-DD');
                    console.log("%d\t%s\t", results[i].id, results[i].create_time);
                }
			    resolve(results);
			}
		});
	});
	
}

Blog.getBlogAllcount = function (userId, everyPage) {
	var sql = 'SELECT COUNT(*) sumcnt from  blogs where user_id = ' + connection.escape(userId);
	var pageAllCnt;
	// 获取某人的博客总数
	return new Promise(function (resolve, reject) {
		connection.query(sql, function (err, page, fields) {
		if (err) {
		    throw err;
		}
		if (page) {
		    //判断页数
		    if(page[0].sumcnt % everyPage == 0){
		        pageAllCnt = page[0].sumcnt / everyPage;
		    }else{
		        pageAllCnt =Number(page[0].sumcnt / everyPage) + 1 ;
		    }

		    resolve(pageAllCnt);
		    console.log('总页数:'+pageAllCnt);

		}
	});	
	});
}

Blog.getCommentsById = function (blogId) {
	var sql = 'select * from comments LEFT join users on comments.user_id = users.id where blog_id = ' + connection.escape(blogId);

	return new Promise(function (resolve, reject) {
		connection.query(sql, function (err, comment, fields) {
		if (err) {
		    throw err;
		}
		
		if (comment) {
			comment.forEach(function (val, index, array) {
				val.create_time = moment(val.create_time).format('YYYY-MM-DD HH:mm:ss');
			});
			resolve(comment);
		}

	});		
	});
}
Blog.getBlogById = function (blogId) {
	var sql = 'select * from users LEFT join blogs on blogs.user_id = users.id where blogs.id = ' + connection.escape(blogId);

	return new Promise(function (resolve, reject) {
		connection.query(sql, function (err, content, fields) {
		if (err) {
		    throw err;
		}
		
		if (content) {
			resolve(content);
		}

	});		
	});

}

Blog.addWatchCount = function (blogId) {
	var sql = 'update blogs set watch_count = watch_count + 1  where id = ?';
	var arr = Array.prototype.slice.call(arguments);

	return new Promise(function (resolve, reject) {
		connection.query(sql, arr, function (err, result, fields) {
			if (err) {
				throw err;
			}
			resolve(result.affectedRows.toString());
		});
	});	
}

Blog.getBlogInfo = function () {
	var sql = 'select blogs.id, title, recommend, create_time, lable, users.user_name from blogs LEFT join users on blogs.user_id = users.id';

	return new Promise(function (resolve, reject) {
		connection.query(sql, function (err, results, fields) {
			if (err) {
			    throw err;
			}
		    for (var i = 0; i < results.length; i++) {
                results[i].create_time = moment(results[i].create_time).format('YYYY-MM-DD');
                console.log("%d\t%s\t", results[i].id, results[i].create_time);
            }
			resolve(results);
		});
	}) 
}

Blog.deleteBlog = function (blogId) {
	var sql = 'delete from comments where blog_id = ?';
	var arr = Array.prototype.slice.call(arguments);


	return new Promise(function (resolve, reject) {
		connection.query(sql, arr, function (err, result, fields) {
			if (err) {
				throw err;
			}
			console.log('121212', +result.affectedRows.toString())
			if (+result.affectedRows.toString() >= 0) {
				sql = 'delete from blogs where id = ?';

				connection.query(sql, arr, function (err, result, fields) {
					if (err) {
						throw err;
					}
					resolve(result.affectedRows.toString());
				});
				
			}
			else {
				resolve(result.affectedRows.toString());
			}
		});

	});

	
}

Blog.updateRecommend = function (blogId, isUp) {
	var sql = '';
	var arr = [];
	arr.push(blogId);

	if (isUp == 'true') {
		sql = 'update blogs set recommend = 1 where id = ?';
	}
	else {
		sql = 'update blogs set recommend = 0 where id = ?';
	}

	return new Promise(function (resolve, reject) {
		connection.query(sql, arr, function (err, result, fields) {
			if (err) {
				throw err;
			}
			resolve(result.affectedRows.toString());
		});
	});
}
// 用户点赞
Blog.addZanCount = function (blogId) {
	var sql = 'update blogs set upvote_count = upvote_count + 1  where id = ?';
	var arr = Array.prototype.slice.call(arguments);

	return new Promise(function (resolve, reject) {
		connection.query(sql, arr, function (err, result, fields) {
			if (err) {
				throw err;
			}
			resolve(result.affectedRows.toString());
		});
	});
}

Blog.saveRemark = function (content, userId, blogId) {
	var sql = 'insert into comments(content, user_id, blog_id, create_time) values(?, ?, ?,now());'
	var arr = Array.prototype.slice.call(arguments);

	return new Promise(function (resolve, reject) {
		connection.query(sql, arr, function (err, result, fields) {
			if (err) {
				throw err;
			}
			resolve(result.affectedRows.toString());
		});
	});

}

Blog.saveNewBlog = function (userId, title, summary, content, categoryId, tags) {
	var sql = 'insert into blogs (user_id, title, summary, content, create_time, category, lable) values (?, ?, ?, ?, now(), ?, ?)';
	var arr = Array.prototype.slice.call(arguments);

	return new Promise(function (resolve, reject) {
		connection.query(sql, arr, function (err, result, fields) {
			if (err) {
				throw err;
			}
			resolve(result.affectedRows.toString());
		});
	});
}

Blog.updateBlog = function (title, summary, content, tags, userId, categoryId, blogId) {
	var sql = 'update blogs set title = ?, summary = ?, content = ?, create_time = now(), lable = ?, user_id = ?, category = ? where id = ?';
	var arr = Array.prototype.slice.call(arguments);

	return new Promise(function (resolve, reject) {
		connection.query(sql, arr, function (err, result, fields) {
			if (err) {
				throw err;
			}
			resolve(result.affectedRows.toString());
		});
	});
}

Blog.getCategoryCount = function () {
	var sql = 'select blog_category.id, blog_kind category, count(blogs.id) count from blog_category left outer join blogs on blogs.category = blog_category.id GROUP by blog_category.id';

	return new Promise(function (resolve, reject) {
		connection.query(sql, function (err, result, fields) {
			if (err) {
				throw err;
			}
			resolve(result);
		});
	});

}

Blog.getCategoryPage = function (categoryId) {
	if (categoryId == 0) {
		var sql = 'select count(*) count from blogs where 0 = ?';
	}
	else {
		var sql = 'select count(*) count from blogs where category = ?';
	}
	var arr = Array.prototype.slice.call(arguments);

	return new Promise(function (resolve, reject) {
		connection.query(sql, arr, function (err, result, fields) {
			if (err) {
				throw err;
			}
			resolve(result[0]);
		});
	});
}

Blog.getIndexPage = function (categoryId, startIndex, indexPage) {
	// 页面直接请求时，默认 categoryId == 0，按阅读数最先来排序
	if (categoryId == 0) {
		var sql = 'select * from (select blogs.id, users.id as userid, title, summary, recommend, create_time, upvote_count, comment_count, watch_count, user_name, image from blogs, users where users.id = blogs.user_id and 0 = ? order by watch_count desc) newly limit ?, ?';
	}
	else {
		var sql = 'select blogs.id, users.id as userid, title, summary, create_time, upvote_count, comment_count, watch_count, user_name, image from blogs, users where users.id = blogs.user_id and category = ? limit ?, ?';

	}
	var arr = Array.prototype.slice.call(arguments);
	console.log(sql);

	return new Promise(function (resolve, reject) {
		connection.query(sql, arr, function (err, result, fields) {
			if (err) {
				throw err;
			}
			console.log('~~~~~~~~~~~~~', result);
			resolve(result);
		});
	});

}

Blog.getRecommendCount = function () {
	var sql = 'select count(*) count from blogs where recommend > 0';

	return new Promise(function (resolve, reject) {
		connection.query(sql, function (err, result, fields) {
			if (err) {
				throw err;
			}
			resolve(result[0]);
		});
	});
}

Blog.getRecommendPage = function (startIndex, pageIndex) {
	var sql = 'select blogs.id, title, summary, recommend, create_time, upvote_count, comment_count, watch_count, user_name, image from blogs, users where users.id = blogs.user_id and recommend > 0 limit ?, ?';
	var arr = Array.prototype.slice.call(arguments);

	return new Promise(function (resolve, reject) {
		connection.query(sql, arr, function (err, result, fields) {
			if (err) {
				throw err;
			}
			resolve(result);
		});
	});

}

Blog.getNewlyPage = function (type, startIndex, indexPage) {
	if (type == 3) {
		var sql = 'select * from (select blogs.id, title, summary, recommend, create_time, upvote_count, comment_count, watch_count, user_name, image from blogs, users where users.id = blogs.user_id order by upvote_count desc) newly limit ?,?';
	}
	else {
		var sql = 'select * from (select blogs.id, title, summary, recommend, create_time, upvote_count, comment_count, watch_count, user_name, image from blogs, users where users.id = blogs.user_id order by create_time desc) newly limit ?,?';
	}
	var arr = [];
	arr.push(startIndex);
	arr.push(indexPage);

	console.log('11', sql, arr);

	return new Promise(function (resolve, reject) {
		connection.query(sql, arr, function (err, result, fields) {
			if (err) {
				throw err;
			}
			resolve(result);
		});
	});
}

Blog.getMyRemarkCount = function (userId) {
	var sql = 'SELECT count(*) count FROM blogs WHERE id IN (SELECT blog_id FROM comments WHERE user_id = ? GROUP BY blog_id)';
	var arr = Array.prototype.slice.call(arguments);

	return new Promise(function (resolve, reject) {
		connection.query(sql, arr, function (err, result, fields) {
			if (err) {
				throw err;
			}
			resolve(result[0]);
		});
	});

}

Blog.getMyRemarkBlog = function (userId) {
	var sql = 'SELECT blogs.id, title, summary, recommend, create_time, upvote_count, comment_count, watch_count, user_name, image FROM blogs, users WHERE blogs.id IN (SELECT blog_id FROM comments WHERE user_id = ? GROUP BY blog_id) and users.id = blogs.user_id limit ?,?';
	var arr = Array.prototype.slice.call(arguments);

	return new Promise(function (resolve, reject) {
		connection.query(sql, arr, function (err, result, fields) {
			if (err) {
				throw err;
			}
			resolve(result);
		});
	});
}

Blog.saveUserImage = function (imgUrl, userId) {
	var sql = 'update users set image = ? where id = ?';
	var arr = Array.prototype.slice.call(arguments);

	return new Promise(function (resolve, reject) {
		connection.query(sql, arr, function (err, result, fields) {
			if (err) {
				throw err;
			}
			resolve(result.affectedRows.toString());
		});
	});

}

exports.Blog = Blog;
