import { PlusOutlined } from '@ant-design/icons';
import { Button, message, Popconfirm, Space } from 'antd';
import React, { useState, useRef } from 'react';
import { useDispatch } from 'umi';
import { PageContainer } from '@ant-design/pro-components';
import StandardTable from '@/components/StandardTable';
import GlobalModal from '@/components/GlobalModal'
import UpdateForm from './UpdateForm';

import * as service_module from '@/services/sys/module';

const ModuleManage = () => {
  const dispatch = useDispatch()
  const [updateModalVisible, handleUpdateModalVisible] = useState(false);
  const [stepFormValues, setStepFormValues] = useState({});
  const actionRef = useRef();
  let columns = [
    {
      dataIndex: 'sort',
      valueType: 'indexBorder',
    },
    {
      title: '模块名称',
      dataIndex: 'name',
    },
    {
      title: '请求路径',
      dataIndex: 'path',
    },
    {
      title: '排序',
      dataIndex: 'number',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      valueType: 'dateTime',
    },
    {
      title: '操作',
      valueType: 'option',
      render: (_, record) => (
        <Space>
          <a onClick={() => { handleUpdateModalVisible(true); setStepFormValues(record); }}>编辑</a>
          <Popconfirm title="确定删除?" onConfirm={() => handleDeleteRecord(record)} okText="确定" cancelText="取消">
            <a style={{ color: '#f50' }}>删除</a>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleUpdate = async fields => {
    const hide = message.loading({ content: '操作中', key: 'loading' });
    const res = await dispatch({
      type: 'global/service',
      service: fields.id ? service_module.update : service_module.add,
      payload: {
        id: fields.id,
        pid: fields.pid,
        name: fields.name,
        path: fields.path,
        number: fields.number,
        description: fields.description,
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

  const handleDeleteRecord = async record => {
    const hide = message.loading({ content: '正在删除', key: 'delete' });
    const res = await dispatch({
      type: 'global/service',
      service: service_module.remove,
      payload: { id: record.id }
    })
    hide();
    if (res?.code == 200) {
      message.success({ content: '删除成功', key: 'success' });
      actionRef.current?.reload();
    } else {
      message.error({ content: res.msg, key: 'error' });
    }
  };

  const loopList = list =>
    list?.map(({ children, ...item }) => ({
      ...item,
      children: children.length ? loopList(children) : undefined,
    }))

  return (
    <PageContainer>
      <StandardTable
        actionRef={actionRef}
        search={false}
        toolBarRender={() => [
          <Button key='add' type="primary" onClick={() => { setStepFormValues({}); handleUpdateModalVisible(true) }}>
            <PlusOutlined /> 新增
          </Button>,
        ]}
        request={({ current, ...params }) => {
          // console.log(params)//查询参数，pageNum用current特殊处理
          return service_module.queryTree({ ...params, pageNum: current })
        }}
        postData={res => loopList(res.list)}
        columns={columns}
      />
      <GlobalModal
        open={updateModalVisible}
        onCancel={() => {
          handleUpdateModalVisible(false);
          setStepFormValues({});
        }}
        title={stepFormValues.id ? '编辑' : '新增'}
      >
        <UpdateForm
          values={stepFormValues}
          handleUpdate={handleUpdate}
        />
      </GlobalModal>
    </PageContainer>
  );
};

export default ModuleManage
