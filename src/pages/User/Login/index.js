import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Alert, Tabs } from 'antd';
import React, { useState } from 'react';
import { useEmotionCss } from '@ant-design/use-emotion-css';
import { ProFormText, LoginForm } from '@ant-design/pro-components';
import { useModel, history } from '@umijs/max';
import * as services_login from '@/services/login';

const LoginMessage = ({ content }) => (
  <Alert style={{ marginBottom: 24 }} message={content} type="error" showIcon />
);

const Login = () => {
  const [status, setStatus] = useState();
  const [errorMsg, setErrorMsg] = useState();
  const { initialState: { settings, setToken, setUnionuser }, refresh } = useModel('@@initialState');

  const containerClassName = useEmotionCss(() => {
    return {
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      overflow: 'auto',
      backgroundImage:
        "url('https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/V-_oS6r-i7wAAAAAAAAAAAAAFl94AQBr')",
      backgroundSize: '100% 100%',
    };
  });

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
    <div className={containerClassName}>
      <div style={{ flex: 1, padding: '32px 0' }}>
        <LoginForm
          contentStyle={{ minWidth: 280, maxWidth: '75vw' }}
          logo={<img alt="logo" src={settings.logo} />}
          title={`${settings.title}后台管理系统`}
          onFinish={handleSubmit}
          onValuesChange={() => setStatus()}
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
