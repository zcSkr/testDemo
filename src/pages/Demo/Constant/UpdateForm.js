import React, { useState } from 'react';
import { ProForm, ProFormSelect, ProFormText, ProFormDigit } from '@ant-design/pro-components';


const formLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 18 },
};
const UpdateForm = ({
  handleUpdate,
  values
}) => {
  const [formVals, setFormVals] = useState({
    ...values,
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
        type: formVals.type,
        name: formVals.name,
        sort: formVals.sort
      }}
    >

      <ProFormSelect
        name="type"
        label="常量类型"
        rules={[{ required: true }]}
        valueEnum={{
          0: '类型1',
          1: '类型2',
        }}
      />
      <ProFormText
        name="name"
        label="分类名称"
        rules={[{ required: true }]}
        fieldProps={{ maxLength: 50 }}
      />
      <ProFormDigit
        name="sort"
        label="排序权重"
        rules={[{ required: true }]}
        min={1}
        fieldProps={{ precision: 0 }}
      />
    </ProForm>
  );
};

export default UpdateForm;
