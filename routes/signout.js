var express = require('express');
var router = express.Router();

var checkLogin = require('../middlewares/check').checkLogin;

// GET /signout 登出
router.get('/', checkLogin, function(req, res, next) {
	if (req.session.user) {
      req.session.user = '';
    }
    var backUrl = req.header('Referer') || '/';

    res.redirect(backUrl);
});

module.exports = router;