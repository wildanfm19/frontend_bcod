import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaCheck, FaEdit, FaEnvelope, FaGraduationCap, FaIdCard, FaPhone, FaTimes, FaUser, FaUserCircle } from 'react-icons/fa';
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur-lg opacity-20 scale-110"></div>
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 shadow-2xl border-4 border-white ring-4 ring-blue-200 flex items-center justify-center">
                <FaUser className="text-white text-5xl" />
              </div>
              <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-green-400 to-green-500 w-8 h-8 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                <div className="w-3 h-3 bg-white rounded-full"></div>
              </div>
            </div>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mt-6 mb-2">
            My Profile
          </h1>
          <p className="text-gray-600 text-lg font-medium">Manage your personal information</p>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mt-4 rounded-full"></div>
        </div>

        {/* Main Content */}
        <div className="bg-white/80 backdrop-blur-lg shadow-2xl rounded-3xl p-8 border border-white/20">
          {isLoadingSellerProfile ? (
            <Loader/>
          ) : sellerProfileError ? (
            <div className="text-center">
              <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl">
                {sellerProfileError}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Username */}
              <div className="group">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 shadow-lg">
                    <FaUser className="text-white text-sm" />
                  </div>
                  <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Username</p>
                </div>
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 hover:from-blue-50 hover:to-blue-100 transition-all duration-300 rounded-xl p-4 border border-gray-200 shadow-sm">
                  <div className="text-lg font-semibold text-gray-800">{user.username}</div>
                </div>
              </div>

              {/* Email */}
              {sellerProfile && sellerProfile.email && (
                <div className="group">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-lg bg-gradient-to-r from-green-500 to-green-600 shadow-lg">
                      <FaEnvelope className="text-white text-sm" />
                    </div>
                    <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Email Address</p>
                  </div>
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 hover:from-green-50 hover:to-green-100 transition-all duration-300 rounded-xl p-4 border border-gray-200 shadow-sm">
                    <div className="text-lg font-semibold text-gray-800">{sellerProfile.email}</div>
                  </div>
                </div>
              )}

              {sellerProfile && (
                <>
                  {/* Full Name */}
                  {sellerProfile.full_name && (
                    <div className="group">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 shadow-lg">
                          <FaIdCard className="text-white text-sm" />
                        </div>
                        <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Full Name</p>
                      </div>
                      <div className="bg-gradient-to-r from-gray-50 to-gray-100 hover:from-purple-50 hover:to-purple-100 transition-all duration-300 rounded-xl p-4 border border-gray-200 shadow-sm">
                        <div className="text-lg font-semibold text-gray-800">{sellerProfile.full_name}</div>
                      </div>
                    </div>
                  )}

                  {/* NIM */}
                  {sellerProfile.nim && (
                    <div className="group">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 shadow-lg">
                          <FaGraduationCap className="text-white text-sm" />
                        </div>
                        <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">NIM</p>
                      </div>
                      <div className="bg-gradient-to-r from-gray-50 to-gray-100 hover:from-orange-50 hover:to-orange-100 transition-all duration-300 rounded-xl p-4 border border-gray-200 shadow-sm">
                        <div className="text-lg font-semibold text-gray-800">{sellerProfile.nim}</div>
                      </div>
                    </div>
                  )}

                  {/* Jurusan */}
                  {sellerProfile.jurusan && (
                    <div className="group">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 rounded-lg bg-gradient-to-r from-red-500 to-red-600 shadow-lg">
                          <FaGraduationCap className="text-white text-sm" />
                        </div>
                        <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Major</p>
                      </div>
                      <div className="bg-gradient-to-r from-gray-50 to-gray-100 hover:from-red-50 hover:to-red-100 transition-all duration-300 rounded-xl p-4 border border-gray-200 shadow-sm">
                        <div className="text-lg font-semibold text-gray-800">{sellerProfile.jurusan}</div>
                      </div>
                    </div>
                  )}

                  {/* Phone Number */}
                  {sellerProfile.phone_number && (
                    <div className="group">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 rounded-lg bg-gradient-to-r from-teal-500 to-teal-600 shadow-lg">
                          <FaPhone className="text-white text-sm" />
                        </div>
                        <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Phone Number</p>
                      </div>
                      <div className="bg-gradient-to-r from-gray-50 to-gray-100 hover:from-teal-50 hover:to-teal-100 transition-all duration-300 rounded-xl border border-gray-200 shadow-sm">
                        {isEditingPhone ? (
                          <div className="p-4 flex items-center gap-3">
                            <input
                              type="text"
                              value={newPhoneNumber}
                              onChange={(e) => setNewPhoneNumber(e.target.value)}
                              className="flex-grow bg-white rounded-lg px-4 py-2 text-lg font-semibold text-gray-800 border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                            />
                            <button
                              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 py-2 rounded-lg font-medium shadow-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                              onClick={handleSavePhoneNumber}
                              disabled={isUpdating}
                            >
                              {isUpdating ? (
                                <div className="flex items-center gap-2">
                                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                  <span>Saving</span>
                                </div>
                              ) : (
                                <FaCheck />
                              )}
                            </button>
                            <button
                              className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white px-4 py-2 rounded-lg font-medium shadow-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                              onClick={handleCancelEdit}
                              disabled={isUpdating}
                            >
                              <FaTimes />
                            </button>
                          </div>
                        ) : (
                          <div className="p-4 flex items-center justify-between">
                            <div className="text-lg font-semibold text-gray-800">{sellerProfile.phone_number}</div>
                            {user?.role === 'seller' && (
                              <button
                                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white p-2 rounded-lg shadow-lg transition-all transform hover:scale-105 disabled:opacity-50"
                                onClick={handleEditPhoneNumber}
                                disabled={isUpdating}
                              >
                                <FaEdit className="text-sm" />
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Store Name */}
                  {sellerProfile.store_name && (
                    <div className="group">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 rounded-lg bg-gradient-to-r from-indigo-500 to-indigo-600 shadow-lg">
                          <FaStore className="text-white text-sm" />
                        </div>
                        <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Store Name</p>
                      </div>
                      <div className="bg-gradient-to-r from-gray-50 to-gray-100 hover:from-indigo-50 hover:to-indigo-100 transition-all duration-300 rounded-xl p-4 border border-gray-200 shadow-sm">
                        <div className="text-lg font-semibold text-gray-800">{sellerProfile.store_name}</div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;