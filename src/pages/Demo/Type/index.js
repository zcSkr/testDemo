import React, { useState, useEffect, useRef } from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { PlusOutlined } from '@ant-design/icons';
import {
  Popconfirm,
  Tag,
  Image,
  message,
  Space,
  Button,
  Switch,
  Row,
  Col,
} from 'antd';
import StandardTable from '@/components/StandardTable';
import GlobalModal from '@/components/GlobalModal'
import UpdateForm from './UpdateForm';

import * as services_type from '@/services/demo/demoTable';

const Type = () => {
  const [selectedRows1, setSelectedRows1] = useState([]);
  const [selectedRows2, setSelectedRows2] = useState([]);
  const [updateModalVisible, handleUpdateModalVisible] = useState(false);
  const [stepFormValues, setStepFormValues] = useState({});
  const actionRef1 = useRef();
  const actionRef2 = useRef();
  const actionRef3 = useRef();

  useEffect(() => {
    selectedRows1.length > 0 && actionRef2.current?.reload()
  }, [selectedRows1])

  useEffect(() => {
    selectedRows2.length > 0 && actionRef3.current?.reload()
  }, [selectedRows2])

  let columns = [
    {
      dataIndex: 'id',
      width: 30,
      hideInSearch: true,
      valueType: 'indexBorder',
    },
    {
      title: '排序',
      dataIndex: 'sort',
      width: 40,
      hideInSearch: true,
    },
    {
      title: '图标',
      dataIndex: 'img',
      hideInSearch: true,
      valueType: 'image',
      width: 40,
      fieldProps: (form) => ({ width: 20, height: 20 }),
    },
    {
      title: '名称',
      width: 100,
      dataIndex: 'name',
      hideInSearch: true,
    },
    {
      title: '状态',
      width: 65,
      dataIndex: 'state',
      render: (text, record, index, action, props) => <Switch checked={Boolean(record[props.dataIndex])} onChange={() => handleSwitchChange(record)} checkedChildren="启用" unCheckedChildren="冻结" />,
      valueEnum: {
        0: '冻结',
        1: '启用',
      },
    },
    {
      title: '操作',
      width: 60,
      valueType: 'option',
      render: (_, record) => (
        <Space>
          <a onClick={() => { handleUpdateModalVisible(true); setStepFormValues({ ...record, selectedRows1, selectedRows2 }); }}>编辑</a>
          <Popconfirm title="确定删除?" onConfirm={() => handleDeleteRecord(record)} okText="确定" cancelText="取消">
            <a style={{ color: '#f50' }}>删除</a>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleUpdate = async fields => {
    const hide = message.loading({ content: '操作中', key: 'loading' });
    const res = await services_type[fields.id ? 'update' : 'add']({
      id: fields.id,
      sort: fields.sort,
      name: fields.name,
      typeLevel: fields.typeLevel,
      upId: { '1': void 0, '2': selectedRows1[0]?.id, '3': selectedRows2[0]?.id }[fields.typeLevel],
    })
    hide();
    if (res?.code == 200) {
      message.success({ content: '操作成功', key: 'success' });
      handleUpdateModalVisible(false)
      // 刷新列表
      switch (fields.typeLevel) {
        case 1:
          actionRef1.current?.reload()
          break;
        case 2:
          actionRef2.current?.reload()
          break;
        case 3:
          actionRef3.current?.reload()
          break;
        default: break;
      }
    } else {
      message.error({ content: res.msg, key: 'error' });
    }
  }

  const handleSwitchChange = async record => {
    const hide = message.loading({ content: '操作中', key: 'loading' });
    const res = await services_type.update({
      id: record.id,
      state: Number(record.state) ? 0 : 1
    })
    hide()
    if (res?.code == 200) {
      message.success({ content: '操作成功', key: 'success' });
    } else {
      message.error({ content: res.msg, key: 'error' });
    }
    switch (record.typeLevel) {
      case 1:
        actionRef1.current?.reload()
        break;
      case 2:
        actionRef2.current?.reload()
        break;
      case 3:
        actionRef3.current?.reload()
        break;
      default: break;
    }
  }

  const handleDeleteRecord = async record => {
    const hide = message.loading({ content: '正在删除', key: 'loading' });
    const res = await services_type.remove({ id: record.id })
    hide()
    if (res?.code == 200) {
      message.success({ content: '删除成功', key: 'success' });
      switch (record.typeLevel) {
        case 1:
          actionRef1.current?.reload()
          if(selectedRows1[0]?.id == record.id) {
            setSelectedRows1([])
            setSelectedRows2([])
            actionRef2.current?.reload()
            actionRef3.current?.reload()
          }
          break;
        case 2:
          actionRef2.current?.reload()
          if(selectedRows2[0]?.id == record.id) {
            setSelectedRows2([])
            actionRef3.current?.reload()
          }
          break;
        case 3:
          actionRef3.current?.reload()
          break;
        default: break;
      }
    } else {
      message.error({ content: res.msg, key: 'error' });
    }
  }

  return (
    <PageContainer>
      <Row gutter={16}>
        <Col span={8}>
          <StandardTable
            actionRef={actionRef1}
            rowSelection={{
              columnWidth: 30,
              type: 'radio',
              selectedRowKeys: selectedRows1.map(item => item.id),
              onChange: (keys, rows) => { setSelectedRows1(rows); setSelectedRows2([]) }
            }}
            tableAlertRender={false}
            headerTitle="一级分类"
            options={false}
            search={false}
            toolBarRender={() => [
              <Button key='add' type="primary" size="small" onClick={() => { setStepFormValues({ typeLevel: 1 }); handleUpdateModalVisible(true) }}>
                <PlusOutlined /> 新增
              </Button>,
            ]}
            request={({ current, ...params }) => {
              // console.log(params)//查询参数，pageNum用current特殊处理
              return services_type.query({ ...params, pageNum: current, typeLevel: 1 })
            }}
            postData={data => data.list}
            columns={columns.filter(item => item.dataIndex != 'img')}
          />
        </Col>
        <Col span={8}>
          <StandardTable
            actionRef={actionRef2}
            rowSelection={{
              columnWidth: 30,
              type: 'radio',
              selectedRowKeys: selectedRows2.map(item => item.id),
              onChange: (keys,rows) => setSelectedRows2(rows)
            }}
            tableAlertRender={false}
            manualRequest={true}
            headerTitle="二级分类"
            options={false}
            search={false}
            toolBarRender={() => selectedRows1.length > 0 ? [
              <Button key='add' type="primary" size="small" onClick={() => { setStepFormValues({ typeLevel: 2, selectedRows1 }); handleUpdateModalVisible(true) }}>
                <PlusOutlined /> 新增
              </Button>,
            ] : []}
            request={({ current, ...params }) => {
              if(!selectedRows1[0]) return { code: 200, data: { list: [], pageNum: 1, pageSize: 10, total: 0 } }
              // console.log(params)//查询参数，pageNum用current特殊处理
              return services_type.query({ ...params, pageNum: current, typeLevel: 2, upId: selectedRows1[0].id })
            }}
            postData={data => data.list}
            columns={columns.filter(item => item.dataIndex != 'img')}
          />
        </Col>
        <Col span={8}>
          <StandardTable
            actionRef={actionRef3}
            manualRequest={true}
            headerTitle="三级分类"
            options={false}
            search={false}
            toolBarRender={() => selectedRows2.length > 0 ? [
              <Button key='add' type="primary" size="small" onClick={() => { setStepFormValues({ typeLevel: 3, selectedRows1, selectedRows2 }); handleUpdateModalVisible(true) }}>
                <PlusOutlined /> 新增
              </Button>,
            ] : []}
            request={({ current, ...params }) => {
              if(!selectedRows2[0]) return { code: 200, data: { list: [], pageNum: 1, pageSize: 10, total: 0 } }
              // console.log(params)//查询参数，pageNum用current特殊处理
              return services_type.query({ ...params, pageNum: current, typeLevel: 3, upId: selectedRows2[0].id })
            }}
            postData={data => data.list}
            columns={columns}
          />
        </Col>
      </Row>

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
  )
}

export default Type