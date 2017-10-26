$(function () {
	var agreeBtn = $('#agree-btn');
 	var errorTip = $('.reg-error');
 	var isUserValid = false;
 	// 检查用户名是否重复
 	$('#regname').on('blur', function () {
 		var username = $('#regname').val();

 		if (ajax) {
 			ajax.abort();
 		}
 		var ajax = $.ajax({
			url: '/signup/check',
			type: 'POST',
			data: {username: username},
			dataTyepe: 'json'
		}).done(function (data) {
			// 错误信息
			errorTip.html(data.msg);
			if (data.state) {
				isUserValid = false;
			}
			else {
				isUserValid = true;
			}

		}).fail(function (err) {
			// alert('ajax错误');
		});	
 	});

 	// 注册点击事件
 	$('.btn-login').on('click', function () {
 		var msg = '';
 		var pass = $('.pass');
 		var password = $('.pass').eq(0).val();
 		var username = $('#regname').val();

 		// 用户名合法
 		if (!isUserValid) {
 			return errorTip.html('用户名存在重复，请重新输入！');
 		}
 		// 验证两次密码是否一致
 		if (pass.eq(0).val() !== pass.eq(1).val()) {
 			return errorTip.html('两次密码输入不一致，请重新输入！');
 		}
 		// 验证统一按钮是否按下
 		if ($('#agree-btn').attr('checked') == 'false') {
 			return errorTip.html('未选择统一按钮，请点击！');
 		}
 		// 验证密码格式是否符合 6-18个字符 只能包含字符、数字和下划线
 		if (!/\w{6,18}/.test(password)) {
 			return errorTip.html('密码格式错误，6-18个字符，只能包含字符、数字和下划线');
 		}
 		// 合法后保存用户名
 		$.ajax({
			url: '/signup',
			type: 'POST',
			data: {username: username, password: password},
			dataTyepe: 'json'
		}).done(function (data) {
			// 错误信息
			if (data.state) {
				return errorTip.html(data.msg);
			}
			// 成功，跳转页面
			else {
				location.href = data.msg;
			}

		}).fail(function (err) {
			alert('ajax错误');
		});



 	});
	



})