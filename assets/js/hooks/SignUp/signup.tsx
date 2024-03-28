import React from "react";
import {
    Button,
    Form,
    Input,
  } from 'antd';

export interface SignUpProps {
    email: string;
    password: string;
    nickname: string;
    submitUser(newUsername: string, newPassword: string, newNickname: string): any
}

export const SignUp: React.FC<SignUpProps> = (props: SignUpProps) => {
    const { submitUser } = props
    const onFinish = (newValues: any) => {
        submitUser(newValues.email, newValues.password, newValues.nickname)
        console.log('Ejecucion onFinish', props)
    };

    return (
        <>
            <h1>Create your account</h1>
            <Form
                layout="vertical"
                name="normal_signup"
                className="signup-form"
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
                <Input />
            </Form.Item>

            <Form.Item
                label="Password"
                name="password"            
                rules={[
                    {
                        required: true,
                        message: 'Please input your password!',
                    },
                ]}
                hasFeedback
            >
                <Input.Password />
            </Form.Item>

            <Form.Item
                name="confirm"
                label="Confirm Password"
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
                <Input.Password />
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
                <Input />
            </Form.Item>

            <Form.Item>
                <Button phx-click="action.save" htmlType="submit" className="signup-form-button">
                Sign up
                </Button>
                <br></br>
                <a href="login">Already have an account</a>
            </Form.Item>
            </Form>
        </>
    );
};