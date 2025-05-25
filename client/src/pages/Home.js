import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Chat from '../components/Chat';

const Home = () => {
  const [room, setRoom] = useState('');
  const [currentRoom, setCurrentRoom] = useState('');
  const { user } = useAuth();

  const popularRooms = ['general', 'random', 'tech', 'gaming', 'music'];

  const joinRoom = (e) => {
    e.preventDefault();
    if (room.trim()) {
      setCurrentRoom(room.trim());
    }
  };

  const joinPopularRoom = (roomName) => {
    setCurrentRoom(roomName);
  };

  if (currentRoom) {
    return <Chat room={currentRoom} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-6 shadow-lg">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome back!
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            Hello, <span className="font-semibold text-primary">{user?.username}</span>
          </p>
          <p className="text-gray-500">Join a chat room to start messaging</p>
        </div>
        
        {/* Join Room Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <form onSubmit={joinRoom} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Room Name
              </label>
              <input
                type="text"
                value={room}
                onChange={(e) => setRoom(e.target.value)}
                placeholder="Enter room name..."
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 shadow-sm"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Join Room
            </button>
          </form>
        </div>
        
        {/* Popular Rooms */}
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
            Popular Rooms
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {popularRooms.map((roomName) => (
              <button
                key={roomName}
                onClick={() => joinPopularRoom(roomName)}
                className="px-4 py-3 bg-gray-50 hover:bg-primary hover:text-white text-gray-700 rounded-xl transition-all duration-200 font-medium border border-gray-200 hover:border-primary hover:shadow-md transform hover:scale-105"
              >
                #{roomName}
              </button>
            ))}
          </div>
        </div>
        
        {/* Features */}
        <div className="text-center space-y-2">
          <div className="flex justify-center space-x-6 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Real-time messaging</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>Multiple rooms</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
