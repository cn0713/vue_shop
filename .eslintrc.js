module.exports = {
    root: true,
    env: {
        node: false
    },
    extends: [
        'plugin:vue/essential',
        // 关闭eslint
        // '@vue/standard'
    ],
    parserOptions: {
        parser: 'babel-eslint'
    },
    rules: {
        'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off'
    }
}