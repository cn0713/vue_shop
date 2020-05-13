<template>
  <div id="home">
    <el-button type="info" @click="logout">退出</el-button>
  </div>
</template>

<script>
  export default {
    name:'Home',
    data(){
      return {

      }
    },
    methods:{
      // 点击按钮，退出登录
      logout(){
        // 清空sessionStorage中的token
        window.sessionStorage.clear()
        // 然后跳转会登录页面
        this.$router.push('/login')
      }
    }
  }
</script>

<style lang="less" scoped>

</style>