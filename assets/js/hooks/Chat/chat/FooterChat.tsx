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
		<footer className="bg-gray-200 h-auto w-full p-5">
      <form className="flex gap-5" onSubmit={handleSendMessage}>
        <div className="flex h-auto gap-3">
          <Button className="w-auto bg-gray-100" icon={<PictureOutlined />}/>
          {/* <Button className="w-auto bg-gray-100" icon={<CameraOutlined />} /> */}
          <Button
            className="w-auto bg-gray-100"
            icon={addMode ? <AudioOutlined /> : <AudioMutedOutlined />}
            onClick={() => setAddMode((prev) => !prev)} 
          />
        </div>
        <div className="flex w-full">
          <input
            className="input w-full h-auto focus:outline-none bg-gray-100 rounded-r-none"
            type="text"
            value={inputStr}
            onChange={e => setInputStr(e.target.value)}
            placeholder="Type a message..."
          />
          <button className="h-auto bg-gray-100 rounded-none px-5 text-sm" onClick={() => setShowPicker(val => !val)}><SmileOutlined /></button>
          <button className="h-auto bg-blue-300 rounded-l-none rounded-r-lg px-5 text-sm" type="submit"><SendOutlined /></button>
          {showPicker && (
            <Flex gap="small">
              <EmojiPicker  onEmojiClick={onEmojiClick} />
            </Flex>
          )}
        </div>
      </form>
		</footer>	
	);
}