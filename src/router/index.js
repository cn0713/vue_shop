import Vue from 'vue'
import VueRouter from 'vue-router'

// 懒加载组件
const Login = () =>
    import ('@/views/login/Login.vue')
const Home = () =>
    import ('@/views/home/Home')
const Welcome = () =>
    import ('@/views/home/user/Welcome')
const Users = () =>
    import ('@/views/home/user/Users')
const Rights = () =>
    import ('@/views/home/power/Rights')
const Roles = () =>
    import ('@/views/home/power/Roles')
const Cate = () =>
    import ('@/views/home/goods/Cate')

Vue.use(VueRouter)

const routes = [{
        path: '/',
        // 设置重定向页面，默认显示的页面
        redirect: "login"
    },
    {
        path: '/login',
        component: Login
    },
    {
        path: '/home',
        component: Home,
        // 重定向路径
        redirect: '/welcome',
        children: [{
                path: '/welcome',
                component: Welcome
            },
            {
                path: '/users',
                component: Users
            },
            {
                path: '/rights',
                component: Rights
            },
            {
                path: '/roles',
                component: Roles
            },
            {
                path: '/categories',
                component: Cate
            },
        ]
    }
]

const router = new VueRouter({
    routes
})

// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
    /**
     * to 将要访问的路径
     * from 代表从哪个路径跳转过来
     * next 是一个函数，表示放行
     */
    // 判断将要访问的路径是否是登录页面，如果是就放行
    if (to.path === '/login') return next();
    // 用getItem()方法获取保存到网站的中token
    const tokenStr = window.sessionStorage.getItem('token');
    // 如果没有token，则跳转到登录页面
    if (!tokenStr) return next('/login');
    // 如果有则留在当前页面
    next()

})


export default router