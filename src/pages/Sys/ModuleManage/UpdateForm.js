import React, { useState, useEffect } from 'react';
import { Form, Button, Input, InputNumber, Select } from 'antd';
import { ProForm } from '@ant-design/pro-components';
import { useDispatch, useSelector } from 'umi';

import * as service_module from '@/services/sys/module';

const FormItem = Form.Item;
const { Option } = Select
const { TextArea } = Input
const formLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 18 },
};
const UpdateForm = ({
  handleUpdate,
  values,
}) => {
  const submiting = useSelector(state => state.loading).effects['global/service']
  const [formVals, setFormVals] = useState({
    id: values.id,
    pid: values.pid,
    name: values.name,
    path: values.path,
    number: values.number,
    description: values.description,
  });

  const [form] = Form.useForm();
  const dispatch = useDispatch()
  const [moduleList, setModuleList] = useState([])
  useEffect(() => {
    dispatch({
      type: 'global/service',
      service: service_module.queryTree,
      payload: { pageSize: 100 }
    }).then(res => {
      if (res?.code == 200) {
        setModuleList(res.data.list)
      }
    })
  }, [])



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
        pid: formVals.pid || '0',
        name: formVals.name,
        path: formVals.path,
        number: formVals.number,
        description: formVals.description,
      }}
    >
      <FormItem
        name="pid"
        label="父级模块"
        rules={[{ required: true, message: '请选择父级模块！' }]}
      >
        <Select
          allowClear
          showSearch
          optionFilterProp="children"
          placeholder="请选择"
          style={{ width: '100%' }}
          getPopupContainer={triggerNode => triggerNode.parentElement}
        >
          <Option value="0">顶级模块</Option>
          {moduleList.map(item => <Option key={item.id} value={item.id}>{item.name}</Option>)}
        </Select>
      </FormItem>
      <FormItem
        name="name"
        label="模块名称"
        rules={[{ required: true, message: '请输入模块名称！' }]}
      >
        <Input placeholder="请输入" maxLength={50} allowClear />
      </FormItem>
      <FormItem
        name="path"
        label="请求路径"
        rules={[{ required: true, message: '请输入请求路径！' }]}
      >
        <Input placeholder="请复制路由表里的path（例：/sys）" maxLength={50} allowClear />
      </FormItem>
      <FormItem
        name="number"
        label="排序"
        rules={[{ required: true, message: '请输入排序！' }]}
      >
        <InputNumber style={{ width: '100%' }} min={1} precision={0} placeholder="请输入" />
      </FormItem>
      <FormItem
        name="description"
        label="描述"
        rules={[{ required: true, message: '请输入！' }]}
      >
        <TextArea placeholder="请输入" autoSize={{ minRows: 2, maxRows: 6 }} maxLength={500} allowClear showCount />
      </FormItem>

      {renderFooter()}
    </ProForm>
  );
};

export default UpdateForm;
