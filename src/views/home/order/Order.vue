<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片内容 -->
    <el-card>
      <!-- 搜索区域 -->
      <el-row>
        <el-col :span="8">
          <el-input placeholder="请输入订单编号" v-model="queryInfo.query">
            <el-button slot="append" icon="el-icon-search" @click="getOrderList"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- 订单列表数据 -->
      <el-table :data="orderslist" stripe border>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="订单编号" prop="order_number" width="300px"></el-table-column>
        <el-table-column label="订单价格" prop="order_price"></el-table-column>
        <el-table-column label="是否付款" prop="pay_status">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.pay_status === 1">已付款</el-tag>
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货" prop="is_send"></el-table-column>
        <el-table-column label="下单时间">
          <template slot-scope="scope">{{scope.row.create_time | dateFormat}}</template>
        </el-table-column>
        <el-table-column label="操作" width="100px">
          <template slot-scope="scope">
            <el-tooltip :enterable="false" effect="dark" content="修改地址" placement="top">
              <el-button
                size="mini"
                type="primary"
                icon="el-icon-edit"
                circle
                @click="editAddress(scope.row.order_id)"
              ></el-button>
            </el-tooltip>
            <el-tooltip :enterable="false" effect="dark" content="物流进度" placement="top">
              <el-button
                size="mini"
                type="success"
                icon="el-icon-location-outline"
                circle
                @click="showProgress"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页数据 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>

    <!-- 修改地址对话框 -->
    <el-dialog
      title="修改地址"
      :visible.sync="addressVisible"
      width="50%"
      @close="addressVisibleClosed"
    >
      <el-form :model="addressForm" :rules="addressRules" ref="addressFormRef" label-width="100px">
        <el-form-item label="省市区/县" prop="address1">
          <el-cascader
            v-model="addressForm.address1"
            :options="cityDate"
            :props="cascaderProps"
            @change="handleChange"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="addressForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addressVisible = false">取 消</el-button>
        <el-button type="primary" @click="Address">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 物流对话框 -->
    <el-dialog title="物流信息" :visible.sync="progressVisible" width="50%">
      <span>这是一段信息</span>
    </el-dialog>
  </div>
</template>

<script>
import cityDate from './citydata'

export default {
  name: 'order',
  data() {
    return {
      // 订单查询对象
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      // 保存订单数据
      orderslist: [],
      // 订单总数
      total: 0,
      // 控制修改地址对话框的显示和隐藏
      addressVisible: false,
      // 编辑的地址的数据
      addressForm: {
        // 省市县
        address1: '',
        // 详细地址
        address2: ''
      },
      // 验证信息
      addressRules: {
        address1: [{ required: true, message: '请选择地址', trigger: 'blur' }],
        address2: [{ required: true, message: '请输入地址', trigger: 'blur' }]
      },
      // 保存省市区/县的地址
      cityDate,
      // 级联选择框的配置内容
      cascaderProps: {
        expandTrigger: 'hover',
        value: 'value',
        label: 'label',
        children: 'children'
      },
      // 控制物流信息对话框的显示和隐藏
      progressVisible: false,
      // 保存物流信息数据
      progressInfo: []
    }
  },
  created() {
    this.getOrderList()
  },
  methods: {
    // 获取商品订单的数据
    async getOrderList() {
      const { data: res } = await this.$http.get('orders', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取订单数据失败!')
      }
      // console.log(res.data);
      this.total = res.data.total
      this.orderslist = res.data.goods
    },
    // 当 pageSize 改变时会触发
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getOrderList()
    },
    // 当 pageNum 改变时触发
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getOrderList()
    },
    // 点击按钮,弹出修改地址对话框
    editAddress() {
      this.addressVisible = true
    },
    // 级联选择变化时触发
    handleChange() {},
    // 对话框关闭时触发
    addressVisibleClosed() {
      this.$refs.addressFormRef.resetFields()
    },
    // 确定修改地址时触发
    Address() {
      this.$refs.addressFormRef.validate(valid => {
        if (!valid) return
        this.addressVisible = false
      })
    },
    // 点击按钮,弹出物流信息的对话框
    showProgress() {
      this.$http.get('/kuaidi/1106975712662').then(res => {
        this.progressInfo = res.data
        console.log(this.progressInfo);
        
      })
      this.progressVisible = true
    },
  }
}
</script>

<style lang="less" scoped>
.el-cascader {
  width: 100%;
}
</style>