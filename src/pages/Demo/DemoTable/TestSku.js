import React, { useState, useEffect } from 'react';
import { ProForm } from '@ant-design/pro-components';
import Sku from '@/components/Sku';

const formLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 18 },
};
const TestSku = ({
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
        sku: [{ name: void 0, tags: void 0 }],
        skuList: formVals.specsList,
      }}
    >
      {/* 表单校验通过后通过fieldsValue.skuList 和 fieldsValue.sku取值 */}
      <Sku />
    </ProForm>
  );
};

export default TestSku;
