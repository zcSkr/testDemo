import React, { useState } from 'react';
import { Form, Button, Input } from 'antd';
import { ProForm } from '@ant-design/pro-components';
import BraftEditor from '@/components/BraftEditor';
import GlobalUpload from '@/components/GlobalUpload';
import { useSelector } from 'umi';

const FormItem = Form.Item;
const { TextArea } = Input
const formLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 18 },
};
const UpdateForm = ({
  handleUpdate,
  values,
}) => {
  const submiting = useSelector(state => state.loading).effects['global/service']
  const [formVals, setFormVals] = useState({
    ...values,
  });
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
      onFinish={fieldsValue => handleUpdate({ ...formVals, ...fieldsValue })}
      submitter={false}
      layout="horizontal"
      {...formLayout}
      form={form}
      initialValues={{
        codeKey: formVals.codeKey,
        codeValue: formVals.codeValue,
        description: formVals.description,
      }}
    >
      <FormItem label="键">{formVals.codeKey}</FormItem>
      <FormItem noStyle shouldUpdate>
        {() => {
          if (formVals.valueType == 'imgText') {
            return (
              <FormItem
                name="codeValue"
                label="值"
                rules={[{ required: true, message: '请输入内容！' }]}
              >
                <BraftEditor />
              </FormItem>
            )
          }
          if (formVals.valueType == 'file') {
            return (
              <FormItem
                name="codeValue"
                label="值"
                rules={[{ required: true, message: '请上传文件！' }]}
              >
                <GlobalUpload accept='*' listType="text" data={{ type: 'paramsFile' }} />
              </FormItem>
            )
          }
          if (formVals.valueType == 'text') {
            return (
              <FormItem
                name="codeValue"
                label="值"
                rules={[{ required: true, message: '请输入值！' }]}
              >
                <Input placeholder="请输入" maxLength={50} allowClear />
              </FormItem>
            )
          }
        }}
      </FormItem>
      <FormItem name="description" label="描述">
        <TextArea placeholder="请输入" autoSize={{ minRows: 2, maxRows: 6 }} maxLength={500} allowClear showCount />
      </FormItem>
      {renderFooter()}
    </ProForm>
  );
};

export default UpdateForm;
