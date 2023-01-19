import { request } from 'umi';


export async function query(params) {
  return request('/mock/demo', { params });
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

// export async function query(params) {
//   return request('/v2/role/manage', { params });
// }
// export async function add(data) {
//   return request('/v2/role/manage', { method: 'POST', data });
// }
// export async function update(data) {
//   return request('/v2/role/manage', { method: 'PUT', data });
// }
// export async function remove(params) {
//   return request('/v2/role/manage', { method: 'DELETE', params });
// }
