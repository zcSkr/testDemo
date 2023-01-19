import React, { useState } from 'react';
import { Form, Button, Input, InputNumber, Select, Cascader, Image, Space } from 'antd';
import { ProForm } from '@ant-design/pro-components';
import { useSelector } from 'umi';
const FormItem = Form.Item;
const { Option } = Select
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
    ...values
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
        number: formVals.number,
        remarks: formVals.remarks,
        type: formVals.type,
      }}
    >
      <FormItem
        name="type"
        label="类别"
        rules={[{ required: true, message: '请选择类别！' }]}
      >
        <Select
          allowClear
          showSearch
          optionFilterProp="children"
          placeholder="请选择"
          style={{ width: '100%' }}
          getPopupContainer={triggerNode => triggerNode.parentElement}
        >
          <Option value="phone">电话</Option>
          <Option value="wechat">微信</Option>
          <Option value="qq">QQ</Option>
        </Select>
      </FormItem>
      <FormItem
        name="number"
        label="联系号码"
        rules={[{ required: true, message: '请输入联系号码！' }]}
      >
        <Input style={{ width: '100%' }} placeholder="请输入" />
      </FormItem>
      <FormItem
        name="remarks"
        label="备注"
      >
        <TextArea placeholder="请输入" autoSize={{ minRows: 2, maxRows: 6 }} maxLength={500} allowClear showCount />
      </FormItem>

      {renderFooter()}
    </ProForm>
  );
};

export default UpdateForm;
