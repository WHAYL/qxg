<template>
	<div id="Login">
		<div id="container">
			<div id="logo">
				<span style="font-size:43px;font-weight: bolder;font-style: italic;">千寻谷</span>
			</div>
			<el-form :model="userInfo" :rules="rules" ref="loginForm" label-width="100px" class="loginForm">
				<el-form-item  prop="username" style="width: 100%">
					<el-input v-model="userInfo.username" style="width: 80%" placeholder="账号"></el-input>
				</el-form-item>
				<el-form-item  prop="password" style="width: 100%">
					<el-input v-model="userInfo.password" style="width: 80%" placeholder="密码"></el-input>
				</el-form-item>
<!--				验证码-->
				<el-form-item prop="dynamicCode">
					<div class="dynamicCode">
						<el-input v-model="userInfo.dynamicCode" style="width: 50%;" placeholder="验证码"></el-input>
						<div style="width: 50%;height: 30px;" v-html="dynamicIMG" @click="flashDynamicCode"></div>
					</div>
				</el-form-item>
				
			</el-form>
			<div class="foot">
				<el-button type="primary" @click="login">登录</el-button>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		data(){
			var checkDynamicCode = (rule, value, callback) => {
				if (!value) {
					return callback(new Error('动态码不能为空'));
				}
				if(value.toLowerCase()!=this.dynamicCode.toLowerCase()){
					return callback(new Error("验证码错误"));
				}
				callback();
			};
			return {
				userInfo:{
					username:"",
					password:"",
					dynamicCode:""
				},
				dynamicIMG: "",
				dynamicCode:"",
				accounts:[],
				rules:{
					username: [
						{required:true,message: '请输入用户名', trigger: 'blur'}
					],
					password: [
						{required:true,message: '请输入密码', trigger: 'blur'}
					],
					dynamicCode: [
						{
							required: true,
							message: '请输入动态码',
							trigger: 'blur',
						},
						{validator:checkDynamicCode,trigger:"blur"}
					]
				}
			}
		},
		methods: {
			login(){
				this.$refs['loginForm'].validate((valid) => {
					if (valid) {
						
						// 登录操作
						this.$http.post(this.$apis.signin,this.userInfo).then((resp)=>{
							let data = JSON.stringify(resp.data.data);
							let token = resp.data.token;
							let success = resp.data.success;
							if(success){
								localStorage.setItem("data",data);
								localStorage.setItem("token",token);
								var redirect = this.$route.query.comepath;
								if(redirect){
									this.$router.push({path:redirect});
								}else{
									this.$router.push("/")
								}
							}
						})
					} else {
						return false;
					}
				});
			},
			loadDynamicCode(){
				this.$http.get(this.$apis.checkDynamicCode).then((resp)=>{
					var data = resp.data.data;
					var img = data.data;
					var text = data.text;
					this.dynamicIMG = img;
					this.dynamicCode = text;
				})
			},
			flashDynamicCode(){
				this.loadDynamicCode();
			}
		},
		created(){
			this.loadDynamicCode();
		}
	}
</script>

<style lang="scss" scoped>
	#Login {
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		#container {
			width: 500px;
			height: 300px;
			background: white;
			box-shadow: 0 0 10px gray;
			border-radius: 10px;
			#logo {
				width: 100%;
				height: 20%;
				display: flex;
				justify-content: center;
				align-items: center;
			}
			.loginForm{
				width: 100%;
				height: 65%;
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
			}
			.foot {
				width: 100%;
				height: 15%;
				display: flex;
				flex-direction: row;
				justify-content: center;
				align-items: center;
			}
		}
		.dynamicCode{
			width: 100%;
			display: flex;
			flex-direction: row;
		}
	}

</style>