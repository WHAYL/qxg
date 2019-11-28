<template>
    <div id="home">
        <el-container style="height:100%">
            <el-aside width="200px">
                <el-row class="tac">
                    <el-col :span="24">
                        <!--
							遍历最外层的所有的权限
							key绑定的是 权限的_id
							index:是选项的下标,确保它被选中的时候是唯一的
						 -->

                        <el-menu
                                 :default-active="lists" class="el-menu-vertical-demo"
                                 v-for="(item,index) in permissions" :key="item._id">
                            <el-submenu :index="index+''" >
                                <template slot="title">
                                    <i class="el-icon-location"></i>
                                    <span>{{item.permissionDesc}}</span>
                                </template>
                                <!-- 遍历当前item权限的所有子权限 children -->
                                <el-menu-item
                                              v-for="(child,key) in item.children" :key="child._id"
                                              @click="show=false,addTab(child.permissionDesc)"
                                              v-bind:index="child.permissionDesc"
                                >
                                    {{child.permissionDesc}}
                                </el-menu-item>
                            </el-submenu>
                        </el-menu>
                    </el-col>
                </el-row>
            </el-aside>
            
            
            <el-container>
                
                <el-header>
                    <div style="width: 100%;height:100%;display: flex;align-items: center;justify-content: flex-end;">
                        <el-button icon="el-icon-switch-button" circle type="danger" @click="logout"></el-button>
                    </div>
                </el-header>
                
                
                <el-main>
                 <div v-if="show" id="welcome">欢迎使用</div>
                    <el-tabs id="tabs" v-if="!show"  @tab-click="pushView(lu,editableTabsValue),me()"  v-model="editableTabsValue" type="card" closable @tab-remove="removeTab">
                        <el-tab-pane
                                v-for="(item, index) in editableTabs"
                                :key="item.name"
                                :label="item.title"
                                :name="item.name"
                                id="cnm"

                        
                        >
                            <router-view></router-view>
                        </el-tab-pane>
                    </el-tabs>
                
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>

<script>

    export default {

        data(){
            return {
                list:"用户管理",
                permissions: [],
                show:'true',
                editableTabsValue: '0',//选定的目标
                editableTabs: [],//所有选项卡数据
                tabIndex: 0,//
                lu:{},//所有的路由数据 {1:角色管理,2:权限管理}
            }
        },
        computed:{
            //控制侧边栏的选中状态,有list来控制
            lists(){
                return this.list;
            }
        },
        methods: {

            logout(){
                // 退出,就直接跳转到登录页面
                var action = ()=>{
                    localStorage.clear();
                    this.$router.push("/login")
                }
                this.operatorConfirm(action,"要退出？");
                
            },
            pushView(lu,editableTabsValue){
                this.$router.push({name:lu[editableTabsValue]})//跳转值该路由
            },
            me(){
                //点击选项卡，获取选项卡的title 并赋值个list ，侧边栏选中状态就选中当前选项卡的信息
                var x;
                for(var i=0;i<this.editableTabs.length;i++){
                    if(this.editableTabs[i].name==this.editableTabsValue){
                        x=this.editableTabs[i].title;
                        break;
                    }
                }
                    this.list=x;
            },
            addTab(targetName) {
                this.list=targetName;
                let t=0;//判断选项卡是否已存在
                let i=0;//选定的目标

                //如果选项卡已存在，就不重复创建，直接跳转到相应路由
                for(var item in this.lu){
                    if(this.lu[item]==targetName){
                        t=1;
                        i=item;
                        break;
                    }
                }
                if(t==0) {
                    let newTabName = ++this.tabIndex + '';//每个选项卡的标识都要不一样
                    this.editableTabs.push({
                        title: targetName,//选项卡标题 是传过来的路由名称
                        name: newTabName,//选项卡ID
                    });//将每个选项卡的数据 push 进  this.editableTabs
                    this.editableTabsValue = newTabName;
                    this.lu[this.tabIndex] = targetName;//{1:角色管理,2:权限管理}

                    if(targetName==  localStorage.getItem('list'))
                    {
                        this.$router.push({name: targetName})//渲染当前路由
                    }else {
                        if(!localStorage.getItem('list'))
                            this.$router.push({name: targetName})//渲染当前路由
                    }
                }else {
                    this.editableTabsValue = i;
                    this.$router.push({name: targetName})//渲染当前路由
            }
            },
            removeTab(targetName) {
                // targetName: 当前要删除的目标
                let tabs = this.editableTabs;
                let activeName = this.editableTabsValue;
                if (activeName === targetName) {
                    tabs.forEach((tab, index) => {
                        if (tab.name === targetName) {
                            let nextTab = tabs[index + 1] || tabs[index - 1];
                            if (nextTab) {
                                activeName = nextTab.name;
                            }
                        }
                    });
                }

                this.editableTabsValue = activeName;//重新选中的选项卡
                this.editableTabs = tabs.filter(tab => tab.name !== targetName);

                delete this.lu[targetName];//删除路由数据中相应的选项
                var b = (JSON.stringify(this.lu) == "{}");
                if(b){
                    this.show=true
                }
                this.$router.push({name:this.lu[this.editableTabsValue]});

                //找出下一个选项卡的title 赋值个list 侧边栏发生相应变化
                var x;
                for(var i=0;i<this.editableTabs.length;i++){
                    if(this.editableTabs[i].name==this.editableTabsValue){
                        x=this.editableTabs[i].title;
                        break;
                    }
                }
                this.list=x;


            }
        },
        created(){
            //权限的树形结构
            var permissions = JSON.parse(localStorage.getItem("data")).permissions;
            this.permissions =  permissions.filter((item,index)=>{
                var childArr = permissions.filter((child)=>{
                    return child.parentid == item._id;
                })
                childArr.length>0?item.children = childArr:"";
                return item.parentid == 0;
            });
            this.$store.dispatch("loadAllRoles");
            this.$store.dispatch("loadAllPermission");

        },
        mounted() {
            this.show=false;
            if(localStorage.getItem('list'))
            {
                //重新渲染刷新前的路由
                var x=JSON.parse(localStorage.getItem('lists'));
                for(var item in x){
                    this.addTab(x[item])
                }
                //指定list为刷新前的选项卡
                this.list=localStorage.getItem('list');
                //选项卡的选中状态是最后一个路由，所以重新把选项卡添加一遍
                this.addTab(this.list)
            }
            else {
               this.show=true;
               this.list=""
            }

            //当页面刷新时 把当前所有显示的路由状态  当前选中的路由信息保存在本地
            window.addEventListener('beforeunload', e => {
                var b = (JSON.stringify(this.lu) == "{}");
                if(b){
                    localStorage.setItem('list', "");
                    localStorage.setItem('lists', "");
                }else {
                    localStorage.setItem('lists', JSON.stringify(this.lu));
                    localStorage.setItem('list', this.list);
                }

            });

        }
    }
</script>
<style lang="scss" scoped>
    #home {
        width: 100%;
        height: 100%;
    }
    .el-header, .el-footer {
        background-color: #B3C0D1;
        color: #333;
        text-align: center;
        line-height: 60px;
    }

    .el-aside {
        background-color: #D3DCE6;
        color: #333;
        text-align: center;
        line-height: 200px;
    }
    .el-main{
        position: relative;
        height: 100%;
    }
    #welcome{
        font-size: 50px;
        position: absolute;
        text-align: center;
        left:40%;
        top: 30%;
    }



</style>
