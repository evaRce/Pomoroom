import React, { useState } from "react";
import { Button, Flex } from "antd";
import EmojiPicker from 'emoji-picker-react';
import {
  PictureOutlined, 
  AudioOutlined, 
  AudioMutedOutlined, 
  SendOutlined,
  SmileOutlined } from '@ant-design/icons';

export default function FooterChat({})  {
  const [addMode, setAddMode] = useState(true);
  const [inputStr, setInputStr] = useState("");
  const [showPicker, setShowPicker] = useState(false);

  const onEmojiClick = (emojiObject, event) => {
    setInputStr(prevInput => prevInput + emojiObject.emoji);
    setShowPicker(false);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    console.log(inputStr);
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
            onChange={e => setInputStr(e.target.value)}
            placeholder="Type a message..."
          />
          <div className="flex">
            <Button className="bg-gray-100 rounded-none" onClick={() => setShowPicker(val => !val)} icon={<SmileOutlined />}/>
            <Button className="bg-blue-300 rounded-l-none rounded-r-lg" icon={<SendOutlined />} onClick={(e) => handleSendMessage(e)}/>
            {showPicker && (
                <EmojiPicker  onEmojiClick={onEmojiClick} />
            )}
          </div>
        </div>
      </form>
		</footer>	
	);
}