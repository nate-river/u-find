$(function() {

	var contacts = [];

	//侧边栏
	var sideEl = $('.indexlist');

	//用户列表
	var userlistEl = $('.userlist');

	//纪录每一组成员的offsettop
	var toplist = [];

	//页面滚动条的偏移量
	var off;

	///////// 触摸跳转需要的变量
	// 侧栏中每一个li的高度
	var sep;
	// 侧栏距离屏幕顶点的距离
	var sidetop;

	var sync = function() {
		$.ajax({
			url: "/getAlluser",
			dataType: "jsonp",
			success: function(list) {
				contacts = list;
				render(contacts);
				localStorage.__findu__data = JSON.stringify(contacts);
			},
		})
	}

	var render = function(contacts) {
		var data = {};
		contacts.forEach(function(v) {
			var key = v.sindex.toUpperCase();
			if(!data[key]) {
				data[key] = [];
			}
			data[key].push(v);
		})
		var indexlists = Object.keys(data).sort();

		var userlistHtml = '';
		var sideElHtml = '';
		indexlists.forEach(function(v) {
			sideElHtml += '<li>' + v.toUpperCase() + '</li>';

			var arr = data[v].sort(function(a, b) {
				return a.uname > b.uname;
			});
			userlistHtml += '<dt>' + v.toUpperCase() + '</dt>'
			arr.forEach(function(v) {
				userlistHtml += '<dd>' + v.uname + '<a href="tel:' + v.phone + '"></a></dd>';
			})
		})

		//创建侧边栏 和 用户列表
		sideEl.html(sideElHtml);
		sideEl.height(function() {
			return $(this).children().eq(0).outerHeight(true) * indexlists.length;
		});
		sideEl.css({
			top: ($(window).outerHeight(true) - sideEl.height()) / 2
		})
		userlistEl.html(userlistHtml)

		//去掉每组最后一个成员的分割线
		userlistEl.find('dt').prev().css('border', 'none');

		if(indexlists.length !== 0) {
			toplist = userlistEl.find('dt').map(function(i, v) {
				return {
					top: $(this).offset().top,
					index: indexlists[i]
				};
			}).get();
			if($('.fixedindex').text().trim() === '') {
				$('.fixedindex').text(toplist[0].index);
			}
		} else {
			$('.fixedindex').text('');
		}

		off = $('.header').height() + $('.sub-header').height() + $('.fixedindex').height();

		//触摸滚动需要的变量
		sep = sideEl.find('li').outerHeight(true);
		sidetop = sideEl.position().top;
	}

	/////////////////////////////////////////////////////////
	//保障没有网络也能使用
	if(localStorage.__findu__data) {
		contacts = JSON.parse(localStorage.__findu__data);
		setTimeout(function() {
			render(contacts);
		}, 0);
		setTimeout(function() {
			sync();
		}, 500);
		//校验用户是否   依然  存在
		//		setTimeout(function() {
		//			$.ajax({
		//				url: "http://139.129.167.201:3000/",
		//				dataType: "jsonp",
		//				success: function(list) {
		//					contacts = list;
		//					render(contacts);
		//					localStorage.__findu__data = JSON.stringify(contacts);
		//				},
		//			})
		//		})
	} else {
		sync();
	}

	// fixed andorid>>>>>>>>>
	$(window).on('resize', function() {
		search($('#search').val().trim());
	})

	////////////////////////////////////////////////////////////////////
	//头部固定字母条

	$(window).on('scroll', function() {
		$(".lxr_zhezhao,lxr_copyright").hide();
		var s = $(this).scrollTop() + off;
		if(toplist) {
			toplist.forEach(function(v) {
				if(s >= v.top) {
					$('.fixedindex').text(v.index);
					return;
				}
			})
		}
	});

	/////////////////////////////////////////////////////////////////////
	//右侧点击和拖动
	$('.indexlist').on('touchstart touchmove', function(e) {
		var soff = $('.header').height() + $('.sub-header').height();
		var y = e.originalEvent.changedTouches[0].clientY;
		var x = Math.floor((y - sidetop) / sep);
		if(x < 0 || x > toplist.length - 1) {
			return false;
		}
		$(window).scrollTop(toplist[x].top - soff);
		return false;
	});

	/////////////////////////////////////////////////////////////////
	//搜索功能
	var search = function(key) {
		var tmp = contacts.filter(function(v) {
			if(v.uname.indexOf(key) !== -1 || v.phone.indexOf(key) !== -1 || v.tel.indexOf(key) !== -1 || v.account.indexOf(key) !== -1) {
				return true;
			} else {
				return false;
			}
		})
		render(tmp);
	}

	// fixed ios position:fixed;
	$('#search').on('touchstart', function() {
		$(window).scrollTop(0);
	})

	$('#search').on('input', function(e) {
		search($(this).val().trim())
		if($(this).val().trim() === '') {
			$(this).trigger('blur');
		}
	})

	$(".header .lxr_change").on('touchstart', function() {
		localStorage.sgqreset = 'true';
	})

})