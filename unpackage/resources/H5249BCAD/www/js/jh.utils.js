/*
 * 主要是接口
 */

//网络IP地址或域名 
var baseurl = "https://gl.chlxb.com:8229";
//var baseurl = "http://192.168.0.105:2822";

var req_url = {
	Account: {
		Register: baseurl + '/api/Account/Register', //注册 
	},
	Version: {
		Check: baseurl + '/api/Version/Check' //版本更新
	}
}

var Page = {
	PageSize: 20,
	PageIndex: 1
}

//跳转到某一个页面
function toPage(url, id, arg) {
	console.log("toPage:" + url);
	arg = arg || {};
	console.log("arg:" + JSON.stringify(arg));
	setTimeout(function() {
		mui.openWindow({
			url: url,
			id: id,
			styles: {
				popGesture: 'none'
			},
			show: {
				autoShow: true, //页面loaded事件发生后自动显示，默认为true
				aniShow: 'slide-in-right', //页面显示动画，默认为”slide-in-right“；
			},
			extras: arg,
			waiting: {
				autoShow: true
			}
		});
	}, 1000);
}

function OpenPage(url, id, arg) {
	arg = arg || {};

	return mui.openWindow({
		url: url,
		id: id,
		styles: {
			popGesture: 'none'
		},
		show: {
			autoShow: true, //页面loaded事件发生后自动显示，默认为true
			aniShow: 'slide-in-right', //页面显示动画，默认为”slide-in-right“；
		},
		extras: arg,
		waiting: {
			autoShow: true
		}
	});
}

function initPage(meth) {
	mui.plusReady(function() {
		var self = plus.webview.currentWebview();
		return meth(self);
	});
}

/**
 * 判断网络是否连接
 * return true:没有联网   false:联网
 */
function IsNetwork() {
	//console.log(plus.networkinfo.CONNECTION_NONE);
	// (plus.networkinfo.CONNECTION_NONE == 1 || plus.networkinfo.CONNECTION_UNKNOW == 0)
	return false;
}

/**
 * 判断是否可以连接服务器
 */
function IsServiceError() {
	mui.ajax(baseurl, {
		data: 'data=' + "",
		dataType: 'json',
		type: 'post',
		contentType: "application/x-www-form-urlencoded; charset=utf-8",
		timeout: 60000,
		success: function(d) {
			return false;
		},
		error: function(xhr, type, errorThrown) {
			//			console.log("1" + errorThrown);
			//			console.log("2" + JSON.stringify(xhr));
			//			console.log("3" + JSON.stringify(type));

			//type=="abort" 没网或访问不了服务器
			if(errorThrown == "Unauthorized") {
				return true;
			}

		}
	});
}

function checkLogin() {
	var info = localStorage.getItem("$logininfo");

	if(info == null || info.length == 0) {

		//setTimeout(function() {
		toPage('../user/login.html', '../user/login.html', {
			tag: 'login'
		});
		//}, 1000);

		return false;
	}
	return true;
}

/**
 * 登录系统
 */
function isLongin(funcSucceed) {
	var info = localStorage.getItem("$logininfo");
	var url = "../user/login.html";
	var id = "../user/login.html";
	console.log("isLogin()");
	if(info != null && info != "") {
		info = JSON.parse(info);
		var str = decrypt(info.Pwd, info.Account);
		mui.post(req_url.Account.Silenceurl, {
			Account: info.Account,
			Pwd: str,
			WxOpenId: info.WxOpenId,
			WbOpenId: info.WbOpenId,
			QqOpenId: info.QqOpenId,
		}, function(d) {
			if(d.result == "succeed") {

				var loginInfo = {
					MemberID: d.content.ID,
					Account: d.content.Account,
					Pwd: encrypt(d.content.Pwd, info.Account),
					Token: d.content.Token,
					WxOpenId: d.content.WxOpenId,
					WbOpenId: d.content.WbOpenId,
					QqOpenId: d.content.QqOpenId,
					BusinessType: d.content.BusinessType,
					Timestamp: new Date().getTime()
				};
				localStorage.setItem("$logininfo", JSON.stringify(loginInfo));
				//保证只有唯一用户才能调用
				localStorage.setItem("$userinfo_" + loginInfo.Account, JSON.stringify(d.content));
				console.log("isLoginEnd");
				if(funcSucceed != undefined) {
					funcSucceed();
				}
			} else {
				localStorage.removeItem("$logininfo");
				toPage(url, id);
			}
		});
	} else {
		localStorage.removeItem("$logininfo");
		toPage(url, id);
	}
}

//自动登录
function autoLogin(account, pwd) {
	var obj = {
		Account: account,
		Pwd: pwd
	}
	ajaxPost(req_url.Account.Login, obj, function(d) {
		if(d.result) {

			var loginInfo = {
				MemberID: d.content.ID,
				Account: d.content.Account,
				Pwd: encrypt(d.content.Pwd, obj.Account),
				Token: d.content.Token,
				WxOpenId: d.content.WxOpenId,
				WbOpenId: d.content.WbOpenId,
				QqOpenId: d.content.QqOpenId,
				BusinessType: d.content.BusinessType,
				Timestamp: new Date().getTime()
			};
			localStorage.setItem("$logininfo", JSON.stringify(loginInfo));
			//保证只有唯一用户才能调用
			localStorage.setItem("$userinfo_" + loginInfo.Account, JSON.stringify(d.content));

			mui.toast('登录成功！');

			setTimeout(function() {
				toPage('../home/index.html', '../home/index.html');
			}, 500);

		} else {
			mui.toast(d.error);
			localStorage.removeItem("$logininfo");
		}
	}, 1);
}
//自动登录
function threeLogin(arg) {
	ajaxPost(req_url.Account.ThreeLogin, arg, function(d) {
		if(d.result == "succeed") {
			var loginInfo = {
				MemberID: d.content.ID,
				Account: d.content.Account,
				Pwd: encrypt(d.content.Pwd, d.content.Account),
				Token: d.content.Token,
				WxOpenId: d.content.WxOpenId,
				WbOpenId: d.content.WbOpenId,
				QqOpenId: d.content.QqOpenId,
				BusinessType: d.content.BusinessType,
				Timestamp: new Date().getTime()
			};
			localStorage.setItem("$logininfo", JSON.stringify(loginInfo));
			//保证只有唯一用户才能调用
			localStorage.setItem("$userinfo_" + loginInfo.Account, JSON.stringify(d.content));

			mui.toast('登录成功！');

			setTimeout(function() {
				toPage('../home/index.html', '../home/index.html');
			}, 500);

		} else {
			//mui.toast(d.error);
			localStorage.removeItem("$logininfo");
			toPage('../user/bound.html', '../user/bound.html', arg);
		}
	}, 0);
}

function ajaxUrl(url, arg, meth, isError) {
	console.log(baseurl + url);
	mui.ajax(baseurl + url, {
		data: arg,
		dataType: 'json',
		type: 'post',
		contentType: "application/x-www-form-urlencoded; charset=utf-8",
		timeout: 60000,
		success: function(d) {
			//console.log(url + JSON.stringify(d));
			if(isError == 0) {
				meth(d);
			} else {
				if(d.result == "succeed") {
					meth(d);
				} else {
					mui.toast(d.error);
				}
			}
			return true;
		},
		error: function(xhr, type, errorThrown) {
			if(errorThrown == "Unauthorized") {
				isLongin(function() {
					mui.ajax(baseurl + url, {
						data: arg,
						dataType: 'json',
						type: 'post',
						contentType: "application/x-www-form-urlencoded; charset=utf-8",
						timeout: 60000,
						success: function(d) {
							if(isError == 0) {
								meth(d);
							} else {
								if(d.result == "succeed") {
									meth(d);
								} else {
									mui.toast(d.error);
								}
							}
							return true;
						},
						error: function(xhr, type, errorThrown) {
							console.log(errorThrown);
							return errorThrown;
						}
					});
				});
			} else {
				console.log(baseurl + url + errorThrown);
			}

		}
	});

}

function ajaxPost(url, arg, meth, isError) {
	var data = typeof arg == "string" ? arg : JSON.stringify(arg);
	console.log(url)
	mui.ajax(url, {
		data: data,
		dataType: 'json',
		type: 'post',
		contentType: "application/json; charset=utf-8",
		timeout: 60000,
		success: function(d) {
			if(isError == 0) {
				meth(d);
			} else {
				if(d.result == "succeed") {
					meth(d);
				} else {
					mui.toast(d.error);
				}
			}
			return true;
		},
		error: function(xhr, type, errorThrown) {

			if(errorThrown == "Unauthorized") {
				isLongin(function() {
					mui.ajax(url, {
						data: data,
						dataType: 'json',
						type: 'post',
						contentType: "application/json; charset=utf-8",
						timeout: 60000,
						success: function(d) {
							if(isError == 0) {
								meth(d);
							} else {
								if(d.result == "succeed") {
									meth(d);
								} else {
									mui.toast(d.error);
								}
							}
							return true;
						},
						error: function(xhr, type, errorThrown) {
							console.log(errorThrown);
							return errorThrown;
						}
					});
				});
			} else {
				console.log(url + ' ' + errorThrown);
			}
		}
	});
}

function colseSplashscreen() {
	plus.navigator.closeSplashscreen();
}

function colseScroll() {
	plus.webview.currentWebview().setStyle({
		scrollIndicator: 'none'
	});
}

function colseOrder(tid, state) {
	var arg = {
		mainId: tid,
		state: state
	}
	localStorage.setItem("$orderTab", JSON.stringify(arg));
	closePage("/home.html", "/main.html", "orderTab");
	mui.back();
}

function closePage(arg1, arg2, arg3) {
	var main = plus.webview.all();
	for(var i = 0; i < main.length; i++) {
		try {
			var exp = main[i].getURL();
			if(exp == null || exp.length == 0) continue;

			if(arg3.length > 0) {
				if(exp.indexOf(arg2) > -1) {
					//console.log('关闭'+main[i].id);
					mui.fire(main[i], arg3);
				}
			}

			if((exp.indexOf(arg1) < 0) && (exp.indexOf(arg2) <= 0)) {
				plus.webview.close(main[i], "none");
			}
		} catch(e) {
			console.log(e);
		}
	}
}

function refreshPage(arg1, arg2, arg3) {
	var list = plus.webview.getWebviewById(arg1); 
	mui.fire(list, arg2);
	if(arg3 == 1) {
		mui.back();
	}
}

function returnLevel() {
	setTimeout(function() {
		mui.back();
	}, 500);
}

function closePageOther(arg1) {
	var main = plus.webview.all();
	for(var i = 0; i < main.length; i++) {
		try {
			var exp = main[i].getURL();
			console.log(exp);
			if(exp == null || exp.length == 0) continue;

			if((exp.indexOf("/home.html") >= 0) || (exp.indexOf("/main.html") >= 0)) {
				continue;
			}

			if(exp.indexOf(arg1) < 0) {
				plus.webview.close(main[i], "none");
			}
		} catch(e) {
			console.log(e);
		}
	}
}

/*
 *对部分存储在本地信息进行加密和解密 
 */

/**
 * 加密
 * @param {Object} str 想要加密的字符串
 * @param {Object} key 加密的Key
 * return str 加密后的密文字符串
 */
function encrypt(str, key) {
	if(key == null || key.length <= 0) {
		//alert("请输入加密的Key.");
		return "";
	}
	var prand = "";
	for(var i = 0; i < key.length; i++) {
		prand += key.charCodeAt(i).toString();
	}
	var sPos = Math.floor(prand.length / 5);
	var mult = parseInt(prand.charAt(sPos) + prand.charAt(sPos * 2) + prand.charAt(sPos * 3) + prand.charAt(sPos * 4) + prand.charAt(sPos * 5));
	var incr = Math.ceil(key.length / 2);
	var modu = Math.pow(2, 31) - 1;
	if(mult < 2) {
		alert("Algorithm cannot find a suitable hash. Please choose a different password.  Possible considerations are to choose a more complex or longer password.");
		return null;
	}
	var salt = Math.round(Math.random() * 1000000000) % 100000000;
	prand += salt;
	while(prand.length > 10) {
		prand = (parseInt(prand.substring(0, 10)) + parseInt(prand.substring(10, prand.length))).toString();
	}
	prand = (mult * prand + incr) % modu;
	var enc_chr = "";
	var enc_str = "";
	for(var i = 0; i < str.length; i++) {
		enc_chr = parseInt(str.charCodeAt(i) ^ Math.floor((prand / modu) * 255));
		if(enc_chr < 16) {
			enc_str += "0" + enc_chr.toString(16);
		} else {
			enc_str += enc_chr.toString(16);
		}
		prand = (mult * prand + incr) % modu;
	}
	salt = salt.toString(16);
	while(salt.length < 8) {
		salt = "0" + salt;
	}
	enc_str += salt;
	return enc_str;
}

/**
 * 对加密的字符串进行解密
 * @param {Object} str 加密码后的字符串
 * @param {Object} key 加密密文Key
 * return 返回解密后的字符串
 */
function decrypt(str, key) {
	if(str == null || str.length < 8) {
		//alert("请输入最小8位长度的加密后字符串.");
		return "";
	}
	if(key == null || key.length <= 0) {
		//alert("请输入加密Key.");
		return "";
	}
	var prand = "";
	for(var i = 0; i < key.length; i++) {
		prand += key.charCodeAt(i).toString();
	}
	var sPos = Math.floor(prand.length / 5);
	var mult = parseInt(prand.charAt(sPos) + prand.charAt(sPos * 2) + prand.charAt(sPos * 3) + prand.charAt(sPos * 4) + prand.charAt(sPos * 5));
	var incr = Math.round(key.length / 2);
	var modu = Math.pow(2, 31) - 1;
	var salt = parseInt(str.substring(str.length - 8, str.length), 16);
	str = str.substring(0, str.length - 8);
	prand += salt;
	while(prand.length > 10) {
		prand = (parseInt(prand.substring(0, 10)) + parseInt(prand.substring(10, prand.length))).toString();
	}
	prand = (mult * prand + incr) % modu;
	var enc_chr = "";
	var enc_str = "";
	for(var i = 0; i < str.length; i += 2) {
		enc_chr = parseInt(parseInt(str.substring(i, i + 2), 16) ^ Math.floor((prand / modu) * 255));
		enc_str += String.fromCharCode(enc_chr);
		prand = (mult * prand + incr) % modu;
	}
	return enc_str;
}

//Javascript 格式化金额
//格式化：
function fmtMoney(s, n) {
	n = n > 0 && n <= 20 ? n : 2;
	s = parseFloat((s / 100 + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";
	var l = s.split(".")[0].split("").reverse(),
		r = s.split(".")[1];
	t = "";
	for(i = 0; i < l.length; i++) {
		t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
	}
	return t.split("").reverse().join("") + "." + r;
}

/*
 * 获取参数
 * 返回json，json的字段名称都是小写
 */
function parseUrl() {
	var url = document.location.href.toLowerCase();

	var x = url.indexOf("?");
	if(x < 0) {
		return null;
	}

	var param = url.substr(x + 1);
	var arr = param.split("&");
	var params = {};
	for(var i = 0; i < arr.length; i++) {

		if(arr[i] == null || arr[i].length == 0) continue;

		var sep = arr[i].split("=");
		var k = arr[i].substr('', sep);
		var v = arr[i].substr(sep + 1);
		if(sep.length < 2) continue;

		params[sep[0]] = sep[1];
	}

	return params;
}
/*
 * 短信倒计时
 * 返回json，json的字段名称都是小写
 */
function Countdown(obj) {
	obj.attr("disabled", true);
	var time = 60;
	var int = setInterval(function() {
		obj.text(time + ' 秒后重发');
		if(time == 0) {
			obj.removeAttr("disabled");
			obj.text("获取验证码");
			int = window.clearInterval(int);
		}
		time--;
	}, 1000);
}

//生成GUID
function guid() {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,
		function(c) {
			var r = Math.random() * 16 | 0,
				v = c == 'x' ? r : (r & 0x3 | 0x8);
			return v.toString(16);
		});
} 