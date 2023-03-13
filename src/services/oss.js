import { request } from '@umijs/max';

// 获取STS认证信息
export async function getSTSInfo(params) {
  return request('/common/getOssInfo', { params })
}