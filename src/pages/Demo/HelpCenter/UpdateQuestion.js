import React, { useState } from 'react';
import { Form, Button, Input, InputNumber, Select, Cascader, Image } from 'antd';
import { ProForm } from '@ant-design/pro-components';
import BraftEditor from '@/components/BraftEditor';
import { useSelector } from 'umi';

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;
const formLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 18 },
};
const UpdateQuestion = ({
  handleUpdate,
  values,
}) => {
  const submiting = useSelector(state => state.loading).effects['global/service']
  const [formVals, setFormVals] = useState({ ...values });

  const [form] = Form.useForm();

  const renderFooter = () => {
    return (
      <FormItem wrapperCol={ 24 }>
        <div style={ { textAlign: 'center' } }>
          <Button type="primary" loading={ submiting } htmlType="submit">
            提交
          </Button>
        </div>
      </FormItem>
    );
  };

  return (
    <ProForm
      onFinish={ fieldsValue => handleUpdate({ ...formVals, ...fieldsValue }) }
      submitter={false}
      layout="horizontal"
      { ...formLayout }
      form={ form }
      initialValues={ {
        sort: formVals.sort,
        title: formVals.title,
        content: formVals.content,
      } }
    >
      <FormItem
        name="sort"
        label="排序权重"
        rules={ [{ required: true, message: '请输入排序权重！' }] }
      >
        <InputNumber style={ { width: '100%' } } min={ 1 } precision={ 0 } placeholder="请输入" />
      </FormItem>
      <FormItem
        name="title"
        label="问题标题"
        rules={ [{ required: true, message: '请输入问题标题！' }] }
      >
        <Input placeholder="请输入问题标题" maxLength={ 50 } allowClear />
      </FormItem>
      <FormItem
        name="content"
        label="内容"
        rules={ [{ required: true, message: '请输入内容！' }] }
      >
        <BraftEditor />
      </FormItem>
      {renderFooter() }
    </ProForm>
  );
};

export default UpdateQuestion;
