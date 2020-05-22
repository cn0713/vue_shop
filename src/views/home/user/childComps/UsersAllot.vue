<template>
  <el-dialog title="分配角色" :visible.sync="allowRoles" width="50%" @close="closeAllot">
    <p>当前用户 : {{allowUserList.username}}</p>
    <p>当前角色 : {{allowUserList.role_name}}</p>
    <p>
      分配新角色 :
      <el-select v-model="SelectRoleId" placeholder="请选择">
        <el-option
          v-for="item in rolesList"
          :key="item.id"
          :label="item.roleName"
          :value="item.id"
        ></el-option>
      </el-select>
    </p>
    <span slot="footer" class="dialog-footer">
      <el-button @click="allowRoles = false">取 消</el-button>
      <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: 'UsersAllot',
  props: {
    allotDialogVisible: Boolean,
    allowUserList: Object
  },
  data() {
    return {
      allowRoles: false,
      rolesList: [],
      // 已选中的角色id
      SelectRoleId:'',
    }
  },
  created() {
    this.getRoleList()
  },
  watch: {
    allotDialogVisible(newValue) {
      this.allowRoles = newValue
    }
  },
  methods: {
    closeAllot() {
      this.$emit('closeAllot', true)
    },
    async getRoleList() {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200)
        return this.$message.error('获取角色列表失败!')
      this.rolesList = res.data
    },
    // 点击按钮,分配角色
    async saveRoleInfo(){
      if(!this.SelectRoleId) return this.$message.error('请选择需要分配的角色!')      
      const {data:res} = await this.$http.put(`users/${this.allowUserList.id}/role`,{
        rid:this.SelectRoleId
      })      
      if(res.meta.status !== 200) return this.$message.error('分配角色失败')
      this.$message.success('分配角色成功!')
      // 调用父组件的方法
      this.$parent.getUsersList()
      this.allowRoles = false
    },
  }
}
</script>

<style lang="less" scoped>
</style>