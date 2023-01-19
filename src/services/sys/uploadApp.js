import { request } from 'umi';

export async function query(params) {
  return request('/v2/app/update', { params });
}
export async function add(data) {
  return request('/v2/app/update', { method: 'POST', data });
}
export async function remove(params) {
  return request('/v2/app/update', { method: 'DELETE', params });
}