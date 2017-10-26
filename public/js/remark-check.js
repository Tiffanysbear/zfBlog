/**
 * Created by Tiffany on 2016/8/25.
 */
$(function () {
    var checkRemark = false;

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
    $('.clndr-next-button').html('next&gt;&gt;');
    $('.clndr-previous-button').html('&lt;&lt;pre');

    //评论字数不能超过140字
    $('#remarkCnt').blur(function () {
        var oremark = $('#remarkCnt').val();
        if (oremark.length > 140) {
            checkRemark = false;
            $('#errorCnt').css('display', 'inline-block');
        } else {
            checkRemark = true;
            $('#errorCnt').css('display', 'none');
        }
    });
    //点击发送按钮时
    $('#send').click(function () {
        var userId = $('.login_name').data('userid');
        var blogId = $('.blogid').data('blogid');

        console.log(typeof userId);

        if (!userId) {
            location.href = '/signin';
        }

        if (checkRemark === false) {
             $.toaster({ message : '评论失败，请检查输入是否有空', title : 'input error',priority : 'warning' });

        } else {
            //昵称和评论字数均合法，应该发送ajax异步请求
            $.ajax({
                url: '/blog-detail/saveRemark',
                method: 'POST',
                async: true,
                dataType:'json',
                timeout:30000,
                data: {
                    blogId: blogId,
                    userId: userId,
                    remarkContent: $('#remarkCnt').val()
                }
            }).done(function (data) {
                if (data.state == 1){
                    $.toaster({ message : '服务器错误，请重试', title : 'Send error' ,priority : 'danger'});
                }
                else {
                    $.toaster({ message : '评论成功,正在跳转中...', title : 'Input success' ,priority : 'success'});

                    window.setTimeout(function () {
                        location.reload(true);
                    }, 2000);

                }

            }).fail(function() {
                $.toaster({ message : '评论失败，请重试', title : 'Failure' ,priority : 'danger'});
            });

        }

    });


});