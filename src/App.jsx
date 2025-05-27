import React from 'react'; // Needed for React.Fragment
import './App.css';

import Home from './components/home/Home';
import Products from './components/products/Product';
import Navbar from './components/shared/Navbar';
import About from './components/About';
import Contact from './components/Contact';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { Toaster } from 'react-hot-toast'; // Needed to show toast notifications
import Cart from './components/cart/Cart';
import LogIn from './components/auth/Login';
import Register from './components/auth/Register';
import PrivateRoute from './components/PrivateRoute';
import ProfilePage from './components/Profile';
import Store from './components/Store/Store';


function App() {
  return(
    <React.Fragment>
    <Router>
      <Navbar/>
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/products' element={<Products/>}/>
          <Route path='/about' element={<About/>}/>
          <Route path='/contact' element={<Contact/>}/>
          <Route path='/cart' element={<Cart/>}/>
          <Route path='/profile' element={<ProfilePage/>}/>
          <Route path='/store' element={<Store/>}/>
          
          
          <Route path='/' element={<PrivateRoute publicPage />}>
            <Route path='/login' element={<LogIn/>}/>
            <Route path='/register' element={<Register/>}/>
          </Route>

        </Routes>
    </Router>
    <Toaster position= 'bottom-center'/>
    </React.Fragment>
  )
}

export default App;
