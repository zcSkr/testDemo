import { PlusOutlined } from '@ant-design/icons';
import { Button, message, Popconfirm, DatePicker, Switch, Select, Image, Input, Space, Tooltip } from 'antd';
import React, { useState, useRef } from 'react';
import { useDispatch } from '@umijs/max';
import { PageContainer } from '@ant-design/pro-components';
import StandardTable from '@/components/StandardTable';
import GlobalModal from '@/components/GlobalModal'
import GlobalDrawer from '@/components/GlobalDrawer'
import dayjs from 'dayjs'
import UpdateForm from './UpdateForm';
import Info from './Info'
import TestSku from './TestSku'

import * as services_demoTable from '@/services/demo/demoTable';

const DemoTable = () => {
  const dispatch = useDispatch()
  const [updateModalVisible, handleUpdateModalVisible] = useState(false);
  const [infoModalVisible, handleInfoModalVisible] = useState(false);
  const [skuModalVisible, handleSkuModalVisible] = useState(false);
  const [stepFormValues, setStepFormValues] = useState({});
  const actionRef = useRef();
  let columns = [
    {
      dataIndex: 'id',
      valueType: 'indexBorder',
    },
    {
      title: '排序权重',
      dataIndex: 'sort',
    },
    {
      title: '价格',
      dataIndex: 'price',
      hideInSearch: true,
      valueType: 'money'
    },
    {
      title: '异步下拉框',
      dataIndex: 'status',
      valueType: 'select',
      fieldProps: (form) => ({
        showSearch: true,
        options: [{ label: 'select1', value: 1 }, { label: 'select2', value: 2 }]
      }),
    },
    {
      title: '状态',
      dataIndex: 'state',
      render: (text, record,index,action,props) => <Switch checked={Boolean(record[props.dataIndex])} onChange={() => handleSwitchChange(record)} checkedChildren="启用" unCheckedChildren="冻结" />,
      valueEnum: {
        0: '冻结',
        1: '启用',
      },
    },
    {
      title: '枚举示例',
      dataIndex: 'status',
      hideInSearch: true,
      valueEnum: {
        0: {
          text: '关闭',
          status: 'Default',
        },
        1: {
          text: '运行中',
          status: 'Processing',
        },
        2: {
          text: '已上线',
          status: 'Success',
        },
        3: {
          text: '异常',
          status: 'Error',
        },
      },
    },
    {
      title: '图片示例',
      dataIndex: 'img',
      hideInSearch: true,
      valueType: 'image',
      fieldProps: (form) => ({ width: 20, height: 20 }),
    },
    {
      title: '单元格编辑',
      dataIndex: 'name',
      hideInSearch: true,
      editable: {
        required: true, // 默认为true，false为不是表单校验
        renderEditCell: (ref, save) => <Input size='small' maxLength={50} ref={ref} onPressEnter={save} onBlur={save} /> //传了会覆盖可编辑单元格的默认Input,比如传入一个InputNumber
      },
    },
    {
      title: '链接',
      dataIndex: 'url',
      ellipsis: true,
      hideInSearch: true,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      valueType: 'dateRange',
      ellipsis: true,
      render: (val,record) => <Tooltip title={record.createTime}>{record.createTime}</Tooltip>,
      fieldProps: (form) => ({
        disabledDate: current => current > dayjs().endOf('day'),
        defaultPickerValue: [dayjs().subtract(1, 'month'), dayjs()],
        placeholder: ['开始时间', '结束时间'],
      }),
    },
    {
      title: '操作',
      valueType: 'option',
      render: (_, record) => (
        <Space>
          <a onClick={() => { handleSkuModalVisible(true); setStepFormValues(record); }}>规格</a>
          <a onClick={() => { handleInfoModalVisible(true); setStepFormValues(record); }}>详情</a>
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
      service: services_demoTable.update,
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
      service: fields.id ? services_demoTable.update : services_demoTable.add,
      payload: {
        id: fields.id,
        sort: fields.sort,
        name: fields.name,
        url: fields.url,
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
    const hide = message.loading({ content: '正在删除', key: 'loading' });
    const res = await dispatch({
      type: 'global/service',
      service: services_demoTable.remove,
      payload: { id: record.id }
    })
    hide()
    if (res?.code == 200) {
      message.success({ content: '删除成功', key: 'success' });
      actionRef.current?.reload();
    } else {
      message.error({ content: res.msg, key: 'error' });
    }
  }

  const handleSave = async (dataIndex, record) => {
    // console.log(dataIndex,record)
    const hide = message.loading({ content: '操作中', key: 'loading' });
    const res = await dispatch({
      type: 'global/service',
      service: services_demoTable.update,
      payload: {
        id: record.id,
        [dataIndex]: record[dataIndex]
      }
    })
    hide();
    if (res?.code == 200) {
      message.success({ content: '操作成功', key: 'success' });
      actionRef.current?.reload();
    } else {
      message.error({ content: res.msg, key: 'error' });
    }
  }

  return (
    <PageContainer>
      <StandardTable
        handleSave={handleSave}
        actionRef={actionRef}
        toolBarRender={() => [
          <Button key='add' type="primary" onClick={() => { setStepFormValues({}); handleUpdateModalVisible(true) }}>
            <PlusOutlined /> 新增
          </Button>,
        ]}
        request={({ current, ...params }) => {
          // console.log(params)//查询参数，pageNum用current特殊处理
          return services_demoTable.query({ ...params, pageNum: current })
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
        width={1000}
      >
        <UpdateForm
          values={stepFormValues}
          handleUpdate={handleUpdate}
        />
      </GlobalModal>
      {/* 弹出层又有表格用Drawer抽屉，普通提交表单用Modal */}
      <GlobalDrawer
        open={infoModalVisible}
        onCancel={() => {
          handleInfoModalVisible(false);
          setStepFormValues({});
        }}
        title="详情"
      >
        <Info values={stepFormValues} />
      </GlobalDrawer>
      <GlobalModal
        open={skuModalVisible}
        onCancel={() => {
          handleSkuModalVisible(false);
          setStepFormValues({});
        }}
        title={stepFormValues.id ? '编辑' : '新增'}
        width={1000}
      >
        <TestSku
          values={stepFormValues}
          handleUpdate={handleUpdate}
        />
      </GlobalModal>
    </PageContainer>
  );
};

export default DemoTable;
