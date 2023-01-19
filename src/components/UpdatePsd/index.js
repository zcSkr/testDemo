import React from 'react';
import { Form, Button, Input } from 'antd';
import { ProForm } from '@ant-design/pro-components';
import { useSelector } from 'umi';

const FormItem = Form.Item;
const formLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 18 },
};
const UpdatePsd = ({ 
  handleUpdate
}) => {
  const submiting = useSelector(state => state.loading).effects['global/service']
  const [form] = Form.useForm();
  const renderFooter = () => {
    return (
      <FormItem wrapperCol={24}>
        <div style={{ textAlign: 'center' }}>
          <Button type="primary" loading={submiting} htmlType="submit">
            提交
          </Button>
        </div>
      </FormItem>
    );
  };
  return (
    <ProForm
      onFinish={fieldsValue => handleUpdate({ ...fieldsValue })}
      submitter={false}
      layout="horizontal"
      {...formLayout}
      form={form}
    >
      <FormItem
        name="password"
        label="新密码"
        rules={[{ required: true, message: '请输入新密码！' }]}
      >
        <Input.Password maxLength={50} allowClear placeholder="请输入" />
      </FormItem>
      <FormItem
        name="againPsd"
        label="确认密码"
        required
        rules={[
          (form) => ({
            validator(rule, value) {
              if (!value) {
                return Promise.reject('请输入确认密码！');
              }
              if (form.getFieldValue('password') !== value) {
                return Promise.reject('两次密码输入不一致!');
              }
              return Promise.resolve();
            },
          })
        ]}
      >
        <Input.Password maxLength={50} allowClear placeholder="请输入" />
      </FormItem>
      {renderFooter()}
    </ProForm>
  );
};

export default UpdatePsd;
