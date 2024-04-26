import React, { useState, useRef, useEffect } from 'react';
import { ProForm, ProFormText, ProFormTextArea } from '@ant-design/pro-components';
import { Cascader, Spin } from 'antd'
import { useRequest } from '@umijs/max'

import * as services_module from '@/services/sys/module';

const formLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 18 },
};
const UpdateForm = ({
  handleUpdate,
  values
}) => {

  const [formVals, setFormVals] = useState({
    ...values,
  });

  const formRef = useRef()

  const { data, loading } = useRequest(() => services_module.queryTree({ pageSize: 0 }))
  useEffect(() => {
    if (data) {
      //给Cascader造回显的数据，二维数组
      const moduleIds = data.list.map(item => {
        if (formVals.moduleIds?.includes(item.id)) { //一级存在
          const children = item.children
          const arr = [item.id] //只有一级id的小数组
          if (!children.every(item => values.moduleIds.includes(item.id))) { //该一级只有部分子级存在
            const childrenIds = children.filter(item => values.moduleIds.includes(item.id)).map(item => item.id)
            return childrenIds.map(childId => arr.concat([childId]))
          }
          return [arr]
        }
      }).filter(item => item).reduce((prev, next) => prev.concat(next), [])
      // console.log(moduleIds,'moduleIds')
      setFormVals(prevStates => ({ ...prevStates, moduleTreeList: data.list }))
      formRef.current.setFieldValue('moduleIds', moduleIds)
    }
  }, [data]);

  return (
    <ProForm
      onFinish={fieldsValue => handleUpdate({ ...formVals, ...fieldsValue })}
      submitter={{
        render: (props, doms) => <div style={{ textAlign: 'center' }}>{doms[1]}</div>
      }}
      layout="horizontal"
      formRef={formRef}
      {...formLayout}
      initialValues={{
        roleName: formVals.roleName,
        description: formVals.description,
      }}
    >
      <ProFormText
        name="roleName"
        label="角色名称"
        rules={[{ required: true }]}
        fieldProps={{ maxLength: 50 }}
      />
      <ProFormTextArea
        name="description"
        label="描述"
        rules={[{ required: true }]}
        fieldProps={{ autoSize: { minRows: 2, maxRows: 6 }, maxLength: 500, allowClear: true, showCount: true }}
      />
      <Spin spinning={loading}>
        <ProForm.Item
          name="moduleIds"
          label="模块"
          rules={[{ required: true }]}
        >
          <Cascader.Panel
            multiple
            expandTrigger="hover"
            fieldNames={{ label: 'name', value: 'id' }}
            options={data?.list}
          />
        </ProForm.Item>
      </Spin>
    </ProForm>
  );
};

export default UpdateForm;
