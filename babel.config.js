module.exports = {
  presets: [
    '@vue/app',
    [
      '@babel/preset-env',
      {
        useBuiltIns: 'entry',
        corejs: 2
      }
    ]
  ],
  plugins: [['@babel/plugin-transform-runtime', {}]],
  env: {
    development: {
      plugins: ['dynamic-import-node']
    }
  }
  // if your use import on Demand, Use this code
  // ,
  // plugins: [
  //   [ 'import', {
  //     'libraryName': 'ant-design-vue',
  //     'libraryDirectory': 'es',
  //     'style': true // `style: true` 会加载 less 文件
  //   } ]
  // ]
}
