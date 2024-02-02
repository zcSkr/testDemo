import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Button, InputNumber, Flex, Form } from 'antd';
import { EditableProTable } from '@ant-design/pro-components';
import { UploadOutlined } from '@ant-design/icons';
import GlobalUpload from '@/components/GlobalUpload'

const SkuTable = ({
  sku,
}) => {
  const actionRef = useRef();
  const editableFormRef = useRef()
  const [editableKeys, setEditableRowKeys] = useState([]);
  useEffect(() => {
    setEditableRowKeys(editableFormRef.current?.getRowsData()?.map(item => (item.id || item.key)) || [])
  }, [sku])

  let columns = sku.map(item => ({ title: item.name, dataIndex: item.name, editable: false })).concat([
    {
      title: ({ dataIndex }) => <InputNumber status="none" onBlur={e => handleTitleBlur(e, dataIndex)} style={{ width: '100%' }} min={0} precision={2} placeholder="价格" />,
      dataIndex: 'price',
      width: 100,
      valueType: 'digit',
      formItemProps: {
        rules: [{ required: true, message: '请输入价格' }]
      },
      fieldProps: {
        min: 0,
        precision: 2,
        style: { width: '100%' }
      }
    },
    {
      title: ({ dataIndex }) => <InputNumber status="none" onBlur={e => handleTitleBlur(e, dataIndex)} style={{ width: '100%' }} min={0} precision={0} placeholder="库存" />,
      dataIndex: 'num',
      width: 100,
      valueType: 'digit',
      formItemProps: {
        rules: [{ required: true, message: '请输入库存' }]
      },
      fieldProps: {
        min: 0,
        precision: 0,
        style: { width: '100%' }
      }
    },
    {
      title: ({ dataIndex }) => (
        <GlobalUpload listType='text' maxCount={1} showUploadList={false} onChange={value => handleBatchUpload(value, dataIndex)}>
          <Button><UploadOutlined /> 批量上传图片</Button>
        </GlobalUpload>
      ),
      dataIndex: 'img',
      width: 200,
      formItemProps: {
        rules: [{ required: true, message: '请上传图片' }]
      },
      renderFormItem: () => <ColUpload maxCount={1} />,
    }
  ])


  const ColUpload = useCallback(({ value, onChange, maxCount }) => {
    const { status } = Form.Item.useStatus()
    return (
      <Flex>
        <GlobalUpload listType='text' maxCount={1} value={value} onChange={onChange}>
          {value?.split(',').filter(r => r).length >= maxCount ? null : <Button danger={status == 'error'}><UploadOutlined /> 上传图片</Button>}
        </GlobalUpload>
      </Flex>
    )
  }, [])

  const handleTitleBlur = useCallback((e, dataIndex) => {
    editableFormRef.current.getRowsData()?.forEach((item, index) => {
      if (item[dataIndex] === void 0) {
        editableFormRef.current.setRowData(index, { ...item, [dataIndex]: Number(e.target.value) })
      }
    })
  }, [])

  const handleBatchUpload = useCallback((val, dataIndex) => {
    editableFormRef.current.getRowsData()?.forEach((item, index) => {
      if (!item[dataIndex]) {
        editableFormRef.current.setRowData(index, { ...item, [dataIndex]: val })
      }
    })
  }, []);

  return (
    <EditableProTable
      name='skuList'
      rowKey={record => record.key || record.id}
      bordered
      recordCreatorProps={false}
      editable={{
        type: 'multiple',
        editableKeys,
        onChange: value => setEditableRowKeys(value),
      }}
      ghost
      actionRef={actionRef}
      editableFormRef={editableFormRef}
      columns={columns}
    />
  );
}

export default SkuTable