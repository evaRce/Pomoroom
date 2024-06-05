import React from "react";
import { Alert, Card, Button, Form, Input } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';

export interface LoginProps {
  searchUser(email: string, password: string): any;
  errors: object;
}

export const Login: React.FC<LoginProps> = (props: LoginProps) => { 
  const {searchUser, errors} = props;
  
  function show_value_error(map, key, message = "") {
    let value = Object(map)[key]
    return value !== undefined ? value : message;
  }

  const onFinish = (newValues: any) => {
    searchUser(newValues.email, newValues.password)  
  };
  const emailError = show_value_error(errors, "email");
  const passwordError = show_value_error(errors, "password");

  return (
    <Card style={{ width: 450 }}>
      <h1 style={{textAlign: 'center'}}>¡Bienvenido de nuevo!</h1>
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
          validateStatus={emailError ? "error" : ""}
          help={emailError}
          rules={[{ required: true, message: '¡Por favor ingrese su correo electrónico!' }]}
        >
          <Input 
            prefix={<UserOutlined className="site-form-item-icon" />} 
            placeholder="" />
        </Form.Item>
        <Form.Item
          label="Contraseña"
          name="password"
          validateStatus={passwordError ? "error" : ""}
          help={passwordError}
          rules={[{ required: true, message: '¡Por favor ingrese su contraseña!' }]}
        >
          <Input.Password
            prefix={<LockOutlined className="site-form-item-icon" />}
          />
        </Form.Item>
        <Form.Item>
          <a className="login-form-forgot" href="retrieve-password">
            Olvide mi contraseña
          </a>
        </Form.Item>
        <Form.Item>
          <Button 
            htmlType="submit" 
            className="login-form-button"
            style={{ borderColor: "#fdba74" }}
            block
          >
            Iniciar sesión
          </Button>
          <br></br>
          <a href="signup">
            <h1 style={{textAlign: 'center'}}>¿No tienes una cuenta?</h1>
          </a>
        </Form.Item>
      </Form>
    </Card>
  );
};
