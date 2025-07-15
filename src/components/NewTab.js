import React from 'react';
import { Tab } from 'react-bootstrap';

const NewTab = ({ content, children, href, tabID }) => {
  return (
    <Tab.Pane eventKey={href}>
      <div id={tabID}>{children}</div>
    </Tab.Pane>
  );
};

export default NewTab;