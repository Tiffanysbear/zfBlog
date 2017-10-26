/**
 * Created by Tiffany on 2016/8/27.
 */

$(document).ready(function(){

    $('body').on('click','.heart', function(){
        var blogId = $(this).data('id');
        var userId = $('.username').data('userid');
        var originCount = $('#likeCount' + blogId).html();
        var zanCount = parseInt(originCount.substring(1, originCount.length - 1));

        // 种cookie来判定是否可以继续点赞
        if ($.cookie(userId + 'clickZan' + blogId)) {
            alert('您已经点过赞了');
            return;
        }

         $.ajax({
         method: 'POST',
         url: '/person-blog/favour',
         dataType:'json',
         data:{
             blogId: blogId
         },
         cache: false
         }).done(function(data) {
            if(data.state == 1){

                alert('点赞失败');
            }
            else {

                $('#likeCount' + blogId).html('(' + (zanCount +1)+ ')');                
                $.cookie(userId + 'clickZan' + blogId, 'true', {path: '/'});
                
             }

         }).fail(function( msg ) {
             alert('点赞失败');
             $.toaster({ message : '服务器错误，请重试', title : 'Send error' ,priority : 'danger'});
        });


    });//heart click end
    isUserValid = false;
    // 修改个人信息模块
    updateUserInfo();
    // 检查用户名重复
    checkUserValid();
    // 提交修改个人信息
    submitUserInfo();
    // 删除博客
    deleteBlog();
    // 上传图片文件
    uploadPic();

    // 初始化日历
    var calendars = {};
    var thisMonth = moment().format('YYYY-MM');
    calendars.clndr1 = $('.cal1').clndr({
        numberOfRows: 6,
        multiDayEvents: {
            singleDay: 'date',
            endDate: 'endDate',
            startDate: 'startDate'
        },
        showAdjacentMonths: true,
        adjacentDaysChangeMonth: false
    });

});

var uploadPic = function () {
    $('.profile-pic img').on('click', function () {
        $('#file').click();
    });
    // 上传图片
    $('#file').on('change', function () {
       ajaxFileUpload();
    });
}

var ajaxFileUpload = function () {
    $.ajaxFileUpload({
        url: '/person-blog/saveUserImg', //用于文件上传的服务器端请求地址
        secureuri: false, //是否需要安全协议，一般设置为false
        fileElementId: 'file', //文件上传域的ID
        dataType: 'json',//返回值类型 一般设置为json
        fileSize:5120000,
        type: 'POST',
        processData: false,
        contentType: false, 
        allowType:'jpg,jpeg,png,JPG,JPEG,PNG',
        success: function (data) {
            console.log(data);
            if (data.state) {
                alert('上传图片失败，请稍后再试！');
            }
            else {
                $('.profile-pic img').attr('src', data.imgUrl);
                $('.user-img').attr('src', data.imgUrl);
                
            }
        },
        error: function (err) {
            alert('上传图片ajax失败，请稍后再试！');
        }
    });
}

var deleteBlog = function () {
    $('.delete-blog').on('click', function () {
        var blogId = $(this).data('blogid');
        var isDelete = confirm('确认要删除吗？');

        if (isDelete) {
            $.ajax({
                url: '/person-blog/del',
                type: 'POST',
                data: {blogId: blogId},
                dataTyepe: 'json'
            }).done(function (data) {
                // 错误信息
                if (data.state) {
                    // 失败
                    alert('服务器繁忙，请稍后再试！');

                }
                else {
                   location.reload();

                }

            }).fail(function (err) {
                alert('ajax错误');
            }); 
        }


    });
}

var submitUserInfo = function () {
    // 提交签名，用户名等信息
    $('.photoshow').on('click', '.btn-info', function () {
        var uname = $('.uname').val();
        var sign = $('.signature').val();

        if (!sign || !isUserValid ) {
            if (uname != $('.username').html()) {
                alert('检查用户名是否重复,签名是否为空');
                return;
            }
        }
        if (ajax) {
            ajax.abort();
        }
        var ajax = $.ajax({
            url: '/person-blog/saveInfo',
            type: 'POST',
            data: {username: uname, signature: sign},
            dataTyepe: 'json'
        }).done(function (data) {
            // 错误信息
            if (data.state) {
                // 失败
                $('.update-tip').html(data.msg);

            }
            else {
               $('.btn-info').hide();
               // 变回展示框
               $('.signature').replaceWith('<div class="desk signature">' + $('.signature').val() + '</div>');
               $('.uname').replaceWith('<div class="desk uname">' + $('.uname').val() + '</div>');
               $('.update-tip').html('');
               $('.doremove').css('color', '#838383');
               // 将用户名展示到上面
               $('.username').html(uname);

            }

        }).fail(function (err) {
            alert('ajax错误');
        }); 



    });
}

var checkUserValid = function () {
    // 检查用户名是否重复
    $('.p-info').on('blur', '.uname', function () {
        var username = $('.uname').val();
        var errorTip = $('.update-tip');

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

                $('.btn-info').attr('disabled', 'disabled');
            }
            else {
                isUserValid = true;
                $('.btn-info').attr('disabled', false);
            }

        }).fail(function (err) {
            // alert('ajax错误');
        }); 
    });
}

// 点击按钮，展示修改框等
var updateUserInfo = function () {

    $('.doremove').on('click', function () {
        // 按钮变颜色
        var isUp = $('.btn-info').css('display');
        if (isUp == 'none') {
            $(this).css('color', '#45BCF9');
            isColor = false;
            $('.btn-info').show();
            // 变为input框
            $('.signature').replaceWith('<input class="desk signature" type="text" value="' + $('.signature').html() + '"/>');
            $('.uname').replaceWith('<input class="desk uname" type="text" value="' + $('.uname').html() + '"/>');
        }
        else {
            $(this).css('color', '#838383');
            isColor = true;
            $('.btn-info').hide();
            // 变回展示框
            $('.signature').replaceWith('<div class="desk signature">' + $('.signature').val() + '</div>');
            $('.uname').replaceWith('<div class="desk uname">' + $('.uname').val() + '</div>');
            $('.update-tip').html('');
        }

    });

}