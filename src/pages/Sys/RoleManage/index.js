import { PlusOutlined } from '@ant-design/icons';
import { Button, Space, message, Popconfirm } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, } from 'umi';
import { PageContainer } from '@ant-design/pro-components';
import StandardTable from '@/components/StandardTable';
import GlobalModal from '@/components/GlobalModal'
import UpdateForm from './UpdateForm';

import * as service_role from '@/services/sys/role';
import * as service_module from '@/services/sys/module';

const RoleManage = () => {
  const dispatch = useDispatch()
  const [updateModalVisible, handleUpdateModalVisible] = useState(false);
  const [stepFormValues, setStepFormValues] = useState({});
  const actionRef = useRef();
  const [moduleTreeList, setModuleTreeList] = useState([])

  useEffect(() => {
    (async () => {
      const res = await service_module.queryTree({ pageSize: 100 })
      if (res?.code == 200) {
        setModuleTreeList(res.data.list)
      }
    })()
  }, [])

  let columns = [
    {
      dataIndex: 'id',
      hideInSearch: true,
      valueType: 'indexBorder',
    },
    {
      title: '角色名称',
      dataIndex: 'roleName',
    },
    {
      title: '角色模块',
      dataIndex: 'moduleNames',
      ellipsis: true,
      hideInSearch: true,
    },
    {
      title: '描述',
      dataIndex: 'description',
      ellipsis: true,
      hideInSearch: true,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      valueType: 'dateTime',
      hideInSearch: true
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
    const moduleIds = fields.moduleIds.map(arr => {
      if (arr.length == 1) { //只选中一级的，要把所有子级带上
        const children = moduleTreeList.find(item => item.id == arr[0]).children
        return arr.concat(children.map(item => item.id))
      }
      return arr
    }).reduce((prev, next) => prev.concat(next), [])
    // console.log(moduleIds)
    const hide = message.loading({ content: '操作中', key: 'loading' });
    const res = await dispatch({
      type: 'global/service',
      service: fields.id ? service_role.update : service_role.add,
      payload: {
        id: fields.id,
        roleName: fields.roleName,
        description: fields.description,
        moduleIds: Array.from(new Set(moduleIds)).join(',')
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
      service: service_role.remove,
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

  return (
    <PageContainer>
      <StandardTable
        actionRef={actionRef}
        toolBarRender={() => [
          <Button key='add' type="primary" onClick={() => { handleUpdateModalVisible(true); setStepFormValues({}) }}>
            <PlusOutlined /> 新增
          </Button>,
        ]}
        request={({ current, ...params }) => {
          // console.log(params)//查询参数，pageNum用current特殊处理
          return service_role.query({ ...params, pageNum: current })
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
        title={stepFormValues.id ? '编辑' : '新增'}
      >
        <UpdateForm
          values={stepFormValues}
          handleUpdate={handleUpdate}
          moduleTreeList={moduleTreeList}
        />
      </GlobalModal>
    </PageContainer>
  );
};

export default RoleManage;
