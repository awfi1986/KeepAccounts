/*
 * sqlite 数据操作基础函数 
 */
var dbAction = {
	dbName: 'keepAccounts_DB', //数据库名称
	dbPath: '_doc/keepAccounts.db', //数据库存储地址
	openDB: function() {
		plus.sqlite.openDatabase({
			name: dbAction.dbName,
			path: dbAction.dbPath,
			success: function(e) {
				console.log('openDatabase success!');
			},
			fail: function(e) {
				console.log('openDatabase failed: ' + JSON.stringify(e));
			}
		});
	},
	closeDB: function() {
		plus.sqlite.closeDatabase({
			name: dbAction.dbName,
			success: function(e) {
				console.log('closeDatabase success!');
			},
			fail: function(e) {
				console.log('closeDatabase failed: ' + JSON.stringify(e));
			}
		});
	},
	isOpenDB: function() {
		return plus.sqlite.isOpenDatabase({
			name: dbAction.dbName,
			path: dbAction.dbPath
		});
	},
	executeSql: function(exec_sql) {
		if (!dbAction.isOpenDB()) {
			dbAction.openDB();
		}
		plus.sqlite.executeSql({
			name: dbAction.dbName,
			sql: exec_sql,
			success: function(e) { 
				dbAction.closeDB();
				console.log('executeSql success!'); 
			},
			fail: function(e) {
				dbAction.closeDB();
				console.log('executeSql failed: ' + JSON.stringify(e));
			}
		});
	},
	selectSql: function(sql, callback) {
		if (!dbAction.isOpenDB()) {
			dbAction.openDB();
		}
		plus.sqlite.selectSql({
			name: dbAction.dbName,
			sql: sql,
			success: function(data) {
				dbAction.closeDB();
				callback(data);
				console.log('executeSql success!');
			},
			fail: function(e) {
				dbAction.closeDB();
				console.log('executeSql failed: ' + JSON.stringify(e));
			}
		});
	} 
};

//基础数据初始化
var init_base_data = function() {
	var isInit = localStorage.getItem("$isInit");
	if (isInit != 1) {
		 //初始化表
		 var t_consume_record_sql =
		 	'create table if not exists t_consume_record("guid" VARCHAR(36),"type" INT(4),"date" DATE,"consume_type" VARCHAR(36),"consume_name" NVARCHAR(20),"consume_icon" NVARCHAR(10),"money" INT,"remark" NVARCHAR(2000),"create_time" DATETIME)';
		 var t_consume_type_sql =
		 	'create table if not exists t_consume_type("id" INT(4),"type" INT(4),"name" NVARCHAR(20),"icon" VARCHAR(20),"sort" INT(4))';
		 dbAction.executeSql(t_consume_record_sql);
		 dbAction.executeSql(t_consume_type_sql);
		 
		 //初始化消费类型
		 var list = [{ id: 1, name: '一般', type: 0, icon: 'icon-qian', sort: 1 }
			, { id: 2, name: '餐饮', type: 0, icon: 'icon-mifan', sort: 2 }
			, { id: 3, name: '购物', type: 0, icon: 'icon-gouwu', sort: 3 }
			, { id: 4, name: '服饰', type: 0, icon: 'icon-yifu', sort: 4}
			, { id: 5, name: '交通', type: 0, icon: 'icon-jiaotong', sort: 5}
			, { id: 6, name: '娱乐', type: 0, icon: 'icon-yule', sort: 6 }
			, { id: 7, name: '社交', type: 0, icon: 'icon-shejiao', sort: 7 }
			, { id: 10, name: '房贷', type: 0, icon: 'icon-fangdaijisuan', sort: 10 }
			, { id: 11, name: '房租', type: 0, icon: 'icon-fangzu', sort: 11 }
			, { id: 16, name: '添加', type: 0, icon: 'icon-tianjia', sort: 16 }
			, { id: 12, name: '工资', type: 1, icon: 'icon-web-icon-', sort: 12 } 
			, { id: 13, name: '兼职', type: 1, icon: 'icon-jianzhi', sort: 13 }
			, { id: 8, name: '礼金', type: 1, icon: 'icon-tuijianlijin', sort: 8 }
			, { id: 9, name: '理财', type: 1, icon: 'icon-licai', sort: 9 }
			, { id: 17, name: '添加', type: 1, icon: 'icon-tianjia', sort: 17 }];
		 for (var i in list)
			data_action.consume_type.insert(list[i]);
			
		localStorage.setItem("$isInit",1);
	}
}


/*
 * 数据操作
 */
var data_action = {
	//消费记录
	consume_record: {
		insert: function(bill) {
 
			var sql =
				"insert into t_consume_record(guid,type,date,consume_type,consume_name,consume_icon,money,remark,create_time) " +
				"values ('" + bill.guid + "','" + bill.type + "','" + bill.date + "','" + bill.consume_type + "','" + bill.consume_name +
				"','" + bill.consume_icon + "','" + bill.money + "','" + bill.remark + "','" + bill.create_time + "')";

			dbAction.executeSql(sql);

		},
		query: function(type, startDate, endDate, callback) {

			var sql = "select * from t_consume_record where type =" + type + " and '" + startDate + "' <= date and date <= '" +
				endDate + "' order by date desc,create_time desc";

			return dbAction.selectSql(sql, callback);
		}
	},
	//消费类型
	consume_type: {
		insert: function(data) { 
			var sql =
				"insert into t_consume_type(id,type,name,icon,sort) " +
				"values (" + data.id + "," + data.type + ",'" + data.name + "','" + data.icon + "'," + data.sort + ")";

			dbAction.executeSql(sql);
		},
		query: function(type, callback) {

			var sql = "select * from t_consume_type where type = " + type + " order by sort";

			return dbAction.selectSql(sql, callback);
		},
		isExis: function(callback) {

			var sql = "select count(1) total from t_consume_type";

			return dbAction.selectSql(sql, callback);
		}
	},
	//月统计
	month_statis: function(type, startDate, endDate, callback) {

		var sql = "select sum(money) as total from t_consume_record where type =" + type + " and '" + startDate +
			"' <= date and date <= '" +
			endDate + "'";

		return dbAction.selectSql(sql, callback);
	}

}
