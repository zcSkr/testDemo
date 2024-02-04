import { PlusOutlined } from '@ant-design/icons';
import { Button, message, Popconfirm, DatePicker, Switch, Select, Image, Input, Space, Tooltip, Tree } from 'antd';
import React, { useState, useRef } from 'react';
import { useDispatch } from '@umijs/max';
import { PageContainer, ProCard } from '@ant-design/pro-components';
import StandardTable from '@/components/StandardTable';
import GlobalModal from '@/components/GlobalModal'
import UpdateForm from './UpdateForm';

import * as services_demoTable from '@/services/demo/demoTable';

const Area = () => {
  const dispatch = useDispatch()
  const [updateModalVisible, handleUpdateModalVisible] = useState(false);
  const [stepFormValues, setStepFormValues] = useState({});
  const [selectedKeys, setSelectedKeys] = useState([])
  const actionRef = useRef();
  let columns = [
    {
      title: '索引',
      dataIndex: 'id',
      valueType: 'indexBorder',
    },
    {
      title: '名称',
      dataIndex: 'sort',
    },
    {
      title: '排序',
      dataIndex: 'sort',
    },
    {
      title: '状态',
      dataIndex: 'state',
      render: (text, record, index, action, props) => <Switch checked={Boolean(record[props.dataIndex])} onChange={() => handleSwitchChange(record)} checkedChildren="启用" unCheckedChildren="冻结" />,
      valueEnum: {
        0: '冻结',
        1: '启用',
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      ellipsis: true,
    },
    {
      title: '操作',
      valueType: 'option',
      render: (_, record) => (
        <Space>
          <a onClick={() => { handleUpdateModalVisible(true); setStepFormValues(record); }}>编辑</a>
          <Popconfirm title="确定删除?" onConfirm={() => handleDeleteRecord(record)} okText="确定" cancelText="取消">
            <a style={{ color: '#f5222d' }}>删除</a>
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

  return (
    <PageContainer>
      <ProCard
        ghost
        gutter={8}
      >
        <ProCard title="开通区域" colSpan="30%">
          <Tree
            showLine
            checkable
            checkStrictly
            selectedKeys={selectedKeys}
            onSelect={setSelectedKeys}
            checkedKeys={selectedKeys}
            onCheck={({ checked }) => setSelectedKeys(checked)}
            loadData={({ key, children, ...props }) => {
              // console.log(key, children, props)
              const updateTreeData = (list, key, children) =>
                list.map((node) => {
                  if (node.key === key) {
                    return {
                      ...node,
                      children,
                    };
                  }
                  if (node.children) {
                    return {
                      ...node,
                      children: updateTreeData(node.children, key, children),
                    };
                  }
                  return node;
                });
              return new Promise((resolve) => {
                // if (children) {
                //   resolve();
                //   return;
                // }
                setTimeout(() => {
                  // setTreeData((origin) =>
                  //   updateTreeData(origin, key, [
                  //     {
                  //       title: 'Child Node',
                  //       key: `${key}-0`,
                  //     },
                  //     {
                  //       title: 'Child Node',
                  //       key: `${key}-1`,
                  //     },
                  //   ]),
                  // );
                  resolve();
                }, 1000);
              });
            }}
            treeData={[
              {
                title: '中国',
                key: '0-0',
                children: [
                  {
                    title: '四川',
                    key: '0-0-0',
                    // disabled: true,
                    children: [
                      {
                        title: '成都',
                        key: '0-0-0-0',
                        children: [{
                          title: '武侯区',
                          key: '0-0-0-0-0',
                        }]
                        // disableCheckbox: true,
                      },
                      {
                        title: 'leaf',
                        key: '0-0-0-1',
                      },
                    ],
                  },
                  {
                    title: 'parent 1-1',
                    key: '0-0-1',
                    children: [
                      {
                        title: (
                          <span>
                            sss
                          </span>
                        ),
                        key: '0-0-1-0',
                      },
                    ],
                  },
                ],
              },
            ]}
          />
        </ProCard>
        <StandardTable
          headerTitle="区域信息"
          search={false}
          actionRef={actionRef}
          toolBarRender={() => [
            <Button key='add' type="primary" onClick={() => { setStepFormValues({}); handleUpdateModalVisible(true) }}>
              <PlusOutlined /> 新增
            </Button>,
          ]}
          params={{ pid: selectedKeys[0] }}
          request={({ current, ...params }) => {
            // console.log(params)//查询参数，pageNum用current特殊处理
            return services_demoTable.query({ ...params, pageNum: current })
          }}
          postData={data => data.list}
          columns={columns}
        />
      </ProCard>

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

export default Area;
