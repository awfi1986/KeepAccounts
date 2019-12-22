//基础数据初始化
 var init_base_data = function() {
 	var isInit = localStorage.getItem("$isInit");
 	if (isInit != 1) {
 		//用户表
 		var t_account_sql =
 			'create table if not exists t_account("guid" NVARCHAR(36),"login_name" NVARCHAR(20),"login_pwd" VARCHAR(20),"status" INT(4))';

 		db_helper.executeSql(t_account_sql);

 		var account = {
 			guid: '',
 			login_name: 'admin',
 			login_pwd: '',
 			status: 0
 		};

 		service.account.insert(account);

 		//消费记录表
 		var t_consume_record_sql =
 			'create table if not exists t_consume_record("guid" VARCHAR(36),"type" INT(4),"date" DATE,"consume_type_id" INT(4),"money" INT,"remark" NVARCHAR(2000),"create_time" DATETIME)';

 		db_helper.executeSql(t_consume_record_sql);

 		//消费类型表
 		var t_consume_type_sql =
 			'create table if not exists t_consume_type("id" INT(4),"type" INT(4),"name" NVARCHAR(20),"icon" VARCHAR(20),"sort" INT(4))';

 		db_helper.executeSql(t_consume_type_sql);

 		//初始化消费类型
 		var list = [{
 			id: 1,
 			name: '一般',
 			type: 0,
 			icon: 'icon-qian',
 			sort: 1
 		}, {
 			id: 2,
 			name: '餐饮',
 			type: 0,
 			icon: 'icon-mifan',
 			sort: 2
 		}, {
 			id: 3,
 			name: '购物',
 			type: 0,
 			icon: 'icon-gouwu',
 			sort: 3
 		}, {
 			id: 4,
 			name: '服饰',
 			type: 0,
 			icon: 'icon-yifu',
 			sort: 4
 		}, {
 			id: 5,
 			name: '交通',
 			type: 0,
 			icon: 'icon-jiaotong',
 			sort: 5
 		}, {
 			id: 6,
 			name: '娱乐',
 			type: 0,
 			icon: 'icon-yule',
 			sort: 6
 		}, {
 			id: 7,
 			name: '社交',
 			type: 0,
 			icon: 'icon-shejiao',
 			sort: 7
 		}, {
 			id: 10,
 			name: '房贷',
 			type: 0,
 			icon: 'icon-fangdaijisuan',
 			sort: 10
 		}, {
 			id: 11,
 			name: '房租',
 			type: 0,
 			icon: 'icon-fangzu',
 			sort: 11
 		}, {
 			id: 16,
 			name: '添加',
 			type: 0,
 			icon: 'icon-tianjia',
 			sort: 100
 		}, {
 			id: 12,
 			name: '工资',
 			type: 1,
 			icon: 'icon-web-icon-',
 			sort: 12
 		}, {
 			id: 13,
 			name: '兼职',
 			type: 1,
 			icon: 'icon-jianzhi',
 			sort: 13
 		}, , {
 			id: 14,
 			name: '礼金',
 			type: 0,
 			icon: 'icon-tuijianlijin',
 			sort: 14
 		}, {
 			id: 8,
 			name: '礼金',
 			type: 1,
 			icon: 'icon-tuijianlijin',
 			sort: 14
 		}, {
 			id: 9,
 			name: '理财',
 			type: 1,
 			icon: 'icon-licai',
 			sort: 15
 		}, {
 			id: 17,
 			name: '添加',
 			type: 1,
 			icon: 'icon-tianjia',
 			sort: 100
 		}, {
 			id: 18,
 			name: '日用品',
 			type: 0,
 			icon: 'icon-riyongpin',
 			sort: 18
 		}, {
 			id: 19,
 			name: '水果',
 			type: 0,
 			icon: 'icon-shuiguo',
 			sort: 19
 		}];
 		for (var i in list)
 			service.consume_type.insert(list[i]);

 		//初始化标示
 		localStorage.setItem("$isInit", 1);
 	} 
 };
 