import React, { useState } from 'react';
import { ProForm, ProFormText, ProFormRadio } from '@ant-design/pro-components';

import * as services_role from '@/services/sys/role';

const formLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 18 },
};
const UpdateForm = ({
  handleUpdate,
  values
}) => {
  const [formVals, setFormVals] = useState({
    ...values
  });


  return (
    <ProForm
      onFinish={fieldsValue => handleUpdate({ ...formVals, ...fieldsValue })}
      submitter={{
        render: (props,doms) => <div style={{ textAlign: 'center' }}>{doms[0]}</div>
      }}
      layout="horizontal"
      {...formLayout}
      initialValues={{
        nickname: formVals.nickname,
        account: formVals.account,
        roleIds: formVals.roleIds,
      }}
    >
      <ProFormText
        name="account"
        label="登录账号"
        rules={[{ required: true }]}
        fieldProps={{ maxLength: 50 }}
      />
      <ProFormText
        name="nickname"
        label="昵称"
        rules={[{ required: true }]}
        fieldProps={{ maxLength: 50 }}
      />
      <ProFormRadio.Group
        name="roleIds"
        label="角色"
        rules={[{ required: true }]}
        request={async () => {
          const { data } = await services_role.query({ pageSize: 0 })
          return data.list.map(item => ({ label: item.roleName, value: item.id }))
        }}
      />
      
    </ProForm>
  );
};

export default UpdateForm;
