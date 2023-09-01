import React, { useState } from 'react';
import { ProForm, ProFormSelect, ProFormText, ProFormDigit, ProFormTextArea } from '@ant-design/pro-components';

import * as services_module from '@/services/sys/module';

const formLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 18 },
};
const UpdateForm = ({
  handleUpdate,
  values,
}) => {
  const [formVals, setFormVals] = useState({
    ...values
  });


  return (
    <ProForm
      onFinish={fieldsValue => handleUpdate({ ...formVals, ...fieldsValue })}
      submitter={{
        render: (props,doms) => <div style={{ textAlign: 'center' }}>{doms[1]}</div>
      }}
      layout="horizontal"
      {...formLayout}
      initialValues={{
        pid: formVals.pid || '0',
        name: formVals.name,
        path: formVals.path,
        number: formVals.number,
        description: formVals.description,
      }}
    >
      <ProFormSelect
        name="pid"
        label="父级模块"
        rules={[{ required: true }]}
        fieldProps={{
          showSearch: true,
          fieldNames: { label: 'name', value: 'id' },
        }}
        request={async () => {
          const { data } = await services_module.queryTree({ pageSize: 999 })
          return [{name: '顶级模块',id: '0'}].concat(data.list)
        }}
      />
      <ProFormText
        name="name"
        label="模块名称"
        rules={[{ required: true }]}
        fieldProps={{ maxLength: 50 }}
      />
      <ProFormText
        name="path"
        label="请求路径"
        rules={[{ required: true }]}
        placeholder="请复制路由表里的path（例：/sys）"
        fieldProps={{ maxLength: 50 }}
      />
      <ProFormDigit
        name="number"
        label="排序"
        rules={[{ required: true }]}
        min={1}
        fieldProps={{ precision: 0 }}
      />
      <ProFormTextArea
        name="description"
        label="描述"
        fieldProps={{ autoSize: { minRows: 2, maxRows: 6 }, maxLength: 500, allowClear: true, showCount: true }}
      />

    </ProForm>
  );
};

export default UpdateForm;
