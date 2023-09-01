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

  const [productList, setProductList] = useState([]) //表格回显的数据
  const [sku, setSku] = useState([{ key: '', inputVisible: false, inputValue: '', tags: [] }]) //默认的规格组
  useEffect(() => {
    //请求数据 或者 回显时对productList和sku赋值
    // setProductList()
    // setSku()
  }, []);
  return (
    <ProForm
      onFinish={fieldsValue => handleUpdate({ ...formVals, ...fieldsValue })}
      submitter={{
        render: (props,doms) => <div style={{ textAlign: 'center' }}>{doms[1]}</div>
      }}
      layout="horizontal"
      {...formLayout}
    >
      {/* 表单校验通过后通过fieldsValue.skuList 和 fieldsValue.sku取值,form必传 */}
      <Sku productList={productList} sku={sku} />

      
    </ProForm>
  );
};

export default TestSku;
