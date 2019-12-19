/**
 * 参数较验
 *
 * */
var reg = {
	phone: /^0?1[3|4|5|6|7|8][0-9]\d{8}$/, //手机号
	LetterNumber: /^[0-9a-zA-Z]+$/ //数字加字母
}
var verification = {
	stop: false, //倒计时
	//非空验证
	required: function(str, mess) {

		if("" == str || !str) {
			if("" != mess) {
				mui.toast(mess);
			}
			return false;
		}
		return true;
	},
	//验证手机号
	phone: function(tel, mess) {
		if(reg.phone.test(tel)) return true;

		if("" == mess || !mess) mess = '手机号错误！';

		mui.toast(mess);

		return false;
	},
	//验证密码(密码只能由数字和字母组成)
	password: function(w) {
		if("" == w || !w) {
			mui.toast('请输入密码!');
		} else if(w.length < 6) {
			mui.toast('密码至少大于等于6位!');
		} else if(w.length > 20) {
			mui.toast('密码不能超过20位!');
		} else if(w) {
			var reg = /^[0-9a-zA-Z]+$/;
			if(reg.test(w)) return true;
			mui.toast("密码只能由数字和字母组成");
		}
		return false;
	},

	//验证码倒计时
	code: function(tel, btn, type) {
		var that = this,
			tel = $.trim(tel);
		if(!this.phone(tel, 'userTel')) return false;
		if(true == that.stop) return false; //防止重复点击
		that.stop = true;

		var btn = $("#" + btn);
		btn.attr("disabled", true).text("正在发送");
		var _no = 60;
		var time = setInterval(function() {
			_no--;
			btn.text(_no + "秒后重发");
			if(_no == 0) {
				//btn.attr("disabled", false).text("获取验证码");
				btn.removeAttr('disabled').text("重新获取验证码");
				that.stop = false;
				_no = 60;
				clearInterval(time);
			}
		}, 1000);

		var url = "/Home/User/sendVerifyCode.html";
		$.post(url, {
			toNumber: tel,
			type: type
		}, function(result) {
			mui.toast(result.info);
			if(200 != result.status) {
				btn.removeAttr('disabled').text("获取验证码");
				that.stop = false;
				_no = 60;
				clearInterval(time);
			}
		}, 'json');
	}
};