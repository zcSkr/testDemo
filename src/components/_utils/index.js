import * as service_oss from '@/services/oss';
import encBase64 from 'crypto-js/enc-base64';
import HmacSHA1 from 'crypto-js/hmac-sha1';
import encUtf8 from 'crypto-js/enc-utf8';
// 获取oss参数
export const getOSSData = async () => {
  const { data } = await service_oss.getSTSInfo()
  if (!data) return null
  const policyText = {
    expiration: data.expiration, // 设置policy过期时间。
    conditions: [
      // 限制上传大小。
      ["content-length-range", 0, 500 * 1024 * 1024], //不写会oss报错400，默认500MB
    ],
  };
  const policy = encBase64.stringify(encUtf8.parse(JSON.stringify(policyText))) // policy必须为base64的string。
  // 计算签名。
  function computeSignature(accessKeySecret, canonicalString) {
    return encBase64.stringify(HmacSHA1(canonicalString, accessKeySecret));
  }
  const signature = computeSignature(data.accessKeySecret, policy)
  const formData = {
    OSSAccessKeyId: data.accessKeyId,
    signature,
    policy,
    'x-oss-security-token': data.securityToken
  }
  // console.log(formData)
  return formData
}

// 获取上传文件后缀
export const getSuffix = (filename) => {
  const pos = filename.lastIndexOf('.')
  let suffix = ''
  if (pos != -1) {
    suffix = filename.substring(pos)
  }
  return suffix;
}

// 上传文件重命名
export const randomString = (len) => {
  len = len || 32;
  var chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
  var maxPos = chars.length;
  var pwd = '';
  for (let i = 0; i < len; i++) {
    pwd += chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return pwd;
}

export const getDuration = (originFile) => {
  let dom;
  if (/audio/.test(originFile.type)) {
    dom = document.createElement('audio')
  } 
  if(/video/.test(originFile.type)) {
    dom = document.createElement('video')
  }
  const url = window.URL.createObjectURL(originFile)
  let time = null
  dom.src = url;
  const formatTime = (time) => {
    let min = Math.floor(time / 60);  //格式化分钟
    min = min < 10 ? '0' + min : min;  //三目 //秒
    let sec = Math.floor(time % 60);
    sec = sec < 10 ? '0' + sec : sec;
    return min + ':' + sec;
  }
  return new Promise((resolve, reject) => {
    dom.onloadedmetadata = () => {
      if (dom.readyState > 0) {
        time = formatTime(dom.duration)
        resolve(time)
      }
    };
  })
}