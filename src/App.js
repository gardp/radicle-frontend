import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import HomePage from './components/HomePage';
import Contact from './components/Contact';
import AboutUs from './components/AboutUs';
import './App.css';
import CustomNavbar from './components/CustomNavbar';
import Catalog from './components/Catalog';
import PricingTable from './components/PricingTable';
import { CartProvider } from './context/cart/CartProvider';
import Checkout from './components/checkout/Checkout';

function App() {
  return (
<>
    <CartProvider>
      <Router>
        <div className="app-container">
        <CustomNavbar />
          {/* <Container className="app-content-container"> */}
            <main className="main-content">
              <Routes>
              <Route path="/" exact element={<HomePage />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/catalog" element={<Catalog />} />
              <Route path="/pricing" element={<PricingTable />} />
              <Route path="/checkout" element={<Checkout />} />
                {/* ADD this <Route path="*" element={<NotFound />} /> */}
                {/* Always start with the most specific routes first then move to the more general ones... */}
                {/* Add more routes as needed */}
              </Routes>
            </main>
          {/* </Container> */}
          {/* <PricingTable/> */}
        </div>
      </Router>
    </CartProvider>
    </>
  );
}

export default App;