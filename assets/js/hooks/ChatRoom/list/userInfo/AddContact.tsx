import React, { useState } from "react";
import { Modal, Button, Form, Input } from "antd";

export default function AddContact({ sendDataToParent, receiveDataFromParent }) {
  const [form] = Form.useForm();
  const [inputStr, setInputStr] = useState("");


  const sendNewContact = () => {
    if (!inputStr) {
      return;
    }
    // sendDataToParent(false);
    setInputStr("");
    form.resetFields();
  };

  const handleAddContact = () => {
    form.submit(); // Forzar la validación del formulario
  };

  const handleCancel = () => {
    sendDataToParent(false);
    form.resetFields();
	};

  return(
    <Modal 
				title="Añadir contacto" 
				open={receiveDataFromParent}
				onCancel={handleCancel}
				// destroyOnClose={true}
				footer={[
          <Button key="cancelContact" onClick={handleCancel}>
            Cancelar
          </Button>,
          <Button key="addContact" onClick={handleAddContact}>
            Añadir
          </Button>
				]}
			>
				<Form
          form={form}
          onFinish={sendNewContact}
        >
          <Form.Item
            name="newContactName"
            rules={[
              { required: true, message: '¡Añade un contacto por su apodo!' }
            ]}
          >
            <Input
              type="text" 
              onChange={e => setInputStr(e.target.value)}
              value={inputStr}
              placeholder="Añade a tu proxim@ amig@"
            />
          </Form.Item>
        </Form>
    </Modal>
  );
}