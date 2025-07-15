import React from 'react';
import { Nav, Tab } from 'react-bootstrap';

const TabGroup = ({ children }) => {
  // Get the href of the first child for defaultActiveKey
  const firstChildHref = React.Children.toArray(children)[0]?.props.href;

  return (
    <Tab.Container id="tabs-container" defaultActiveKey={firstChildHref}>
      <Nav variant="tabs" className="mb-3">
        {React.Children.map(children, (child) => (
          <Nav.Item>
            <Nav.Link eventKey={child.props.href}>{child.props.content}</Nav.Link>
          </Nav.Item>
        ))}
      </Nav>
      <Tab.Content>
        {children}
      </Tab.Content>
    </Tab.Container>
  );
};

export default TabGroup;