import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Box, Typography, Divider, Paper, Grid, Select, MenuItem, FormControl, InputLabel, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { FaExclamationTriangle, FaArrowLeft, FaWhatsapp, FaUser, FaShoppingBag, FaCalendarAlt, FaMapMarkerAlt } from 'react-icons/fa';
import { formatPrice } from '../../utils/formatPrice';
import Loader from '../shared/Loader';
import api from '../../api/api';
import toast from 'react-hot-toast';

// Simple Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to an error reporting service
    console.error("Uncaught error in OrderHistoryDetailPage:", error, errorInfo);
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="flex justify-center items-center h-[calc(100vh-64px)] w-full text-center">
          <FaExclamationTriangle className="text-red-500 text-3xl mr-2" />
          <span className="text-red-500 text-lg font-medium">Something went wrong displaying order details.</span>
           {/* Optional: Display error details in development */}
          {process.env.NODE_ENV === 'development' && (
            <details style={{ whiteSpace: 'pre-wrap', margin: '1em', padding: '1em', border: '1px solid #ccc' }}>
              <summary>Error Details</summary>
              {this.state.error && this.state.error.toString()}
              <br />
              {this.state.errorInfo?.componentStack}
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

const OrderHistoryDetailPage = () => {
  const navigate = useNavigate();
  const { orderId } = useParams(); // Get orderId from URL parameters
  const [order, setOrder] = useState(null);
  const [error, setError] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingStatus, setPendingStatus] = useState(null);
  const [isLoadingOrder, setIsLoadingOrder] = useState(true); // Add loading state for initial fetch

  // Get order ID from location state or URL params if necessary
  // const orderId = location.state?.order?.order_id; // Removed - now using useParams()

  // Fetch order details from API on component mount or if orderId changes
  useEffect(() => {
    const fetchOrderDetail = async () => {
      if (!orderId) {
        setError('Order ID not provided in URL.'); // Updated error message
        setIsLoadingOrder(false);
        return;
      }
      setIsLoadingOrder(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('User not authenticated.');
          setIsLoadingOrder(false);
          return;
        }

        // Fetch order details using orderId
        const { data } = await api.get(`/seller/orders/${orderId}`, { // Use the correct endpoint for Order History
          headers: { Authorization: `Bearer ${token}` },
        });

        if (data.code === '000' && data.status === 'success' && data.data) {
          setOrder(data.data); // Set the fetched order data
        } else {
          setError(data.message || 'Failed to fetch order details.');
          setOrder(null);
        }
      } catch (error) {
        console.error('Error fetching order details:', error);
        setError(error?.response?.data?.message || 'Failed to fetch order details.');
        setOrder(null);
      } finally {
        setIsLoadingOrder(false);
      }
    };

    fetchOrderDetail();

  }, [orderId]); // Re-run effect if orderId changes (though it's likely static for this page)

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

  // Order History does not have these update status functions
  // const handleStatusChange = async (newStatus) => { ... };
  // const updateOrderStatus = async (newStatus) => { ... };
  // const handleConfirmStatusChange = () => { ... };
  // const handleStatusAccChange = async (newStatusAcc) => { ... };


  if (error) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-64px)] w-full text-center">
        <FaExclamationTriangle className="text-red-500 text-3xl mr-2" />
        <span className="text-red-500 text-lg font-medium">{error}</span>
      </div>
    );
  }

  if (!order || isLoadingOrder) { // Check both order state and loading state
    return <Loader />;
  }

  // For Order History, the other party is the seller, not the customer
  const customerOrSeller = order.seller; // In Order History, we are the buyer, the other party is the seller
  const customerOrSellerLabel = 'Seller'; // Translated Text
  const customerOrSellerName = customerOrSeller?.full_name || customerOrSeller?.store_name || customerOrSeller?.phone_number || 'N/A'; // Use full_name or store_name for seller

  const getStatusColorClass = (status) => {
    switch (status) {
      case 'success': return 'bg-green-200 text-green-800';
      case 'pending': return 'bg-yellow-200 text-yellow-800';
      case 'failed':
      case 'expired':
      case 'cancel': return 'bg-red-200 text-red-800';
      default: return 'bg-gray-200 text-gray-800';
    }
  };

  // Status ACC is specific to received orders (seller view), remove or adjust if needed for buyer view
  const getStatusAccColorClass = (statusAcc) => {
    switch (statusAcc) {
      case 'sudah di acc': return 'bg-green-200 text-green-800';
      case 'belum di acc': return 'bg-yellow-200 text-yellow-800';
      default: return 'bg-gray-200 text-gray-800';
    }
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50">
        <div className="lg:px-14 sm:px-8 px-4 py-10 2xl:w-[90%] 2xl:mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Button
              onClick={() => navigate(-1)}
              startIcon={<FaArrowLeft />}
              className="bg-white hover:bg-gray-100 text-gray-700 shadow-sm"
            >
              Back {/* Translated Text */}
            </Button>
            <Typography variant="h4" className="font-bold text-gray-800">
              Order Details {/* Translated Text */}
            </Typography>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              ID: {order.order_id}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Order Information */}
            <div className="lg:col-span-2 space-y-6">
              <Paper elevation={0} className="p-6 bg-white rounded-xl shadow-sm">
                <Typography variant="h6" className="font-semibold mb-4 text-gray-800">
                  Order Information {/* Translated Text */}
                </Typography>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <FaShoppingBag className="text-gray-600 text-xl" />
                      <Typography className="text-gray-700 font-medium">Order ID:</Typography> {/* Translated Text */}
                      <Typography className="text-gray-700">{order.order_id}</Typography>
                    </div>
                    <div className="flex items-center gap-3">
                      <FaCalendarAlt className="text-gray-600 text-xl" />
                      <Typography className="text-gray-700 font-medium">Order Date/Time:</Typography> {/* Translated Text */}
                      <Typography className="text-gray-700">{`${formatDate(order.tanggal_pesan || '')} ${order.jam_pesan ? order.jam_pesan.substring(0, 5) : ''}`}</Typography>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <FaMapMarkerAlt className="text-gray-600 text-xl" />
                      <Typography className="text-gray-700 font-medium">Location:</Typography> {/* Translated Text */}
                      <Typography className="text-gray-700">{order.lokasi || 'N/A'}</Typography>
                    </div>
                    {order.whatsapp_link && ( // Keep whatsapp link if present in API response
                      <div className="flex items-center gap-3">
                        <FaWhatsapp className="text-gray-400" />
                        <div>
                          <Typography className="text-sm text-gray-500">WhatsApp</Typography> {/* Translated Text */}
                          <a
                            href={order.whatsapp_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 font-semibold"
                          >
                            Contact {/* Translated Text */}
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </Paper>

              {/* Order Items */}
              <Paper elevation={0} className="p-6 bg-white rounded-xl shadow-sm">
                <Typography variant="h6" className="font-semibold mb-4 text-gray-800">
                  Order Items {/* Translated Text */}
                </Typography>
                {order.order_items && order.order_items.length > 0 ? (
                  <div className="space-y-4">
                    {order.order_items.map((item, index) => (
                      <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                        <div className="w-24 h-24 flex-shrink-0"> {/* Adjusted height */}
                          {item.galleries?.[0]?.image_url ? (
                            <img
                              src={item.galleries[0].image_url}
                              alt={item.product_name}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          ) : item.image_url ? (
                            <img
                              src={item.image_url}
                              alt={item.product_name}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
                              <span className="text-gray-400">No Image</span>
                            </div>
                          )}
                        </div>
                        <div className="flex-grow flex flex-col justify-center">
                          <Typography className="font-semibold text-gray-800">{item.product_name || 'N/A'}</Typography>
                          <div className="mt-2 space-y-1"> {/* Adjusted margin */}
                            <Typography className="text-sm text-gray-800">
                              Quantity: {item.quantity}
                            </Typography>
                            <Typography className="text-sm text-gray-800">
                              Price: {formatPrice(item.price)}
                            </Typography>
                            <Typography className="font-semibold text-gray-800">
                              Subtotal: {formatPrice(item.subtotal)}
                            </Typography>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <Typography className="text-gray-500">No items found for this order.</Typography>
                )}
              </Paper>
            </div>

            {/* Side Information */}
            <div className="space-y-6">
              {/* Status Updates - REMOVED for Order History */} 
              {/* Customer/Seller Information */}
              <Paper elevation={0} className="p-6 bg-white rounded-xl shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <FaUser className="text-gray-400" />
                  <Typography variant="h6" className="font-semibold text-gray-800">
                    {customerOrSellerLabel} Information
                  </Typography>
                </div>
                <div className="space-y-3">
                  <div>
                    <Typography className="text-sm text-gray-500">Name/Store</Typography>
                    <Typography className="font-semibold">{customerOrSellerName}</Typography>
                  </div>
                  {/* In Order History, the other party is the seller, so show seller's phone */}
                  {customerOrSeller?.phone_number && (
                    <div>
                      <Typography className="text-sm text-gray-500">Phone</Typography>
                      <a
                        href={`https://wa.me/${customerOrSeller.phone_number.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 font-semibold"
                      >
                        {customerOrSeller.phone_number}
                      </a>
                    </div>
                  )}
                  {/* Email might not be available for seller in this endpoint, keep if needed */}
                  {customerOrSeller?.email && (
                     <div>
                       <Typography className="text-sm text-gray-500">Email</Typography>
                       <Typography className="font-semibold">{customerOrSeller.email}</Typography>
                     </div>
                   )}
                </div>
              </Paper>

              {/* Display Order Status */}
                <Paper elevation={0} className="p-6 bg-white rounded-xl shadow-sm">
                  <Typography variant="h6" className="font-semibold mb-4 text-gray-800">Order Status</Typography>
                  <div className="space-y-3">
                      <div>
                          <Typography className="text-sm text-gray-500">Status</Typography>
                          <Typography className={`font-semibold px-2 py-1 rounded-full inline-block ${getStatusColorClass(order.status)}`}>
                              {order.status}
                          </Typography>
                      </div>
                      {/* Removed Status ACC display for buyer view */}
                      {/*
                       <div>
                          <Typography className="text-sm text-gray-500">Status ACC</Typography>
                          <Typography className={`font-semibold px-2 py-1 rounded-full inline-block ${getStatusAccColorClass(order.status_acc)}`}>
                              {order.status_acc || 'No info'}
                          </Typography>
                      </div>
                      */}
                  </div>
              </Paper>


            </div>
          </div>
        </div>

        {/* Remove Confirmation Dialog as status updates are removed */}
        {/*
        <Dialog
          open={showConfirmDialog}
          onClose={() => setShowConfirmDialog(false)}
          PaperProps={{
            className: "rounded-xl"
          }}
        >
          <DialogTitle className="font-semibold text-gray-800">
            Confirm Status Change
          </DialogTitle>
          <DialogContent>
            <div className="py-4">
              <Typography className="text-gray-600 mb-4">
                Are you sure you want to mark this order as successful?
              </Typography>
              <Typography className="text-gray-600 font-medium">
                Please verify that:
              </Typography>
              <ul className="list-disc list-inside mt-2 space-y-2 text-gray-600">
                <li>Payment has been received</li>
                <li>Order has been delivered to the customer</li>
              </ul>
              <Typography className="text-red-500 mt-4 font-medium">
                Note: This action cannot be undone once confirmed.
              </Typography>
            </div>
          </DialogContent>
          <DialogActions className="p-4">
            <Button
              onClick={() => setShowConfirmDialog(false)}
              className="text-gray-600 hover:bg-gray-100"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmStatusChange}
              className={`bg-sky-100 text-white hover:bg-sky-300 active:bg-sky-200 px-4 py-2 rounded transition-all duration-150 text-sm focus:outline-none ${ 
                isUpdating ? 'bg-sky-200 cursor-not-allowed' : ''
              }`}
              disabled={isUpdating}
            >
              {isUpdating ? 'Updating...' : 'Confirm'}
            </Button>
          </DialogActions>
        </Dialog>
        */}
      </div>
    </ErrorBoundary>
  );
};

export default OrderHistoryDetailPage;