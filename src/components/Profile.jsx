import React from 'react';
import { useSelector } from 'react-redux';
import { FaUserCircle } from 'react-icons/fa';

const ProfilePage = () => {
  const { user } = useSelector((state) => state.auth);

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-100 to-gray-300">
        <div className="text-2xl text-gray-600 font-semibold">You are not logged in.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-blue-100 flex items-center justify-center px-4"
           style={{
                backgroundImage:
                    "url('https://images.pexels.com/photos/2904142/pexels-photo-2904142.jpeg')",
            }}>
      <div className="w-full max-w-3xl bg-white shadow-2xl rounded-3xl p-10 border border-blue-100">
        <div className="flex flex-col items-center mb-10">
          <FaUserCircle className="text-7xl text-blue-600 mb-3" />
          <h1 className="text-4xl font-bold text-gray-800">My Profile</h1>
          <p className="text-gray-500 mt-2">Here's your personal information</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-gray-700">
          <div>
            <p className="text-sm text-gray-500 mb-1">UserName</p>
            <div className="bg-gray-100 rounded-lg p-3 text-lg font-medium">{user.username}</div>
          </div>

          <div>
            <p className="text-sm text-gray-500 mb-1">Email Address</p>
            <div className="bg-gray-100 rounded-lg p-3 text-lg font-medium">{user.email}</div>
          </div>

          <div>
            <p className="text-sm text-gray-500 mb-1">NIM</p>
            <div className="bg-gray-100 rounded-lg p-3 text-lg font-medium">{user.nim}</div>
          </div>

          <div>
            <p className="text-sm text-gray-500 mb-1">Jurusan</p>
            <div className="bg-gray-100 rounded-lg p-3 text-lg font-medium">{user.jurusan}</div>
          </div>

          <div>
            <p className="text-sm text-gray-500 mb-1">Phone Number</p>
            <div className="bg-gray-100 rounded-lg p-3 text-lg font-medium">{user.phone}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
