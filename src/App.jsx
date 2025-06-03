import React, { useEffect } from 'react';
import './App.css';

import Home from './components/home/Home';
import Products from './components/products/Product';
import Navbar from './components/shared/Navbar';
import About from './components/About';
import Contact from './components/Contact';

import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { getProfile } from './store/actions';

import { Toaster } from 'react-hot-toast'; // Needed to show toast notifications
import Cart from './components/cart/Cart';
import LogIn from './components/auth/LogIn';
import Register from './components/auth/Register';
import ProfilePage from './components/Profile';
import Store from './components/Store/Store';
import ProtectedRoute from './components/ProtectedRoute';
import Checkout from './components/checkout/Checkout';
import PlacedOrders from './components/OrderDetails/PlacedOrders';
import ReceivedOrders from './components/OrderDetails/ReceivedOrders';
import OrderDetailPage from './components/OrderDetails/OrderDetailPage';
import Layout from './components/shared/Layout';

function AppRoutes() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token && location.pathname !== '/login' && location.pathname !== '/register') {
      navigate('/login', { replace: true });
    }
    // Ambil user dari localStorage jika ada
    const user = localStorage.getItem('user');
    if (token && user) {
      dispatch({ type: "LOGIN_USER", payload: { user: JSON.parse(user) } });
    } else if (token) {
      dispatch(getProfile());
    }
  }, [location, navigate, dispatch]);

  return (
    <>
      <Layout>
      <Routes>
        {/* Public routes */}
        <Route path='/login' element={<LogIn/>}/>
        <Route path='/register' element={<Register/>}/>
        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route path='/' element={<Home/>}/>
          <Route path='/products' element={<Products/>}/>
          <Route path='/about' element={<About/>}/>
          <Route path='/contact' element={<Contact/>}/>
          <Route path='/cart' element={<Cart/>}/>
          <Route path='/checkout' element={<Checkout/>}/>
          <Route path='/profile' element={<ProfilePage/>}/>
          <Route path='/profile/order' element={<PlacedOrders/>}/>
          <Route path='/store' element={<Store/>}/>
          <Route path='/store/received-orders' element={<ReceivedOrders/>}/>
          <Route path='/order-details' element={<OrderDetailPage/>}/>
        </Route>
      </Routes>
      </Layout>
      <Toaster position='bottom-center'/>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;
