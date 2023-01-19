import { request } from 'umi';

export async function query(params) {
  return request('/mock/demo', { params });
}

// 默认表单提交，post将参数写在data里，get将参数写在params里面
export async function add(data) {
  return request('/mock/demo', { method: 'POST', data });
}
// json提交，传requestType: 'json', 去看文档https://github.com/umijs/umi-request/blob/master/README_zh-CN.md
export async function add_json(data) {
  return request('/mock/demo', { method: 'POST', data, requestType: 'json' });
}

export async function update(data) {
  return request('/mock/demo', { method: 'PUT', data });
}

export async function remove(params) {
  return request('/mock/demo', { method: 'DELETE', params });
}