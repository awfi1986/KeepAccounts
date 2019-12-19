/*
 * sqlite 数据操作基础函数 
 */
var db_helper = {
	dbName: 'keepAccounts_DB', //数据库名称
	dbPath: '_doc/keepAccounts.db', //数据库存储地址
	openDB: function() {
		plus.sqlite.openDatabase({
			name: db_helper.dbName,
			path: db_helper.dbPath,
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
			name: db_helper.dbName,
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
			name: db_helper.dbName,
			path: db_helper.dbPath
		});
	},
	executeSql: function(exec_sql, success, fail) {
		if (!db_helper.isOpenDB()) {
			db_helper.openDB();
		}
		plus.sqlite.executeSql({
			name: db_helper.dbName,
			sql: exec_sql,
			success: function(e) {
				db_helper.closeDB();
				success(e);
				console.log('executeSql success!');
			},
			fail: function(e) {
				db_helper.closeDB();
				fail(e);
				console.log('executeSql failed: ' + JSON.stringify(e));
			}
		});
	},
	selectSql: function(sql, success, fail) {
		if (!db_helper.isOpenDB()) {
			db_helper.openDB();
		}
		plus.sqlite.selectSql({
			name: db_helper.dbName,
			sql: sql,
			success: function(data) {
				db_helper.closeDB();
				success(data);
				console.log('executeSql success!');
			},
			fail: function(e) {
				db_helper.closeDB();
				fail(e);
				console.log('executeSql failed: ' + JSON.stringify(e));
			}
		});
	}
};
