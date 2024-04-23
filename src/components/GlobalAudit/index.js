import React, { useRef } from 'react';
import { Space, Form, Input, Row, Col, Button } from 'antd';
import { ProForm } from '@ant-design/pro-components';
const FormItem = Form.Item;
const { TextArea } = Input

const formLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 18 },
};
const GlobalAudit = ({
  onSubmit, //表单提交事件
  fieldNames = { //默认字段名
    state: 'state',
    description: 'description'
  },
  children
}) => {
  const formRef = useRef()
  const handleAudit = useCallback(async state => {
    formRef.current.setFields([{ name: fieldNames.description, errors: [] }])
    formRef.current.setFieldsValue({ [fieldNames.state]: state })
    formRef.current.submit()
  }, [])

  return (
    <ProForm
      onFinish={fieldsValue => onSubmit({ ...fieldsValue })}
      submitter={{
        render: (props, doms) => (
          <Row align='middle' gutter={24}>
            <Col span={16}>
              <FormItem wrapperCol={{ span: 24 }} name={fieldNames.description} validateTrigger="onSubmit" rules={[
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (getFieldValue(fieldNames.state) == 2 && !value) {
                      return Promise.reject(new Error('请输入审核失败理由'));
                    }
                    return Promise.resolve()
                  },
                }),
              ]}>
                <TextArea onChange={() => formRef.current.setFields([{ name: fieldNames.description, errors: [] }])} placeholder="请输入" autoSize={{ minRows: 2, maxRows: 6 }} maxLength={500} allowClear showCount />
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem wrapperCol={{ span: 24 }} name={fieldNames.state}>
                <Space>
                  <Button onClick={_ => handleAudit(2)} danger loading={props.submitButtonProps.loading}>审核失败</Button>
                  <Button onClick={_ => handleAudit(1)} type="primary" loading={props.submitButtonProps.loading}>审核成功</Button>
                </Space>
              </FormItem>
            </Col>
          </Row>
        )
      }}
      formRef={formRef}
      style={{ marginTop: 24 }}
      layout='horizontal'
      {...formLayout}
    >
      {children}
    </ProForm>
  );
};

export default GlobalAudit