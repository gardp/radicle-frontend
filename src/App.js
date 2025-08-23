import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import HomePage from './components/HomePage';
import Contact from './components/Contact';
import AboutUs from './components/AboutUs';
import './App.css';
import CustomNavbar from './components/CustomNavbar';
import Catalog from './components/Catalog';
import Checkout from './components/checkout/Checkout';
import TrackPricingTable from './components/TrackPricingTable';
import LicenseAgreement from './components/LicenseAgreement';

function App() {
  return (
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
              <Route path="/checkout" element={<Checkout />} />
                {/* ADD this <Route path="*" element={<NotFound />} /> */}
                {/* Always start with the most specific routes first then move to the more general ones... */}
                {/* Add more routes as needed */}
              </Routes>
            </main>
          {/* </Container> */}
          <TrackPricingTable/>
          <LicenseAgreement/>
        </div>
      </Router>
  );
}

export default App;