import React, { useState, useEffect } from 'react';
import {
  Button,
  InputNumber,
  Upload,
  message,
} from 'antd';
import { useModel } from 'umi';
import StandardTable from '@/components/StandardTable';
import { UploadOutlined } from '@ant-design/icons';
import { getOSSData, getSuffix, randomString } from '../_utils';

const SkuTableOss = ({
  sku,
  value: list,
  handleSkuTableChange
}) => {
  // console.log(props)
  const { initialState: { ossHost } } = useModel('@@initialState');
  const [fileList, setFileList] = useState([])
  const [ossSTSInfo, setOssSTSInfo] = useState();

  useEffect(() => {
    (async () => {
      const res = await getOSSData()
      setOssSTSInfo(res)
    })()
  }, [])

  let columns = sku.map(item => ({ title: item.key, dataIndex: item.key }))
  columns.push(
    {
      title: () => <InputNumber onBlur={handleTitleBlur.bind(this, 'price')} size="small" style={{ width: '100%' }} min={0} precision={2} placeholder="价格" />,
      dataIndex: 'price',
      width: 100,
      render: (val, record, index) => <InputNumber value={val} onBlur={handleInputBlur.bind(this, 'price', index)} size="small" style={{ width: '100%' }} min={0.01} precision={2} placeholder="价格" />
    },
    {
      title: () => <InputNumber onBlur={handleTitleBlur.bind(this, 'num')} size="small" style={{ width: '100%' }} min={0} precision={0} placeholder="库存" />,
      dataIndex: 'num',
      width: 100,
      render: (val, record, index) => <InputNumber value={val} onBlur={handleInputBlur.bind(this, 'num', index)} size="small" style={{ width: '100%' }} min={0} precision={0} placeholder="库存" />
    },
    {
      title: () => (
        <div style={{ maxWidth: 200 }}>
          <Upload
            name='file'
            accept="image/*"
            action={ossHost}
            data={file => ({
              key: file.ossName,
              ...ossSTSInfo,
              'success_action_status': '200' //让服务端返回200,不然，默认会返回204
            })}
            beforeUpload={async (file, fileList) => { //上传前文件重命名
              file.ossName = `Spu/${randomString(10)}${getSuffix(file.name)}`
              return file
            }}
            fileList={fileList}
            onChange={(e) => handleTitleUploadChange('img', e)}
          >
            <Button size="small">
              <UploadOutlined /> 批量上传图片
            </Button>
          </Upload>
        </div>
      ),
      dataIndex: 'img',
      render: (val, record, index) => (
        <div style={{ maxWidth: 200 }}>
          <Upload
            name='file'
            accept="image/*"
            action={ossHost}
            data={file => ({
              key: file.ossName,
              ...ossSTSInfo,
              'success_action_status': '200' //让服务端返回200,不然，默认会返回204
            })}
            beforeUpload={async (file, fileList) => { //上传前文件重命名
              file.ossName = `Spu/${randomString(10)}${getSuffix(file.name)}`
              return file
            }}
            fileList={val || []}
            onChange={(e) => handleUploadChange(index, 'img', e)}
          >
            <Button size="small">
              <UploadOutlined /> 上传图片
            </Button>
          </Upload>
        </div>
      )
    },
  )

  const handleInputBlur = (action, index, val) => {
    list[index][action] = Number(val.target.value)
    handleSkuTableChange([...list])
  }

  const handleTitleBlur = (action, val) => {
    // console.log(action,val.target.value)
    list.forEach(item => {
      if (item[action] === null) {
        item[action] = Number(val.target.value)
      }
    })
    handleSkuTableChange([...list])
  }

  const handleTitleUploadChange = (field, { file, fileList }) => {
    if (file.status === 'done') {
      message.success(`${file.name} 上传成功`);
      file.url = ossHost + '/' + file.ossName;
    } else if (file.status === 'error') {
      message.error(`${file.name} 上传失败`);
    }
    fileList = fileList.filter(item => item.status);
    // console.log(fileList)
    list.forEach(item => {
      if (!item[field] || !item[field].length) {
        item[field] = fileList
      }
    })
    handleSkuTableChange([...list])
    setFileList(fileList)
  };

  const handleUploadChange = (index, field, { file, fileList }) => {
    if (file.status === 'done') {
      message.success(`${file.name} 上传成功`);
      file.url = ossHost + '/' + file.ossName;
    } else if (file.status === 'error') {
      message.error(`${file.name} 上传失败`);
    }
    fileList = fileList.filter(item => item.status);
    // console.log(fileList)
    list[index][field] = fileList
    handleSkuTableChange([...list])
  }

  return (
    <StandardTable
      bordered
      search={false}
      options={false}
      loading={false}
      dataSource={list}
      pagination={false}
      columns={columns}
      columnEmptyText={false}
    />
  );
}

export default SkuTableOss