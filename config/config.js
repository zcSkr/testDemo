// https://umijs.org/config/
import { defineConfig } from '@umijs/max';
import defaultSettings from './defaultSettings';
import pageRoutes from './router.config';
export default defineConfig({
  base: '/',
  publicPath: '/',
  favicons: ['/favicon.ico'],
  hash: true,
  history: { type: 'hash' },
  antd: {
    // configProvider
    configProvider: {},
    // themes
    dark: false, // 开启暗色主题
    compact: false, // 开启紧凑主题
  },
  dva: {},
  layout: {},
  locale: {
    // default zh-CN
    default: 'zh-CN',
    antd: true,
    // default true, when it is true, will use `navigator.language` overwrite default
    baseNavigator: true,
  },
  // umi routes: https://umijs.org/docs/routing
  routes: pageRoutes,
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    'primary-color': defaultSettings.primaryColor,
  },
  headScripts: [ //需要头部引入的三方script配置
    'https://map.qq.com/api/js?v=2.exp&key=TUJBZ-GMTR4-FE7UG-XIRYO-IQM2F-TCF4X', //腾讯地图script
    'http://api.map.baidu.com/api?v=2.0&ak=GC2tQ11of0Kr8WLpYws4ySC3aPT7t4ly',//百度地图script
    'https://webapi.amap.com/maps?v=1.4.15&key=c070243f603d1206459ee7e2f8cbb191',//高德地图script
  ],
  externals: {},
  proxy: {
    '/api': {
      target: 'http://localhost:8000',
      // target: 'https://www.fastmock.site/mock/19502d36f214e49aeb0b29a39556846e/mock',
      changeOrigin: true,
      pathRewrite: {
        '^/api': '',
      },
    },
  },
  moment2dayjs: {},
  fastRefresh: true,
  devtool: process.env.NODE_ENV === 'development' ? 'eval' : false,
  model: {},
  request: {},
  access: {},
  initialState: {}, // access 插件依赖 initial State 所以需要同时开启
  deadCode: { //检测未使用的文件和导出
    failOnHint: true, //检测失败是否终止进程
    exclude: ['src/pages/document.ejs'],  //排除检测的范围
  },
  helmet: false, //不会集成 react-helmet-async同时构建产物也会减少相应的尺寸
});
