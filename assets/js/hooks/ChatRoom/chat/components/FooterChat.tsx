import React, { useState, useEffect } from "react";
import { Button, Modal } from "antd";
import EmojiPicker from 'emoji-picker-react';
import {
  PictureOutlined, 
  AudioOutlined, 
  AudioMutedOutlined, 
  SendOutlined,
  SmileOutlined } from '@ant-design/icons';
import { useEventContext } from "../../EventContext";

export default function FooterChat({addMessage})  {
  const [addMode, setAddMode] = useState(true);
  const [inputStr, setInputStr] = useState("");
  const [showPicker, setShowPicker] = useState(false);
  const { addEvent, getEventData, removeEvent } = useEventContext();
  const [contactName, setContactName] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  const onEmojiClick = (emojiObject, event) => {
    setInputStr(prevInput => prevInput + emojiObject.emoji);
    setShowPicker(false);
  };

	useEffect(() => {
    const contactData = getEventData("open_chat");
    if (contactData) {
      setContactName(contactData);
			// removeEvent("open_chat");
    }
  }, [getEventData]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (inputStr.trim() === "") {
      return;
    }
    console.log(inputStr);
    addEvent("send_message", { message: inputStr, contact_name: contactName })
    addMessage(inputStr);
    setInputStr("");
  };

	return(
		<footer className="flex justify-between bg-gray-300 h-[7vh] px-4">
      <form className="flex w-full gap-3" onSubmit={handleSendMessage}>
        <div className="flex items-center gap-2">
          <Button className="bg-gray-100" icon={<PictureOutlined />}/>
          <Button
            className="bg-gray-100"
            icon={addMode ? <AudioOutlined /> : <AudioMutedOutlined />}
            onClick={() => setAddMode((prev) => !prev)} 
          />
        </div>
        <div className="flex items-center w-full justify-center">
          <input
            className="input bg-gray-100 h-8 w-full focus:outline-none rounded-r-none"
            type="text"
            value={inputStr}
            onChange={(e) => {
              if (e.target.value.length <= 5000) {
                setInputStr(e.target.value);
              } else {
                setModalVisible(true);
              }
            }}
            placeholder="Type a message..."
            maxLength={5001}
          />
          <div className="flex">
            <Button 
              className="bg-gray-100 rounded-none" 
              onClick={() => setShowPicker(val => !val)} 
              icon={<SmileOutlined />}/>
            <Button 
              className="bg-blue-300 rounded-l-none rounded-r-lg" 
              icon={<SendOutlined />} 
              onClick={(e) => handleSendMessage(e)}/>
            {showPicker && (<EmojiPicker  onEmojiClick={onEmojiClick} />)}
          </div>
        </div>
      </form>
      <Modal
        title="Límite de caracteres excedido"
        open={modalVisible}
        onOk={() => setModalVisible(false)}
        onCancel={() => setModalVisible(false)}
      >
        <p>Se ha excedido el límite de 5000 caracteres.</p>
      </Modal>
		</footer>	
	);
}