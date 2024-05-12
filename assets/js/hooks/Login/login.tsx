import React from "react";
import { Card, Button, Checkbox, Form, Input } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';

export interface LoginProps {
  searchUser(email: string, password: string): any; 
}

export const Login: React.FC<LoginProps> = (props: LoginProps) => {
  const {searchUser} = props;
  
  const onFinish = (newValues: any) => {
    searchUser(newValues.email, newValues.password)
    // console.log(newValues)
  };

  return (
    <Card style={{ width: 450 }}>
      <h1 style={{textAlign: 'center'}}>Welcome</h1>
      <Form
        layout="vertical"
        name="normal_login"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        style={{ maxWidth: 400 }}
      >
        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: 'Please input your Email!' }]}
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
          <Input.Password
            prefix={<LockOutlined className="site-form-item-icon" />}
          />
        </Form.Item>
        <Form.Item>
          <a className="login-form-forgot" href="retrieve-password">
            Forgot password
          </a>
        </Form.Item>
        <Form.Item>
          <Button 
            htmlType="submit" 
            className="login-form-button"
            style={{ borderColor: "#fdba74" }}
            block
          >
            Log in
          </Button>
          <br></br>
          <a href="signup">
            <h1 style={{textAlign: 'center'}}>Don't have an account?</h1>
          </a>
        </Form.Item>
      </Form>
    </Card>
  );
};
