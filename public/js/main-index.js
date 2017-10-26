$(function () {
	// 类别选择列表
	var navList = new Vue({
		el: '#nav-choose-list',
		data: {
			countList: [],
			cur: 1,
			active: -1
		},
		watch: {
			cur: function (newVal, oldVal) {
				
			}
		},
		beforeMount: function () {
			this.getCountList();
		},
		methods: {
			getCountList: function () {
				// 进行ajax请求
				var _this = this;

				$.ajax({
					url: 'main/navList',
					type: 'POST',
					dataType: 'JSON'
				}).done(function (data) {
					// success
					_this.countList = data.list;

				}).fail(function (data) {
					alert('服务忙，请稍后');

				});

			},
			activeClick: function (index) {
				this.active = index;
			},
			categoryClick: function (index) {
				if (index != this.cur) {
					this.cur = index;
				}
				navTopList.cur = -1;
				pageBean.cur = 1;
				pageBean.getPageInfo(this.cur);
				essayContent.getData(this.cur, 1);

				console.log('导航index', this.cur);
			}
		}

	});
	// 分页组件
	var pageBean = new Vue({
		el: '.pagination',
		data: {
			all: 8,
			cur: 1
		},
		watch: {
			cur: function (newVal, oldVal) {
				if (navList.active == -1) {
					// 细化请求
					if (navTopList.cur == 5) {
						essayContent.getMyRemarkBlog(newVal);
					}
					else {
						essayContent.getNavData(navTopList.cur, newVal);
					}
				}
				else {
					essayContent.getData(navList.cur, newVal);
					
				}
			}
		},
		beforeMount: function () {
			this.getPageInfo(0);
		},
		methods: {
			getPageInfo: function (categoryId) {
				// 进行ajax请求
				var _this = this;

				$.ajax({
					url: 'main/pageBean',
					type: 'POST',
					data: {categoryId: categoryId},
					dataType: 'JSON'
				}).done(function (data) {
					// success 传过来是条数
					_this.all = data.count;

					console.log('count', data.count);
				}).fail(function (data) {
					alert('ajax错误');
				});				
			},
			getNavPage: function (type) {
				// 获取点击了头顶部导航条之后的内容条数
				// type nav 第几个
				var _this = this;

				$.ajax({
					url: 'main/navBean',
					type: 'POST',
					data: {navType: type},
					dataType: 'JSON'
				}).done(function (data) {
					// success 传过来是条数
					_this.all = data.count;

					console.log('nav count', data.count);
				}).fail(function (data) {
					alert('ajax错误');
				});	

			},
			getMyRemarkCount: function () {
				var _this = this;

				$.ajax({
					url: 'main/myRemarkCount',
					type: 'POST',
					dataType: 'JSON'
				}).done(function (data) {
					// success 传过来是条数
					_this.all = data.count;

					console.log('nav count', data.count);
				}).fail(function (data) {
					alert('ajax错误');
				});	
			},
			btnClick: function (data) {
				if (data != this.cur) {
					this.cur = data;
				}
				console.log('现在在'+this.cur+'页');
			},
			pageClick: function () {
			    console.log('现在在'+this.cur+'页');
			}
		},
		computed: {
	        indexs: function() {
	          var left = 1;
	          var right = this.all;
	          var ar = [];
	          if (this.all>= 5) {
	            if(this.cur > 3 && this.cur < this.all-2){
	                    left = this.cur - 2;
	                    right = this.cur + 2;
	            }
	            else {
	                if (this.cur<=3) {
	                    left = 1;
	                    right = 5;
	                }
	                else {
	                    right = this.all;
	                    left = this.all -4;
	                }
	            }
	         }
	        while (left <= right) {
	            ar.push(left);
	            left ++;
	        }
	        return ar;
	       }
		         
		}
	});
	// 文章组件
	var essayContent = new Vue({
		el: '#essay-content',
		data: {
			blogList: [],
			pageCur: pageBean.cur,
			navCur: navList.cur
		},
		beforeMount: function () {
			this.getNavData(1, this.pageCur);
		},
		methods: {
			getData: function (categoryId, pageIndex) {
				var page = pageIndex || 1;
				// 进行ajax请求
				var _this = this;

				$.ajax({
					url: 'main/indexInfo',
					type: 'POST',
					data: {categoryId: categoryId, page: page},
					dataType: 'JSON'
				}).done(function (data) {
					// success
					_this.blogList = data.blogList;

				}).fail(function (data) {
					alert('ajax请求失败！');
				});

			},
			getNavData: function (type, pageIndex) {
				var _this = this;
				// 推荐
				$.ajax({
					url: 'main/getNavInfo',
					type: 'POST',
					data: {navType: type, page: pageIndex},
					dataType: 'JSON'
				}).done(function (data) {
					// success
					_this.blogList = data.blogList;

				}).fail(function (data) {
					alert('ajax请求失败！');
				});
			},
			getMyRemarkBlog: function (pageIndex) {
				var _this = this;
				// 推荐
				$.ajax({
					url: 'main/getMyRemarkBlog',
					type: 'POST',
					data: {page: pageIndex},
					dataType: 'JSON'
				}).done(function (data) {
					// success
					_this.blogList = data.blogList;

				}).fail(function (data) {
					alert('ajax请求失败！');
				});
			},
			addZanCount: function (index) {
				var userId = $('.username').data('userid');
				var blogId = this.blogList[index].id;
				var _this = this;

				if ($.cookie(userId +'clickZan' +blogId)) {
					alert('已经点过赞了！');
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
				        _this.blogList[index].upvote_count = _this.blogList[index].upvote_count + 1;                
				        $.cookie(userId + 'clickZan' + blogId, 'true', {path: '/'});     
				     }

				 }).fail(function( msg ) {
				     alert('点赞失败');
				});
			}
		}
	});
	// 顶上的navbar
	var navTopList = new Vue({
		el: '#nav-top-list',
		data: {
			cur: 1
		},
		methods: {
			navClick: function (index) {
				this.cur = index;
				navList.active = -1;

				// 对分页条和内容进行分页
				if (index == 2) {
					pageBean.getNavPage(index);
					pageBean.cur = 1;
					essayContent.getNavData(this.cur, 1);
				}
				else if (index == 3 || index == 4) {
					pageBean.getPageInfo(0);// 3 和 4 的总页数是相同的
					pageBean.cur = 1;

					essayContent.getNavData(this.cur, 1);
				}
				else if(index == 5){
					// 我评，需要登录, 只有登录后才能点进来
					pageBean.getMyRemarkCount();
					pageBean.cur = 1;

					essayContent.getMyRemarkBlog(1);

				}
			}
		}
	});

});

/*
select blog_kind, count(blogs.id) count
from blog_category left outer join blogs
on blogs.category = blog_category.id 
GROUP by blog_kind*/