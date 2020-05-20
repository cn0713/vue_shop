<template>
  <el-dialog
    title="编辑角色"
    :visible.sync="SearchDialogVisible"
    width="50%"
    @close="closeDialogVisible"
  >
    <el-form
      ref="searchRoleRef"
      :model="searchRoleform"
      :rules="searchRoleRules"
      label-width="80px"
    >
      <el-form-item label="角色名称">
        <el-input v-model="searchRoleform.roleName" disabled></el-input>
      </el-form-item>
      <el-form-item label="角色描述" prop="roleDesc">
        <el-input v-model="searchRoleform.roleDesc"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="SearchDialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="searchRoles">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: 'SearchRoles',
  props: {
    searchRolesDialogVisible: Boolean,
    searchList: {
      type: Object,
      default() {
        return {
          name: '未获取到参数'
        }
      }
    }
  },
  data() {
    return {
      SearchDialogVisible: false,
      searchRoleform: {
        roleName: '',
        roleDesc: ''
      },
      searchRoleRules: {
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' },
          { min: 2, max: 8, message: '长度在 2 到 8 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    searchRolesDialogVisible(newValue) {
      this.SearchDialogVisible = newValue
    },
    // 对象和数组需要深度监听
    searchList: {
      handler(newValue) {
        this.searchRoleform = newValue
      },
      deep: true
    }
  },
  methods: {
    closeDialogVisible() {
      this.$emit('closeSearchDialog', true)
    },
    searchRoles(){
      this.$refs.searchRoleRef.validate(async valid => {
        if(!valid) return
        const {data:res} = await this.$http.put('roles/'+this.searchList.id,this.searchRoleform)
        if(res.meta.status !== 200) return this.$message.error('修改角色信息失败! ')
        this.$parent.getRoleList()
        this.$message.success('修改角色信息成功! ')
        this.SearchDialogVisible = false
      })
    }
  }
}
</script>

<style lang="less" scoped>
</style>