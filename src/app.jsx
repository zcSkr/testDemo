import { history } from '@umijs/max';
import { notification, theme } from 'antd';
import md5 from 'md5'
import defaultSettings from '../config/defaultSettings';
import { LinkOutlined, UserOutlined } from '@ant-design/icons';
// import { PageLoading } from '@ant-design/pro-components';
import React from 'react';
import RightContent from '@/components/RightContent';
import Exception403 from '@/pages/Exception/403'
import qs from 'qs';

import * as services_module from '@/services/sys/module';

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '错误: 登录超时/异地登录',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};
const errorHandler = (error) => {
  const { response } = error;
  if (response?.status) {
    const errorText = codeMessage[response.status] || response.statusText;
    const { status, url } = response;
    notification.error({
      key: 'global_error',
      message: `请求错误 ${status}`,
      description: errorText,
    });
    if (status === 401) {
      history.replace('/user/login');
    }
  } else if (!response) {
    notification.error({
      key: 'global_error',
      description: '您的网络发生异常，无法连接服务器',
      message: '网络异常',
    });
  }
  return response;
};

const headerInterceptor = (url, options) => {
  const timestamp = new Date().getTime()
  const rand = Math.floor(Math.random() * 99999) //0-99999随机整数
  if (url.substr(0, 4) != 'http') {
    url = (process.env.NODE_ENV === 'development' ? '/api' : requestUrl) + url;
  }
  return {
    url,
    options: {
      ...options,
      data: options.requestType == 'form' ? qs.stringify(options.data) : options.data,
      headers: {
        'Content-Type': options.requestType == 'form' ? 'application/x-www-form-urlencoded;charset=UTF-8' : 'application/json;charset=UTF-8',
        'api-version': 1,
        token: sessionStorage.token,
        apiSecret: md5(md5(timestamp + "ccys" + rand)),
        timestamp,
        rand
      }
    }
  };
};

//打包时接口请求路径
const requestUrl = 'https://www.fastmock.site/mock/19502d36f214e49aeb0b29a39556846e/mock'
export const request = {
  errorConfig: { errorHandler },
  requestType: 'form',//post 请求时数据类型，默认form，需要json时services层改变传值
  requestInterceptors: [headerInterceptor],
};
// 全局初始化数据配置，用于 Layout 用户信息和权限初始化
// 更多信息见文档：https://next.umijs.org/docs/api/runtime-config#getinitialstate
export async function getInitialState() {
  const ossHost = 'https://school-coach-static.oss-cn-chengdu.aliyuncs.com' //oss上传路径
  const ossSuffix = '?x-oss-process=video/snapshot,t_1000,m_fast' //oss视频链接拼接此后缀即为视频封面图
  const getToken = () => sessionStorage.token
  const setToken = token => sessionStorage.token = token
  const getUnionuser = () => sessionStorage.unionuser ? JSON.parse(sessionStorage.unionuser) : null
  const setUnionuser = unionuser => sessionStorage.unionuser = JSON.stringify(unionuser)
  return {
    settings: defaultSettings,
    requestUrl,
    ossHost,
    ossSuffix,
    getToken,
    setToken,
    getUnionuser,
    setUnionuser,
  };
}

export const antd = (memo) => {
  // console.log(memo)
  // memo.theme ??= {};
  // // memo.theme.algorithm = [theme.compactAlgorithm]; // 配置 antd5 的预设 dark 算法
  // memo.appConfig = {
  //   message: {
  //     // 配置 message 最大显示数，超过限制时，最早的消息会被自动关闭
  //     maxCount: 1,
  //   }
  // }
  // console.log(memo)
  return memo;
};

export const layout = ({ initialState, setInitialState }) => {
  const { token } = theme.useToken()
  const loopMenuItem = (menus) =>
    menus?.map(({ children, ...item }) => ({
      ...item,
      routes: children && loopMenuItem(children),
    }));
  return {
    avatarProps: {
      src: <UserOutlined style={{ color: token.blue }} />,
      size: 'small',
      title: initialState.getUnionuser()?.nickname || initialState.getUnionuser()?.account,
      render: (props, dom) => <RightContent>{dom}</RightContent>
    },
    actionsRender: (props) => [], //if不写这行，layout仅在top模式下没有显示avatarProps
    //  rightContentRender: () => <RightContent />,
    rightContentRender: false,
    onPageChange: ({ pathname }) => {
      if (!initialState.getUnionuser() && pathname !== '/user/login') {// 如果没有登录，重定向到 login
        history.replace('/user/login');
      }
    },
    onMenuHeaderClick: () => history.push('/'),
    // 自定义渲染面包屑
    breadcrumbRender: (routers = []) => {
      const routes = [{ linkPath: '/', breadcrumbName: '首页' }, ...routers]
      routes.forEach(item => {
        const first = routes.indexOf(item) === 0;
        if (!first) delete item.linkPath
      })
      return routes
    },
    menu: {
      locale: false,
      // 权限路由
      params: { token: sessionStorage.token }, // 每当 sessionStorage.token 发生修改时重新执行 request
      // request: async (params, defaultMenuData) => {
      //   if (!params.token) return [] //没有token不走接口
      //   const res = await services_module.queryLoginModules()
      //   const menuRes = res.data.map(item => ({ ...item, icon: defaultMenuData.find(route => route.path == item.path)?.icon }))
      //   setInitialState({ ...initialState, menuRes })
      //   return loopMenuItem(menuRes)
      // }
    },
    links: process.env.NODE_ENV === 'development' ? [
      <a href="http://192.168.2.74:9010/admin/swagger-ui.html" target="_blank">
        <LinkOutlined />
        <span>本地接口文档</span>
      </a>,
      <a href="https://xx.xxx.com/xxx/swagger-ui.html" target="_blank">
        <LinkOutlined />
        <span>线上接口文档</span>
      </a>,
    ] : [],
    // 自定义 403 页面
    unAccessible: <Exception403 />,
    // 增加一个 loading 的状态
    childrenRender: (children, props) => {
      // if (initialState?.loading) return <PageLoading />;
      return children;
    },
    ...initialState?.settings,
  };
};
