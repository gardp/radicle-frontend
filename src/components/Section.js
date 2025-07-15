import React from 'react';

const Section = ({ title, children }) => {
    return (
      <div className="content-section">
        {title && (
          <div className="content-section-title-frame">
            <h2 className="content-section-title">{title}</h2>
          </div>
        )}
        <div className="content-section-body">
          {children}
        </div>
      </div>
    );
  };
  export default Section;