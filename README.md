# 依赖安装
1. 首选yarn，由于yarn的扁平化处理，有“幽灵依赖”，不在package.json里列出
2. 如果选择npm/pnpm ，由于没有扁平化处理，不在package.json列出的包不会安装，导致用到的包会提示找不到。此类情况按提示安装即可。

# Ant Design Pro
此项目依赖于 antd-pro v6版本
[Ant Design Pro v6](https://pro.ant.design).
[ProComponent组件文档](https://procomponents.ant.design/)
 
# Ant Design
此项目依赖于 antd5.x.x以上版本
[Ant Design 5.x.x](https://ant.design/index-cn).

# React Hooks
此项目使用hooks编写函数式组件 
[React Hooks 入门教程](http://www.ruanyifeng.com/blog/2019/09/react-hooks.html).
[轻松学会 React 钩子：以 useEffect() 为例](http://www.ruanyifeng.com/blog/2020/09/react-hooks-useeffect-tutorial.html).

# UmiJS
此项目依赖于umi4.x.x
[UmiJS 4.x.x](https://umijs.org/zh-CN)


# 开始使用
### 注意此脚手架使用mock模拟数据请求，oss示例缺少参数无法上传！
1. dev模式接口使用proxy代理 在`config/config.js`里面的proxy配置target到本地接口地址，如http://localhost:8000
2. build之后proxy失效，请求会在app.js里request拼接上prefix里面的`requestUrl`

# 开发规范
#### 1. page层
1. 参考`src/pages/Demo`文件夹，一级文件夹代表一级菜单，二级文件夹代表二级菜单
2. 参考`src/pages/Demo/DemoTable`文件夹，`index.js`代表路由页面，组件在`components`文件夹，model在`models`文件夹
3. 弹出层分为两种`src/components/GlobalModal`和`src/components/GlobalDrawer`，根据业务场景，表单提交用modal，详情展示以及弹出表格等用Drawer

#### 2. models层
1. 规范写法参考`src/pages/Demo/DemoTable/models/demoTable.js`,由于ProTable组件，models不再存储list数组，仅需存储pagination
2. umi4.x.x使用的是[@umijs/plugin-dva](https://umijs.org/zh-CN/plugins/plugin-dva)插件，使用约定式的model组织方式，故不再有公私有models概念。pageA可以connect pageB的model使用。（[回顾umi2.x.x 页面 model 不能被其他页面所引用的原因](https://v2.umijs.org/zh/guide/with-dva.html#model-%E6%B3%A8%E5%86%8C)）
3. `src/models`下的文件，放一些通用的model就够，比如`global.js` 等所有项目都可能用到的model

#### 3. services层
1. 规范写法参考`src/services/demo/demoTable.js`,get类的将params放在`params`里，post类的将参数放在`data`里。
2. 默认表单提交，需要json提交传`requestType: 'json'`。具体原因请参考文档[@umijs/plugin-request](https://umijs.org/zh-CN/plugins/plugin-request)和[umi-request](https://github.com/umijs/umi-request)


# 业务组件
###### 使用React Hooks重构了之前的常用组件
## 组件`BraftEditor`、`GlobalUpload`、`Sku`用到的鱼oss有关参数的处理在`components/_utils`
1. Bmap:百度地图。需引入三方js，配置如`config/config.js`39行
2. BraftEditor:富文本编辑器oss版本
3. GlobalDrawer:公共抽屉弹出层
4. GlobalModal:公共Modal弹出层
5. GlobalUpload:公共上传文件（仅video和img表现良好）oss版本
6. QQMap:腾讯地图。需引入三方js，配置如`config/config.js`38行
7. StandardTable: 公共ProTable组件
8. Sku: 商品规格组件oss版本
9. EditTag: 标签添加组件
10. GlobalAudit: 常用于审核部分
11. VideoPreview: 用于表格列视频展示播放
12. Amap:高德地图。需引入三方js，配置如`config/config.js`40行
13. UpdatePsd:公共修改密码弹窗组件
14. VideoPreview: 视频预览组件（常用于表格列）
15. GlobalAudit: 公共审核组件（包含textArea和审核成功按钮和审核失败按钮）
16. GlobalExport: 公共导出组件（常见于表格导出）特别注意：service层需要responseType: 'blob', getResponse: true。
17. GlobalImport: 公共导入组件（常见于表格导入excel）
18. GlobalSearchSelect: 下拉框输入异步请求的组件，搜索之后查询接口展示select（常见于表单select数据量很大时用此组件替代）

# 常用的代码提交默认前缀标签规则
1. feat: 新功能（feature）
2. fix: 修补bug
3. docs: 文档（documentation）
4. style: 格式（不影响代码运行的变动）
5. refactor: 重构（即不是新增功能，也不是修改bug的代码变动）
6. chore: 构建过程或辅助工具的变动
7. revert: 撤销，版本回退
8. perf: 性能优化
9. test：测试
10. improvement: 改进
11. build: 打包
12. ci: 持续集成
13. update:更新