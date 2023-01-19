import { PlusOutlined } from '@ant-design/icons';
import {
  Button,
  message,
  Popconfirm,
  DatePicker,
  Switch,
  Select,
  Image,
  Input,
  Tag,
  Radio,
  Space,
  Row,
  Col
} from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import { useDispatch } from 'umi';
import { PageContainer, ProCard, ProList } from '@ant-design/pro-components';
import StandardTable from '@/components/StandardTable';
import GlobalModal from '@/components/GlobalModal';
import dayjs from 'dayjs';
import UpdateForm from './UpdateForm';
import UpdateQuestion from './UpdateQuestion';

import * as service_helpCenter from '@/services/business/helpCenter';

const { RangePicker } = DatePicker;
const { Option } = Select;

const HelpCenter = () => {
  const dispatch = useDispatch()
  const [updateModalVisible, handleUpdateModalVisible] = useState(false);
  const [typeModalVisible, handleTypeModalVisible] = useState(false);
  const [stepFormValues, setStepFormValues] = useState({});
  const actionRef = useRef();
  const listActionRef = useRef()
  const [selectedRows, setSelectedRows] = useState([])

  useEffect(() => {
    actionRef.current?.reload()
  }, [selectedRows])

  let columns = [
    {
      dataIndex: 'id',
      hideInSearch: true,
      valueType: 'indexBorder',
    },
    {
      title: '排序权重',
      dataIndex: 'sort',
    },
    {
      title: '问题标题',
      dataIndex: 'name',
      ellipsis: true,
      hideInSearch: true,
    },
    {
      title: '状态',
      dataIndex: 'state',
      render: (text, record) => <Switch checked={Boolean(record.state)} onChange={() => handleSwitchChange(record)} checkedChildren="启用" unCheckedChildren="冻结" />,
      valueEnum: {
        0: '冻结',
        1: '启用',
      },
    },
    {
      title: '创建时间',
      hideInSearch: true,
      dataIndex: 'createTime',
      valueType: 'dateRange',
      render: (val, record) => record.createTime,
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
      service: fields.id ? service_helpCenter.update : service_helpCenter.add,
      payload: {
        id: fields.id,
        primaryNavId: selectedRows[0]?.id,
        title: fields.title,
        sort: fields.sort,
        content: fields.content,
      },
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

  const handleSwitchChange = async record => {
    const hide = message.loading({ content: '操作中', key: 'loading' });
    const res = await dispatch({
      type: 'global/service',
      service: service_helpCenter.update,
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

  const handleDeleteRecord = async record => {
    const hide = message.loading({ content: '正在删除', key: 'delete' });
    const res = await dispatch({
      type: 'global/service',
      service: service_helpCenter.remove,
      payload: { id: record.id },
    })
    hide();
    if (res?.code == 200) {
      message.success({ content: '删除成功', key: 'success' });
      actionRef.current?.reload();
    } else {
      message.error({ content: res.msg, key: 'error' });
    }
  };

  const handleUpdateType = async fields => {
    const hide = message.loading({ content: '操作中', key: 'loading' });
    const res = await dispatch({
      type: 'global/service',
      service: fields.id ? service_helpCenter.update : service_helpCenter.add,
      payload: {
        id: fields.id,
        title: fields.title,
        sort: fields.sort,
      },
    })
    hide();
    if (res?.code == 200) {
      message.success({ content: '操作成功', key: 'success' });
      handleTypeModalVisible(false);
      listActionRef.current?.reload()
    } else {
      message.error({ content: res.msg, key: 'error' });
    }
  };

  const handleSwitchChangeType = async record => {
    const hide = message.loading({ content: '操作中', key: 'loading' });
    const res = await dispatch({
      type: 'global/service',
      service: service_helpCenter.update,
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
    listActionRef.current?.reload()
  }

  const handleDeleteRecordType = async record => {
    // 删除逻辑
    const hide = message.loading({ content: '正在删除', key: 'loading' });
    const res = await dispatch({
      type: 'global/service',
      service: service_helpCenter.remove,
      payload: { id: record.id },
    })
    hide()
    if (res?.code == 200) {
      message.success({ content: '删除成功', key: 'success' });
      listActionRef.current?.reload()
      if (selectedRows[0]?.id == record.id) {
        setSelectedRows([]);
      }
    } else {
      message.error({ content: res.msg, key: 'error' });
    }
  };


  const extraDom = (
    <Tag color="#1677ff" style={{ margin: 0 }} onClick={() => handleTypeModalVisible(true)}>
      <PlusOutlined />
      新增
    </Tag>
  );

  return (
    <PageContainer>
      <ProCard gutter={8}>
        <ProCard title="问题类型" colSpan={10} bordered extra={extraDom} bodyStyle={{ padding: 0 }}>
          <ProList
            rowKey={record => record.id}
            showActions="hover" //hover always
            actionRef={listActionRef}
            request={params => {
              return service_helpCenter.query({ pageSize: 9999, pageNum: 1 })
            }}
            postData={data => data.list}
            tableAlertRender={false}
            rowSelection={{
              type: 'radio',
              selectedRowKeys: selectedRows.map(item => item.id),
              onChange: (_, selectedRows) => setSelectedRows(selectedRows)
            }}
            metas={{
              title: {
                render: (_, record) => (
                  <Space>
                    <div>{record.sort}</div>
                    <div>{record.name}</div>
                  </Space>
                )
              },
              subTitle: {
                render: (_, record) => <Switch style={{minWidth: 47}} size="small" checked={Boolean(record.state)} onChange={() => handleSwitchChangeType(record)} checkedChildren="启用" unCheckedChildren="冻结" />
              },
              actions: {
                render: (_, record) => [
                  <a key="edit" onClick={() => { handleTypeModalVisible(true); setStepFormValues(record); }}>编辑</a>,
                  <Popconfirm key="delete" title="确定删除?" onConfirm={() => handleDeleteRecordType(record)} okText="确定" cancelText="取消">
                    <a style={{ color: '#f50' }}>删除</a>
                  </Popconfirm>,
                ]
              }
            }}
          />
        </ProCard>

        <ProCard colSpan={14} bordered bodyStyle={{ padding: 0 }}>
          <StandardTable
            headerTitle="问题列表"
            manualRequest
            search={false}
            size="small"
            actionRef={actionRef}
            toolBarRender={() => selectedRows.length ? [<Button type="primary" onClick={() => { handleUpdateModalVisible(true); setStepFormValues({}); }}>
              <PlusOutlined /> 新增
            </Button>] : []}
            request={({ current, ...params }) => {
              // console.log(params)//查询参数，pageNum用current特殊处理
              if (!selectedRows[0]) return { data: { list: [] } }
              return service_helpCenter.query({ ...params, pageNum: current, primaryNavId: selectedRows[0]?.id })
            }}
            postData={data => data.list}
            columns={columns}
          />
        </ProCard>
      </ProCard>

      {/* 问题类型的弹窗 */}
      <GlobalModal
        open={typeModalVisible}
        onCancel={() => {
          handleTypeModalVisible(false);
          setStepFormValues({});
        }}
        title={stepFormValues.id ? '编辑' : '新增'}
      >
        <UpdateForm values={stepFormValues} handleUpdate={handleUpdateType} />
      </GlobalModal>

      <GlobalModal
        open={updateModalVisible}
        onCancel={() => {
          handleUpdateModalVisible(false);
          setStepFormValues({});
        }}
        title={stepFormValues.id ? '编辑' : '新增'}
        width={1000}
      >
        <UpdateQuestion values={stepFormValues} handleUpdate={handleUpdate} />
      </GlobalModal>

    </PageContainer>
  );
};

export default HelpCenter
