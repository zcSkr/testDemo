import { PlusOutlined } from '@ant-design/icons';
import { Button, Space, message, Popconfirm, Switch } from 'antd';
import React, { useState, useRef } from 'react';
import { useDispatch } from 'umi';
import { PageContainer } from '@ant-design/pro-components';
import StandardTable from '@/components/StandardTable';
import GlobalModal from '@/components/GlobalModal'
import UpdateForm from './UpdateForm';

import * as service_params from '@/services/sys/params';

const SysParams = () => {
  const dispatch = useDispatch()
  const [updateModalVisible, handleUpdateModalVisible] = useState(false);
  const [stepFormValues, setStepFormValues] = useState({});
  const actionRef = useRef();
  let columns = [
    {
      dataIndex: 'id',
      valueType: 'indexBorder',
    },
    {
      title: '键',
      dataIndex: 'codeKey',
    },
    {
      title: '值',
      dataIndex: 'codeValue',
      search: false,
      // ellipsis: true,
      render: (value, record) => record.valueType == 'imgText' ? <a onClick={() => { handleUpdateModalVisible(true); setStepFormValues(record); }}>【请点击查看】</a> : value
    },
    {
      title: '描述',
      dataIndex: 'description',
      ellipsis: true,
      search: false,
    },
    {
      title: '操作',
      valueType: 'option',
      render: (_, record) => <a onClick={() => { handleUpdateModalVisible(true); setStepFormValues(record); }}>编辑</a>,
    },
  ];

  const handleUpdate = async fields => {
    const hide = message.loading({ content: '操作中', key: 'loading' });
    const res = await dispatch({
      type: 'global/service',
      service: service_params.update,
      payload: {
        id: fields.id,
        codeKey: fields.codeKey,
        codeValue: fields.codeValue,
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

  return (
    <PageContainer>
      <StandardTable
        actionRef={actionRef}
        request={({ current, ...params }) => {
          // console.log(params)//查询参数，pageNum用current特殊处理
          return service_params.query({ ...params, pageNum: current })
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
        />
      </GlobalModal>
    </PageContainer>
  );
};

export default SysParams;
