//页面初始化 
(function jumpPage() {
	//跳转页面
	var subpages = ['home/index.html', 'look/index.html', 'order/index.html', 'goods/cart.html', 'my/index.html'];
	var subpage_style = {
		top: '0',
		bottom: '57px'
	};
	var aniShow = {}; //动画显示
	//首次启动切滑效果
	mui.plusReady(function() {
		//      launchScreen(); 
		var self = plus.webview.currentWebview();
		for(var i = 0; i < 5; i++) {
			var temp = {};
			//http://www.html5plus.org/doc/zh_cn/webview.html#plus.webview.create
			var sub = plus.webview.create(subpages[i], subpages[i], subpage_style);
			if(i > 0) {
				sub.hide();
			} else {
				temp[subpages[i]] = "true";
				mui.extend(aniShow, temp); //合并对象
			}
			self.append(sub);
		}
	});
	//当前激活选项
	var activeTab = subpages[0];
	//选项卡点击事件
	mui('.mui-bar-tab').on('tap', 'a', function(e) {

		var targetTab = this.getAttribute('href');

		if(targetTab == activeTab) {
			return;
		}
		//更换标题
		//var title = document.getElementById("title");
		//console.log(this.querySelector('.mui-tab-label').innerHTML);
		//title.innerHTML = this.querySelector('.mui-tab-label').innerHTML;
		//显示目标选项卡
		//若为iOS平台或非首次显示，则直接显示
		if(mui.os.ios || aniShow[targetTab]) {
			plus.webview.show(targetTab);
		} else {
			//否则，使用fade-in动画，且保存变量
			var temp = {};
			temp[targetTab] = "true";
			mui.extend(aniShow, temp);
			plus.webview.show(targetTab, "fade-in", 300);
		}
		//隐藏当前;
		plus.webview.hide(activeTab);
		//更改当前活跃的选项卡
		activeTab = targetTab;
	});

	//底部选项卡切换事件
	mui('.mui-bar-tab').on('tap', 'a', function(e) {
		//关闭所有打开的子页面 
		var targetTab = this.getAttribute('href');
		if(targetTab == activeTab) {
			return;
		}

		//自动静默登录
		//silentlogin();

		//显示目标选项卡
		//若为iOS平台或非首次显示，则直接显示 
		if(mui.os.ios || aniShow[targetTab]) {
			plus.webview.show(targetTab);
		} else {
			//否则，使用fade-in动画，且保存变量
			var temp = {};
			temp[targetTab] = "true";
			mui.extend(aniShow, temp);
			plus.webview.show(targetTab, "fade-in", 500);
		}
		//隐藏当前;
		plus.webview.hide(activeTab);
		//更改当前活跃的选项卡
		activeTab = targetTab;
		//更换标题
		var id = this.getAttribute("id");
		if(id == 'homeTab') {
			document.getElementById("homeTab").className = "mui-icon icon-logo";
			document.getElementById("typeTab").className = "mui-icon iconfont icon-order-filled";
			document.getElementById("lookTab").className = "mui-icon iconfont icon-kefu";
			document.getElementById("catTab").className = "mui-icon iconfont icon-wode";
		} else if(id == 'typeTab') {
			document.getElementById("homeTab").className = "mui-icon icon-logo";
			document.getElementById("typeTab").className = "mui-icon iconfont icon-order-filled";
			document.getElementById("lookTab").className = "mui-icon iconfont icon-kefu";
			document.getElementById("catTab").className = "mui-icon iconfont icon-wode";
		} else if(id == 'lookTab') {
			document.getElementById("homeTab").className = "mui-icon icon-logo";
			document.getElementById("typeTab").className = "mui-icon iconfont icon-order-filled";
			document.getElementById("lookTab").className = "mui-icon iconfont icon-kefu";
			document.getElementById("catTab").className = "mui-icon iconfont icon-wode";
		} else if(id == 'myTab') {
			document.getElementById("homeTab").className = "mui-icon icon-logo";
			document.getElementById("typeTab").className = "mui-icon iconfont icon-order-filled";
			document.getElementById("lookTab").className = "mui-icon iconfont icon-kefu";
			document.getElementById("catTab").className = "mui-icon iconfont icon-wode";
		} else {
			document.getElementById("homeTab").className = "mui-icon icon-logo";
			document.getElementById("typeTab").className = "mui-icon iconfont icon-order-filled";
			document.getElementById("lookTab").className = "mui-icon iconfont icon-kefu";
			document.getElementById("catTab").className = "mui-icon iconfont icon-wode";

			//执行我页面的绑定数据方法
			var info = localStorage.getItem("$logininfo");
			if(info == null || info.length == 0) return;
			var wv = plus.webview.getWebviewById(targetTab);
			if(wv) {
				wv.evalJS("bindData()");
			}
		}
	});
})()
var lastback = 0;
//初始化主页面
function initHome() {
	//关闭所有打开的子页面 
	//closePage("/home.html", "/main.html", ""); 

	//	try {
	//		var map = new BMap.Map("container");
	//		var myCity = new BMap.LocalCity();
	//		myCity.get(myFun);
	//	} catch(e) {
	//		console.log(e);
	//	}

	//获取当前客服电话（在客户页面有调用）
	//ajaxUrl(helpServices, '', function(d) {
	//	localStorage.setItem("$tel", d.content.Tel);
	//});

	plus.navigator.closeSplashscreen();
	mui.back = function(event) {
		//var wv=plus.webview.currentWebview();
		//console.log(wv.id);
		var t = new Date().getTime();
		if(t - lastback < 2000) {
			plus.runtime.quit();
		} else {
			lastback = t;
			mui.toast("再按一次退出和唐商城");
		}
	};
}

//初始化首页
function mainTab() {
	var self = plus.webview.currentWebview();
	for(var i = 3; i >= 0; i--) {
		var temp = {};
		var sub = plus.webview.create(subpages[i], subpages[i], subpage_style);
		if(i > 0) {
			//sub.hide();
		} else {
			temp[subpages[i]] = "true";
			mui.extend(aniShow, temp);
		}
		self.append(sub);
	}
}

//百度地图初始化
function initialize() {
	//	var mp = new BMap.Map('map');
	//	mp.centerAndZoom(new BMap.Point(121.491, 31.233), 11);
}

//静默登录
function silentlogin() {
	var info = localStorage.getItem("$logininfo");
	if(info == null || info.length == 0) return;

	info = JSON.parse(info);
	var ts = new Date().getTime() - info.Timestamp;
	//如果不超过25分钟，则退出
	if(ts < 1500000) return;
	console.log("silentlogin");

	var str = decrypt(info.Pwd, info.Account);
	mui.post(baseurl + silenceurl, {
		Account: info.Account,
		Pwd: str
	}, function(d) {
		if(d.result == "succeed") {
			info = {
				Account: info.Account,
				Pwd: encrypt(str, info.Account),
				Timestamp: new Date().getTime()
			};
			localStorage.setItem("$logininfo", JSON.stringify(info));
			//保证只有唯一用户才能调用
			localStorage.setItem("$userinfo_" + info.Account, JSON.stringify(d.content));
			return true;
		} else {
			localStorage.removeItem("$logininfo");
		}
	});
}