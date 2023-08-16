import { PlusOutlined } from '@ant-design/icons';
import { Button, message, Popconfirm, Space } from 'antd';
import React, { useState, useRef } from 'react';
import { useDispatch, useAppData } from '@umijs/max';
import { PageContainer } from '@ant-design/pro-components';
import StandardTable from '@/components/StandardTable';
import GlobalModal from '@/components/GlobalModal'
import UpdateForm from './UpdateForm';

import * as services_module from '@/services/sys/module';

const ModuleManage = () => {
  const dispatch = useDispatch()
  const [updateModalVisible, handleUpdateModalVisible] = useState(false);
  const [stepFormValues, setStepFormValues] = useState({});
  const actionRef = useRef();
  const routes = useAppData().routes

  let columns = [
    {
      dataIndex: 'id',
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

  const handlePatchMoudle = async () => {
    console.log(routes)
    const hide = message.loading({ content: '操作中', key: 'loading' });
    const module = await handleMoudleGroup(routes, {})

    const res = await services_module.patch_add({ jsonArray: JSON.stringify(module) })
    hide()
    if (res.code != 200) return message.error(res.msg)
    actionRef.current.reload()

  }

  const handleMoudleGroup = async (routes, payload = {}) => {
    console.log(routes)
    const keys = Object.keys(routes)
    //icon不能存入服务器,回显在app.jsx 139行可配置成本地
    const router = keys.map(item => routes[item]).filter(item => item.access && item.access != 'accessDev').map(item => ({ ...item, icon: undefined }))
    console.log(JSON.stringify(router))

    //parentId为NaN的为父级,umi不变的话 判断不变
    let parent = router.filter(item => isNaN(Number(item.parentId)))
    //添加children字段
    parent.forEach(item => item.children = [])
    let children = router.filter(item => parent.some(parent => parent.id == item.parentId))

    //相同父级组装到children里面
    children.forEach(child => {
      parent.find(par => child.parentId == par.id).children.push({
        pid: child.parentId, name: child.name, path: child.path, icon: child.icon, ...payload,
      })
    })

    //组装最后结果并返回
    const result = parent.map(item => ({ pid: 0, name: item.name, path: item.path, icon: item.icon, children: item.children, ...payload, }))
    console.log(JSON.stringify(result))

    return result
  }

  const handleUpdate = async fields => {
    const hide = message.loading({ content: '操作中', key: 'loading' });
    const res = await dispatch({
      type: 'global/service',
      service: fields.id ? services_module.update : services_module.add,
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
      service: services_module.remove,
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
          <Button key='add' type="primary" onClick={handlePatchMoudle}>
            <PlusOutlined /> 一键生成模块
          </Button>,
          <Button key='add' type="primary" onClick={() => { setStepFormValues({}); handleUpdateModalVisible(true) }}>
            <PlusOutlined /> 新增
          </Button>,
        ]}
        request={({ current, ...params }) => {
          // console.log(params)//查询参数，pageNum用current特殊处理
          return services_module.queryTree({ ...params, pageNum: current })
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
