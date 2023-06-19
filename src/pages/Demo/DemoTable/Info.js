import React, { useState } from 'react';
import { Radio, Switch, Space, InputNumber, Image } from 'antd';
import { ProDescriptions, ProField } from '@ant-design/pro-components';
import dayjs from 'dayjs';

const Info = ({
  values
}) => {
  const [formVals, setFormVals] = useState({
    ...values
  });
  return (
    <ProDescriptions
      column={2}
      bordered
    >
      <ProDescriptions.Item label="空字符串">
        <ProField text="" />
      </ProDescriptions.Item>
      <ProDescriptions.Item label="图片">
        <Image.PreviewGroup>
          <Space wrap>
            {formVals.imgs?.split(',').map(item => <Image key={item} width={100} height={100} src={item} />)}
          </Space>
        </Image.PreviewGroup>
      </ProDescriptions.Item>
      <ProDescriptions.Item label="文本">
        <ProField text="这是一段文本" />
      </ProDescriptions.Item>
      <ProDescriptions.Item label="金额">
        <ProField text="100" valueType="money" />
      </ProDescriptions.Item>
      <ProDescriptions.Item label="数字">
        <ProField text="19897979797979" />
      </ProDescriptions.Item>
      <ProDescriptions.Item label="枚举">
        <ProField
          text="open"
          valueEnum={{
            all: {
              text: '全部',
              status: 'Default',
            },
            open: {
              text: '未解决',
              status: 'Error',
            },
            closed: {
              text: '已解决',
              status: 'Success',
            },
            processing: {
              text: '解决中',
              status: 'Processing',
            },
          }}
        />
      </ProDescriptions.Item>
      <ProDescriptions.Item label="日期时间">
        <ProField text={dayjs('2019-11-16 12:50:26').valueOf()} valueType="dateTime"/>
      </ProDescriptions.Item>
      <ProDescriptions.Item label="日期">
        <ProField text={dayjs('2019-11-16 12:50:26').valueOf()} valueType="date" />
      </ProDescriptions.Item>
    </ProDescriptions>
  );
};

export default Info