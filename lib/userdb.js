var config = require('config-lite');
var mysql = require('mysql');
var Promise = require('bluebird');
var moment = require('moment');
// 连接数据库
var connection = mysql.createConnection(config.mysql);

// 有关user表操作
var User = {};

User.getPassByName = function (name) {
	var sql = 'select * from users where user_name = ' + connection.escape(name);

	return new Promise(function (resolve, reject) {
		connection.query(sql, function (err, user, fields) {
			if (err) {
			    throw err;
			}

			if (user.length === 0) {
			   reject();
			}
			for (var i = 0; i < user.length; i++) {
				user[i].regtime = moment(user[i].regtime).format('YYYY-MM-DD');
			}
			console.log(user);
			resolve(user[0]);

		});
	})
}

User.saveUserInfo = function (username, password) {
	var sql = 'insert into users(user_name, passwd, role_id, regtime) values(?, ?, 1,now())';
	var arr = [];
	arr.push(username);
	arr.push(password);

	return new Promise(function (resolve, reject) {
		connection.query(sql, arr, function (err, results, fields) {
			if (err) {
			    throw err;
			}
			resolve(results.affectedRows.toString());
		});
	})

}

User.checkValidName = function (username) {
	var sql = 'select id from users where user_name = ?';
	var arr = [];
	arr.push(username);

	return new Promise(function (resolve, reject) {
		connection.query(sql, arr, function (err, results, fields) {
			if (err) {
			    throw err;
			}
			resolve(results);
		});
	}) 
}

User.updateNameSign = function (username, signature, userId) {
	var sql = 'UPDATE users set user_name = ? , signature = ? where id = ?';
	var arr = Array.prototype.slice.call(arguments);

	return new Promise(function (resolve, reject) {
		connection.query(sql, arr, function (err, results, fields) {
			if (err) {
			    throw err;
			}
			resolve(results.affectedRows.toString());
		});
	}) 

}

User.getAllUser = function () {
	var sql = 'select * from users';

	return new Promise(function (resolve, reject) {
		connection.query(sql, function (err, results, fields) {
			if (err) {
			    throw err;
			}
		    for (var i = 0; i < results.length; i++) {
                results[i].regtime = moment(results[i].regtime).format('YYYY-MM-DD');
                console.log("%d\t%s\t", results[i].id, results[i].regtime);
            }
			console.log(results);
			resolve(results);
		});
	}) 
}

User.setUserRight = function (userId, setRight) {
	var sql = '';
	var arr = [];
	arr.push(userId);

	if (setRight == 'true') {
		sql = 'update users set remark_right = 1 where id = ?';
	}
	else {
		sql = 'update users set remark_right = 0 where id = ?';
	}

	return new Promise(function (resolve, reject) {
		connection.query(sql, arr, function (err, results, fields) {
			if (err) {
			    throw err;
			}
			console.log(results);
			resolve(results.affectedRows.toString());
		});
	}) 

}
User.getUserById = function (userId) {
	var sql = 'select user_name, regtime, signature, image from users where id = ?';
	var arr = Array.prototype.slice.apply(arguments);

	return new Promise(function (resolve, reject) {
		connection.query(sql, arr, function (err, results, fields) {
			if (err) {
			    throw err;
			}
			for (var i = 0; i < results.length; i++) {
				results[i].regtime = moment(results[i].regtime).format('YYYY-MM-DD');
			}
			console.log(results);
			resolve(results[0]);
		});
	});

}

exports.User = User;