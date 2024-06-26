import { PlusOutlined } from '@ant-design/icons';
import { Button, message, Popconfirm, DatePicker, Switch, Select, Image, Input, Space, Tooltip } from 'antd';
import React, { useState, useRef } from 'react';
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
  const [updateModalVisible, handleUpdateModalVisible] = useState(false);
  const [infoModalVisible, handleInfoModalVisible] = useState(false);
  const [skuModalVisible, handleSkuModalVisible] = useState(false);
  const [stepFormValues, setStepFormValues] = useState({});
  const actionRef = useRef();
  let columns = [
    {
      title: '索引',
      dataIndex: 'id',
      valueType: 'indexBorder',
    },
    {
      title: '排序权重',
      dataIndex: 'sort',
      sorter: true,
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
        fetchDataOnSearch: false,
        fieldNames: { label: 'name', value: 'id' },
      }),
      request:  async () => {
        const { data } = await services_demoTable.query({ pageSize: 0 })
        return data.list
      }
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
      // formItemProps: {
      //   rules: [{ required: true }] //单元格编辑必传校验
      // },
      editable: {
        renderEditCell: ({ save, ...props }) => <Input {...props} onPressEnter={save} placeholder="请输入" allowClear /> //传了会覆盖可编辑单元格的默认Input,比如传入一个InputNumber
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
        maxDate: dayjs(),
        defaultPickerValue: [dayjs().subtract(1, 'month'), dayjs().subtract(1, 'month')],
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
            <a style={{ color: '#ff4d4f' }}>删除</a>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleSwitchChange = async record => {
    const hide = message.loading({ content: '操作中', key: 'loading' });
    const res = await services_demoTable.update({
      id: record.id,
      state: Number(record.state) ? 0 : 1
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
    const res = await services_demoTable[fields.id ? 'update' : 'add']({
      id: fields.id,
      sort: fields.sort,
      name: fields.name,
      url: fields.url,
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
    const res = await services_demoTable.remove({ id: record.id })
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
    const res = await services_demoTable.update({
      id: record.id,
      [dataIndex]: record[dataIndex]
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
        request={({ current, ...params }, sort) => {
          // console.log(params)//查询参数，pageNum用current特殊处理
          return services_demoTable.query({ ...params, pageNum: current, orderByStr: sort })
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
        width={860}
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
