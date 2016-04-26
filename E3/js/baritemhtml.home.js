requirejs.config({
	baseUrl: '../js/',
	paths: {
	},
	shim: {
		'ajax': {
			deps: ['md5', 'load']
		}
	},
	waitSeconds: 15
});

requirejs(['mui', 'ajax', 'own'], function($) {

	(function($, doc, win) {
		$.init({
			swipeBack: false
		});
		//将ios中独有的东西在android上屏蔽
		var isLoadMarquee = false;
		var isLoadRecommend = false;
		var currentWebview;
		var homeDiv;
		var marqueeArray = []; //跑马灯数据数组
		var recommendArray = []; //推荐商品数组
		mui.plusReady(function() {
			currentWebview = plus.webview.currentWebview();
			homeDiv = document.getElementById('homeDiv');
			//进到这个函数说明plusready可以通信(解决为什么第一个显示的界面不没有触发show函数)
			pasueLink();
			//监听show事件请求数据
			currentWebview.addEventListener('show', function() {
				pasueLink();
			}, false);
			//添加每个item点击的监听事件
			mui('#recommend').on('tap', 'a', function() {
				var item = this;
				var itemID = this.getAttribute('href');
				var indexWebview = plus.webview.getWebviewById('HBuilder');
				var anishow = getaniShow();
				//弹入分类商品列表
				mui.fire(indexWebview, 'newWebView', {
					id: 'Home/product-detail-needtem.html',
					href: 'Home/product-detail-needtem.html',
					aniShow: anishow,
					title: '商品详情',
					isBars: false,
					barsIcon: '',
					product_id: itemID,
				});
			});
		});
		//与服务器通信
		function pasueLink() {
			if (!isLoadMarquee && marqueeArray.length <= 0) {
				//开始请求
				isLoadMarquee = true;
				ajax_get_Marquee(null, getMarqueeSuccess);
			}
			if (!isLoadRecommend && recommendArray.length <= 0) {
				isLoadRecommend = true;
				ajax_get_Recommend(null, getRecommendSuccess);
				
			}
		}

		function getMarqueeSuccess(data) {
			if (data.code == '000000') {
				marqueeArray = data.paomadeng;
				//设置跑马灯
				setMarquee();
			}
			isLoadMarquee = false;
		}

		function getRecommendSuccess(data) {
			if (data.code = '000000') {
				mui.each(data.hotSaleProducts, function(index, item) {
					var dataItem = {};
					dataItem.product_price = item.product_price;
					dataItem.product_name = item.product_name;
					dataItem.large_image_url = item.large_image_url;
					dataItem.product_id = item.product_id;
					recommendArray.push(dataItem);
				});
				//设置推荐商品
				setRecommend();
			}
			isLoadRecommend = false;
		}

		function setMarquee() {
			var sliderMarquee = document.getElementById('productSlider');
			var sliderGroup = document.createElement('div');
			sliderGroup.className = 'mui-slider-group mui-slider-loop';
			sliderMarquee.appendChild(sliderGroup);
			var sliderIndicator = document.createElement('div');
			sliderIndicator.className = 'mui-slider-indicator';
			sliderMarquee.appendChild(sliderIndicator);
			for (var i = 0; i < marqueeArray.length; i++) {
				if (0 == i) {
					var sliderItemDuplicate = document.createElement('div');
					sliderItemDuplicate.className = 'mui-slider-item mui-slider-item-duplicate';
					sliderItemDuplicate.innerHTML = '<a href="' + marqueeArray[marqueeArray.length - 1].contentId + '">\
							<img src="' + marqueeArray[marqueeArray.length - 1].imagerpath + '" />\
						</a>';
					sliderGroup.appendChild(sliderItemDuplicate);
				}
				var sliderItem = document.createElement('div');
				sliderItem.className = 'mui-slider-item';
				sliderItem.innerHTML = '<a href="' + marqueeArray[i].contentId + '">\
						<img src="' + marqueeArray[i].imagerpath + '" />\
					</a>';
				sliderGroup.appendChild(sliderItem);
				var indicatorItme = document.createElement('div');
				if (i == 0) {
					indicatorItme.className = 'mui-indicator mui-active';
				} else {
					indicatorItme.className = 'mui-indicator';
				}
				sliderIndicator.appendChild(indicatorItme);
				if (marqueeArray.length - 1 == i) {
					var sliderItemDuplicate = document.createElement('div');
					sliderItemDuplicate.className = 'mui-slider-item mui-slider-item-duplicate';
					sliderItemDuplicate.innerHTML = '<a href="' + marqueeArray[0].contentId + '">\
							<img src="' + marqueeArray[0].imagerpath + '" />\
						</a>';
					sliderGroup.appendChild(sliderItemDuplicate);
				}
				var slider = mui('.mui-slider');
				slider.slider();
			}
		}
		//设置推荐商品
		function setRecommend() {
			var recommend = document.getElementById('recommend');
			mui.each(recommendArray, function(index, item) {
				var li = document.createElement('li');
				li.className = 'mui-table-view-cell mui-media mui-col-xs-6';
				li.innerHTML = '<a href="' + item.product_id + '">\
					<div class= "bgDiv">\
						<img class="mui-media-object" src="' + item.large_image_url + '"/>\
						<div class="mui-media-body">\
							<p class="mui-ellipsis-2">' + item.product_name + '</p>\
							<p class="price-one">¥' + item.product_price.default_price + '</p>\
							<p class="price-two">¥' + item.product_price.list_price + '</p>\
						</div>\
					</div>\
				</a>';
				recommend.appendChild(li);
			});
		}
		
		//win.getRecommendSuccess = getRecommendSuccess;
		
	})(mui, document, window);

});