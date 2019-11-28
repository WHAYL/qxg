<template>
	<div id="AccountManage">
		<mt-table width="45%">
			<div slot="table">
			<table>
				<tr>
					<th>
						<el-checkbox></el-checkbox>
					</th>
					<th>账号</th>
					<th>密码</th>
					<th>操作</th>
				</tr>
				
				<tr v-if="accounts.data.length>0" v-for="(item,index) in accounts.data" :key="item._id">
					<td>
						<el-checkbox></el-checkbox>
					</td>
					<td>{{item.username}}</td>
					<td></td>
					<td>
						<el-button v-if="item.username !== 'admin'" type="danger" size="mini" @click="deleteAccount(item)">删除</el-button>
					</td>
				</tr>
				<tr v-else>
					<td>数据为空</td>
				</tr>
				<tr>
					<td>
						<el-checkbox></el-checkbox>
					</td>
					<td></td>
					<td></td>
					<td>
						<el-button type="primary" size="mini" @click="showAdd = true">新增</el-button>
					</td>
				</tr>
			
			</table>
			<div style="position:relative;bottom: 10px;height: 30px;left: 35%" id="pack">
				
				<el-pagination
						background
						layout="prev, pager, next"
						:page-size=Number(8)
						:total="accounts.total"
						@current-change="changeCurrentPage"
				>
				</el-pagination>
			
			</div>
			</div>
		</mt-table>
		
		<transition name="fade">
			<mt-table width="45%" v-show="showAdd">
				<div slot="table" id="en">
					<div style="width: 100%;height: 44px;background: lightblue;display: flex;align-items: center;justify-content: flex-end;">
						<i class="el-icon-close" style="margin-right: 20px;" @click="cancel"></i>
					</div>
					<el-form :model="accountInfo" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm" style="margin: 10px;" >
						<el-form-item label="账户" prop="username">
							<el-input v-model="accountInfo.username"></el-input>
						</el-form-item>
						<el-form-item label="密码" prop="password">
							<el-input v-model="accountInfo.password"></el-input>
						</el-form-item>

						<el-form-item label="角色"  prop="roles">
							<el-checkbox-group v-model="accountInfo.roles">
								<el-checkbox v-for="(item,index) in allRoles"
											 :label="item._id"
											 :key="item._id"
											name="roles"
								>{{item.roleDesc}}</el-checkbox>
							</el-checkbox-group>
						</el-form-item>
					</el-form>
					<el-row>
						<el-col id="cn">
							<el-button type="danger" size="mini" @click="cancel">取消</el-button>
							<el-button type="primary" size="mini" @click="submit">提交</el-button>
						</el-col>
					
					</el-row>
				</div>
			</mt-table>
		</transition>
	</div>
</template>

<script>
	import mtTable from '@/components/mt-table.vue'
	import {mapState} from "vuex"
	export default {
		components:{mtTable},
		data(){
			return {
				accounts: [],
				showAdd: false,
				accountInfo: {
					roles: []
				},
				rules: {
					username: [
						{required:true,message:"请填写用户名",trigger:"blur"}
					],
					password: [
						{required:true,message:"请填写密码",trigger:"blur"}
					],
					roles:[
						{ type: 'array', required: true, message: '请至少选择一个角色', trigger: 'blur' }
					]
				}
			}
		},
		computed:{
			...mapState(["allRoles"]),
			...mapState(["allPermissions"])
		},
		methods:{
			cancel(){
				this.showAdd = false;
				this.$refs['ruleForm'].resetFields();
			},
			changeCurrentPage(pageNo){
				this.loadData("findAdmins",'accounts',{pageNo:pageNo});
			},
			async submit(){
				this.$refs['ruleForm'].validate(async (valid) => {
					if (valid) {
						var rs = await this.$http.post(this.$apis.addNewAdmin,this.accountInfo);
						if(rs.data.success){
							this.accountInfo = {roles:[]}
							this.loadData("findAdmins",'accounts')
						}
					} else {
						return false;
					}
				});


			},
			async deleteAccount(item){
				var action = () => {
					this.$http.post(this.$apis.deleteAdmin,{_id:item._id}).then(()=>{
						this.loadData("findAdmins",'accounts')
					});
				};

				this.operatorConfirm(action,"删除 "+item.username+" 的账号");
			}
		},
		mounted(){
			this.loadData("findAdmins",'accounts')
		}
	}
</script>

<style lang="scss" scoped>
	#AccountManage {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: row;
	}
	#en{
		.el-pagination {
			white-space: nowrap;
			padding: 2px 5px;
			color: #303133;
			font-weight: 700;
			height: 50px;
		}
	}
	#cn{
		position: relative;
		left: 40%;
	}
</style>
