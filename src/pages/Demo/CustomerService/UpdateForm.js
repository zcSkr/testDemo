import React, { useState } from 'react';
import { ProForm, ProFormTextArea, ProFormSelect, ProFormText } from '@ant-design/pro-components';
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
        render: (props, doms) => <div style={{ textAlign: 'center' }}>{doms[1]}</div>
      }}
      layout="horizontal"
      {...formLayout}
      initialValues={{
        number: formVals.number,
        remarks: formVals.remarks,
        type: formVals.type,
      }}
    >
      <ProFormSelect
        name="type"
        label="类别"
        rules={[{ required: true }]}
        fieldProps={{
          showSearch: true,
        }}
        options={[{ label: '电话', value: 'phone' }, { label: '微信', value: 'wechat' }, { label: 'QQ', value: 'qq' }]}
      />
      <ProFormText
        name="number"
        label="联系号码"
        rules={[{ required: true }]}
        fieldProps={{ maxLength: 50 }}
      />
      <ProFormTextArea
        name="remarks"
        label="备注"
        rules={[{ required: true }]}
        fieldProps={{ autoSize: { minRows: 2, maxRows: 6 }, maxLength: 500, allowClear: true, showCount: true }}
      />
    </ProForm>
  );
};

export default UpdateForm;
