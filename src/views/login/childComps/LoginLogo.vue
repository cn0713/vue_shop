<template>
  <div class="auatar_box">
    <img src="@/assets/logo.png" alt />
  </div>
</template>

<script>
export default {
  name: "LoginLogo"
};
</script>

<style lang="less" scoped>
.auatar_box {
    width: 130px;
    height: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%,-50%);

    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }
</style>