import { PlusOutlined } from '@ant-design/icons';
import { Button, message, Popconfirm, Space } from 'antd';
import React, { useState, useRef } from 'react';
import { useDispatch } from 'umi';
import { PageContainer } from '@ant-design/pro-components';
import StandardTable from '@/components/StandardTable';
import GlobalModal from '@/components/GlobalModal'
import UpdateForm from './UpdateForm';

import * as service_customer from '@/services/business/customer';

const CustomerService = () => {
  const dispatch = useDispatch();
  const [updateModalVisible, handleUpdateModalVisible] = useState(false);
  const [stepFormValues, setStepFormValues] = useState({});
  const actionRef = useRef();
  let columns = [
    {
      dataIndex: 'id',
      valueType: 'indexBorder',
    },
    {
      title: '类别',
      dataIndex: 'type',
      render: text => ({ 'phone': '电话', 'wechat': '微信', 'qq': 'QQ' }[text])
    },
    {
      title: '号码',
      dataIndex: 'number',
    },
    {
      title: '备注',
      dataIndex: 'remarks',

    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      valueType: 'dateTime',
    },
    {
      title: '操作',
      valueType: 'option',
      render: (_, record) => <Space>
        <a onClick={() => { handleUpdateModalVisible(true); setStepFormValues(record); }}>编辑</a>
        <Popconfirm title="确定删除?" onConfirm={() => handleDeleteRecord(record)} okText="确定" cancelText="取消">
          <a style={{ color: '#f50' }}>删除</a>
        </Popconfirm>
      </Space>
    },
  ];
  const handleDeleteRecord = async record => {
    const hide = message.loading({ content: '正在删除', key: 'delete' });
    const res = await dispatch({
      type: 'global/service',
      service: service_customer.remove,
      payload: { id: record.id }
    })
    hide();
    if (res?.code == 200) {
      message.success("删除成功");
      actionRef.current?.reload();
    } else {
      message.error({ content: res.msg, key: 'error' });
    }
  };
  const handleUpdate = async fields => {
    const hide = message.loading({ content: '操作中', key: 'loading' });
    const res = await dispatch({
      type: 'global/service',
      service: service_customer.update,
      payload: {
        id: fields.id,
        type: fields.type,
        remarks: fields.remarks,
        number: fields.number,
      }
    })
    hide();
    if (res?.code == 200) {
      message.success({ content: '操作成功', key: 'success' });
      handleUpdateModalVisible(false);
      actionRef.current?.reload();
    } else {
      message.error({ content: res.msg, key: 'error' });
    }
  };

  return (
    <PageContainer>
      <StandardTable
        actionRef={actionRef}
        search={false}
        toolBarRender={() => [
          <Button key='add' type="primary" onClick={() => { handleUpdateModalVisible(true); setStepFormValues({}); }}>
            <PlusOutlined /> 新增
          </Button>,
        ]}
        request={({ current, ...params }) => {
          // console.log(params)//查询参数，pageNum用current特殊处理
          return service_customer.query({ ...params, pageNum: current })
        }}
        postData={data => data.list}
        columns={columns}
      />
      <GlobalModal
        open={updateModalVisible}
        onCancel={() => {
          handleUpdateModalVisible(false);
          setStepFormValues({});
        }}
        title='新增'
      >
        <UpdateForm
          values={stepFormValues}
          handleUpdate={handleUpdate}
        />
      </GlobalModal>
    </PageContainer>
  );
};

export default CustomerService;
