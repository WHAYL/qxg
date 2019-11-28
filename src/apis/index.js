import Vue from 'vue'
const apis = {
//系统管理
	signin:'/signin',//登录接口
	//角色相关
	findRole: '/system/role/findRoles',//查询角色
	addNewRole: '/system/role/addNewRole',//新增角色
	deleteRole: '/system/role/deleteRole',//删除角色
	updateRole: '/system/role/updateRole',//更新角色
	//管理员
	addNewAdmin: '/system/admin/addNewAdmin',//新增后台用户
	findAdmins: '/system/admin/findAdmins',//查找管理员列表
	deleteAdmin: '/system/admin/deleteAdmin',//删除管理员
	//权限
	findPermission: '/system/permission/findPermission',//查询权限
	addNewPermission: '/system/permission/addNewPermission',//新增权限
	deletePermission: '/system/permission/deletePermission',//删除权限
	//动态验证码
	checkDynamicCode: '/checkDynamicCode',//动态验证码
//日历管理
	setDailyBackground: '/daily/setDailyBackground',//设置日历接口
	setDailyBackgroundLike: '/daily/setDailyBackgroundLike',//日历背景图点赞接口
	findDailyBackground:'/webapp/findDailyBackground?from=2019-06-12&to=2019-06-15',//查询日历背景图
//留言管理
	addNewMessage:'/message/addNewMessage',//留言管理
	deleteMessage:'/message/deleteMessage',//删除留言
//类型管理
	addNewMusicType:'/music/addNewMusicType',//新增类型
	findMusicTypes:'/music/findMusicTypes',//查询音乐类型
	deleteMusicType:'/music/deleteMusicType',//删除音乐类型
//音频管理
	findMusic:'/music/findMusic',//查询音频列表
	uploadMusic:'/music/uploadMusic',//新增音频
	deleteMusic:'/music/deleteMusic',//删除音频
	updateMusicInfo:'/music/updateMusicInfo',//更新音频
//微信端接口
	wxSignIn:'/webapp/wxSignIn',//微信端登陆接口
	etLikePic:'/webapp/setLikePic',//微信用户点赞接口
}

Vue.prototype.$apis = apis;
export default apis
