import React, { useState } from 'react';
import { ProForm, ProFormText, ProFormDigit } from '@ant-design/pro-components';

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
        sort: formVals.sort,
        name: formVals.name,
      }}
    >
      <ProFormDigit
        name="sort"
        label="排序权重"
        rules={[{ required: true }]}
        min={1}
        fieldProps={{ precision: 0 }}
      />
      <ProFormText
        name="name"
        label="名称"
        rules={[{ required: true }]}
        fieldProps={{ maxLength: 50 }}
      />
    </ProForm>
  );
};

export default UpdateForm;
