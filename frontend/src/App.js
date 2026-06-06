import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Welcome from './pages/Welcome';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Confirmation from './pages/Confirmation';
import Deals from './pages/Deals';
import TrackOrder from './pages/TrackOrder';
import Contact from './pages/Contact';

const Layout = () => {
  const location = useLocation();
  const isWelcome = location.pathname === '/';

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#13133a',
            color: '#fff',
            border: '1px solid rgba(245,166,35,0.2)',
            borderRadius: '12px',
            fontSize: '14px',
            fontWeight: '600',
          },
          success: { iconTheme: { primary: '#f5a623', secondary: '#07071a' } },
        }}
      />
      {!isWelcome && <Navbar />}
      <Routes>
        <Route path="/"                       element={<Welcome />} />
        <Route path="/home"                   element={<Home />} />
        <Route path="/shop"                   element={<Shop />} />
        <Route path="/product/:id"            element={<ProductDetail />} />
        <Route path="/cart"                   element={<Cart />} />
        <Route path="/checkout"               element={<Checkout />} />
        <Route path="/confirmation/:orderId"  element={<Confirmation />} />
        <Route path="/deals"                  element={<Deals />} />
        <Route path="/track"                  element={<TrackOrder />} />
        <Route path="/contact"                element={<Contact />} />
      </Routes>
    </>
  );
};

function App() {
  return (
    <CartProvider>
      <Router>
        <Layout />
      </Router>
    </CartProvider>
  );
}

export default App;
