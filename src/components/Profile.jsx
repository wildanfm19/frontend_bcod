import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaEdit, FaUserCircle } from 'react-icons/fa';
import api from '../api/api';
import Loader from './shared/Loader';
import toast from 'react-hot-toast';

const ProfilePage = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [sellerProfile, setSellerProfile] = useState(null);
  const [isLoadingSellerProfile, setIsLoadingSellerProfile] = useState(false);
  const [sellerProfileError, setSellerProfileError] = useState(null);

  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [newPhoneNumber, setNewPhoneNumber] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (user && user.user_id && user.role === 'seller') {
      const fetchSellerProfile = async () => {
        setIsLoadingSellerProfile(true);
        setSellerProfileError(null);
        try {
          const sellerId = user.user_id;

          if (sellerId) {
            const { data } = await api.get(`/sellers/${sellerId}`);
            if (data.code === "000" && data.seller) {
              setSellerProfile(data.seller);
            } else {
              setSellerProfileError(data.message || "Failed to fetch seller profile");
              toast.error(data.message || "Failed to fetch seller profile");
            }
          } else {
            setSellerProfileError("Seller ID not found for this user");
          }

        } catch (error) {
          console.error("Error fetching seller profile:", error);
          setSellerProfileError(error?.response?.data?.message || "Failed to fetch seller profile");
          toast.error(error?.response?.data?.message || "Failed to fetch seller profile");
        } finally {
          setIsLoadingSellerProfile(false);
        }
      };

      fetchSellerProfile();
    } else if (user && user.user_id && user.role !== 'seller') {
      setSellerProfile(null);
    }

  }, [user]);

  const handleEditPhoneNumber = () => {
    setIsEditingPhone(true);
    setNewPhoneNumber(sellerProfile?.phone_number || '');
  };

  const handleCancelEdit = () => {
    setIsEditingPhone(false);
    setNewPhoneNumber('');
  };

  const handleSavePhoneNumber = async () => {
    if (!newPhoneNumber || newPhoneNumber === sellerProfile?.phone_number) {
      handleCancelEdit();
      return;
    }

    setIsUpdating(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('User not authenticated.');
        setIsUpdating(false);
        return;
      }

      const { data } = await api.put('/seller/phone-number', { phone_number: newPhoneNumber }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (data.code === '000') {
        setSellerProfile(prev => ({ ...prev, phone_number: data.data.phone_number }));
        toast.success(data.message || 'Phone number updated successfully!');
        setIsEditingPhone(false);
        setNewPhoneNumber('');
      } else {
        toast.error(data.message || 'Failed to update phone number.');
      }
    } catch (error) {
      console.error('Error updating phone number:', error);
      toast.error(error?.response?.data?.message || 'Failed to update phone number.');
    } finally {
      setIsUpdating(false);
    }
  };

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

        {isLoadingSellerProfile ? (
            <Loader/>
        ) : sellerProfileError ? (
             <div className="text-center text-red-500">{sellerProfileError}</div>
        ) : (
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-gray-700">
                <div>
                    <p className="text-sm text-gray-500 mb-1">UserName</p>
                    <div className="bg-gray-100 rounded-lg p-3 text-lg font-medium">{user.username}</div>
                </div>

                {sellerProfile && sellerProfile.email && (
                    <div>
                        <p className="text-sm text-gray-500 mb-1">Email Address</p>
                        <div className="bg-gray-100 rounded-lg p-3 text-lg font-medium">{sellerProfile.email}</div>
                    </div>
                 )}

                 {sellerProfile && (
                    <>
                        {sellerProfile.full_name && (
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Full Name</p>
                                <div className="bg-gray-100 rounded-lg p-3 text-lg font-medium">{sellerProfile.full_name}</div>
                            </div>
                        )}
                        {sellerProfile.nim && (
                             <div>
                                <p className="text-sm text-gray-500 mb-1">NIM</p>
                                <div className="bg-gray-100 rounded-lg p-3 text-lg font-medium">{sellerProfile.nim}</div>
                             </div>
                        )}
                        {sellerProfile.jurusan && (
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Jurusan</p>
                                <div className="bg-gray-100 rounded-lg p-3 text-lg font-medium">{sellerProfile.jurusan}</div>
                            </div>
                        )}
                         {sellerProfile.phone_number && (
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Phone Number</p>
                                <div className="flex items-center gap-2">
                                    {isEditingPhone ? (
                                        <>
                                            <input
                                                type="text"
                                                value={newPhoneNumber}
                                                onChange={(e) => setNewPhoneNumber(e.target.value)}
                                                className="bg-gray-100 rounded-lg p-3 text-lg font-medium flex-grow outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                            <button
                                                className="text-green-600 hover:text-green-800 text-sm font-semibold"
                                                onClick={handleSavePhoneNumber}
                                                disabled={isUpdating}
                                            >
                                                {isUpdating ? 'Saving...' : 'Save'}
                                            </button>
                                            <button
                                                className="text-gray-600 hover:text-gray-800 text-sm"
                                                onClick={handleCancelEdit}
                                                disabled={isUpdating}
                                            >
                                                Cancel
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <div className="bg-gray-100 rounded-lg p-3 text-lg font-medium flex-grow">{sellerProfile.phone_number}</div>
                                            {user?.role === 'seller' && (
                                                <button
                                                    className="text-blue-600 hover:text-blue-800 text-sm"
                                                    onClick={handleEditPhoneNumber}
                                                    disabled={isUpdating}
                                                >
                                                    <FaEdit/>
                                                </button>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>
                        )}
                        {sellerProfile.store_name && (
                             <div>
                                <p className="text-sm text-gray-500 mb-1">Store Name</p>
                                <div className="bg-gray-100 rounded-lg p-3 text-lg font-medium">{sellerProfile.store_name}</div>
                            </div>
                        )}
                    </>
                 )}

             </div>
        )}

      </div>
    </div>
  );
};

export default ProfilePage;