<template>
  <el-form
    :model="loginForm"
    ref="loginFormRef"
    :rules="loginFormRules"
    label-width="0px"
    class="menu"
  >
    <!-- 用户名-->
    <el-form-item prop="username">
      <el-input v-model="loginForm.username" prefix-icon="iconfont icon-user"></el-input>
    </el-form-item>
    <!-- 密码 -->
    <el-form-item prop="password">
      <el-input v-model="loginForm.password" type="password" prefix-icon="iconfont icon-3702mima"></el-input>
    </el-form-item>
    <!-- 按钮区域 -->
    <el-form-item class="btns">
      <el-button type="primary" @click="login">登录</el-button>
      <el-button type="info" @click="resetLoginForm">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: "LoginMenu",
  data() {
    return {
      // 这是登录表单的数据绑定对象
      loginForm: {
        username: "admin",
        password: "123456"
      },
      // 这是表单的验证规则
      loginFormRules: {
        // 用户名验证规则
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 10, message: "长度在 3 到 10 个字符", trigger: "blur" }
        ],
        // 密码验证规则
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 15, message: "长度在 6 到 15 个字符", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    // 点击重置表单
    resetLoginForm() {
      // resetFields是element-ui中重置表单的方法，可以在官网中的Form组件中查看
      this.$refs.loginFormRef.resetFields();
    },
    // 点击登录按钮
    login() {
      // validate 表单预验证
      this.$refs.loginFormRef.validate(async valid => {
        // 如果valid返回false就跳出比选项
        if (!valid) return;
        // {data:res} ：将返回的数据中的data赋给res
        const { data: res } = await this.$http.post("login", this.loginForm);
        // 判断返回的状态码是否等于200,这里使用了element-ui中的消息提示方法
        if (res.meta.status !== 200) {
          this.$message({
            showClose: true,
            message: "错了哦，这是一条错误消息",
            type: "error"
          });
        } else {
          this.$message({
            showClose: true,
            message: "恭喜你登录成功",
            type: "success"
          });
          /**
           * 1.将登录客户端的 token保存到客户端的 sessionStorage 中
           *   1.1 项目中除了登录之外的其他API接口，必须登录之后才能访问
           *   1.2 token只因在当前网页打开期间生效，所以将 token 保存在sessionStorage中
           */
          window.sessionStorage.setItem("token", res.data.token);
          // 2.通过编程式导航跳转到后台主页，路由地址是 /home
          this.$router.push("/home");
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
.menu {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  // 改变盒模型，去掉padding和margin
  box-sizing: border-box;
}

.btns {
  display: flex;
  // 使内容向右对齐
  justify-content: flex-end;
}
</style>