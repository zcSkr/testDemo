import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Alert, Tabs } from 'antd';
import React, { useState } from 'react';
import { ProFormText, LoginForm } from '@ant-design/pro-components';
import { useModel, history } from 'umi';
import styles from './index.less';
import * as services_login from '@/services/login';

const LoginMessage = ({ content }) => (
  <Alert style={{ marginBottom: 24 }} message={content} type="error" showIcon />
);

const Login = () => {
  const [status, setStatus] = useState();
  const [errorMsg, setErrorMsg] = useState();
  const { initialState: { settings, setToken, setUnionuser }, refresh } = useModel('@@initialState');

  const handleSubmit = async (values) => {
    const response = await services_login.login(values);
    // console.log(response)
    if (response?.code == 200) {
      setToken(response.data.user.token);
      setUnionuser(response.data.user);
      history.replace('/');
      refresh()
    } else {
      setStatus('error')
      setErrorMsg(response.msg)
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <LoginForm
          logo={<img alt="logo" src={settings.logo} />}
          title={`${settings.title}后台管理系统`}
          onFinish={handleSubmit}
        >
          <Tabs centered activeKey='account' items={[{label: "账号密码登录", key: 'account'}]} />
          {status === 'error' && <LoginMessage content={errorMsg || "账号或密码错误"} />}
          <ProFormText
            name="account"
            fieldProps={{ size: 'large', prefix: <UserOutlined /> }}
            placeholder="登录账号baba"
            rules={[
              {
                required: true,
                message: '请输入登录账号！',
              },
            ]}
          />
          <ProFormText.Password
            name="password"
            fieldProps={{ size: 'large', prefix: <LockOutlined /> }}
            placeholder='密码123456'
            rules={[
              {
                required: true,
                message: '请输入密码！',
              },
            ]}
          />
        </LoginForm>
      </div>
    </div>
  );
};

export default Login;
