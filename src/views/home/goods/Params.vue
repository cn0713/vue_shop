<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 警告提示区域 -->
      <el-alert show-icon title="注意：只允许为第三级分类设置相关参数！" type="warning" :closable="false"></el-alert>
      <!-- 商品分类区域 -->
      <el-row class="cat_opt">
        <el-col>
          <span>选择商品分类:</span>
          <!-- 选择商品分类的级联选择框 -->
          <el-cascader
            v-model="selectedCateKeys"
            :options="catelist"
            :props="cateProps"
            @change="handleChange"
          ></el-cascader>
        </el-col>
      </el-row>
      <!-- tabs 页签区域 -->
      <el-tabs v-model="activeName" @tab-click="handleTabsClick">
        <!-- 添加动态参数的面板 -->
        <el-tab-pane label="动态参数" name="many">
          <!-- 动态参数按钮 -->
          <el-button
            type="primary"
            size="mini"
            :disabled="isBtnDisabled"
            @click="addParamsDialog"
          >添加参数</el-button>
          <!-- 动态参数表格 -->
          <el-table :data="manyTableDate" border stripe>
            <!-- 下拉列表项 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!-- 循环渲染Tag标签 -->
                <el-tag
                  v-for="(item,i) in scope.row.attr_vals"
                  :key="i"
                  closable
                  @close="closedTag(i,scope.row)"
                >{{item}}</el-tag>
                <!-- 输入的文本框 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <!-- 添加按钮 -->
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                >+ New Tag</el-button>
              </template>
            </el-table-column>
            <!-- 索引 -->
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  @click="showEditDialog(scope.row.attr_id)"
                >编辑</el-button>
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  @click="removeParams(scope.row.attr_id)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 添加静态属性的面板 -->
        <el-tab-pane label="静态属性" name="only">
          <!-- 静态属性按钮 -->
          <el-button
            type="primary"
            size="mini"
            :disabled="isBtnDisabled"
            @click="addParamsDialog"
          >添加属性</el-button>
          <!-- 静态属性表格 -->
          <el-table :data="onlyTableDate" border stripe>
            <!-- 下拉列表项 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!-- 循环渲染Tag标签 -->
                <el-tag
                  v-for="(item,i) in scope.row.attr_vals"
                  :key="i"
                  closable
                  @close="closedTag(i,scope.row)"
                >{{item}}</el-tag>
                <!-- 输入的文本框 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <!-- 添加按钮 -->
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                >+ New Tag</el-button>
              </template>
            </el-table-column>
            <!-- 索引 -->
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column label="属性名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  @click="showEditDialog(scope.row.attr_id)"
                >编辑</el-button>
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  @click="removeParams(scope.row.attr_id)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 添加对话框 -->
    <el-dialog
      :title="'添加'+titleText"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="closedDialog"
    >
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="80px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addForm.attr_name" ref="addFormInput"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑对话框 -->
    <el-dialog
      :title="'修改'+titleText"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editClosedDialog"
    >
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="80px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Params',
  data() {
    return {
      // 保存分类商品数据
      catelist: [],
      // 级联选择框的配置对象
      cateProps: {
        // 次级菜单的展开方式
        expandTrigger: 'hover',
        // 指定菜单的id
        value: 'cat_id',
        // 指定显示的内容
        label: 'cat_name',
        // 指定次级菜单的数据名
        children: 'children'
      },
      // 级联选择框双向绑定到的数组
      selectedCateKeys: [],
      // 被激活的页签名称
      activeName: 'many',
      // 动态参数的数据
      manyTableDate: [],
      // 静态参数的数据
      onlyTableDate: [],
      // 控制添加对话框的显示和隐藏
      addDialogVisible: false,
      // 添加参数的表单数据对象
      addForm: {
        attr_name: ''
      },
      // 添加参数的验证信息
      addFormRules: {
        attr_name: [
          { required: true, message: '请输入正确信息', trigger: 'blur' }
        ]
      },
      // 控制修改对话框的显示和隐藏
      editDialogVisible: false,
      // 修改参数的表单数据对象
      editForm: {
        attr_name: '',
        attr_id: 0
      },
      // 修改参数的验证信息
      editFormRules: {
        attr_name: [
          { required: true, message: '请输入正确信息', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    // 获取商品分类数据
    async getCateList() {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) {
        return this.$message.error('获取分类数据失败！')
      }
      this.catelist = res.data
    },
    // 级联选择框选中项变化，会触发这个函数
    handleChange() {
      this.getParamsData()
    },
    // 点击按钮,显示添加参数对话框
    addParamsDialog() {
      this.addDialogVisible = true
      // 自动获取焦点
      this.$nextTick(_ => {
        this.$refs.addFormInput.$refs.input.focus()
      })
    },
    // 点击页签触发的函数
    handleTabsClick() {
      // console.log(this.activeName)
      this.getParamsData()
    },
    // 获取参数的列表数据
    async getParamsData() {
      // 如果不是三级分类就,清空级联选择框
      if (this.selectedCateKeys.length !== 3) {
        this.selectedCateKeys = []
        this.manyTableDate = []
        this.onlyTableDate = []
        return
      }
      // 证明选中的三级分类
      // console.log('选中的是三级分类'+this.selectedCateKeys)
      // 根据所选分类的id,和当前所处的面板,获取对应的参数
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes`,
        {
          params: {
            sel: this.activeName
          }
        }
      )
      if (res.meta.status !== 200) {
        return this.$message.error('获取数据失败!')
      }
      // 遍历获取的数据,将attr_vals里的数据按照空格处理成数组
      res.data.forEach(item => {
        // 如果item.attr_vals值为空.则返回一个空字符串,
        // 解决了,添加的参数会有空的tag标签显示的bug
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        // 控制按钮文本框之间的切换
        item.inputVisible = false
        // 保存输入文本框的信息
        item.inputValue = ''
      })
      // console.log(res.data)

      // 根据activieName的不同,将res.data保存到不同的变量数组中
      if (this.activeName === 'many') {
        this.manyTableDate = res.data
      } else {
        this.onlyTableDate = res.data
      }
    },
    // 对话框关闭时触发
    closedDialog() {
      this.$refs.addFormRef.resetFields()
    },
    // 点击按钮,添加属性
    addParams() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post(
          `categories/${this.cateId}/attributes`,
          {
            attr_name: this.addForm.attr_name,
            attr_sel: this.activeName
          }
        )
        if (res.meta.status !== 201) {
          return this.$message.error('添加属性失败!')
        }
        this.$message.success('添加属性成功!')
        this.getParamsData()
        this.addDialogVisible = false
      })
    },
    // 点击按钮,显示编辑对话框
    async showEditDialog(attr_id) {
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes/${attr_id}`,
        {
          params: { attr_sel: this.activeName }
        }
      )
      if (res.meta.status !== 200) {
        return this.$message.error('查询参数失败!')
      }
      this.$message.success('查询参数成功!')
      this.editForm = res.data
      this.editDialogVisible = true
    },
    // 关闭对话框时,进行重置
    editClosedDialog() {
      this.$refs.editFormRef.resetFields()
    },
    // 点击按钮,修改列表数据
    editParams() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put(
          `categories/${this.cateId}/attributes/${this.editForm.attr_id}`,
          {
            attr_name: this.editForm.attr_name,
            attr_sel: this.activeName
          }
        )
        if (res.meta.status !== 200) return this.$message.error('修改参数失败!')
        this.$message.success('修改参数成功!')
        this.getParamsData()
        this.editDialogVisible = false
      })
    },
    // 根据id删除对应的参数
    async removeParams(attr_id) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该文件, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消了删除!')
      }
      const { data: res } = await this.$http.delete(
        `categories/${this.cateId}/attributes/${attr_id}`
      )
      if (res.meta.status !== 200) {
        return this.$message.error('删除失败!')
      }
      this.$message.success('删除成功!')
      this.getParamsData()
    },
    // 当失去焦点,或者键盘 Enter 键按下后触发
    handleInputConfirm(row) {
      // 处理输入的内容是否合法,如果不合法就清空内容
      if (row.inputValue.trim().length === 0) {
        row.inputValue = ''
        row.inputVisible = false
        return
      }
      // 如果没有 return 则证明输入的内容,需要做后续处理
      // 将新添加的 inputValue push到attr_vals数组中
      row.attr_vals.push(row.inputValue.trim())
      // 然后清空输入的内容
      row.inputValue = ''
      // 最后切换回添加按钮
      row.inputVisible = false
      // 将添加的Tag保存到数据库中
      this.saveAttrVals(row)
    },
    // 将对 attr_vals 的操作保存到数据库
    async saveAttrVals(row) {
      const { data: res } = await this.$http.put(
        `categories/${this.cateId}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          // 因为row.attr_vals的数据是数组,
          // 而数据库中的数据是字符串,
          // 所以要通过 join 将数组处理成字符串
          attr_vals: row.attr_vals.join(' ')
        }
      )
      if (res.meta.status !== 200) return this.$message.error('添加参数失败!')
      this.$message.success('添加参数成功!')
    },
    // 点击按钮,切换到输入文本框
    showInput(row) {
      row.inputVisible = true
      // 自动获取焦点
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    // 点击按钮,根据索引,删除对应的 Tag
    closedTag(i, row) {
      // 通过 splice 来删除对应的 Tag
      row.attr_vals.splice(i, 1)
      // 因为 splice 会改变原数组,所以可以之间发起网络请求,更新数据
      this.saveAttrVals(row)
    }
  },
  computed: {
    // 判断点击按钮是否禁用
    isBtnDisabled() {
      if (this.selectedCateKeys.length !== 3) {
        return true
      } else {
        return false
      }
    },
    // 动态获取三级分类选中的id
    cateId() {
      // 如果选中的时三级分类,那么就返回对应索引的id
      if (this.selectedCateKeys.length === 3) {
        return this.selectedCateKeys[2]
      }
      // 否则返回空值
      return null
    },
    // 动态获取对话框的提示信息
    titleText() {
      if (this.activeName === 'many') {
        return '动态参数'
      }
      return '静态属性'
    }
  }
}
</script>

<style lang="less" scoped>
.cat_opt {
  margin: 15px 0;
}

.el-cascader {
  margin-left: 15px;
}

.el-tag {
  margin: 0 15px;
}

.input-new-tag {
  width: 150px;
}
</style>