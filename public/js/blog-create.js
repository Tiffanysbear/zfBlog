$(function () {
	// 绑定提交事件，并校验填空情况
	$('#postMessageBtn').on('click', function () {
		// 检验填空的数值
		var blog = {};
		var blogId = $('#blog-id').data('blogid');
		var blogTitle = $('.blog-title').val();
		var blogSummary = $('.blog-summary').val();
		var blogContent = ue.getContent();
		var categoryId = $('.js-example-basic-single').select2("data")[0].id;
		var tags = $('.tag-items').val().replace(/，/ig, ',');
		var errTip = $('#errorTips');
		console.log(tags);
		console.log(blogContent);

		// 检验是否符合
		if (!blogTitle.length || !blogSummary.length || !blogContent.length) {
			return errTip.html('*标题、摘要、内容不能为空！');
		}
		// 处理标签
		var tagArr = tags.split(',');
		var realArr = [];
		for (var i = 0; i < tagArr.length; i++) {
			if (tagArr[i] != '') {
				realArr.push(tagArr[i]);
			}
		}
		// 检验标签是否合格, 并将其中文'，'转换成英文','拆分成字符串
		if (!realArr.length) {
			return errTip.html('*标签内无内容');
		}
		else {
			errTip.html('');
		}
		// 整理数据格式
		blog = {
			title: blogTitle,
			summary: blogSummary,
			content: blogContent,
			categoryId: categoryId,
			tags: tags
		};
		// 合格，上传
		$.ajax({
			url: 'saveBlog',
			type: 'POST',
			dataType: 'json',
			data: {blogId: blogId, title: blogTitle, summary: blogSummary, content: blogContent, categoryId: categoryId, tags: realArr.join(',')}
		}).done(function (data) {
			// 返回信息
			if (data.state) {
				alert('新增博客失败，请重新提交！');
			}
			else {
				alert(data.msg);
				location.href = $('.reflash-new').attr('href');
			}

		}).fail(function () {

		});

	});
});