import React, { useCallback, useState } from 'react';
import { Dropdown, Spin, message } from 'antd';
import { useEmotionCss } from '@ant-design/use-emotion-css';
import classNames from 'classnames';
import { LogoutOutlined, SettingOutlined } from '@ant-design/icons';
import { history, useModel, useDispatch } from '@umijs/max';
import GlobalModal from '@/components/GlobalModal'
import UpdatePsd from '@/components/UpdatePsd'

import * as services_manager from '@/services/sys/manager';

const HeaderDropdown = ({ overlayClassName: cls, ...restProps }) => {
  const className = useEmotionCss(({ token }) => {
    return {
      [`@media screen and (max-width: ${token.screenXS}px)`]: {
        width: '100%',
      },
    };
  });
  return <Dropdown overlayClassName={classNames(className, cls)} {...restProps} />;
};

const AvatarDropdown = ({ children }) => {
  const dispatch = useDispatch()
  const [updateModalVisible, handleUpdateModalVisible] = useState(false);
  const { initialState: { getUnionuser }, setInitialState, refresh } = useModel('@@initialState');

  const actionClassName = useEmotionCss(({ token }) => {
    return {
      display: 'flex',
      height: '48px',
      marginLeft: 'auto',
      overflow: 'hidden',
      alignItems: 'center',
      padding: '0 8px',
      cursor: 'pointer',
      borderRadius: token.borderRadius,
      '&:hover': {
        backgroundColor: token.colorBgTextHover,
      },
    };
  });


  const onMenuClick = useCallback(
    ({ key }) => {
      if (key === 'logout') {
        sessionStorage.removeItem('unionuser')
        sessionStorage.removeItem('token')
        history.replace('/user/login')
        refresh()
      } else if (key === 'changePsd') {
        handleUpdateModalVisible(true)
      }
    },
    [setInitialState],
  );

  const handleUpdate = useCallback(async fields => {
    const hide = message.loading({ content: '操作中', key: 'loading' });
    const res = await dispatch({
      type: 'global/service',
      service: services_manager.updatePsd,
      payload: { id: getUnionuser().id, password: fields.password }
    })
    hide();
    if (res?.code == 200) {
      message.success({ content: '操作成功', key: 'success' });
      handleUpdateModalVisible(false)
    } else {
      message.error({ content: res.msg, key: 'error' });
    }
  },[])

  if (!getUnionuser()) {
    return (
      <span className={actionClassName}>
        <Spin size="small" style={{ marginLeft: 8, marginRight: 8 }} />
      </span>
    );
  }

  return (
    <>
      <HeaderDropdown
        menu={{
          onClick: onMenuClick,
          items: [
            { label: '修改密码', icon: <SettingOutlined />, key: 'changePsd' },
            { label: '退出登录', icon: <LogoutOutlined />, key: 'logout' }
          ]
        }}
      >
        {children}
      </HeaderDropdown>
      <GlobalModal
        open={updateModalVisible}
        onCancel={() => {
          handleUpdateModalVisible(false);
        }}
        title="修改密码"
      >
        <UpdatePsd handleUpdate={handleUpdate} />
      </GlobalModal>
    </>
  );
};

export default AvatarDropdown
