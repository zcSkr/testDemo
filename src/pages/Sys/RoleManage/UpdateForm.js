import React, { useState } from 'react';
import { Form, Button, Input, Cascader } from 'antd';
import { ProForm } from '@ant-design/pro-components';

import { useSelector } from 'umi';

const FormItem = Form.Item;
const { TextArea } = Input
const formLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 18 },
};
const UpdateForm = ({
  handleUpdate,
  moduleTreeList,
  values
}) => {
  const submiting = useSelector(state => state.loading).effects['global/service']

  //给Cascader造回显的数据，二维数组
  const moduleIds = moduleTreeList.map(item => {
    if (values.moduleIds?.includes(item.id)) { //一级存在
      const children = item.children
      const arr = [item.id] //只有一级id的小数组
      if (!children.every(item => values.moduleIds.includes(item.id))) { //该一级只有部分子级存在
        const childrenIds = children.filter(item => values.moduleIds.includes(item.id)).map(item => item.id)
        return childrenIds.map(childId => arr.concat([childId]))
      }
      return [arr]
    }
  }).filter(item => item).reduce((prev,next) => prev.concat(next),[])
  // console.log(moduleIds,'moduleIds')

  const [formVals, setFormVals] = useState({
    id: values.id,
    roleName: values.roleName,
    description: values.description,
    moduleIds,
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
        roleName: formVals.roleName,
        description: formVals.description,
        moduleIds: formVals.moduleIds
      }}
    >
      <FormItem
        name="roleName"
        label="角色名称"
        rules={[{ required: true, message: '请输入角色名称！' }]}
      >
        <Input placeholder="请输入" maxLength={50} allowClear />
      </FormItem>
      <FormItem
        name="description"
        label="描述"
        rules={[{ required: true, message: '请输入！' }]}
      >
        <TextArea placeholder="请输入" autoSize={{ minRows: 2, maxRows: 6 }} maxLength={500} allowClear showCount />
      </FormItem>
      <FormItem
        name="moduleIds"
        label="模块"
        rules={[{ required: true, message: '请选择模块！' }]}
      >
        <Cascader
          showSearch
          expandTrigger="hover"
          fieldNames={{ label: 'name', value: 'id' }	}
          options={moduleTreeList}
          getPopupContainer={triggerNode => triggerNode.parentElement}
          placeholder="请选择"
          multiple
          maxTagCount="responsive"
        />
      </FormItem>

      {renderFooter()}
    </ProForm>
  );
};

export default UpdateForm;
