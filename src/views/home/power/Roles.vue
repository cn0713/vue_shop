<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 添加角色按钮 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="AddRoles()">添加角色</el-button>
        </el-col>
      </el-row>

      <!-- 角色列表区域 -->
      <el-table :data="roleList" border stripe>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <!-- :class="['bdbottom', i1 === 0 ? 'bdtop' : '']"
                动态绑定class,
                'bdbottom':为每个el-row动态添加一个底边框
                (i1 === 0 ? 'bdtop' : ''):三目选算符，如果索引为0,就添加一个顶边框
            -->
            <el-row
              :class="['bdbottom', i1 === 0 ? 'bdtop' : '','vconter']"
              v-for="(item1, i1) in scope.row.children"
              :key="item1.id"
            >
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag closable @close="removeRightById(scope.row,item1.id)">{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级权限-->
              <el-col :span="19">
                <!-- 通过 for循环 嵌套渲染二级权限 -->
                <el-row
                  :class="[ i2 === 0 ? '' : 'bdtop','vconter']"
                  v-for="(item2,i2) in item1.children"
                  :key="item2.id"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRightById(scope.row,item2.id)"
                    >{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 通过for循环 嵌套渲染三级权限 -->
                  <el-col :span="18">
                    <el-tag
                      type="warning"
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      closable
                      @close="removeRightById(scope.row,item3.id)"
                    >{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column type="角色名称" label="角色名称" prop="roleName"></el-table-column>
        <el-table-column type="角色描述" label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-search"
              @click="searchDialog(scope.row)"
            >编辑</el-button>
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="removeDialog(scope.row.id)"
            >删除</el-button>
            <el-button
              size="mini"
              type="warning"
              icon="el-icon-setting"
              @click="showSetRightDialog(scope.row)"
            >分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加角色的对话框 -->
    <add-roles :addRolesDialogVisible="addRolesDialogVisible" @closeDialog="closeDialog"></add-roles>
    <!-- 编辑角色的对话框 -->
    <search-roles
      :searchRolesDialogVisible="searchRolesDialogVisible"
      :searchList="searchList"
      @closeSearchDialog="closeSearchDialog"
    ></search-roles>

    <!-- 分配权限的对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="setRightDialogVisible"
      width="50%"
      @close="setRightDialogClosed">
      <!-- 树形控件 -->
      <el-tree
        :data="rightList"
        :props="treeProps"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defKeys"
        ref="treeRef"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import AddRoles from './childComps/AddRoles'
import SearchRoles from './childComps/SearchRoles'

export default {
  name: 'Roles',
  components: {
    AddRoles,
    SearchRoles
  },
  data() {
    return {
      // 保存角色列表数据
      roleList: [],
      // 控制分配权限对话框的显示与隐藏
      setRightDialogVisible: false,
      // 保存所有权限数据
      rightList: [],
      // 树形控件的属性绑定对象
      treeProps: {
        label: 'authName',
        children: 'children'
      },
      // 默认选中节点id值数组
      defKeys: [],
      // 当前即将分配权限角色的id
      rowsId: '',
      // 控制添加角色对话框的显示和隐藏
      addRolesDialogVisible: false,
      // 控制编辑角色对话框的显示和隐藏
      searchRolesDialogVisible: false,
      // 保存对应id的角色数据
      searchList: {
        id: '',
        roleName: '',
        roleDesc: ''
      }
    }
  },
  created() {
    this.getRoleList()
  },
  methods: {
    async getRoleList() {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色失败！')
      }
      this.roleList = res.data      
      this.$message.success('获取角色成功！ ')         
    },
    // 根据Id删除对应的权限
    async removeRightById(rows, itemId) {
      // 弹框提示用户是否删除
      const confirmReslt = await this.$confirm(
        '此操作将取消该权限, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      if (confirmReslt !== 'confirm') {
        return this.$message.info('取消了删除！')
      }
      const { data: res } = await this.$http.delete(
        `roles/${rows.id}/rights/${itemId}`
      )
      if (res.meta.status !== 200) {
        return this.$message.error('取消权限失败！')
      }
      // 因为使用 this.getRoleList() 会造成页面的重新刷新，
      // 而返回的 res.data 是最新的数据
      // 所以只需要重新赋值就行了
      rows.children = res.data
      this.$message.success(res.meta.msg)
    },
    // 展示分配权限的对话框
    async showSetRightDialog(rows) {
      this.rowsId = rows.id
      // 获取所有权限数据
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) {
        return thsi.$message.error('获取权限数据失败！')
      }
      this.rightList = res.data
      // 递归获取三级节点的id
      this.getLeafKeys(rows, this.defKeys)

      this.setRightDialogVisible = true
    },
    // 通过递归，获取角色下所有三级权限的id,并保存到 defKeys 数组中
    getLeafKeys(node, arr) {
      // 如果当前 node 节点不包括 children 属性，则是三级节点
      if (!node.children) {
        return arr.push(node.id)
      } else {
        // 如果当前 node 节点包括 children 属性，则调用for循环再次遍历数组
        node.children.forEach(item => this.getLeafKeys(item, arr))
      }
    },
    //  点击清空 defKeys
    setRightDialogClosed() {
      this.defKeys = []
    },
    // 点击为角色分配权限
    async allotRights() {
      // 通过element-ui的tree中的两个方法，来获取权限id，
      // 然后通过展开运算符...合并数组
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      // 通过join方法划分数组
      const idStr = keys.join(',')
      // console.log(this.rowsId)

      const { data: res } = await this.$http.post(
        `roles/${this.rowsId}/rights`,
        {
          rids: idStr
        }
      )
      if (res.meta.status !== 200) {
        return this.$message.error('权限授权失败！')
      }
      this.$message.success('权限授权成功！')
      this.getRoleList()
      this.setRightDialogVisible = false
    },
    // 点击显示添加角色的对话框
    AddRoles() {
      this.addRolesDialogVisible = true
    },
    // 关闭添加角色对话框时触发，
    closeDialog(flag) {
      this.addRolesDialogVisible = false
    },
    // 点击实现编辑角色对话框
    searchDialog(row) {
      this.searchRolesDialogVisible = true
      this.searchList.id = row.id
      this.searchList.roleName = row.roleName
      this.searchList.roleDesc = row.roleDesc
    },
    // 关闭编辑角色对话框时触发
    closeSearchDialog(flag) {
      this.searchRolesDialogVisible = false
    },
    // 根据id删除对应的角色数据
    async removeDialog(id) {
      const removeConfirm = await this.$confirm(
        '此操作将永久删除角色, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      if (removeConfirm !== 'confirm')
        return this.$message.info('已取消删除!')
      const { data: res } = await this.$http.delete('roles/' + id)
      if (res.meta.status !== 200) return this.$message.error('删除角色失败!')
      this.getRoleList()
      this.$message.success('删除角色成功!')
    }
  }
}
</script>

<style lang="less" scoped>
.el-tag {
  margin: 7px;
}

.bdtop {
  border-top: 1px solid #eee;
}

.bdbottom {
  border-bottom: 1px solid #eee;
}
</style>