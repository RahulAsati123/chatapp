import React, { useState, useEffect, useRef } from 'react';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';

const Chat = ({ room }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const { socket } = useSocket();
  const { user, logout } = useAuth();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (socket && user) {
      socket.emit('join_room', { room, username: user.username });
      
      socket.on('receive_message', (data) => {
        setMessages(prev => [...prev, data]);
      });

      socket.on('room_history', (history) => {
        setMessages(history.map(msg => ({
          author: msg.sender,
          message: msg.content,
          time: new Date(msg.timestamp).toLocaleTimeString(),
          room: msg.room
        })));
      });
    }

    return () => {
      if (socket) {
        socket.off('receive_message');
        socket.off('room_history');
      }
    };
  }, [socket, room, user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim() && socket && user) {
      const messageData = {
        room,
        author: user.username,
        message,
        time: new Date().toLocaleTimeString()
      };
      
      socket.emit('send_message', messageData);
      setMessage('');
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="bg-primary text-white p-4 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold">Room: {room}</h2>
          <p className="text-sm opacity-75">Welcome, {user?.username}!</p>
        </div>
        <button
          onClick={logout}
          className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded text-sm"
        >
          Logout
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.author === user?.username ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                msg.author === user?.username
                  ? 'bg-primary text-white'
                  : 'bg-white text-gray-800 shadow'
              }`}
            >
              {msg.author !== user?.username && (
                <p className="text-sm font-semibold text-gray-600">{msg.author}</p>
              )}
              <p>{msg.message}</p>
              <p className="text-xs opacity-75 mt-1">{msg.time}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      <form onSubmit={sendMessage} className="p-4 bg-white border-t">
        <div className="flex space-x-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            type="submit"
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default Chat;
