/*
 * 数据操作
 */
var service = {
	//用户账户
	account: {
		insert: function(model) {

			var sql =
				"insert into t_account(guid,login_name,login_pwd,status) " +
				"values ('" + model.guid + "','" + model.login_name + "','" + model.login_pwd + "','" + model.status + "')";

			db_helper.executeSql(sql);

		},
		query: function(login_name, callback) {

			var sql = "select * from t_account where login_name =" + login_name;

			return db_helper.selectSql(sql, callback);
		}
	},
	//消费类型
	consume_type: {
		insert: function(data) {
			var sql =
				"insert into t_consume_type(id,type,name,icon,sort) " +
				"values (" + data.id + "," + data.type + ",'" + data.name + "','" + data.icon + "'," + data.sort + ")";

			db_helper.executeSql(sql);
		},
		query: function(type, callback) {

			var sql = "select * from t_consume_type where type = " + type + " order by sort";

			return db_helper.selectSql(sql, callback);
		}
	},
	//消费记录
	consume_record: {
		insert: function(bill) {

			var sql =
				"insert into t_consume_record(guid,type,date,consume_type_id,money,remark,create_time) " +
				"values ('" + bill.guid + "','" + bill.type + "','" + bill.date + "','" + bill.consume_type_id + "','" + bill.money +
				"','" + bill.remark + "','" + bill.create_time + "')";

			db_helper.executeSql(sql);

		},
		query: function(type, endDate, page_index, page_size, callback) {

			var sql = "select r.*,t.name consume_name,t.icon consume_icon from t_consume_record r " +
				" left join t_consume_type t on t.id = r.consume_type_id " +
				" where r.type =" + type + " and '" + endDate + "' >= date " +
				" order by date desc,create_time desc limit " + page_size + " offset " + (page_index - 1) * page_size;

			return db_helper.selectSql(sql, callback);
		},
		query_dateil: function(guid, callback) {

			var sql = "select r.*,t.name consume_name,t.icon consume_icon from t_consume_record r " +
				" left join t_consume_type t on t.id = r.consume_type_id " +
				" where r.guid ='" + guid + "'";

			return db_helper.selectSql(sql, callback);
		},
		remove: function(guid, callback) {

			var sql = "delete from t_consume_record where guid ='" + guid + "'";

			return db_helper.executeSql(sql, callback);
		}
	},
	//支出收入金额月统计
	month_statis: function(type, startDate, endDate, callback) {

		var sql = "select sum(money) as total from t_consume_record where type =" + type + " and '" + startDate +
			"' <= date and date <= '" + endDate + "'";

		return db_helper.selectSql(sql, callback);
	},
	//统计报表
	report: {
		//消费分类月统计
		month_consume: function(type, startDate, endDate, callback) {

			var sql = "select t.name, sum(r.money) as total from t_consume_record r left join t_consume_type t on t.id = r.consume_type_id " +
			          " where r.type =" + type + " and '" + startDate + "' <= r.date and r.date <= '" + endDate + "'" +
					  " group by t.name order by total";
 
			return db_helper.selectSql(sql, callback);
		}
	}
}
