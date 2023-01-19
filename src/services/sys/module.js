import { request } from 'umi';

//获取登录人菜单
export async function queryLoginModules(params) {
  return request('/mock/moduleDemo', { params });
}
export async function queryTree(params) {
  return request('/mock/moduleDemo', { params });
}
export async function query(params) {
  return request('/mock/module', { params });
}
export async function add(data) {
  return request('/mock/demo', { method: 'POST', data });
}
export async function update(data) {
  return request('/mock/demo', { method: 'PUT', data });
}
export async function remove(params) {
  return request('/mock/demo', { method: 'DELETE', params });
}

// 以下是正常项目标准接口

//获取登录人菜单
// export async function queryLoginModules(params) {
//   return request('/v2/userLogin/loginModules', { params });
// }
// export async function queryTree(params) {
//   return request('/v2/module/manage', { params });
// }
// export async function add(data) {
//   return request('/v2/module/manage', { method: 'POST', data });
// }
// export async function update(data) {
//   return request('/v2/module/manage', { method: 'PUT', data });
// }
// export async function remove(params) {
//   return request('/v2/module/manage', { method: 'DELETE', params });
// }