import { request } from 'umi';

// 获取STS认证信息
export async function getSTSInfo(params) {
  return request('/common/getOssInfo', { params })
}