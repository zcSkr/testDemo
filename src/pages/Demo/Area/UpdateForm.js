import React, { useState } from 'react';
import { ProForm, ProFormCascader, ProFormDigit, ProFormText } from '@ant-design/pro-components';

import * as services_demoTable from '@/services/demo/demoTable';

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
        render: (props, doms) => <div style={{ textAlign: 'center' }}>{doms[0]}</div>
      }}
      layout="horizontal"
      {...formLayout}
      initialValues={{
        sort: formVals.sort,
        name: formVals.name,
        url: formVals.url,
        logo: formVals.logo,
        logo1: formVals.logo1,
        content: formVals.content,
        content1: formVals.content1,
        cascader: formVals.cascader,
        select: formVals.select,
        textArea: formVals.textArea,
      }}
    >
      <ProFormCascader
        name="proformcascader"
        label="上级区域"
        fieldProps={{
          showSearch: true,
          expandTrigger: "hover",
          fieldNames: { label: 'name', value: 'id' },
          changeOnSelect: true
        }}
        placeholder="请选择（默认顶级）"
        request={async () => {
          const { data } = await services_demoTable.query({ pageSize: 0 })
          return data.list
        }}
      />
      <ProFormText
        name="proformtext"
        label="区域名称"
        rules={[{ required: true }]}
        fieldProps={{ maxLength: 50 }}
      />
      <ProFormDigit
        name="proformdigit"
        label="排序"
        rules={[{ required: true }]}
        min={1}
        fieldProps={{ precision: 0 }}
      />
    </ProForm>
  );
};

export default UpdateForm;
