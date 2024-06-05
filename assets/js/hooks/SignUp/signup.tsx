import React from "react";
import {
	Alert,
	Card,
	Button,
	Form,
	Input,
} from 'antd';
import {LockOutlined, UserOutlined, RobotOutlined} from '@ant-design/icons';

export interface SignUpProps {
	submitUser(newUsername: string, newPassword: string, newNickname: string): any;
	errors: object;
}

export const SignUp: React.FC<SignUpProps> = (props: SignUpProps) => {
	const { submitUser, errors } = props;

	function show_value_error(map, key) {
		let value =  Object(map)[key]
		return value !== undefined ? value : "";
	};

	const onFinish = (newValues: any) => {
		submitUser(newValues.email, newValues.confirmPassword, newValues.nickname)
	};
	const emailError = show_value_error(errors, "email");
  const nicknameError = show_value_error(errors, "nickname");

	return (
		<Card style={{ width: 450 }}>
			<h1 style={{textAlign: 'center'}}>Crea tu cuenta</h1>
			<Form
				layout="vertical"
				name="normal_signup"
				onFinish={onFinish}
				style={{ maxWidth: 400 }}
				scrollToFirstError
			>
			<Form.Item
				label="Email"
				name="email"
				validateStatus={emailError ? "error" : ""}
				help={emailError}
				rules={[
						{
							type: 'email',
							message: '¡La entrada no es un email válido!',
						},
						{
							required: true,
							message: '¡Por favor ingrese su email!',
						},
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
					{
						required: true,
						message: '¡Por favor ingrese su contraseña!',
					},
					{
						type: 'string',
						min: 5,
						max: 20,
					}
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
					{
						required: true,
						message: '¡Por favor, confirme su contraseña!',
					},
					({ getFieldValue }) => ({
						validator(_, value) {
						if (!value || getFieldValue('password') === value) {
							return Promise.resolve();
						}
						return Promise.reject(new Error('¡La nueva contraseña que ingresó no coincide!'));
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
				validateStatus={nicknameError ? "error" : ""}
				help={nicknameError}
				rules={[
					{ 
						required: true,
						message: '¡Por favor ingresa tu apodo!', 
						whitespace: true 
					}
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