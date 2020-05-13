<template>
  <div id="login">
    <div class="login_box">
      <!-- 头像区域 -->
      <login-logo></login-logo>
      <!-- 表单区域 -->
      <login-menu></login-menu>
    </div>
  </div>
</template>

<script>
import LoginLogo from './childComps/LoginLogo'
import LoginMenu from './childComps/LoginMenu'

  export default {
    name:'Login',
    components:{
      LoginLogo,
      LoginMenu
    }
      
    
  }
</script>

<style lang="less" scoped>
#login {
  height: 100%;
  background-color: #2b4b6b;
}

.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
}
</style>