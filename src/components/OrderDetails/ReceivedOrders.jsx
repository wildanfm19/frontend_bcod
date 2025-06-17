// Komponen untuk menampilkan Order Diterima (Sebagai Penjual)

import React, { useEffect, useState } from 'react';
import api from '../../api/api';
import Loader from '../shared/Loader';
import { FaExclamationTriangle } from 'react-icons/fa';
import Paginations from '../shared/Paginations';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const ReceivedOrders = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const navigate = useNavigate();

  const fetchReceivedOrders = async (page = 1) => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('User not authenticated.');
        setIsLoading(false);
        return;
      }

      const { data } = await api.get(`/seller/received-orders?page=${page}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (data.code === '000' && data.status === 'success' && data.data) {
        setOrders(data.data.orders);
        setPagination({
          currentPage: data.data.current_page,
          lastPage: data.data.last_page,
          total: data.data.total,
          perPage: data.data.per_page,
        });
      } else {
        setError(data.message || 'Failed to fetch received orders.');
        setOrders([]);
        setPagination(null);
      }
    } catch (error) {
      console.error('Error fetching received orders:', error);
      setError(error?.response?.data?.message || 'Failed to fetch received orders.');
      setOrders([]);
      setPagination(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReceivedOrders(currentPage);
  }, [currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const formatPrice = (price) => {
    return `Rp ${parseFloat(price)?.toLocaleString('id-ID')}`;
  };

  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const [year, month, day] = dateString.split('-');
      const date = new Date(year, month - 1, day);
      return date.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });
    } catch (e) {
      console.error("Error formatting date:", dateString, e);
      return dateString; // Return original if formatting fails
    }
  };

  // Helper function to get status ACC color class
  const getStatusAccColorClass = (statusAcc) => {
    switch (statusAcc) {
      case 'acc': return 'bg-green-200 text-green-800';
      case 'belum di acc': return 'bg-yellow-200 text-yellow-800';
      case 'di tolak': return 'bg-red-200 text-red-800';
      default: return 'bg-gray-200 text-gray-800';
    }
  };

  const handleOpenModal = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedOrder(null);
    setIsModalOpen(false);
  };

  // New handler to navigate to detail page
  const handleViewDetails = (order) => {
    navigate('/order-details', { state: { order } });
  };

  return (
    <div className="lg:px-14 sm:px-8 px-4 py-10 2xl:w-[90%] 2xl:mx-auto">
      <button 
        onClick={() => navigate(-1)} 
        className="mb-4 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition duration-200"
      >
        &larr; Back
      </button>
      <h1 className="text-2xl font-semibold mb-6 text-gray-800">Received Orders</h1>

      {/* Always render the table container and table structure */}
      <div className="overflow-x-auto shadow-lg rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No.</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Amount</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date/Time</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Approval Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer Phone</th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {/* Conditional rendering for table body content */}
              {isLoading && orders.length === 0 ? (
                <tr>
                  <td colSpan="10" className="px-6 py-4 text-center text-sm text-gray-500">Loading orders...</td>
                </tr>
              ) : error && orders.length === 0 ? (
                <tr>
                  <td colSpan="10" className="px-6 py-4 text-center text-sm text-red-500">{error}</td>
                </tr>
              ) : orders && orders.length > 0 ? (
                  orders.map((order, index) => {
                    const orderNumber = ((pagination?.currentPage || 1) - 1) * (pagination?.perPage || 0) + index + 1;
                    return (
                      <tr key={order.order_id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{isNaN(orderNumber) ? '' : orderNumber}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.order_id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.customer?.username || order.customer?.full_name || 'N/A'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatPrice(order.total_amount)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${order.status === 'success' ? 'bg-green-100 text-green-800' : order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.lokasi || 'N/A'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{`${formatDate(order.tanggal_pesan || '')} ${order.jam_pesan ? order.jam_pesan.substring(0, 5) : ''}`}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusAccColorClass(order.status_acc)}`}>
                            {order.status_acc || 'No info'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {order.customer?.phone_number ? (
                            <a 
                              href={`https://wa.me/${order.customer.phone_number.replace(/[^0-9]/g, '')}`} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-900"
                            >
                              {order.customer.phone_number}
                            </a>
                          ) : (
                            'N/A'
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                          <button className="text-indigo-600 hover:text-indigo-900" onClick={() => handleViewDetails(order)}>View Details</button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="10" className="px-6 py-4 text-center text-sm text-gray-500">No received orders found.</td>
                  </tr>
                )}
              </tbody>
          </table>
        </div>
      

      {pagination && orders.length > 0 && (
        <div className="flex justify-center pt-10">
          <Paginations
            numberOfPage={pagination.lastPage}
            totalPoducts={pagination.total}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
};

export default ReceivedOrders;