import React, { useEffect } from "react";
import { Card, Button, Form, Input } from 'antd';
import { LockOutlined, UserOutlined, RobotOutlined } from '@ant-design/icons';

export interface SignUpProps {
	submitUser(newUsername: string, newPassword: string, newNickname: string): any;
	errors: object;
}

export const SignUp: React.FC<SignUpProps> = (props: SignUpProps) => {
	const { submitUser, errors } = props;
	const [form] = Form.useForm();
	const nicknameRegex = new RegExp(/^\w[\w.]{2,18}\w$/);

	const onFinish = (newValues: any) => {
		submitUser(newValues.email, newValues.confirmPassword, newValues.nickname)
	};

	useEffect(() => {
    // Set custom backend errors to the form fields
    if (errors) {
      form.setFields(Object.keys(errors).map(key => ({
        name: key,
        errors: [errors[key]],
      })));
    }
  }, [errors, form]);

	return (
		<Card style={{ width: 450 }}>
			<h1 style={{textAlign: 'center'}}>¡Es fácil empezar! Crea tu cuenta y empieza a ser más productivo.</h1>
			<Form
				form={form}
				layout="vertical"
				name="normal_signup"
				onFinish={onFinish}
				style={{ maxWidth: 400 }}
				scrollToFirstError
			>
			<Form.Item
				label="Email"
				name="email"
				rules={[
					{ required: true, message: '¡Por favor ingrese su email!' },
					{ type: 'email', message: '¡La entrada no es un email válido!' }
				]}
				hasFeedback
			>
				<Input 
					prefix={<UserOutlined className="site-form-item-icon" />} 
				/>
			</Form.Item>

			<Form.Item
				label="Contraseña"
				name="password"
				rules={[
					{ required: true, 	message: '¡Por favor ingrese su contraseña!' },
					{ type: 'string', min: 8, max: 64, message: '¡La contraseña debe tener entre 8 y 64 caracteres!' }
				]}
				hasFeedback
			>
				<Input.Password 
					prefix={<LockOutlined className="site-form-item-icon" />}
				/>
			</Form.Item>

			<Form.Item
				label="Confirmar contraseña"
				name="confirmPassword"
				dependencies={['password']}
				rules={[
					{ required: true, message: '¡Por favor, confirme su contraseña!' },
					({ getFieldValue }) => ({
						validator(_, value) {
						if (!value || getFieldValue('password') === value) {
							return Promise.resolve();
						}
						return Promise.reject(new Error('¡La contraseña que ingresó no coincide con la anterior!'));
						},
					}),
				]}
				hasFeedback
			>
				<Input.Password 
					prefix={<LockOutlined className="site-form-item-icon" />}
				/>
			</Form.Item>

			<Form.Item
				label="Apodo"
				name="nickname"
				tooltip="¿Cómo quieres que te llamen los demás?"
				rules={[
					{ required: true, message: '¡Por favor ingresa tu apodo!', whitespace: true },
					{ pattern: nicknameRegex, message: '¡La entrada no es un apodo válido!' },
					{ min: 2, max: 64, message: 'El apodo debe tener entre 2 y 64 caracteres' }
				]}
				hasFeedback
			>
				<Input 
					prefix={<RobotOutlined />}
				/>
			</Form.Item>

			<Form.Item>
				<Button 
					htmlType="submit" 
					className="signup-form-button"
					style={{ borderColor: "#fdba74" }}
					block
				>
					Crear cuenta
				</Button>
				<br></br>
				<a href="login">
					<h1 style={{textAlign: 'center'}}>Ya tengo una cuenta</h1>
				</a>
			</Form.Item>
			</Form>
		</Card>
	);
};