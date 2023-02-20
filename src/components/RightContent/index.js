import { Space } from 'antd';
import React from 'react';
import { useModel } from 'umi';
import AvatarDropdown from './AvatarDropdown';

const GlobalHeaderRight = (props) => {
  const { initialState } = useModel('@@initialState');

  if (!initialState || !initialState.settings) {
    return null;
  }

  return <AvatarDropdown {...props} />;
};

export default GlobalHeaderRight;
