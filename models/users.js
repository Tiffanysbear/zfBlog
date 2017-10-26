var User = require('../lib/userdb').User;

module.exports = {
	getPassByName: function (name) {
		return User.getPassByName(name);
	},
	saveUserInfo: function (username, password) {
		return User.saveUserInfo(username, password);
	},
	checkValidName: function (username) {
		return User.checkValidName(username);
	},
	updateNameSign: function (username, signature, userId) {
		return User.updateNameSign(username, signature, userId);
	},
	getAllUser: function () {
		return User.getAllUser();
	},
	setUserRight: function (userId, setRight) {
		return User.setUserRight(userId, setRight);
	},
	getUserById: function (userId) {
		return User.getUserById(userId);
	}
};