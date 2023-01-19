import React from 'react';
import { Result } from 'antd';
import { SmileTwoTone } from '@ant-design/icons';
import { useModel } from 'umi';


const Welcome = () => {
  const { initialState: { settings } } = useModel('@@initialState');
  return (
    <Result
      icon={<SmileTwoTone />}
      title={<span style={{ fontSize: 30 }}>欢迎使用{settings.title}后台管理系统</span>}
    />
  );
};

export default Welcome;
