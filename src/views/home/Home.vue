<template>
  <el-container class="home_container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img src="@/assets/heima.png" alt />
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!-- 页面主题内容 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="taggle-button" @click="taggleCollapse">|||</div>
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409EFF"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          router
          :default-active="activePath"
        >
          <!-- 一级菜单 -->
          <!-- element-ui中的 index 里面传的必须的字符串 -->
          <el-submenu :index="item.id + ''" v-for="item in menuList" :key="item.id">
            <!-- 一级菜单模板 -->
            <template slot="title">
              <!-- 图标 -->
              <i :class="iconsObj[item.id]"></i>
              <!-- 文本 -->
              <span>{{item.authName}}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item
              :index="'/'+subItem.path"
              v-for="subItem in item.children"
              :key="subItem.id"
              @click="savenavState('/'+subItem.path)"
            >
              <!-- 二级菜单模板 -->
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-menu"></i>
                <!-- 文本 -->
                <span>{{subItem.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧内容主题 -->
      <el-main>
        <!-- 路由占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: 'Home',
  data() {
    return {
      // 保存所有菜单的数据
      menuList: [],
      // 保存菜单的字体图标
      iconsObj: {
        '125': 'iconfont icon-user',
        '103': 'iconfont icon-tijikongjian',
        '101': 'iconfont icon-shangpin',
        '102': 'iconfont icon-danju',
        '145': 'iconfont icon-baobiao'
      },
      // 判断是否折叠和展开的标识符
      isCollapse: false,
      // 被激活的链接地址
      activePath:'',
    }
  },
  created() {
    this.getMenuList(),
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    // 点击按钮，退出登录
    logout() {
      // 清空sessionStorage中的token
      window.sessionStorage.clear()
      // 然后跳转会登录页面
      this.$router.push('/login')
    },
    // 获取所有的菜单
    async getMenuList() {
      // 通过get请求，获取数据
      // {data:res} ：将返回的数据中的data赋给res
      const { data: res } = await this.$http.get('menus')
      // 判断返回的状态码是否等于200,这里使用了element-ui中的消息提示方法
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      // 将数据添加到Vue响应式系统中
      this.menuList = res.data
      // console.log(res)
    },
    // 点击按钮，实现菜单的折叠和展开
    taggleCollapse() {
      this.isCollapse = !this.isCollapse
    },
    // 保存链接的激活状态
    savenavState(activePath) {
      // 将被激活的链接保存到sessionStorage中
      window.sessionStorage.setItem('activePath',activePath)
      // 将点击的链接保存到激活的链接地址中
      this.activePath = activePath
      
    }
  }
}
</script>

<style lang="less" scoped>
.home_container {
  height: 100%;
}

.el-header {
  background-color: #373d41;
  display: flex;
  // 左右布局
  justify-content: space-between;
  // 居中对齐
  align-items: center;
  padding-left: 0;
  font-size: 24px;
  color: #fff;

  > div {
    display: flex;
    justify-content: center;
    align-items: center;

    span {
      margin-left: 10px;
    }
  }
}

.el-aside {
  background-color: #333744;

  .taggle-button {
    background-color: #4a5064;
    font-size: 10px;
    color: #fff;
    text-align: center;
    line-height: 24px;
    // 增加字体之间有间距
    letter-spacing: 0.2em;
    cursor: pointer;
  }

  .el-menu {
    border-right: none;
  }
}

.iconfont {
  margin-right: 10px;
}

.el-main {
  background-color: #eaedf1;
}
</style>