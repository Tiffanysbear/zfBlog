$(function () {
    // 登录页面 获取各个输入框的信息
    $('.btn-login').on('click', function () {
        var username = $('#username').val();
        var password = $('#password').val();

        $.ajax({
            url: '/signin',
            type: 'POST',
            data: {username: username, password: password},
            dataTyepe: 'json'
        }).done(function (data) {
            if (data.state) {
                location.href = data.href;
                
            }
            else {
                $('.login-error').html(data.msg);
            }

        }).fail(function (err) {
            alert('ajax错误');
        });
    });

    
})