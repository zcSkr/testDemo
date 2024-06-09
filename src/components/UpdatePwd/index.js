import React from 'react';
import { ProForm, ProFormText } from '@ant-design/pro-components';

const formLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 18 },
};
const UpdatePsd = ({ 
  handleUpdate
}) => {
  return (
    <ProForm
      onFinish={fieldsValue => handleUpdate({ ...fieldsValue })}
      submitter={{
        render: (props,doms) => <div style={{ textAlign: 'center' }}>{doms[1]}</div>
      }}
      layout="horizontal"
      {...formLayout}
    >
      <ProFormText.Password 
        name="password"
        label="新密码"
        rules={[{ required: true }]}
        fieldProps={{ maxLength: 50 }}
      />
      <ProFormText.Password 
        name="againPwd"
        label="确认密码"
        dependencies={['password']}
        rules={[
          (form) => ({
            validator(rule, value) {
              if (!value) {
                return Promise.reject('请输入确认密码');
              }
              if (form.getFieldValue('password') !== value) {
                return Promise.reject('两次密码输入不一致');
              }
              return Promise.resolve();
            },
          })
        ]}
        fieldProps={{ maxLength: 50 }}
      />
    </ProForm>
  );
};

export default UpdatePsd;
