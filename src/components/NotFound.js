import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Button } from 'react-bootstrap';

const NotFound = () => {
  return (
    <Container className="text-center py-5">
      <div className="not-found-content">
        <h1 className="display-1 text-danger">404</h1>
        <h2 className="mb-4">Page Not Found</h2>
        <p className="lead mb-4">
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-4">
          <Button as={Link} to="/" variant="primary" className="me-3">
            Go Home
          </Button>
          <Button as={Link} to="/contact" variant="outline-primary">
            Contact Support
          </Button>
        </div>
      </div>
    </Container>
  );
};

export default NotFound;