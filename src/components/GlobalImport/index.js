import React, { useState } from 'react';
import { Upload, message, Button } from 'antd';
import { ImportOutlined } from '@ant-design/icons'
import { useModel } from '@umijs/max';
import md5 from 'crypto-js/md5'

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
    if (file.response) {
      if (file.response.code === 200) {
        message.success(`${file.name} 导入成功`);
        onSuccess?.(file, fileList)
      } else {
        message.error(file.response.msg);
      }
    }
  }

  const [headers,setHeaders] = useState({})
  
  return (
    <Upload
      name='file'
      showUploadList={false}
      {...props}
      beforeUpload={async (file,fileList) => {
        const timestamp = new Date().getTime()
        const rand = Math.floor(Math.random() * 99999) //0-99999随机整数
        setHeaders({
          token: sessionStorage.token || '',
          apiSecret: md5(md5(timestamp + "ccys" + rand).toString()).toString(),
          timestamp,
          rand
        })
        return file
      }}
      headers={headers}
      action={requestUrl + action}
      maxCount={maxCount}
      accept={accept}
      multiple={maxCount > 1}
      onChange={handleUploadChange}
    >
      {props.children || <Button icon={<ImportOutlined />}>导入 </Button>}
    </Upload>
  )
}

export default GlobalImport