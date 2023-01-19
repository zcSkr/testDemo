import React, { useState } from 'react';
import { Upload, message, Button } from 'antd';
import { ImportOutlined } from '@ant-design/icons'
import { useModel } from 'umi';
import md5 from 'md5'

const GlobalImport = ({
  maxCount = 1,
  accept = '.xls,.xlsx',
  action,
  onSuccess,
  ...props
}) => {

  const { initialState: { requestUrl } } = useModel('@@initialState');

  const handleUploadChange = ({ file, fileList }) => {
    // console.log(file,fileList)
    if (file.status === 'done') {
      message.success(`${file.name} 上传成功`);
      onSuccess?.()
    } else if (file.status === 'error') {
      message.error(`${file.name} 上传失败`);
    }
  }

  const [headers,setHeaders] = useState({})
  
  return (
    <Upload
      name='file'
      showUploadList={false}
      {...props}
      beforeUpload={(file,fileList) => {
        const timestamp = new Date().getTime()
        const rand = Math.floor(Math.random() * 100) //0-100随机整数
        setHeaders({
          'api-version': 1,
          token: sessionStorage.token || '',
          apiSecret: md5(md5(timestamp + "ccys" + rand)),
          timestamp,
          rand
        })
        return Promise.resolve()
      }}
      headers={headers}
      action={requestUrl + action}
      maxCount={maxCount}
      accept={accept}
      multiple={maxCount > 1}
      onChange={handleUploadChange}
    >
      <Button icon={<ImportOutlined />}>导入 </Button>
    </Upload>
  )
}

export default GlobalImport