import React from 'react';
import { Space, Form, Input, Row, Col, Button } from 'antd';
import { ProForm } from '@ant-design/pro-components';
import { useSelector } from 'umi'
const FormItem = Form.Item;
const { TextArea } = Input

const GlobalAudit = ({
  onSubmit, //表单提交事件
  fieldNames = { //默认字段名
    state: 'state',
    description: 'description'
  },
  children
}) => {
  const submiting = useSelector(state => state.loading).effects['global/service']
  const [form] = Form.useForm();

  const handleAudit = async state => {
    form.setFields([{ name: fieldNames.description, errors: [] }])
    form.setFieldsValue({ [fieldNames.state]: state })
    form.submit()
  }
  const formLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 18 },
  };

  return (
    <ProForm
      onFinish={fieldsValue => onSubmit({ ...fieldsValue })}
      submitter={false}
      form={form}
      style={{ marginTop: 24 }}
      layout='horizontal'
      {...formLayout}
    >
      {children}
      <Row align='middle' gutter={24}>
        <Col span={16}>
          <FormItem wrapperCol={{ span: 24 }} name={fieldNames.description} validateTrigger="onSubmit" rules={[
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (getFieldValue(fieldNames.state) == 2 && !value) {
                  return Promise.reject(new Error('请输入审核失败理由!'));
                }
                return Promise.resolve()
              },
            }),
          ]}>
            <TextArea onChange={() => form.setFields([{ name: fieldNames.description, errors: [] }])} placeholder="请输入" autoSize={{ minRows: 2, maxRows: 6 }} maxLength={500} allowClear showCount />
          </FormItem>
        </Col>
        <Col span={8}>
          <FormItem wrapperCol={{ span: 24 }} name={fieldNames.state}>
            <Space>
              <Button onClick={_ => handleAudit(2)} danger loading={submiting}>审核失败</Button>
              <Button onClick={_ => handleAudit(1)} type="primary" loading={submiting}>审核成功</Button>
            </Space>
          </FormItem>
        </Col>
      </Row>
    </ProForm>
  );
};

export default GlobalAudit