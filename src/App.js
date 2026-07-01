import React, { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loadCartFromStorageThunk } from './store/slices/cartSlice';
import './App.css';
import CustomNavbar from './components/CustomNavbar';
import TrackPricingTable from './components/TrackPricingTable';
import TrackDownloadModal from './components/trackDownloadModal';
import LicenseAgreement from './components/LicenseAgreement';

// Route-level code splitting: each page is loaded in its own chunk so the
// initial bundle stays small (better LCP/INP — Core Web Vitals ranking signals).
const HomePage = lazy(() => import('./components/HomePage'));
const Contact = lazy(() => import('./components/Contact'));
const AboutUs = lazy(() => import('./components/AboutUs'));
const Catalog = lazy(() => import('./components/Catalog'));
const Checkout = lazy(() => import('./components/checkout/Checkout'));
const OrderConfirmation = lazy(() => import('./components/checkout/OrderConfirmation'));
const MusicLicensing = lazy(() => import('./components/MusicLicensing'));
const NotFound = lazy(() => import('./components/NotFound'));

function App() {
  const dispatch = useDispatch();
  
  // Load cart data from localStorage when app initializes
  useEffect(() => {
    dispatch(loadCartFromStorageThunk());
    console.log("cart loaded from storage");
  }, [dispatch]);
  
  return (
      <Router>
        <div className="app-container">
        <CustomNavbar />
            <main className="main-content">
              <Suspense fallback={<div className="route-loading" aria-busy="true">Loading…</div>}>
                <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/about" element={<AboutUs />} />
                <Route path="/catalog" element={<Catalog />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/order-confirmation" element={<OrderConfirmation />} />
                <Route path="/licensing" element={<MusicLicensing/>} />
                <Route path="*" element={<NotFound />} />
                  {/* Always start with the most specific routes first then move to the more general ones... */}
                  {/* Add more routes as needed */}
                </Routes>
              </Suspense>
            </main>
          <TrackPricingTable/>
          <TrackDownloadModal/>
          <LicenseAgreement/>
        </div>
      </Router>
  );
}

export default App;