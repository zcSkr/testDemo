import React from 'react';
import { Row, Col, Card, Button, theme, Form } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { ProForm, ProFormText } from '@ant-design/pro-components';
import EditTag from '@/components/EditTag';

const SkuList = ({
  maxCount = 2,
}) => {
  const { token } = theme.useToken()

  return (
    <Form.List name="sku">
      {(fields, { remove, add }) => (
        <>
          {fields.map((field, index) => {
            return (
              <Card
                key={field.key}
                bordered={false}
                style={{ borderRadius: 0 }}
                headStyle={{ borderRadius: 0 }}
                type="inner"
                title={
                  <Row type="flex" align="middle" gutter={token.padding}>
                    <Col span={3}>规格名</Col>
                    <Col span={10}>
                      <ProFormText name={[field.name, 'name']} fieldProps={{ maxLength: 50 }} noStyle />
                    </Col>
                    {index !== 0 && <DeleteOutlined onClick={() => remove(field.name)} style={{ color: token.colorError, fontSize: token.fontSizeLG, cursor: 'pointer' }} />}
                  </Row>
                }
              >
                <Row type="flex" align="middle">
                  <Col span={3}>规格值</Col>
                  <Col span={21}>
                    <ProForm.Item
                      name={[field.name, 'tags']}
                      noStyle
                    >
                      <EditTag />
                    </ProForm.Item>
                  </Col>
                </Row>
              </Card>
            )
          })}
          {
            fields.length < maxCount &&
            <ProForm.Item style={{ marginTop: token.margin }}>
              <Button type='primary' onClick={() => add()}><PlusOutlined />添加规格项</Button>
            </ProForm.Item>
          }
        </>
      )}
    </Form.List>
  )
}

export default SkuList