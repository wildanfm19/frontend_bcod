import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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
    console.error("Uncaught error in OrderDetailPage:", error, errorInfo);
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

const OrderDetailPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingStatus, setPendingStatus] = useState(null);

  useEffect(() => {
    if (location.state && location.state.order) {
      setOrder(location.state.order);
    } else {
      setError('Order data not found.');
    }
  }, [location.state]);

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

  const handleStatusChange = async (newStatus) => {
    if (!order || isUpdating) return;

    // Check if status_acc is 'acc' before allowing status change
    if (order.status_acc !== 'acc') {
      toast.error('Please accept the order first (change status ACC to "Acc") before updating the status');
      return;
    }

    // If changing to success, show confirmation dialog
    if (newStatus === 'success') {
      setPendingStatus(newStatus);
      setShowConfirmDialog(true);
      return;
    }

    await updateOrderStatus(newStatus);
  };

  const updateOrderStatus = async (newStatus) => {
    setIsUpdating(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('User not authenticated');
        return;
      }

      const { data } = await api.put(
        `/seller/orders/${order.order_id}/status`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (data.code === '000') {
        setOrder(prev => ({ ...prev, status: newStatus }));
        toast.success('Order status updated successfully');
      } else {
        toast.error(data.message || 'Failed to update order status');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      if (error?.response?.data?.code === '422') {
        if (error?.response?.data?.message?.includes('must be accepted')) {
          toast.error('Please accept the order first (change status ACC to "Acc") before updating the status');
        } else if (error?.response?.data?.message?.includes('successful order')) {
          toast.error('Cannot change status of a successful order');
        } else {
          toast.error(error?.response?.data?.message || 'Failed to update order status');
        }
      } else {
        toast.error(error?.response?.data?.message || 'Failed to update order status');
      }
    } finally {
      setIsUpdating(false);
      setShowConfirmDialog(false);
      setPendingStatus(null);
    }
  };

  const handleConfirmStatusChange = () => {
    if (pendingStatus) {
      updateOrderStatus(pendingStatus);
    }
  };

  const handleStatusAccChange = async (newStatusAcc) => {
    if (!order || isUpdating) return;
    
    setIsUpdating(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('User not authenticated');
        return;
      }

      const { data } = await api.put(
        `/seller/orders/${order.order_id}/status-acc`,
        { status_acc: newStatusAcc },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (data.code === '000') {
        setOrder(prev => ({ ...prev, status_acc: newStatusAcc }));
        toast.success('Order status ACC updated successfully');
      } else {
        toast.error(data.message || 'Failed to update order status ACC');
      }
    } catch (error) {
      console.error('Error updating order status ACC:', error);
      toast.error(error?.response?.data?.message || 'Failed to update order status ACC');
    } finally {
      setIsUpdating(false);
    }
  };

  if (error) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-64px)] w-full text-center">
        <FaExclamationTriangle className="text-red-500 text-3xl mr-2" />
        <span className="text-red-500 text-lg font-medium">{error}</span>
      </div>
    );
  }

  if (!order) {
    return <Loader />;
  }

  const isReceivedOrder = order.customer ? true : false; // Determine order type
  const customerOrSeller = isReceivedOrder ? order.customer : order.seller;
  const customerOrSellerLabel = isReceivedOrder ? 'Customer' : 'Seller';
  const customerOrSellerName = isReceivedOrder
    ? customerOrSeller?.username || customerOrSeller?.full_name || customerOrSeller?.store_name || customerOrSeller?.phone_number || 'N/A'
    : customerOrSeller?.full_name || customerOrSeller?.store_name || customerOrSeller?.phone_number || 'N/A'; // Use full_name for seller

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
                    {order.whatsapp_link && (
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
                        <div className="w-24 h-24 flex-shrink-0">
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
                          <div className="mt-2 space-y-1">
                            <Typography className="text-sm text-gray-500">
                              Quantity: {item.quantity}
                            </Typography>
                            <Typography className="text-sm text-gray-500">
                              Price: <span className="font-semibold text-gray-800">{formatPrice(item.price)}</span>
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
              {/* Status Updates */}
              {isReceivedOrder && (
                <Paper elevation={0} className="p-6 bg-white rounded-xl shadow-sm">
                  <Typography variant="h6" className="font-semibold mb-4 text-gray-800">
                    Update Status
                  </Typography>
                  <div className="space-y-4">
                    <FormControl fullWidth>
                      <InputLabel>Order Status</InputLabel>
                      <Select
                        value={order.status}
                        label="Order Status"
                        onChange={(e) => handleStatusChange(e.target.value)}
                        disabled={isUpdating}
                        className="bg-gray-50"
                      >
                        <MenuItem value="pending">Pending</MenuItem>
                        <MenuItem value="success">Success</MenuItem>
                        <MenuItem value="cancel">Cancel</MenuItem>
                      </Select>
                    </FormControl>
                    <FormControl fullWidth>
                      <InputLabel>Status ACC</InputLabel>
                      <Select
                        value={order.status_acc || 'belum di acc'}
                        label="Status ACC"
                        onChange={(e) => handleStatusAccChange(e.target.value)}
                        disabled={isUpdating}
                        className="bg-gray-50"
                      >
                        <MenuItem value="acc">Acc</MenuItem>
                        <MenuItem value="belum di acc">Belum di Acc</MenuItem>
                        <MenuItem value="di tolak">Di Tolak</MenuItem>
                      </Select>
                    </FormControl>
                  </div>
                </Paper>
              )}

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
                  {isReceivedOrder && order.customer?.email && (
                    <div>
                      <Typography className="text-sm text-gray-500">Email</Typography>
                      <Typography className="font-semibold">{order.customer.email}</Typography>
                    </div>
                  )}
                  {isReceivedOrder && order.customer?.phone_number && (
                    <div>
                      <Typography className="text-sm text-gray-500">Phone</Typography>
                      <a
                        href={`https://wa.me/${order.customer.phone_number.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 font-semibold"
                      >
                        {order.customer.phone_number}
                      </a>
                    </div>
                  )}
                  {!isReceivedOrder && order.seller?.phone_number && (
                    <div>
                      <Typography className="text-sm text-gray-500">Seller Phone</Typography>
                      <a 
                        href={`https://wa.me/${order.seller.phone_number.replace(/[^0-9]/g, '')}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 font-semibold"
                      >
                        {order.seller.phone_number}
                      </a>
                    </div>
                  )}
                </div>
              </Paper>
            </div>
          </div>
        </div>

        {/* Add Confirmation Dialog */}
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
      </div>
    </ErrorBoundary>
  );
};

export default OrderDetailPage;