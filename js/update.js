//版本
function checkVersion() {
	var dt = new Date();
	var today = dt.getFullYear() + "-" + (dt.getMonth() + 1) + "-" + dt.getDate();
	var updatedate = plus.storage.getItem("$updatedate");
	
	if(updatedate != null && updatedate == today) {
		//console.log("今天已经检查版本更新");
		return;
	}

	//版本号
	var ver = plus.runtime.version;
	
	
	plus.runtime.getProperty(plus.runtime.appid, function(info) {
		ver = info.version;
	});

	//清空更新记录
	plus.storage.removeItem("$updatedate");
	plus.storage.removeItem("$update");
	
	var arg = {
		os: plus.os.name.toLowerCase(),
		version: ver
	};
	ajaxPost(req_url.Version.Check, arg, function(d) {
		//console.log(JSON.stringify(d));
		//标记当天已检查更新
		plus.storage.setItem("$updatedate", today);

		if(d.result != "succeed") return;

		//缓存
		plus.storage.setItem("$update", JSON.stringify(d.content));
		
		//苹果不自动更新
		if(mui.os.ios){
			return;
		}

		if(d.content.url == null || d.content.url.length == 0) {
			return;
		}

		plus.nativeUI.confirm("更新后有更多惊喜", function(e) {
			if(e.index == 0) {
				if(mui.os.android) {
					updateApp(d.content.url);
				} else {
					//plus.nativeUI.alert("有新版本，请及时更新！")

					if(d.content.url != null && d.content.url.length > 0) {
						//应用在appstore的地址
						plus.runtime.openURL(d.content.url);
					}

					//清空更新记录
					plus.storage.removeItem("$updatedate");
					plus.storage.removeItem("$update");
				}
			}
		}, "当前版本太旧了哦", ["马上更新", "下次再说"]);
	}, 0);
}

//下载对象
var dtask = null;
//更新
function updateApp(url) {
	if(!mui.os.android) return;
	if(dtask != null) return;

	var waiting = plus.nativeUI.showWaiting("下载中，请等待...");
	dtask = plus.downloader.createDownload(baseurl + url, {}, function(d, status) {
		if(status == 200) {
			//安装
			plus.runtime.install(d.filename, {
				force: true
			}, function() {
				console.log("更新成功！");

				//清空更新记录
				plus.storage.removeItem("$updatedate");
				plus.storage.removeItem("$update");

				/*plus.nativeUI.alert("更新完成！", function() {
					plus.runtime.restart();
				});*/
				plus.runtime.quit();
			}, function(e) {
				mui.toast("更新失败[" + e.code + "]：" + e.message);
			});
		} else {
			mui.toast("下载安装包失败！");
		}
	});
	dtask.addEventListener("statechanged", function() {
		if(dtask == null) {
			return;
		}
		switch(dtask.state) {
			case 1: // 开始
				//console.log("开始下载...");
				break;
			case 2: // 已连接到服务器
				//console.log("链接到服务器...");
				break;
			case 3: // 已接收到数据
				//console.log("下载数据更新:");
				console.log(dtask.downloadedSize + "/" + dtask.totalSize);
				break;
			case 4: // 下载完成
				console.log("下载完成！");
				//console.log(dtask.totalSize);
				waiting.close();
				break;
		}
	});
	dtask.start();
}