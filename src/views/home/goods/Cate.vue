<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片内容 -->
    <el-card>
      <!-- 添加分类按钮 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="addCateDialog()">添加分类</el-button>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <tree-table
        :data="cartlist"
        :columns="cateColumns"
        :selection-type="false"
        :expand-type="false"
        :show-index="true"
        index-text="#"
        border
        class="tree_table"
      >
        <!-- 是否有效 -->
        <template v-slot:isok="scope">
          <i
            class="el-icon-success"
            v-if="scope.row.cat_deleted === false"
            style="color:lightgreen"
          ></i>
          <i class="el-icon-error" v-else style="color:red"></i>
        </template>
        <!-- 排序 -->
        <template v-slot:order="scope">
          <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag size="mini" type="success" v-else-if="scope.row.cat_level === 1">二级</el-tag>
          <el-tag size="mini" type="warning" v-else>三级</el-tag>
        </template>
        <!-- 操作 -->
        <template v-slot:opt="scope">
          <el-button
            size="mini"
            type="primary"
            icon="el-icon-edit"
            @click="searchCateDialog(scope.row.cat_id)"
          >编辑</el-button>
          <el-button
            size="mini"
            type="danger"
            icon="el-icon-delete"
            @click="removeCateDialog(scope.row.cat_id)"
          >删除</el-button>
        </template>
      </tree-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>

    <!-- 添加分类对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCateDialogVisible"
      width="50%"
      @close="closeCateDialogVisible"
    >
      <!-- 添加分类的表单 -->
      <el-form :model="addCateForm" :rules="addCateRules" ref="addCateRef" label-width="80px">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <!-- options: 用来指定数据源 -->
          <!-- props: 用来指定匹配对象 -->
          <el-cascader
            v-model="selectedKeys"
            :options="parentCateList"
            :props="cascaderProps"
            @change="parentCateChanged"
            clearable
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改分类对话框 -->
    <el-dialog title="编辑分类" :visible.sync="searchCateDialogVisible" width="50%">
      <el-form :model="searchCateList" :rules="addCateRules" ref="searchCateRef" label-width="80px">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="searchCateList.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="searchCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="searchCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Cate',
  components: {},
  data() {
    return {
      // 查询条件
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      // 商品分类数据列表，默认为空
      cartlist: [],
      // 保存商品总数
      total: 0,
      // 为table指定列的定义
      cateColumns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          // 表示将当前列定义为模板列
          type: 'template',
          // 表示当前这一列使用模板名称
          template: 'isok'
        },
        {
          label: '排序',
          // 表示将当前列定义为模板列
          type: 'template',
          // 表示当前这一列使用模板名称
          template: 'order'
        },
        {
          label: '操作',
          // 表示将当前列定义为模板列
          type: 'template',
          // 表示当前这一列使用模板名称
          template: 'opt'
        }
      ],
      // 控制添加分类对话框的显示和隐藏
      addCateDialogVisible: false,
      // 添加分类的表单的数据对象
      addCateForm: {
        // 父级分类的Id
        cat_pid: 0,
        // 将要添加分类的名称
        cat_name: '',
        // 分类的等级，默认要添加的是1级分类
        cat_level: 0
      },
      // 添加分类表单的验证规则
      addCateRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
          { min: 2, max: 6, message: '长度在 2 到 6 个字符', trigger: 'blur' }
        ]
      },
      // 保存父级分类的数据
      parentCateList: [],
      // 指定级联选择器的配置对象
      cascaderProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        checkStrictly: 'true'
      },
      // 选中的父级分类的Id数组
      selectedKeys: [],
      // 控制编辑分类对话框的显示和隐藏
      searchCateDialogVisible: false,
      // 保存根据id查询到的分类信息
      searchCateList: {
        cat_id: '',
        cat_name: ''
      }
    }
  },
  created() {
    this.getCartList()
  },
  methods: {
    // 获取商品分类数据
    async getCartList() {
      const { data: res } = await this.$http.get('categories', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类数据失败！')
      }
      this.$message.success('获取分类商品成功！')
      this.cartlist = res.data.result
      this.total = res.data.total
      // console.log(res)
    },
    // 监听 pagesize 的改变
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getCartList()
    },
    // 监听 pagenum 的改变
    handleCurrentChange(newNum) {
      this.queryInfo.pagenum = newNum
      this.getCartList()
    },
    // 点击按钮，显示添加分类对话框
    addCateDialog() {
      // 先获取父级分类的数据
      this.getParentCateList()
      // 再显示添加分类对话框
      this.addCateDialogVisible = true
    },
    // 获取父级分类的数据列表
    async getParentCateList() {
      const { data: res } = await this.$http.get('categories', {
        params: { type: 2 }
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取父级分类数据失败！')
      }
      this.parentCateList = res.data
    },
    // 选择项发送改变时触发
    parentCateChanged() {
      // console.log(this.selectedKeys)
      // 当 selectedKeys 的长度大于0时，说明选择了父级分类
      // 反之 就说明没有选择父级分类
      if (this.selectedKeys.length > 0) {
        // 父级分类的id
        this.addCateForm.cat_pid = this.selectedKeys[
          this.selectedKeys.length - 1
        ]
        // 为当前分类的等级赋值
        this.addCateForm.cat_level = this.selectedKeys.length
      } else {
        // 父级分类的id
        this.addCateForm.cat_pid = 0
        // 为当前分类的等级赋值
        this.addCateForm.cat_level = 0
      }
    },
    // 点击按钮，确定添加新的分类
    addCate() {
      // 对新添加的分类进行预验证
      this.$refs.addCateRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post(
          'categories',
          this.addCateForm
        )
        if (res.meta.status !== 201) {
          return this.$message.error('添加分类失败！')
        }
        this.$message.success('添加分类成功！')
        this.getCartList()
        // 隐藏对话框
        this.addCateDialogVisible = false
      })
    },
    // 关闭对话框时触发，重置表单数据
    closeCateDialogVisible() {
      // 重置分类名称
      this.$refs.addCateRef.resetFields()
      // 重置父级分类
      this.selectedKeys = []
      // 重置父级分类的id
      this.addCateForm.cat_pid = 0
      // 重置父级分类的等级
      this.addCateForm.cat_level = 0
    },
    // 点击按钮，显示编辑分类对话框
    searchCateDialog(id) {
      this.searchCateList.cat_id = id
      this.getSearchCateList()

      this.searchCateDialogVisible = true
    },
    // 根据id查询商品分类数据
    async getSearchCateList() {
      const { data: res } = await this.$http.get(
        'categories/' + this.searchCateList.cat_id
      )
      if (res.meta.status !== 200) {
        return this.$message.error('查询分类数据失败！')
      }
      this.$message.success('查询分类数据成功！ ')
      this.searchCateList = res.data
    },
    // 点击按钮，确定修改分类信息
    searchCate() {
      this.$refs.searchCateRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put(
          'categories/' + this.searchCateList.cat_id,
          {
            cat_name: this.searchCateList.cat_name
          }
        )
        if (res.meta.status !== 200) {
          return this.$message.error('修改分类失败！')
        }
        this.$message.success('修改分类成功！')
        this.getCartList()
        this.searchCateDialogVisible = false
      })
    },
    // 点击按钮，删除商品分类数据
    async removeCateDialog(id) {
      const removeConfirm = await this.$confirm(
        '此操作将永久删除该分类, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      if (removeConfirm != 'confirm') {
        return this.$message.info('取消了删除！')
      }
      const { data: res } = await this.$http.delete('categories/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('删除分类失败！')
      }
      this.$message.success('删除分类成功！')
      this.getCartList()
    }
  }
}
</script>

<style lang="less" scoped>
.tree_table {
  margin: 15px 0;
}

.el-cascader {
  width: 100%;
}
</style>