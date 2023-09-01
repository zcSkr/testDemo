export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        name: 'login',
        path: '/user/login',
        component: './User/Login',
      },
    ],
  },
  {
    path: '/',
    component: './Welcome'
  },
  {
    name: '系统设置',
    access: 'accessRoute',
    icon: 'setting',
    path: '/sys',
    routes: [
      {
        name: '模块管理',
        access: 'accessDev',
        path: '/sys/module',
        component: './Sys/ModuleManage',
      },
      {
        name: '角色管理',
        access: 'accessRoute',
        path: '/sys/role',
        component: './Sys/RoleManage',
      },
      {
        name: '子管理员',
        access: 'accessRoute',
        path: '/sys/manager',
        component: './Sys/ChildManage',
      },
      {
        name: '系统参数',
        access: 'accessRoute',
        path: '/sys/params',
        component: './Sys/SysParams',
      },
      {
        name: '版本更新',
        access: 'accessRoute',
        path: '/sys/app',
        component: './Sys/App',
      },
    ]
  },
  {
    name: '测试菜单',
    access: 'accessRoute',
    icon: 'table',
    path: '/demo',
    routes: [
      {
        name: '查询表格',
        access: 'accessRoute',
        path: '/demo/demoTable',
        component: './Demo/DemoTable',
      },
      {
        name: '三级分类',
        access: 'accessRoute',
        path: '/demo/type',
        component: './Demo/Type',
      },
      {
        name: '客服中心',
        access: 'accessRoute',
        path: '/demo/customer',
        component: './Demo/CustomerService',
      },
    ]
  },
  {
    name: 'exception',
    path: '/exception',
    hideInMenu: true,
    routes: [
      // exception
      {
        path: '/exception/403',
        name: '403',
        component: './Exception/403',
      },
      {
        path: '/exception/404',
        name: '404',
        component: './Exception/404',
      },
      {
        path: '/exception/500',
        name: '500',
        component: './Exception/500',
      },
    ],
  },
  {
    path: '*',
    component: './Exception/404',
  },
]