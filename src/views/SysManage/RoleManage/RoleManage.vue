<template>
	<div id="RoleManage">
		<div id="left">
			<mt-table>
				<div slot="table" style="max-height: 500px">
					<table>
						<tr>
							<th>
								<el-checkbox></el-checkbox>
							</th>
							<th>角色</th>
							<th>名称</th>
							<th >
								操作
							</th>
						</tr>
						<tr v-for="(item,index) in allRoles">
							<th>
								<el-checkbox></el-checkbox>
							</th>
							<th>
								{{item.roleDesc}}
							</th>
							<th>
								{{item.roleName}}
							</th>
							<th>
								<el-button type="success" icon="el-icon-check" circle @click="show=true,ruleForm=item,hh()"></el-button>
								<el-button type="danger" icon="el-icon-delete" circle></el-button>
							</th>
						</tr>
					</table>
				</div>
			</mt-table>
		</div>

		<transition name="fade">
		<div id="right" v-show="show">

			<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
				<el-form-item label="角色" prop="roleDesc">
					<el-input v-model="ruleForm.roleDesc"></el-input>
				</el-form-item>
				<el-form-item label="名称" prop="roleName">
					<el-input v-model="ruleForm.roleName"></el-input>
				</el-form-item>

				<el-form-item label="权限列表">
					<el-tree
							:data="permissionTree"
							show-checkbox
							node-key="_id"
							:props="defaultProps"
							ref="tree"
					>
					</el-tree>
				</el-form-item>


				<el-form-item>
					<el-button type="primary" @click="updateRoleInfo">立即更新</el-button>
				</el-form-item>
			</el-form>
		</div>
		</transition>
	</div>
</template>

<script>
	import mtTable from '@/components/mt-table.vue'
	import {mapState,mapGetters} from "vuex"
	export default {
		components:{mtTable},
		data(){
			return {
				show:false,
				rolename:'',
				ruleForm: {
				},
				defaultProps: {
					children: 'children',
					label: 'permissionDesc',

				},
				rules: {
					roleDesc: [
						{ required: true, message: '请输入', trigger: 'blur' },
					],
					roleName: [
						{ required: true, message: '请输入', trigger: 'blur' },
					],

				}
			}
		},
		computed:{
			...mapState(["allRoles"]),
			...mapState(["allPermissions"]),
			...mapGetters(['permissionTree'])
		},
		methods:{
			submitForm(formName) {
				this.$refs[formName].validate((valid) => {
					if (valid) {
						alert('submit!');
					} else {
						console.log('error submit!!');
						return false;
					}
				});
			},
			resetForm(formName) {
				this.$refs[formName].resetFields();
			},
			hh(){
				this.$refs.tree.setCheckedKeys(this.ruleForm.permissions);
			},
			updateRoleInfo(){
				// 查询是否有父级权限,如果有,则将父级权限一起放入到最终结果,
				//如果没有父级权限,则直接将当前元素放入到最终结果.
				var keys = this.$refs.tree.getCheckedKeys();
				var set = new Set()
				// 你点击选中的所有权限
				for(var i=0;i<keys.length;i++){
					set.add(keys[i])
				}
				var ps = Array.from(set);
				this.ruleForm.permissions = ps;

				var action = () => {
					this.$http.post(this.$apis.updateRole,this.ruleForm).then(()=>{
						this.$store.dispatch("loadAllRoles")
					});
				};
				this.operatorConfirm(action,"更新 "+this.ruleForm.roleName+" 角色");
			}
		},
		mounted(){

		}
	}
</script>

<style scoped>
	#RoleManage{
		display: flex;
		width: 100%;
		float: left;
		flex-direction: row;
		flex-wrap:wrap;
		justify-content:space-around;
	}
	#left{
		width: 45%;
	}
	#right{
		width: 45%;
		box-shadow: 0 0 10px lightgray;
		background: white;
		border-radius: 5px;
	}

</style>
