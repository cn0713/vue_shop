<template>
  <el-dialog
    title="添加角色"
    :visible.sync="addRolesDialogVisibles"
    width="50%"
    @close="closeDialogVisibles"
  >
    <span>
      <el-form :model="roleForm" :rules="rolRules" ref="roleFormRef" label-width="80px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="roleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="roleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
    </span>
    <span slot="footer" class="dialog-footer">
      <el-button @click="addRolesDialogVisibles = false">取 消</el-button>
      <el-button type="primary" @click="addRoles">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: 'AddRoles',
  props: {
    addRolesDialogVisible: {
      type: Boolean,
      default() {
        return false
      }
    }
  },
  data() {
    return {
      // 控制对话框的显示和隐藏
      addRolesDialogVisibles: false,
      // 保存添加角色的数据
      roleForm: {
        roleName: '',
        roleDesc: ''
      },
      // 角色的验证规则
      rolRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          { min: 2, max: 5, message: '长度在 2 到 5 个字符', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' },
          { min: 2, max: 8, message: '长度在 2 到 8 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    // 通过父级组件传递过来的 addRolesDialogVisible 来决定对话框是否显示和隐藏
    addRolesDialogVisible(newValue) {
      this.addRolesDialogVisibles = newValue
    }
  },
  methods: {
    // 对话框关闭时触发
    closeDialogVisibles() {
      this.$emit('closeDialog', true)
      // 重置对话框的信息
      this.$refs.roleFormRef.resetFields()
    },
    // 点击按钮，添加新角色
    addRoles() {
      // 对提交的表单进行预验证
      this.$refs.roleFormRef.validate(async valid => {
        // 如果返回的时 false 则
        if (!valid) return
        // 发起添加角色的网络请求
        const {data:res} = await this.$http.post('roles',this.roleForm)
        if (res.meta.status !== 201) {
          return this.$message.error('添加角色失败！')
        }
        // 通过 $parent 获取父组件的实例
        this.$parent.getRoleList()
        this.$message.success('添加角色成功！')
        this.addRolesDialogVisibles = false
      })
    }
  }
}
</script>

<style lang="less" scoped>
</style>