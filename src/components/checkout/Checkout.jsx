import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import toast from 'react-hot-toast';
import api from '../../api/api';

const lokasiOptions = [
  { value: 'Kantin payung', label: 'Kantin Payung' },
  { value: 'LKC', label: 'LKC' },
  { value: 'Depan Admisi', label: 'Depan Admisi' },
];

// Generate jam options dari 10:00 sampai 17:00
const jamOptions = Array.from({ length: 8 }, (_, i) => {
  const hour = i + 10;
  return { value: `${hour.toString().padStart(2, '0')}:00`, label: `${hour}:00` };
});

const Checkout = () => {
  const navigate = useNavigate();
  const [lokasi, setLokasi] = useState('Kantin payung');
  const [tanggal, setTanggal] = useState(() => new Date().toISOString().slice(0, 10));
  const [jam, setJam] = useState('10:00');
  const [loading, setLoading] = useState(false);
  const [orderInfo, setOrderInfo] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!lokasi || !tanggal || !jam) {
      toast.error('Semua field wajib diisi!');
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
        toast.success(data.message || 'Checkout berhasil!', { icon: '✅', style: { background: '#22c55e', color: '#fff' } });
        setOrderInfo(data.data);
      } else {
        toast.error(data.message || 'Checkout gagal');
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Checkout gagal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <h1 className="text-2xl font-bold mb-6 text-center">Checkout</h1>
      {orderInfo ? (
        <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
          <div className="text-green-600 font-semibold text-center">Order created successfully!</div>
          <div><b>Order ID:</b> {orderInfo.order_id}</div>
          <div><b>Total:</b> Rp {orderInfo.total_amount?.toLocaleString('id-ID')}</div>
          <div><b>Lokasi:</b> {orderInfo.lokasi}</div>
          <div><b>Tanggal:</b> {orderInfo.tanggal_pesan}</div>
          <div><b>Jam:</b> {orderInfo.jam_pesan}</div>
          <div><b>Status:</b> {orderInfo.status}</div>
          <div><b>Screen Shoot this and send to seller :</b> <a href={orderInfo.whatsapp_link} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Chat Seller</a></div>
         
          <Button fullWidth variant="contained" color="primary" onClick={() => navigate('/cart')}>Kembali ke Cart</Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-4">
          <TextField
            select
            label="Lokasi"
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
            label="Tanggal Pesan"
            type="date"
            value={tanggal}
            onChange={e => setTanggal(e.target.value)}
            fullWidth
            required
            InputLabelProps={{ shrink: true }}
            inputProps={{ min: new Date().toISOString().slice(0, 10) }}
          />
          <TextField
            select
            label="Jam Pesan"
            value={jam}
            onChange={e => setJam(e.target.value)}
            fullWidth
            required
          >
            {jamOptions.map(opt => (
              <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
            ))}
          </TextField>
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
            className="bg-gray-800 text-white hover:bg-gray-900 active:bg-gray-700 transition-all duration-150 text-sm focus:outline-none"
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Confirm Checkout'}
          </Button>
        </form>
      )}
    </div>
  );
};

export default Checkout; 