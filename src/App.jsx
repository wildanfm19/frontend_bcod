import './App.css'
import Home from './components/home/Home';
import Products from './components/products/Product'
import { BrowserRouter as Router , Routes ,Route } from 'react-router-dom';
import Navbar from './components/shared/Navbar';
function App() {
  return(
    <Router>
      <Navbar/>
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/products' element={<Products/>}/>
        </Routes>
    </Router>
  )
}

export default App;
