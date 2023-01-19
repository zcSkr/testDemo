import { request } from 'umi';

export async function query(params) {
    return request('/mock/demo', { params });
}
export async function update(data) {
    return request('/mock/demo', { method: 'POST', data });
}
export async function remove(params) {
    return request('/mock/demo', { method: 'DELETE', params });
}

// 以下是正常项目标准接口

// export async function query(params) {
//     return request('/v2/customerService/change', { params });
// }
// export async function update(data) {
//     return request('/v2/customerService/findList', { method: 'POST', data });
// }
// export async function remove(params) {
//     return request('/v2/customerService/delete', { method: 'DELETE', params });
// }