import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Chat from '../components/Chat';

const Home = () => {
  const [room, setRoom] = useState('');
  const [currentRoom, setCurrentRoom] = useState('');
  const { user } = useAuth();

  const joinRoom = (e) => {
    e.preventDefault();
    if (room.trim()) {
      setCurrentRoom(room.trim());
    }
  };

  if (currentRoom) {
    return <Chat room={currentRoom} />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">
            Welcome, {user?.username}!
          </h2>
          <p className="mt-2 text-gray-600">Join a chat room to start messaging</p>
        </div>
        
        <form onSubmit={joinRoom} className="space-y-4">
          <div>
            <input
              type="text"
              value={room}
              onChange={(e) => setRoom(e.target.value)}
              placeholder="Enter room name..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-primary text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-primary font-medium"
          >
            Join Room
          </button>
        </form>
        
        <div className="text-center">
          <p className="text-sm text-gray-500">
            Popular rooms: #general, #random, #tech
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
