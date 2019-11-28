import Vue from 'vue';

Vue.mixin({
	methods: {
		//封装获取数据的方法
		async loadData(urlName,accounts,params={pageSize:8,pageNo:1}){
			var url = this.$apis[urlName];
			params.pageSize = params.pageSize?params.pageSize:8;
			var rs = await this.$http.get(url,params);
			this[accounts] = rs.data;
		},
		//操作确认函数,所有的删除弹出的提示都在这里实现
		operatorConfirm(action,message) {
			this.$confirm(`此操作将${message}, 是否继续?`, '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				action();
				this.$message({
					type: 'success',
					message: 'OK'
				});
			}).catch(() => {
				this.$message({
					type: 'info',
					message: '已取消'
				});
			});
		}
	},
	filters:{
		formateDate(value) {
			var date = new Date(value);
			return date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDay();
		}
	}
})
