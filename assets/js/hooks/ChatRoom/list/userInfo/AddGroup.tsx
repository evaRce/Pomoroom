import React, { useState } from "react";
import { Modal, Button, Form, Input } from "antd";

export default function AddGroup({ sendDataToParent, receiveDataFromParent }) {
  const [form] = Form.useForm();
  const [inputStr, setInputStr] = useState("");


  const sendNewGroup = () => {
    if (!inputStr) {
      return;
    }
    // sendDataToParent(false);
    setInputStr("");
    form.resetFields();
  };

  const handleAddGroup = () => {
    form.submit(); // Forzar la validación del formulario
  };

  const handleCancel = () => {
    sendDataToParent(false);
    form.resetFields();
  };

  return(
    <Modal 
				title="Añadir Grupo" 
				open={receiveDataFromParent}
				onCancel={handleCancel}
				footer={[
          <Button key="cancelGroup" onClick={handleCancel}>
            Cancelar
          </Button>,
          <Button key="createGroup" onClick={handleAddGroup}>
            Crear
          </Button>
				]}
			>
				<Form
          form={form}
          onFinish={sendNewGroup}
        >
          <Form.Item 
            name="newContactGroup"
            rules={[
              { required: true, message: '¡Ingresa un nombre para tu grupo!' }
            ]}
          >
            <Input
              type="text" 
              onChange={e => setInputStr(e.target.value)}
              value={inputStr}
              placeholder="Añade tu proxima sala"/>
          </Form.Item>
        </Form>
    </Modal>
  );
}