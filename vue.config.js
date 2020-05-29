module.exports = {
    /**
     * configureWebpack 和 chainWebpack 都是自定义webpack的打包配置
     * configureWebpack：通过操作对象的形式，来修改webpack的默认配置
     * chainWebpack：通过链式编程的形式，来修改webpack的默认配置
     */
    configureWebpack: {
        resolve: {
            alias: {
                'assets': '@/assets',
                'components': '@/components',
                'views': '@/views'
            }
        }
    },
    chainWebpack: config => {
        // 产品发布模式，运行 main-prod.js 文件
        config.when(process.env.NODE_ENV === 'production', config => {
                config.entry('app').clear().add('./src/main-prod.js')

                //使用externals设置排除项
                config.set('externals', {
                    vue: 'Vue',
                    'vue-router': 'VueRouter',
                    axios: 'axios',
                    lodash: '_',
                    echarts: 'echarts',
                    nprogress: 'NProgress',
                    'vue-quill-editor': 'VueQuillEditor'
                })

                config.plugin('html').tap(args => {
                    args[0].isProd = true
                    return args
                })
            })
            // 产品开发模式，运行 main-dev.js 文件
        config.when(process.env.NODE_ENV === 'development', config => {
            config.entry('app').clear().add('./src/main-dev.js')

            config.plugin('html').tap(args => {
                args[0].isProd = false
                return args
            })
        })
    }

}