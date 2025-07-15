import React from 'react';
import '../styles/AudioPlayer.css';
import '../styles/TrackFrame.css';
import { Nav, Tab } from 'react-bootstrap';
import Track from './Track';

/**
 * TrackFrame Component
 * 
 * A elegant playlist-style track container that complements the AudioControls component.
 * This component displays tracks in a vertical list format with smaller thumbnails
 * and action icons aligned in a consistent way.
 *
 * @param {Array} tabs - Array of tab objects with label and content properties
 * @param {Number} currentTrackIndex - Index of currently playing track
 * @param {Function} onTrackSelect - Callback when track is selected
 */
const TrackFrame = ({ tabs = [], currentTrackIndex, onTrackSelect }) => (
  <>
    <div className="track-frame-wrapper">
      <Tab.Container defaultActiveKey={0}>
        {/* Tabs navigation */}
        <Nav variant="tabs" className="modern-tabs">
          {tabs.map((tab, index) => (
            <Nav.Item key={index} className="modern-tab-item">
              <Nav.Link eventKey={index} className="modern-tab-link">{tab.label}</Nav.Link>
            </Nav.Item>
          ))}
        </Nav>
        
        {/* Track frame container */}
        <div className="track-frame">
          <div className="track-list">
            <Tab.Content>
              {tabs.map((tab, index) => (
                <Tab.Pane eventKey={index} key={index}>
                  {/* Map through tracks in the current tab */}
                  {tab.content.map((track, trackIndex) => (
                    <Track
                      key={track.track_id}
                      track={track}
                      isActive={trackIndex === currentTrackIndex}
                      onClick={() => onTrackSelect(trackIndex)}
                    />
                  ))}
                </Tab.Pane>
              ))}
            </Tab.Content>
          </div>
        </div>
      </Tab.Container>
    </div>
  </>
);

export default TrackFrame;