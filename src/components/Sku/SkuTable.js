import React, { useRef } from 'react';
import { Button, InputNumber, Flex } from 'antd';
import StandardTable from '@/components/StandardTable';
import { UploadOutlined } from '@ant-design/icons';
import GlobalUpload from '@/components/GlobalUpload'

const SkuTable = ({
  sku,
  value,
  onChange,
}) => {
  const actionRef = useRef();

  let columns = sku.map(item => ({ title: item.name, dataIndex: item.name })).concat([
    {
      title: ({ dataIndex }) => <InputNumber status="none" onBlur={e => handleTitleBlur(e, dataIndex)} style={{ width: '100%' }} min={0} precision={2} placeholder="价格" />,
      dataIndex: 'price',
      width: 100,
      render: (val, record, index, action, props) => <InputNumber status="none" value={record[props.dataIndex]} onChange={value => handleColChange(props.dataIndex, record, value)} style={{ width: '100%' }} min={0} precision={2} placeholder="价格" />
    },
    {
      title: ({ dataIndex }) => <InputNumber status="none" onBlur={e => handleTitleBlur(e, dataIndex)} style={{ width: '100%' }} min={0} precision={0} placeholder="库存" />,
      dataIndex: 'num',
      width: 100,
      render: (val, record, index, action, props) => <InputNumber status="none" value={record[props.dataIndex]} onChange={value => handleColChange(props.dataIndex, record, value)} style={{ width: '100%' }} min={0} precision={0} placeholder="库存" />
    },
    {
      title: ({ dataIndex }) => (
        <GlobalUpload listType='text' maxCount={1} showUploadList={false} onChange={value => handleBatchUpload(value, dataIndex)}>
          <Button><UploadOutlined /> 批量上传图片</Button>
        </GlobalUpload>
      ),
      dataIndex: 'img',
      width: 200,
      render: (val, record, index, action, props) => {
        const maxCount = 1
        return (
          <Flex>
            <GlobalUpload listType='text' maxCount={maxCount} value={record[props.dataIndex]} onChange={value => handleColUpload(props.dataIndex, record, value)}>
              {record[props.dataIndex]?.split(',').length >= maxCount ? null : <Button><UploadOutlined /> 上传图片</Button>}
            </GlobalUpload>
          </Flex>
        )
      }
    }
  ])

  const handleColChange = (dataIndex, record, val) => {
    value.forEach(item => {
      if (item.key == record.key) {
        item[dataIndex] = val
      }
    })
    actionRef.current?.reload()
  }
  

  const handleTitleBlur = (e, action) => {
    value.forEach(item => {
      if (item[action] === void 0) {
        item[action] = Number(e.target.value)
      }
    })
    onChange(value)
  }

  const handleColUpload = (dataIndex, record, val) => {
    // console.log(dataIndex, record, val)
    value.forEach(item => {
      if (item.key == record.key) {
        item[dataIndex] = val
      }
    })
    actionRef.current?.reload()
  }

  const handleBatchUpload = (val, action) => {
    value.forEach(item => {
      if (!item[action]) {
        item[action] = val
      }
    })
    onChange(value)
  };

  return (
    <StandardTable
      actionRef={actionRef}
      ghost
      bordered
      search={false}
      options={false}
      loading={false}
      dataSource={value}
      pagination={false}
      columns={columns}
      columnEmptyText={false}
    />
  );
}

export default SkuTable