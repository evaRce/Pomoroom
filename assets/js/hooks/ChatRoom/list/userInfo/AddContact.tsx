import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Input, Radio, message, Spin } from "antd";
import { useEventContext } from "../../EventContext";

export default function AddContact({ sendDataToParent, receiveDataFromParent }) {
  const [form] = Form.useForm();
  const [inputStr, setInputStr] = useState("");
  const [entryType, setEntryType] = useState("contact");
  const { addEvent, getEventData, removeEvent } = useEventContext();
  const [loading, setLoading] = useState(false);

  const sendNewEntry = () => {
    if (!inputStr) {
      return;
    }
    setLoading(true);
    if (entryType === "contact") {
      addEvent("send_friend_request", {send_to_contact: inputStr})
    } else if (entryType === "group") {
      addEvent("add_contact", { name: inputStr, is_group: true});
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
    setInputStr("");
  };

  const handleChangeEntryType = (e) => {
    setEntryType(e.target.value);
  };

  useEffect(() => {
    const errorContact = getEventData("error_adding_contact");
    if(errorContact) {
      form.setFields([
        {name: 'newContactName', errors: [errorContact]}
      ]);
      removeEvent("error_adding_contact");
      setLoading(false);
    }

    const successContact = getEventData("add_contact_to_list");
    if (successContact) {
      const successMessage = entryType === "contact" ? 'Invitación enviada!' : 'Grupo creado exitosamente!';
      message.success(successMessage, 2);;
      removeEvent("add_contact_to_list");
      setLoading(false);
    }
  }, [getEventData]);

  return (
    <Modal
      title={entryType === "contact" ? "Añadir contacto" : "Crear grupo"}
      open={receiveDataFromParent}
      onCancel={handleCancel}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          Cancelar
        </Button>,
        <Button key="add" onClick={handleAddEntry} disabled={loading}>
        {loading ? <Spin /> : (entryType === "contact" ? "Añadir" : "Crear")}
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
          name="newContactName"
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
