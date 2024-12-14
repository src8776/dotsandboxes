import React, { useState } from 'react';

const ChatContainer = ({ players, room, sendMessage, currentRoom, messages = [] }) => {
  const [currentMessage, setCurrentMessage] = useState('');

  const handleSendMessage = () => {
    if (currentMessage.trim()) {
      sendMessage({ type: 'chatMessage', message: currentMessage, room: currentRoom, sender: 'username' });
      setCurrentMessage('');
    }
  };

  return (
    <div className="chat-container">
      <h2>Chat</h2>
      <div className="chat-box">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.type}`}>
            <strong>{msg.username}:</strong> {msg.content}
          </div>
        ))}
      </div>
      <div className="chat-input">
        <input 
          type="text" 
          value={currentMessage}
          onChange={(e) => setCurrentMessage(e.target.value)} 
          placeholder="Type a message" 
        />
        <button onClick={handleSendMessage}>Send</button> 
      </div>
    </div>
  );
};

export default ChatContainer;