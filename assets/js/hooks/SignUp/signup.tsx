import React from "react";
import {
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
		if (value != undefined) {
			return value
		} else {
			return ""
		}
	};

	const onFinish = (newValues: any) => {
			submitUser(newValues.email, newValues.confirmPassword, newValues.nickname)
	};
	return (
		<Card style={{ width: 450 }}>
			<h1>{show_value_error(errors, "email")}</h1>
			<h1>{show_value_error(errors, "nickname")}</h1>
			<h1 style={{textAlign: 'center'}}>Create your account</h1>
			<Form
				layout="vertical"
				name="normal_signup"
				onFinish={onFinish}
				style={{ maxWidth: 400 }}
				scrollToFirstError
			>
			<Form.Item
				label="E-mail"
				name="email"
				rules={[
						{
								type: 'email',
								message: 'The input is not valid E-mail!',
						},
						{
								required: true,
								message: 'Please input your E-mail!',
						},
				]}
				hasFeedback
			>
				<Input 
					prefix={<UserOutlined className="site-form-item-icon" />} 
				/>
			</Form.Item>

			<Form.Item
				label="Password"
				name="password"            
				rules={[
					{
							required: true,
							message: 'Please input your password!',
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
				label="Confirm Password"
				name="confirmPassword"
				dependencies={['password']}
				rules={[
					{
							required: true,
							message: 'Please confirm your password!',
					},
					({ getFieldValue }) => ({
						validator(_, value) {
						if (!value || getFieldValue('password') === value) {
							return Promise.resolve();
						}
						return Promise.reject(new Error('The new password that you entered do not match!'));
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
				name="nickname"
				label="Nickname"
				tooltip="What do you want others to call you?"
				rules={[
					{ 
						required: true,
						message: 'Please input your nickname!', 
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
					Sign up
				</Button>
				<br></br>
				<a href="login">
					<h1 style={{textAlign: 'center'}}>Already have an account</h1>
				</a>
			</Form.Item>
			</Form>
		</Card>
	);
};