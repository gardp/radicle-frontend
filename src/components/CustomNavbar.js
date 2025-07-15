import React, { useState, useEffect } from 'react';
// import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import '../styles/Navbar.css';
import '../styles/Cart.css';
import '../styles/SkeuomorphicButtons.css';
import CartPreview from './cart/CartPreview';
import useCart from '../hooks/useCart';

const CustomNavbar = () => {
  const [cartPreviewOpen, setCartPreviewOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { totalItems } = useCart();
  const location = useLocation(); // Get current location to highlight active link
  
  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 100) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  const toggleCartPreview = () => {
    setCartPreviewOpen(prevState => !prevState);
  };
  
  const closeCartPreview = () => {
    setCartPreviewOpen(false);
  };
  
  // Helper function to determine if a link is active
  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };
  
  return (
    <Navbar fixed="top" expand="lg" className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <Container>
        <Navbar.Brand as={Link} to="/"><img src="/assets/images/Radicle-Sound_white.svg" alt="Radicle Sound" className="navbar-logo" /></Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="navbar-nav ms-auto">
            <Nav.Link as={Link} to="/" className={isActive('/')}>HOME</Nav.Link>
            <Nav.Link as={Link} to="/catalog" className={isActive('/catalog')}>CATALOG</Nav.Link>
            <Nav.Link as={Link} to="/licensing" className={isActive('/licensing')}>MUSIC LICENSING</Nav.Link>
            {/* <Nav.Link as={Link} to="/services">STUDIO SERVICES</Nav.Link> */}
            <Nav.Link as={Link} to="/about" className={isActive('/about')}>ABOUT</Nav.Link>
            <Nav.Link as={Link} to="/contact" className={isActive('/contact')}>CONTACT</Nav.Link>
            {/* <NavDropdown title="MORE" id="basic-nav-dropdown">
              <NavDropdown.Item as={Link} to="/merchandise">Merchandise</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/media">Media</NavDropdown.Item>
            </NavDropdown> */}
          </Nav>
        </Navbar.Collapse>
        
        <div className="cart-button-container">
          {totalItems > 0 && (
            <div className="rounded-circle bg-danger d-flex justify-content-center align-items-center"
              style={{ color: 'white', width: '18px', height: '18px', position: 'absolute', right: '0', bottom: '0', transform: 'translate(-5%, 40%)', zIndex: 3 }}
            >
             {totalItems}
            </div>
          )}
          <button 
            className="cart-button primary size-lg"
            onClick={toggleCartPreview}
            aria-label="Open cart"
          >
            <div className="cart-icon" href="https://icons8.com"></div>
          </button>
        </div>
      </Container>
      
      <CartPreview 
        isOpen={cartPreviewOpen} 
        onClose={closeCartPreview} 
        position="right" 
      />
    </Navbar>
  );
};

export default CustomNavbar;