<template>
	<div id="PermissionManage">
		<div id="left">
			<template>
				<el-table
						:data="allPermissions"
						style="width: 100%">
					<el-table-column
							label="创建日期"
							width="180">
						<template slot-scope="scope">
							<i class="el-icon-time"></i>
							<span style="margin-left: 10px">{{ scope.row.createDate | formateDate}}</span>
						</template>
					</el-table-column>
					<el-table-column
							label="权限名"
							width="180">
						<template slot-scope="scope">
							<el-popover trigger="hover" placement="top">
								<p>描述: {{ scope.row.permissionDesc }}</p>
								<p>父级权限: {{ scope.row.parentid | findPaPa(allPermissions) }}</p>
								<div slot="reference" class="name-wrapper">
									<el-tag size="medium">{{ scope.row.permissionName }}</el-tag>
								</div>
							</el-popover>
						</template>
					</el-table-column>
					<el-table-column label="操作">
						<template slot-scope="scope">
							<el-button
									size="mini"
									@click="handleEdit(scope.$index, scope.row)">编辑</el-button>
							<el-button
									size="mini"
									type="danger"
									@click="handleDelete(scope.$index, scope.row)">删除</el-button>
						</template>
					</el-table-column>

				</el-table>

			</template>
			<div id="addpermission" >
				<el-button type="primary" plain size="medium" @click="show=true,btn=true,resetForm()">添加权限</el-button>
			</div>
		</div>
		<transition name="fade">
			<div id="right" v-show="show">
				<div style="position: relative;font-size: 35px;text-align: center" v-if="btn">新增权限 <hr /></div>
				<div style="position: relative;font-size: 35px;text-align: center" v-if="btn==false">编辑权限 <hr /></div>
				<el-form :model="permission" :rules="rules" ref="permission" label-width="100px" class="demo-ruleForm">
					<el-form-item label="权限名称" prop="permissionDesc">
						<el-input v-model="permission.permissionName"></el-input>
					</el-form-item>
					<el-form-item label="权限描述" prop="permissionName">
						<el-input v-model="permission.permissionDesc"></el-input>
					</el-form-item>
					<el-form-item label="权限序号" prop="sortNum">
						<el-input v-model="permission.sortNum"></el-input>
					</el-form-item>
					<el-form-item label="父级权限" >
						<el-select v-model="permission.parentid"  placeholder="请选择父级权限id">
							<el-option  :label="0" :value="0" :key="0">
							</el-option>
							<el-option v-for="item in allPermissions" :key="item._id" :label="item.permissionDesc" :value="item._id">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="权限等级" prop="permissionLeve">
						<el-input v-model="permission.permissionLeve"></el-input>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" @click="submitForm('permission')" v-if="btn">立即创建</el-button>
						<el-button type="primary" @click="submitForm('permission'),mrid=1" v-else>更新</el-button>
						<el-button type="danger" @click="resetForm()" >重置</el-button>
					</el-form-item>
				</el-form>
			</div>
		</transition>
	</div>
</template>

<script>

	import {mapState} from "vuex"
	export default {

		data(){
			return {
				show:false,
				btn:true,
				cnm:{},
				permission: {
					parentid: 0,
					permissionDesc: '',
					permissionName: '',
					sortNum: "",
					permissionLeve:"",
				},

				rules: {
					permissionDesc: [
						{ required: true, message: '请输入', trigger: 'blur' },
					],
					permissionName: [
						{ required: true, message: '请输入', trigger: 'blur' },
					],

				}
			}
		},
		computed:{
			...mapState(["allPermissions"])
		},
		methods:{
			handleEdit(index, row) {

				this.permission={...row};
				this.btn=false;
				if(!this.show){
					this.show=true;
				}
			},
			resetForm() {
				this.permission={
							parentid: 0,
							permissionDesc: '',
							permissionName: '',
							sortNum: "",
							permissionLeve:"",
				}

			},
			handleDelete(index, row) {
				var action= ()=>{this.$http.post(this.$apis.deletePermission,{_id:row._id}).then(()=>{
					this.$store.dispatch("loadAllPermission")
				});
				}
				this.operatorConfirm(action,"删除 "+row.permissionName+"权限");
			},
			submitForm(formName) {
				this.$refs[formName].validate((valid) => {
					if (valid) {
						var action= ()=>{this.$http.post(this.$apis.addNewPermission,this.permission).then(()=>{
							this.$store.dispatch("loadAllPermission")
						});
						}
						this.operatorConfirm(action,"新增权限 "+this.permission.permissionName);
					} else {
						console.log('error submit!!');
						return false;
					}
				});
			},

		},
		filters: {
			findPaPa(value,allPermissions){
				for(var i=0;i<allPermissions.length;i++){
					if(value===allPermissions[i]._id){
						return allPermissions[i].permissionDesc;
					}
				}
				return "";
			}
		},
		mounted(){

		}
	}
</script>

<style  lang="scss" scoped>
	#PermissionManage{
		display: flex;
		width: 100%;
		float: left;
		flex-direction: row;
		flex-wrap:wrap;
		justify-content:space-around;
	}
	#left{
		width: 50%;
		box-shadow:  0 20px 10px #888888;
		background: white;
		border-radius: 5px;
	}
	#right{
		width: 45%;
		box-shadow:  0 20px 10px #888888;
		background: white;
		border-radius: 5px;
	}
	#addpermission{
		position: relative;
		left: 70%;
	}
</style>
