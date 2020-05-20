import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import './plugins/element.js'
// 引入默认的CSS文件
import './assets/css/global.css'
// 引入iconfont字体图标
import './assets/fonts/iconfont.css'

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

Vue.config.productionTip = false

new Vue({
    router,
    render: h => h(App)
}).$mount('#app')