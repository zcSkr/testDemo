import React, { useState } from 'react';
import { Form, Button, Input, InputNumber, Select, Cascader, Image, Space } from 'antd';
import { ProForm, ProFormDependency } from '@ant-design/pro-components';
import BraftEditor from '@/components/BraftEditor';
import GlobalUpload from '@/components/GlobalUpload';
import EditTag from '@/components/EditTag';
import QQMap from '@/components/QQMap';
import { useSelector } from '@umijs/max';

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
      <FormItem
        name="sort"
        label="排序权重"
        rules={[{ required: true, message: '请输入排序权重！' }]}
      >
        <InputNumber style={{ width: '100%' }} min={1} precision={0} placeholder="请输入" />
      </FormItem>
      <FormItem
        name="name"
        label="文本"
        rules={[{ required: true, message: '请输入文本！' }]}
      >
        <Input placeholder="请输入" maxLength={50} allowClear />
      </FormItem>
      <FormItem
        name="textArea"
        label="文本域"
        rules={[{ required: true, message: '请输入文本！' }]}
      >
        <TextArea placeholder="请输入" autoSize={{ minRows: 2, maxRows: 6 }} maxLength={500} allowClear showCount />
      </FormItem>
      <FormItem
        name="cascader"
        label="Cascader示例"
        rules={[{ required: true, message: '请选择xx！' }]}
      >
        <Cascader
          allowClear
          showSearch
          expandTrigger='hover'
          placeholder="请选择"
          style={{ width: '100%' }}
          getPopupContainer={triggerNode => triggerNode.parentElement}
          options={[
            {
              value: 'zhejiang',
              label: '浙江',
              children: [
                {
                  value: 'hangzhou',
                  label: '杭州',
                  children: [
                    {
                      value: 'xihu',
                      label: '西湖',
                    },
                  ],
                },
              ],
            },
            {
              value: 'jiangsu',
              label: '江苏',
              children: [
                {
                  value: 'nanjing',
                  label: '南京',
                  children: [
                    {
                      value: 'zhonghuamen',
                      label: '中华门',
                    },
                  ],
                },
              ],
            },
          ]}
        />
      </FormItem>
      <FormItem
        name="select"
        label="select示例"
        rules={[{ required: true, message: '请选择xx！' }]}
      >
        <Select
          allowClear
          showSearch
          optionFilterProp="children"
          placeholder="请选择"
          style={{ width: '100%' }}
          getPopupContainer={triggerNode => triggerNode.parentElement}
          options={[{label: '0', value: '0'},{label: '1', value: '1'},{label: '2', value: '3'},{label: '我擦', value: '3'}]}
        />
      </FormItem>
      <FormItem noStyle shouldUpdate={(prevValues, curValues) => prevValues.select !== curValues.select || prevValues.cascader !== curValues.cascader}>
        {() => (
          form.getFieldValue('select') == 0 &&
          <FormItem
            name="url"
            label="链接"
            rules={[{ required: true, message: '请输入链接！' }]}
          >
            <Input placeholder="请输入" maxLength={50} allowClear />
          </FormItem>
        )}
      </FormItem>
      <ProFormDependency name={['select']}>
        {({ select }) => (
          select == 0 &&
          <FormItem
            name="url"
            label="链接"
            rules={[{ required: true, message: '请输入链接！' }]}
          >
            <Input placeholder="请输入" maxLength={50} allowClear />
          </FormItem>
        )}
      </ProFormDependency>

      <FormItem
        name="tags"
        label="标签示例"
        rules={[{ required: true, message: '请添加！' }]}
      >
        <EditTag />
      </FormItem>
      <FormItem
        name="logo1"
        label="oss上传示例"
        rules={[{ required: true, message: '请上传图片！' }]}
      >
        <GlobalUpload data={{ type: 'test' }} maxCount={2} />
      </FormItem>
      <FormItem
        name="address"
        label="腾讯地图示例"
        rules={[{ required: true, message: '请选择定位！' }]}
      >
        <QQMap />
      </FormItem>
      <FormItem label="图片纯展示示例">
        <Image.PreviewGroup>
          <Space wrap>
            {
              formVals.imgs?.split(',').map(item => <Image key={item} width={100} height={100} src={item} style={{ margin: '0 8px 8px 0' }} />)
            }
          </Space>
        </Image.PreviewGroup>
      </FormItem>
      <FormItem
        name="content1"
        label="oss富文本示例"
        rules={[{ required: true, message: '请输入内容！' }]}
      >
        <BraftEditor />
      </FormItem>
      {renderFooter()}
    </ProForm>
  );
};

export default UpdateForm;
