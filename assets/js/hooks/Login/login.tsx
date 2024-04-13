import React from "react";
import { Button, Checkbox, Form, Input } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';

export interface LoginProps {
  username: string;
  password: string;
}

export const Login: React.FC<LoginProps> = (props: LoginProps) => {
  
  const onFinish = (props: LoginProps) => {
    console.log('Received values of form: ', props);
  };

  return (
    <>
      <h1>Welcome</h1>
      <Form
        layout="vertical"
        name="normal_login"
        className="login-form"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        style={{ maxWidth: 400 }}
      >
        <Form.Item
          label="User"
          name="username"
          rules={[{ required: true, message: 'Please input your Username!' }]}
        >
          <Input 
            prefix={<UserOutlined className="site-form-item-icon" />} 
            placeholder="" />
        </Form.Item>
        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: 'Please input your Password!' }]}
        >
          <Input
            prefix={<LockOutlined className="site-form-item-icon" />}
            type="password"
            placeholder=""
          />
        </Form.Item>
        <Form.Item>
          <Form.Item name="remember" valuePropName="checked" noStyle>
            <Checkbox>Remember me</Checkbox>
          </Form.Item>

          <a className="login-form-forgot" href="">
            Forgot password
          </a>
        </Form.Item>

        <Form.Item>
          <Button phx-click="action.log_user" htmlType="submit" className="login-form-button">
            Log in
          </Button>
          <br></br>
          <a href="signup">Don't have an account? </a>
        </Form.Item>
      </Form>
    </>
  );
};
