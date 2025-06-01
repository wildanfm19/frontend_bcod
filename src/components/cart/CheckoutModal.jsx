import React, { useState } from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import toast from 'react-hot-toast';
import api from '../../api/api';

const lokasiOptions = [
  { value: 'kantin payung', label: 'Kantin Payung' },
  { value: 'LKC', label: 'LKC' },
  { value: 'Depan Admisi', label: 'Depan Admisi' },
];

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 350,
  bgcolor: 'background.paper',
  borderRadius: 3,
  boxShadow: 24,
  p: 4,
};

const CheckoutModal = ({ open, handleClose, onCheckoutSuccess }) => {
  const [lokasi, setLokasi] = useState('kantin payung');
  const [tanggal, setTanggal] = useState(() => new Date().toISOString().slice(0, 10));
  const [jam, setJam] = useState(() => {
    const now = new Date();
    return now.toTimeString().slice(0, 5);
  });
  const [loading, setLoading] = useState(false);
  const [orderInfo, setOrderInfo] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!lokasi || !tanggal || !jam) {
      toast.error('All fields are required!');
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.post('/checkout', {
        lokasi,
        tanggal_pesan: tanggal,
        jam_pesan: jam,
      });
      if (data.code === '000') {
        toast.success(data.message || 'Checkout successful!', { icon: '✅', style: { background: '#22c55e', color: '#fff' } });
        setOrderInfo(data.data);
        if (onCheckoutSuccess) onCheckoutSuccess(data.data);
      } else {
        toast.error(data.message || 'Checkout failed');
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Checkout failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={handleClose} aria-labelledby="checkout-modal-title">
      <Box sx={style}>
        <h2 className="text-xl font-bold mb-4" id="checkout-modal-title">Checkout</h2>
        {orderInfo ? (
          <div className="space-y-3">
            <div className="text-green-600 font-semibold">Order created successfully!</div>
            <div><b>Order ID:</b> {orderInfo.order_id}</div>
            <div><b>Total:</b> Rp {orderInfo.total_amount?.toLocaleString('id-ID')}</div>
            <div><b>Location:</b> {orderInfo.lokasi}</div>
            <div><b>Date:</b> {orderInfo.tanggal_pesan}</div>
            <div><b>Time:</b> {orderInfo.jam_pesan}</div>
            <div><b>Status:</b> {orderInfo.status}</div>
            <div><b>Seller WA:</b> <a href={orderInfo.whatsapp_link} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Chat Seller</a></div>
            <Button 
              fullWidth 
              onClick={handleClose}
              className="bg-gray-800 text-white hover:bg-gray-900 active:bg-gray-700 transition-all duration-150 text-sm focus:outline-none"
            >
              Close
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <TextField
              select
              label="Location"
              value={lokasi}
              onChange={e => setLokasi(e.target.value)}
              fullWidth
              required
            >
              {lokasiOptions.map(opt => (
                <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
              ))}
            </TextField>
            <TextField
              label="Order Date"
              type="date"
              value={tanggal}
              onChange={e => setTanggal(e.target.value)}
              fullWidth
              required
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Order Time"
              type="time"
              value={jam}
              onChange={e => setJam(e.target.value)}
              fullWidth
              required
              InputLabelProps={{ shrink: true }}
            />
            <Button
              type="submit"
              fullWidth
              disabled={loading}
              className="bg-gray-800 text-white hover:bg-gray-900 active:bg-gray-700 transition-all duration-150 text-sm focus:outline-none"
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Confirm Checkout'}
            </Button>
          </form>
        )}
      </Box>
    </Modal>
  );
};

export default CheckoutModal; 