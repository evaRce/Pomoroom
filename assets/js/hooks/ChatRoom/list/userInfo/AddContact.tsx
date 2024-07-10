import React, { useState } from "react";
import { Modal, Button, Form, Input, Radio } from "antd";
import { useEventContext } from "../../EventContext";

export default function AddContact({ sendDataToParent, receiveDataFromParent }) {
  const [form] = Form.useForm();
  const [inputStr, setInputStr] = useState("");
  const [entryType, setEntryType] = useState("contact");
  const { addEvent } = useEventContext();

  const sendNewEntry = () => {
    if (!inputStr) {
      return;
    }
    if (entryType === "contact") {
      addEvent("add_contact", { name: inputStr, type: entryType});
    } else if (entryType === "group") {
      addEvent("add_contact", { name: inputStr, type: entryType});
    }
    setInputStr("");
    form.resetFields();
  };

  const handleAddEntry = () => {
    form.submit();
  };

  const handleCancel = () => {
    sendDataToParent(false);
    form.resetFields();
    setEntryType("contact");
  };

  const handleChangeEntryType = (e) => {
    setEntryType(e.target.value);
  };

  return (
    <Modal
      title={entryType === "contact" ? "Añadir contacto" : "Crear grupo"}
      open={receiveDataFromParent}
      onCancel={handleCancel}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          Cancelar
        </Button>,
        <Button key="add" onClick={handleAddEntry}>
          {entryType === "contact" ? "Añadir" : "Crear"}
        </Button>
      ]}
    >
      <Form form={form} onFinish={sendNewEntry}>
        <Form.Item>
          <Radio.Group onChange={handleChangeEntryType} value={entryType}>
            <Radio value="contact">Contacto</Radio>
            <Radio value="group">Grupo</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          name="newEntryName"
          rules={[{ required: true, message: '¡Añade un nombre!' }]}
        >
          <Input
            type="text"
            onChange={e => setInputStr(e.target.value)}
            value={inputStr}
            placeholder={entryType === "contact" ? "Añade a tu proxim@ amig@" : "Añade tu proxima sala"}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}
