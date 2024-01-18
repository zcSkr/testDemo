import React, { useState } from 'react';
import { ProForm, ProFormText, ProFormTextArea } from '@ant-design/pro-components';
import BraftEditor from '@/components/BraftEditor';
import GlobalUpload from '@/components/GlobalUpload';

const formLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 18 },
};
const UpdateForm = ({
  handleUpdate,
  values,
}) => {
  const [formVals, setFormVals] = useState({
    ...values,
  });
  return (
    <ProForm
      onFinish={fieldsValue => handleUpdate({ ...formVals, ...fieldsValue })}
      submitter={{
        render: (props, doms) => <div style={{ textAlign: 'center' }}>{doms[0]}</div>
      }}
      layout="horizontal"
      {...formLayout}
      initialValues={{
        codeKey: formVals.codeKey,
        codeValue: formVals.codeValue,
        description: formVals.description,
      }}
    >
      <ProForm.Item label="键">{formVals.codeKey}</ProForm.Item>
      {
        formVals.valueType == 'imgText' &&
        <ProForm.Item
          name="codeValue"
          label="值"
          rules={[{ required: true }]}
        >
          <BraftEditor />
        </ProForm.Item>
      }
      {
        formVals.valueType == 'file' &&
        <ProForm.Item
          name="codeValue"
          label="值"
          rules={[{ required: true, message: '请上传文件！' }]}
        >
          <GlobalUpload accept='*' listType="text" />
        </ProForm.Item>
      }
      {
        formVals.valueType == 'text' &&
        <ProFormText
          name="codeValue"
          label="值"
          rules={[{ required: true }]}
          fieldProps={{ maxLength: 50 }}
        />
      }
      <ProFormTextArea
        name="description"
        label="描述"
        fieldProps={{ autoSize: { minRows: 2, maxRows: 6 }, maxLength: 500, allowClear: true, showCount: true }}
      />
    </ProForm>
  );
};

export default UpdateForm;
