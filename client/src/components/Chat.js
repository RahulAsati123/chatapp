import React, { useState, useEffect, useRef } from 'react';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';

const Chat = ({ room }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const { socket } = useSocket();
  const { user, logout } = useAuth();
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  useEffect(() => {
    if (socket && user) {
      socket.emit('join_room', { room, username: user.username });
      
      socket.on('receive_message', (data) => {
        setMessages(prev => [...prev, data]);
        // Play notification sound
        const audio = new Audio('/notification.mp3');
        audio.volume = 0.3;
        audio.play().catch(() => {}); // Ignore if audio fails
      });

      socket.on('room_history', (history) => {
        setMessages(history.map(msg => ({
          author: msg.sender,
          message: msg.content,
          time: new Date(msg.timestamp).toLocaleTimeString(),
          room: msg.room
        })));
      });

      socket.on('user_typing', (data) => {
        if (data.username !== user.username) {
          setIsTyping(data.isTyping);
        }
      });
    }

    return () => {
      if (socket) {
        socket.off('receive_message');
        socket.off('room_history');
        socket.off('user_typing');
      }
    };
  }, [socket, room, user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleScroll = () => {
    const container = messagesContainerRef.current;
    if (container) {
      const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 100;
      setShowScrollButton(!isNearBottom);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

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
      socket.emit('typing', { room, username: user.username, isTyping: false });
    }
  };

  const handleTyping = (e) => {
    setMessage(e.target.value);
    if (socket) {
      socket.emit('typing', { room, username: user.username, isTyping: e.target.value.length > 0 });
    }
  };

  const getInitials = (name) => {
    return name ? name.charAt(0).toUpperCase() : 'U';
  };

  const getAvatarColor = (name) => {
    const colors = ['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500', 'bg-pink-500', 'bg-indigo-500'];
    const index = name ? name.charCodeAt(0) % colors.length : 0;
    return colors[index];
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-gray-200 p-4 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold">
            #
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">{room}</h2>
            <p className="text-sm text-gray-500">Welcome, {user?.username}!</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="bg-red-500 hover:bg-red-600 transition-colors duration-200 px-4 py-2 rounded-lg text-white text-sm font-medium shadow-md hover:shadow-lg"
        >
          Logout
        </button>
      </div>
      
      {/* Messages Container */}
      <div 
        ref={messagesContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-4 space-y-4 relative"
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex items-start space-x-3 animate-fadeIn ${
              msg.author === user?.username ? 'flex-row-reverse space-x-reverse' : ''
            }`}
          >
            {/* Avatar */}
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${getAvatarColor(msg.author)}`}>
              {getInitials(msg.author)}
            </div>
            
            {/* Message Bubble */}
            <div className={`max-w-xs lg:max-w-md ${msg.author === user?.username ? 'ml-auto' : ''}`}>
              {msg.author !== user?.username && (
                <p className="text-xs text-gray-500 mb-1 font-medium">{msg.author}</p>
              )}
              <div
                className={`px-4 py-3 rounded-2xl shadow-md transition-all duration-200 hover:shadow-lg ${
                  msg.author === user?.username
                    ? 'bg-primary text-white rounded-br-md'
                    : 'bg-white text-gray-800 rounded-bl-md border border-gray-100'
                }`}
              >
                <p className="break-words">{msg.message}</p>
                <p className={`text-xs mt-1 ${
                  msg.author === user?.username ? 'text-blue-100' : 'text-gray-400'
                }`}>
                  {msg.time}
                </p>
              </div>
            </div>
          </div>
        ))}
        
        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex items-center space-x-2 text-gray-500 animate-pulse">
            <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
            </div>
            <span className="text-sm italic">Someone is typing...</span>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      {/* Scroll to Bottom Button */}
      {showScrollButton && (
        <button
          onClick={scrollToBottom}
          className="fixed bottom-24 right-6 bg-primary text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 z-20"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </button>
      )}
      
      {/* Message Input */}
      <form onSubmit={sendMessage} className="p-4 bg-white border-t border-gray-200 shadow-lg">
        <div className="flex items-center space-x-3 max-w-4xl mx-auto">
          <div className="flex-1 relative">
            <input
              type="text"
              value={message}
              onChange={handleTyping}
              placeholder="Type your message..."
              className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 shadow-sm"
            />
            {message && (
              <button
                type="button"
                onClick={() => setMessage('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
          <button
            type="submit"
            disabled={!message.trim()}
            className="bg-primary text-white p-3 rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
};

export default Chat;
