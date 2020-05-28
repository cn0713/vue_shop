<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <!-- 提示区域 -->
      <el-alert title="添加商品信息" type="info" center show-icon :closable="false"></el-alert>
      <!-- 步骤条区域 -->
      <el-steps :space="200" :active="activeIndex - 0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- Tab栏区域 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="80px"
        label-position="top"
      >
        <el-tabs
          tab-position="left"
          v-model="activeIndex"
          :before-leave="beforeTabLeave"
          @tab-click="tabClicked"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                v-model="addForm.goods_cat"
                :options="catelist"
                :props="cateProps"
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <!-- 渲染表单的item项 -->
            <el-form-item :label="item.attr_name" v-for="(item,i) in manyTableDate" :key="i">
              <!-- 复选框组 -->
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox :label="cb" v-for="(cb,i) in item.attr_vals" :key="i" border></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item :label="item.attr_name" v-for="item in onlyTableDate" :key="item.attr_id">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <!-- action 表示图片要上传到后台的API地址 -->
            <el-upload
              :action="baseUpload"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers="headersObj"
              :on-success="handerSuccess"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <!-- 富文本编辑组件 -->
            <quill-editor v-model="addForm.goods_introduce"></quill-editor>
            <!-- 添加商品按钮 -->
            <el-button type="primary" class="addBtn" @click="addGoods">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>

    <!-- 预览图片对话框 -->
    <el-dialog title="图片预览" :visible.sync="previewVisible" width="50%">
      <img :src="previewPath" alt="图片" class="previewImg" />
    </el-dialog>
  </div>
</template>

<script>
// 导入lodash插件
import _ from 'lodash'

export default {
  name: 'GoodsAdd',
  data() {
    return {
      // 进度条激活步骤的索引
      activeIndex: '0',
      // 保存添加商品的数据
      addForm: {
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        // 商品所属分类数组
        goods_cat: [],
        // 图片的数组
        pics: [],
        // 商品的详细描述
        goods_introduce: '',
        attrs: []
      },
      // 设置添加商品的验证规则
      addFormRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ],
        goods_cat: [
          { required: true, message: '请选择分类商品', trigger: 'blur' }
        ]
      },
      // 保存商品分类数据
      catelist: [],
      // 级联选择框的配置信息
      cateProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover'
      },
      // 保存动态参数的数据
      manyTableDate: [],
      // 保存静态属性的数据
      onlyTableDate: [],
      // 保存图片上传的API地址
      baseUpload: 'http://127.0.0.1:8888/api/private/v1/upload',
      // 图片上传组件的headers请求头对象
      headersObj: {
        // 因为el-upload调用的是它自己封装的axios
        // 没有获取我封装的token
        // 所以需要手动发送请求头信息
        Authorization: window.sessionStorage.getItem('token')
      },
      // 保存图片的地址
      previewPath: '',
      // 控制图片预览的显示和隐藏
      previewVisible: false
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
        return this.$message.error('获取商品分类数据失败!')
      }
      this.catelist = res.data
      // console.log(this.catelist)
    },
    // 级联选择框选中项变化,会触发这个函数
    handleChange() {
      // console.log(this.addForm.goods_cat)
      // 只允许选择第三级数据
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = []
        this.$message.error('只允许选择第三级的数据')
      }
    },
    // 切换标签页时触发
    beforeTabLeave(activeName, oldActiveName) {
      // console.log('即将离开标签页的名字' + oldActiveName)
      // console.log('即将进入标签页的名字' + activeName)
      // 当 即将离开标签页的名字 与 选择了商品分类 都为true才能进行跳转
      if (oldActiveName === '0' && this.addForm.goods_cat.length !== 3) {
        this.$message.error('请先选择商品分类!')
        return false
      }
    },
    // 点击Tab按钮时触发
    async tabClicked() {
      // 跳转到商品参数时触发
      if (this.activeIndex === '1' || this.activeIndex === '2') {
        // 获取动态参数的数据
        const { data: res } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          {
            params: {
              sel: this.isActiveName
            }
          }
        )
        if (res.meta.status !== 200) {
          return this.$message.error('获取动态参数失败!')
        }
        console.log(res.data)
        if (this.isActiveName === 'many') {
          // 将res.data中的attr_vals处理成数组
          res.data.forEach(item => {
            item.attr_vals =
              item.attr_vals.length !== 0 ? item.attr_vals.split(' ') : []
          })
          this.manyTableDate = res.data
        } else {
          this.onlyTableDate = res.data
        }
      }
    },
    // 处理图片预览效果
    handlePreview(file) {
      this.previewPath = file.response.data.url
      this.previewVisible = true
    },
    // 点击删除图片的操作
    handleRemove(file) {
      // console.log(file);
      // 1.获取将要删除的图片的临时路径
      const filePath = file.response.data.tmp_path
      // 2.从 pics 数组中找到这个图片对应的索引值
      const i = this.addForm.pics.findIndex(x => {
        x.pic = filePath
      })
      // 3.调用数组的 splice 方法,把图片信息对象,从 pics 数组中删除
      this.addForm.pics.splice(i, 1)
      console.log(this.addForm.pics)
    },
    // 图片上传成功执行的操作
    handerSuccess(response) {
      // console.log(response);
      // 1.拼接得到一个信息对象
      const picInfo = {
        pic: response.data.tmp_path
      }
      // 2.将图片对象push到 pics 数组中
      this.addForm.pics.push(picInfo)
      // console.log(this.addForm.pics);
    },
    // 点击按钮,添加商品
    addGoods() {
      this.$refs.addFormRef.validate(async vaild => {
        if (!vaild) {
          return this.$message.error('请输入必要的表单信息! ')
        }
        // 执行添加的业务逻辑
        /**
         * 因为级联选择框中的 goods_cat必须是数组,
         * 而添加商品的网络请求的参数又必须是字符串
         * 所以就通过 lodash插件 中的 cloneDeep(obj) 方法来执行深拷贝
         */
        const form = _.cloneDeep(this.addForm)
        form.goods_cat = form.goods_cat.join(',')
        // 处理动态参数
        this.manyTableDate.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(' ')
          }
          this.addForm.attrs.push(newInfo)
        })
        // 处理静态属性
        this.onlyTableDate.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals
          }
          this.addForm.attrs.push(newInfo)
        })
        form.attrs = this.addForm.attrs
        console.log(form)
        // 发起请求,添加商品
        // 商品的名称必须是唯一的
        const {data:res} = await this.$http.post('goods',form)
        if (res.meta.status !== 201) {
          return this.$message.error('添加商品失败,商品的名称必须是唯一!')
        }
        this.$message.success('添加商品成功!')
        this.$router.push('/goods')
      })
    }
  },
  computed: {
    // 计算商品分类第三级分类的id
    cateId() {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2]
      }
      return null
    },
    // 计算返回的是 动态参数 还是 静态属性
    isActiveName() {
      if (this.activeIndex === '1') {
        return 'many'
      }
      return 'only'
    }
  }
}
</script>

<style lang="less" scoped>
.el-checkbox {
  margin: 0 10px 0 0 !important;
}

.previewImg {
  width: 100%;
}

.addBtn {
  margin-top: 15px;
}
</style>