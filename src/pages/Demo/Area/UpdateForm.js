import React, { useState } from 'react';
import { Form, Button, Input, InputNumber, Select, Cascader, Image, Space } from 'antd';
import { ProForm, ProFormSelect, ProFormMoney } from '@ant-design/pro-components';
import { useSelector } from '@umijs/max';

import * as services_demoTable from '@/services/demo/demoTable';

const FormItem = Form.Item;
const { TextArea } = Input
const formLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 18 },
};
const UpdateForm = ({
  handleUpdate,
  values
}) => {
  const submiting = useSelector(state => state.loading).effects['global/service']
  const [formVals, setFormVals] = useState({
    ...values,
  });

  const [form] = Form.useForm();

  const renderFooter = () => {
    return (
      <FormItem wrapperCol={24} noStyle>
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
      <ProFormSelect
        name="proformselect"
        label="上级区域"
        placeholder="请选择（默认顶级）"
        fieldProps={{
          showSearch: true,
          fieldNames: { label: 'name', value: 'id' },
        }}
        request={async () => {
          const { data } = await services_demoTable.query({ pageSize: 999 })
          return data.list
        }}
      />
      <FormItem
        name="name"
        label="区域名称"
        rules={[{ required: true, message: '请输入！' }]}
      >
        <Input placeholder="请输入" maxLength={50} allowClear />
      </FormItem>
      <FormItem
        name="sort"
        label="排序"
        rules={[{ required: true, message: '请输入！'}]}
      >
        <InputNumber style={{ width: '100%' }} min={0} precision={0} placeholder="请输入" />
      </FormItem>
      {renderFooter()}
    </ProForm>
  );
};

export default UpdateForm;
