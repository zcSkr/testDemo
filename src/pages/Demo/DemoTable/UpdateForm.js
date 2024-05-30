import React, { useState } from 'react';
import { ProForm, ProFormDependency, ProFormCascader, ProFormSelect, ProFormText, ProFormTextArea, ProFormMoney, ProFormDigit, ProFormRadio, ProFormSwitch, ProFormDigitRange, ProFormDatePicker, ProFormDateTimePicker } from '@ant-design/pro-components';
import BraftEditor from '@/components/BraftEditor';
import GlobalUpload from '@/components/GlobalUpload';
import EditTag from '@/components/EditTag';
import QQMap from '@/components/QQMap';
import dayjs from 'dayjs';

import * as services_demoTable from '@/services/demo/demoTable';

const formLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
};
const UpdateForm = ({
  handleUpdate,
  values
}) => {
  const [formVals, setFormVals] = useState({
    ...values,
  });


  return (
    <ProForm
      onFinish={fieldsValue => handleUpdate({ ...formVals, ...fieldsValue })}
      submitter={{
        render: (props, doms) => <div style={{ textAlign: 'center' }}>{doms[1]}</div>
      }}
      layout="horizontal"
      {...formLayout}
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
      <ProFormText
        name="proformtext"
        label="proformtext示例"
        rules={[{ required: true }]}
        fieldProps={{ maxLength: 50 }}
      />
      <ProFormTextArea
        name="ProFormTextArea"
        label="ProFormTextArea示例"
        rules={[{ required: true }]}
        fieldProps={{ autoSize: { minRows: 2, maxRows: 6 }, maxLength: 500, allowClear: true, showCount: true }}
      />
      <ProFormDigit
        name="proformdigit"
        label="proformdigit示例"
        rules={[{ required: true }]}
        min={0}
        fieldProps={{ precision: 0 }}
      />
      <ProFormMoney
        name="proformmoney"
        label="proformmoney示例"
        rules={[{ required: true }]}
        min={0}
        fieldProps={{ precision: 2 }}
      />
      <ProFormSelect
        name="proformselect"
        label="proformselect示例"
        rules={[{ required: true }]}
        fieldProps={{
          showSearch: true,
          fetchDataOnSearch: false,
          fieldNames: { label: 'name', value: 'id' },
        }}
        request={async () => {
          const { data } = await services_demoTable.query({ pageSize: 0 })
          return data.list
        }}
      />
      <ProFormCascader
        name="proformcascader"
        label="proformcascader示例"
        rules={[{ required: true }]}
        fieldProps={{
          showSearch: true,
          expandTrigger: "hover",
          fieldNames: { label: 'name', value: 'id' },
        }}
        request={async () => {
          const { data } = await services_demoTable.query({ pageSize: 0 })
          return data.list
        }}
      />
      <ProFormRadio.Group
        name="ProFormRadio"
        label="ProFormRadio示例"
        rules={[{ required: true }]}
        valueEnum={{
          a: 'item 1',
          b: 'item 2',
          c: 'item 3',
        }}
      />
      <ProFormSwitch
        name="ProFormSwitch"
        label="ProFormSwitch示例"
        rules={[{ required: true }]}
        fieldProps={{ checkedChildren: '是', unCheckedChildren: '否' }}
      />
      <ProFormDigitRange
        name="ProFormDigitRange"
        label="ProFormDigitRange示例"
        rules={[{ required: true }]}
        fieldProps={{ precision: 0 }}
      />
      <ProFormDatePicker
        name="ProFormDatePicker"
        label="ProFormDatePicker示例"
        rules={[{ required: true }]}
        width='100%'
        fieldProps={{
          minDate: dayjs()
        }}
        normalize={value => value?.format('YYYY-MM-DD')}
      />
      <ProFormDateTimePicker
        name="ProFormDateTimePicker"
        label="ProFormDateTimePicker示例"
        rules={[{ required: true }]}
        width='100%'
        fieldProps={{
          minDate: dayjs()
        }}
        normalize={value => value?.format('YYYY-MM-DD HH:mm:ss')}
      />

      <ProFormDependency name={['select']}>
        {({ select }) => (
          select == 0 &&
          'dom元素'
        )}
      </ProFormDependency>

      <ProForm.Item
        name="tags"
        label="标签示例"
        rules={[{ required: true, message: '请添加' }]}
        style={{ width: '100%' }}
      >
        <EditTag />
      </ProForm.Item>
      <ProForm.Item
        name="logo1"
        label="oss上传示例"
        rules={[{ required: true, message: '请上传' }]}
        style={{ width: '100%' }}
      >
        <GlobalUpload maxCount={2} />
      </ProForm.Item>
      <ProForm.Item
        name="address"
        label="腾讯地图示例"
        rules={[{ required: true, message: '请选择' }]}
        style={{ width: '100%' }}
      >
        <QQMap />
      </ProForm.Item>
      <ProForm.Item
        name="content1"
        label="oss富文本示例"
        rules={[{ required: true, message: '请输入' }]}
        style={{ width: '100%' }}
      >
        <BraftEditor />
      </ProForm.Item>

    </ProForm>
  );
};

export default UpdateForm;
