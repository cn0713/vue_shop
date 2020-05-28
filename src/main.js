import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
// 引入element-ui插件
import './plugins/element.js'
// 引入默认的CSS文件
import './assets/css/global.css'
// 引入iconfont字体图标
import './assets/fonts/iconfont.css'
//  引入 vue-table-with-tree-grid ui插件
import TreeTable from 'vue-table-with-tree-grid'
// 1.导入富文本编辑器插件
import VueQuillEditor from 'vue-quill-editor'

// 2.导入富文本编辑器对应的样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

// 配置请求的根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/';
// 添加axios的请求拦截
axios.interceptors.request.use(config => {
        // 为请求头对象添加 token 验证的 `Authorization`字段
        // console.log(config);
        config.headers.Authorization = window.sessionStorage.getItem('token');
        // 最后必须 return config
        return config
    })
    // axios添加到Vue原型中
Vue.prototype.$http = axios

// 创建一个中央事件总线
Vue.prototype.$bus = new Vue()

// 注册 vue-table-with-tree-grid 组件
Vue.component('tree-table', TreeTable)

// 3.全局注册富文本编辑器
Vue.use(VueQuillEditor)

// 定义一个全局过滤器
Vue.filter('dateFormat', (originVal) => {
    const dt = new Date(originVal)

    const y = dt.getFullYear()
        // 月是从0开始的,所以要加1
        // 将数据处理成字符串,所以后面加引号
        // .padStart是ES6的新特性:返回的数据为两位数,并且不足的用 0 补齐
    const m = (dt.getMonth() + 1 + '').padStart(2, '0')
    const d = (dt.getDay() + '').padStart(2, '0')

    const hh = (dt.getHours() + '').padStart(2, '0')
    const mm = (dt.getMinutes() + '').padStart(2, '0')
    const ss = (dt.getSeconds() + '').padStart(2, '0')

    return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

Vue.config.productionTip = false

new Vue({
    router,
    render: h => h(App)
}).$mount('#app')