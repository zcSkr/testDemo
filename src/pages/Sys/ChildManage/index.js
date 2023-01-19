import { PlusOutlined } from '@ant-design/icons';
import { Button, Space, message, Popconfirm, Switch, Select } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import { useDispatch } from 'umi';
import { PageContainer } from '@ant-design/pro-components';
import StandardTable from '@/components/StandardTable';
import GlobalModal from '@/components/GlobalModal'
import UpdateForm from './UpdateForm';
import UpdatePsd from '@/components/UpdatePsd'
const { Option } = Select;

import * as service_manager from '@/services/sys/manager';
import * as service_role from '@/services/sys/role';

const ChildManage = () => {
  const dispatch = useDispatch();
  const [updateModalVisible, handleUpdateModalVisible] = useState(false);
  const [psdModalVisible, handlePsdModalVisible] = useState(false);
  const [stepFormValues, setStepFormValues] = useState({});
  const actionRef = useRef();
  const [roleList, setRoleList] = useState([])
  useEffect(() => {
    (async () => {
      const res = await service_role.query({ pageSize: 100 })
      if (res?.code == 200) {
        setRoleList(res.data.list)
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
      title: '登录账号',
      dataIndex: 'account',
    },
    {
      title: '昵称',
      dataIndex: 'nickname',
    },
    {
      title: '拥有角色',
      dataIndex: 'roleNames',
      ellipsis: true,
      hideInSearch: true,
    },
    {
      title: '状态',
      dataIndex: 'state',
      hideInSearch: true,
      render: (text, record) => <Switch checked={Boolean(record.state)} onChange={() => handleSwitchChange(record)} checkedChildren="启用" unCheckedChildren="冻结" />,
      valueEnum: {
        0: '冻结',
        1: '启用',
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      valueType: 'dateTime',
      hideInSearch: true,
    },
    {
      title: '操作',
      valueType: 'option',
      render: (_, record) => (
        <Space>
          <a onClick={() => { handlePsdModalVisible(true); setStepFormValues(record); }}>修改密码</a>
          <a onClick={() => { handleUpdateModalVisible(true); setStepFormValues(record); }}>编辑</a>
          <Popconfirm title="确定删除?" onConfirm={() => handleDeleteRecord(record)} okText="确定" cancelText="取消">
            <a style={{ color: '#f50' }}>删除</a>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleSwitchChange = async record => {
    const hide = message.loading({ content: '操作中', key: 'loading' });
    const res = await dispatch({
      type: 'global/service',
      service: service_manager.update,
      payload: {
        id: record.id,
        state: Number(record.state) ? 0 : 1
      }
    })
    hide()
    if (res?.code == 200) {
      message.success({ content: '操作成功', key: 'success' });
    } else {
      message.error({ content: res.msg, key: 'error' });
    }
    actionRef.current?.reload();
  }

  const handleUpdate = async fields => {
    const hide = message.loading({ content: '操作中', key: 'loading' });
    const res = await dispatch({
      type: 'global/service',
      service: fields.id ? service_manager.update : service_manager.add,
      payload: {
        id: fields.id,
        account: fields.account,
        nickname: fields.nickname,
        roleIds: fields.roleIds,
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
      service: service_manager.remove,
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

  const handleUpdatePsd = async fields => {
    const hide = message.loading({ content: '操作中', key: 'loading' });
    const res = await dispatch({
      type: 'global/service',
      service: service_manager.updatePsd,
      payload: { id: stepFormValues.id, password: fields.password }
    })
    hide();
    if (res?.code == 200) {
      message.success({ content: '操作成功', key: 'success' });
      handlePsdModalVisible(false)
    } else {
      message.error({ content: res.msg, key: 'error' });
    }
  }

  return (
    <PageContainer>
      <StandardTable
        actionRef={actionRef}
        toolBarRender={() => [
          <Button key='add' type="primary" onClick={() => { setStepFormValues({}); handleUpdateModalVisible(true) }}>
            <PlusOutlined /> 新增
          </Button>,
        ]}
        request={({ current, ...params }) => {
          // console.log(params)//查询参数，pageNum用current特殊处理
          return service_manager.query({ ...params, pageNum: current })
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
          roleList={roleList}
        />
      </GlobalModal>
      <GlobalModal
        open={psdModalVisible}
        onCancel={() => {
          handlePsdModalVisible(false);
          setStepFormValues({});
        }}
        title='修改密码'
      >
        <UpdatePsd
          handleUpdate={handleUpdatePsd}
        />
      </GlobalModal>
    </PageContainer>
  );
};

export default ChildManage;
