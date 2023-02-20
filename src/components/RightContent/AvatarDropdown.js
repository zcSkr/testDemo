import React, { useCallback, useState } from 'react';
import { LogoutOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Spin, message } from 'antd';
import { useModel, history, useDispatch } from 'umi';
import HeaderDropdown from '../HeaderDropdown';
import GlobalModal from '@/components/GlobalModal'
import UpdatePsd from '@/components/UpdatePsd'

import * as service_manager from '@/services/sys/manager';

const AvatarDropdown = ({ children }) => {
  const dispatch = useDispatch()
  const [updateModalVisible, handleUpdateModalVisible] = useState(false);
  const { initialState: { getUnionuser }, setInitialState } = useModel('@@initialState');
  const onMenuClick = useCallback(
    ({ key }) => {
      // console.log(key)
      if (key === 'logout') {
        sessionStorage.removeItem('unionuser')
        sessionStorage.removeItem('token')
        history.replace('/user/login')
      } else if (key === 'changePsd') {
        handleUpdateModalVisible(true)
      }
    },
    [setInitialState],
  );

  const handleUpdate = async fields => {
    const hide = message.loading({ content: '操作中', key: 'loading' });
    const res = await dispatch({
      type: 'global/service',
      service: service_manager.updatePsd,
      payload: { id: getUnionuser().id, password: fields.password }
    })
    hide();
    if (res?.code == 200) {
      message.success({ content: '操作成功', key: 'success' });
      handleUpdateModalVisible(false)
    } else {
      message.error({ content: res.msg, key: 'error' });
    }
  }


  if (!getUnionuser()) {
    return <Spin size="small" style={{ marginLeft: 8, marginRight: 8 }} />;
  }

  return (
    <>

      <HeaderDropdown menu={{
        items: [
          { label: '修改密码', icon: <SettingOutlined />, key: 'changePsd' },
          { label: '退出登录', icon: <LogoutOutlined />, key: 'logout' }
        ],
        onClick: onMenuClick,
      }}
      placement="topLeft"
      >
        {children}
      </HeaderDropdown>
      <GlobalModal
        open={updateModalVisible}
        onCancel={() => {
          handleUpdateModalVisible(false);
        }}
        title='修改密码'
      >
        <UpdatePsd handleUpdate={handleUpdate} />
      </GlobalModal>
    </>
  );
};

export default AvatarDropdown;
