function initPage(meth) {
	mui.plusReady(function() {
		var self = plus.webview.currentWebview();
		return meth(self);
	});
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
	}, 100);
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
			if (errorThrown == "Unauthorized") {
				return true;
			}

		}
	});
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
			if (isError == 0) {
				meth(d);
			} else {
				if (d.result == "succeed") {
					meth(d);
				} else {
					mui.toast(d.error);
				}
			}
			return true;
		},
		error: function(xhr, type, errorThrown) {
			if (errorThrown == "Unauthorized") {
				isLongin(function() {
					mui.ajax(baseurl + url, {
						data: arg,
						dataType: 'json',
						type: 'post',
						contentType: "application/x-www-form-urlencoded; charset=utf-8",
						timeout: 60000,
						success: function(d) {
							if (isError == 0) {
								meth(d);
							} else {
								if (d.result == "succeed") {
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
			if (isError == 0) {
				meth(d);
			} else {
				if (d.result == "succeed") {
					meth(d);
				} else {
					mui.toast(d.error);
				}
			}
			return true;
		},
		error: function(xhr, type, errorThrown) {

			if (errorThrown == "Unauthorized") {
				isLongin(function() {
					mui.ajax(url, {
						data: data,
						dataType: 'json',
						type: 'post',
						contentType: "application/json; charset=utf-8",
						timeout: 60000,
						success: function(d) {
							if (isError == 0) {
								meth(d);
							} else {
								if (d.result == "succeed") {
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
  
function closePage(arg1, arg2, arg3) {
	var main = plus.webview.all();
	for (var i = 0; i < main.length; i++) {
		try {
			var exp = main[i].getURL();
			if (exp == null || exp.length == 0) continue;

			if (arg3.length > 0) {
				if (exp.indexOf(arg2) > -1) {
					//console.log('关闭'+main[i].id);
					mui.fire(main[i], arg3);
				}
			}

			if ((exp.indexOf(arg1) < 0) && (exp.indexOf(arg2) <= 0)) {
				plus.webview.close(main[i], "none");
			}
		} catch (e) {
			console.log(e);
		}
	}
}

function refreshPage(arg1, arg2, arg3) {
	var list = plus.webview.getWebviewById(arg1);
	mui.fire(list, arg2);
	if (arg3 == 1) {
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
	for (var i = 0; i < main.length; i++) {
		try {
			var exp = main[i].getURL();
			console.log(exp);
			if (exp == null || exp.length == 0) continue;

			if ((exp.indexOf("/home.html") >= 0) || (exp.indexOf("/main.html") >= 0)) {
				continue;
			}

			if (exp.indexOf(arg1) < 0) {
				plus.webview.close(main[i], "none");
			}
		} catch (e) {
			console.log(e);
		}
	}
}

/*
 * 获取参数
 * 返回json，json的字段名称都是小写
 */
function parseUrl() {
	var url = document.location.href.toLowerCase();

	var x = url.indexOf("?");
	if (x < 0) {
		return null;
	}

	var param = url.substr(x + 1);
	var arr = param.split("&");
	var params = {};
	for (var i = 0; i < arr.length; i++) {

		if (arr[i] == null || arr[i].length == 0) continue;

		var sep = arr[i].split("=");
		var k = arr[i].substr('', sep);
		var v = arr[i].substr(sep + 1);
		if (sep.length < 2) continue;

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
		if (time == 0) {
			obj.removeAttr("disabled");
			obj.text("获取验证码");
			int = window.clearInterval(int);
		}
		time--;
	}, 1000);
}


var utils = {
	//生成GUID
	generate_guid: function() {
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,
			function(c) {
				var r = Math.random() * 16 | 0,
					v = c == 'x' ? r : (r & 0x3 | 0x8);
				return v.toString(16);
			});
	},
	//格式化金额
	fmtMoney: function(s, n) {
		n = n > 0 && n <= 20 ? n : 2;
		s = parseFloat((s / 100 + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";
		var l = s.split(".")[0].split("").reverse(),
			r = s.split(".")[1];
		t = "";
		for (i = 0; i < l.length; i++) {
			t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
		}
		return t.split("").reverse().join("") + "." + r;
	},
	//获得当前时间
	getDate: function(fmt) {
		var myDate = new Date();
		var dyear = myDate.getYear(); //获取当前年份(2位)     
		var cyear = myDate.getFullYear(); //获取完整的年份(4位,1970-????)    
		var month = myDate.getMonth() + 1; //获取当前月份(0-11,0代表1月)    
		var date = myDate.getDate(); //获取当前日(1-31)
		var day = myDate.getDay(); //获取当前星期X(0-6,0代表星期天)     
		var time = myDate.getTime(); //获取当前时间(从1970.1.1开始的毫秒数)    
		var hours = myDate.getHours(); //获取当前小时数(0-23)    
		var minute = myDate.getMinutes(); //获取当前分钟数(0-59)    
		var second = myDate.getSeconds(); //获取当前秒数(0-59)    
		var millsecond = myDate.getMilliseconds(); //获取当前毫秒数(0-999)    
		var ddate = myDate.toLocaleDateString(); //获取当前日期     
		var dtime = myDate.toLocaleTimeString(); //获取当前时间    
		var ddatetime = myDate.toLocaleString(); //获取日期与时间
		
		if (month < 10) month = '0' + month;
		if (date < 10) date = '0' + date;
		if (hours < 10) hours = '0' + hours;
		if (minute < 10) minute = '0' + minute;
		if (second < 10) second = '0' + second;
		
		if (fmt) {
			if (fmt == "yyyy-MM-dd") return cyear + "-" + month + "-" + date;
			if (fmt == "yyyy-MM-dd HH:mm:ss") return cyear + "-" + month + "-" + date + " " + hours + ":" + minute + ":" +
				second;
			if (fmt = "yyyy-MM") return cyear + "-" + month;
			if (fmt == "MM-dd") return month + "-" + date;
			if (fmt == "HH:mm:ss") return hours + ":" + minute + ":" + second;
			if (fmt == "HH:mm") return hours + ":" + minute;
			return cyear + "-" + month + "-" + date;
		} else {
			return cyear + "-" + month + "-" + date;
		}
	},
	//Date(1464671903000)/ 格式的日期转换
	fmtDate: function(dateStr, fmt) {
		if (dateStr == null) return '';
		//var myDate = new Date(parseInt(dateStr.slice(6)));
		var myDate = new Date(dateStr);
		var cyear = myDate.getFullYear(); //获取完整的年份(4位,1970-????)    
		var month = myDate.getMonth() + 1; //获取当前月份(0-11,0代表1月)    
		var date = myDate.getDate(); //获取当前日(1-31)  
		var hours = myDate.getHours(); //获取当前小时数(0-23)    
		var minute = myDate.getMinutes(); //获取当前分钟数(0-59)    
		var second = myDate.getSeconds(); //获取当前秒数(0-59)     
		if (month < 10) month = '0' + month;
		if (date < 10) date = '0' + date;
		if (hours < 10) hours = '0' + hours;
		if (minute < 10) minute = '0' + minute;
		if (second < 10) second = '0' + second;
		if (fmt) {
			if (fmt == "yyyy-MM-dd") return cyear + "-" + month + "-" + date;
			if (fmt == "yyyy-MM-dd HH:mm:ss") return cyear + "-" + month + "-" + date + " " + hours + ":" + minute + ":" +
				second;
			if (fmt == "yyyy-MM") return cyear + "-" + month;
			if (fmt == "MM-dd") return month + "-" + date;
			if (fmt == "HH:mm:ss") return hours + ":" + minute + ":" + second;
			if (fmt == "HH:mm") return hours + ":" + minute;
			return cyear + "-" + month + "-" + date;
		} else {
			return cyear + "-" + month + "-" + date;
		}
	},
	//获取两个时间差
	getDateDiff: function(startTime, endTime, diffType) {
		startTime = startTime.replace(/-/g, "/");
		endTime = endTime.replace(/-/g, "/");
		diffType = diffType.toLowerCase();
		var sTime = new Date(startTime);
		var eTime = new Date(endTime);
		var divNum = 1;
		switch (diffType) {
			case "ss":
				divNum = 1000;
				break;
			case "mm":
				divNum = 1000 * 60;
				break;
			case "hh":
				divNum = 1000 * 3600;
				break;
			case "dd":
				divNum = 1000 * 3600 * 24;
				break;
			default:
				break;
		}
		return parseInt((eTime.getTime() - sTime.getTime()) / parseInt(divNum));
	},
	//加密字符串
	encrypt: function(str, key) {
		if (key == null || key.length <= 0) {
			//alert("请输入加密的Key.");
			return "";
		}
		var prand = "";
		for (var i = 0; i < key.length; i++) {
			prand += key.charCodeAt(i).toString();
		}
		var sPos = Math.floor(prand.length / 5);
		var mult = parseInt(prand.charAt(sPos) + prand.charAt(sPos * 2) + prand.charAt(sPos * 3) + prand.charAt(sPos * 4) +
			prand.charAt(sPos * 5));
		var incr = Math.ceil(key.length / 2);
		var modu = Math.pow(2, 31) - 1;
		if (mult < 2) {
			alert(
				"Algorithm cannot find a suitable hash. Please choose a different password.  Possible considerations are to choose a more complex or longer password."
			);
			return null;
		}
		var salt = Math.round(Math.random() * 1000000000) % 100000000;
		prand += salt;
		while (prand.length > 10) {
			prand = (parseInt(prand.substring(0, 10)) + parseInt(prand.substring(10, prand.length))).toString();
		}
		prand = (mult * prand + incr) % modu;
		var enc_chr = "";
		var enc_str = "";
		for (var i = 0; i < str.length; i++) {
			enc_chr = parseInt(str.charCodeAt(i) ^ Math.floor((prand / modu) * 255));
			if (enc_chr < 16) {
				enc_str += "0" + enc_chr.toString(16);
			} else {
				enc_str += enc_chr.toString(16);
			}
			prand = (mult * prand + incr) % modu;
		}
		salt = salt.toString(16);
		while (salt.length < 8) {
			salt = "0" + salt;
		}
		enc_str += salt;
		return enc_str;
	},
	//解密
	encrypt: function(str, key) {
		if (str == null || str.length < 8) {
			//alert("请输入最小8位长度的加密后字符串.");
			return "";
		}
		if (key == null || key.length <= 0) {
			//alert("请输入加密Key.");
			return "";
		}
		var prand = "";
		for (var i = 0; i < key.length; i++) {
			prand += key.charCodeAt(i).toString();
		}
		var sPos = Math.floor(prand.length / 5);
		var mult = parseInt(prand.charAt(sPos) + prand.charAt(sPos * 2) + prand.charAt(sPos * 3) + prand.charAt(sPos * 4) +
			prand.charAt(sPos * 5));
		var incr = Math.round(key.length / 2);
		var modu = Math.pow(2, 31) - 1;
		var salt = parseInt(str.substring(str.length - 8, str.length), 16);
		str = str.substring(0, str.length - 8);
		prand += salt;
		while (prand.length > 10) {
			prand = (parseInt(prand.substring(0, 10)) + parseInt(prand.substring(10, prand.length))).toString();
		}
		prand = (mult * prand + incr) % modu;
		var enc_chr = "";
		var enc_str = "";
		for (var i = 0; i < str.length; i += 2) {
			enc_chr = parseInt(parseInt(str.substring(i, i + 2), 16) ^ Math.floor((prand / modu) * 255));
			enc_str += String.fromCharCode(enc_chr);
			prand = (mult * prand + incr) % modu;
		}
		return enc_str;
	}
}
