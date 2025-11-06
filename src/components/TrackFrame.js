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
 * @param {Number} currentLibTrackIndex - Index of currently playing track
 * @param {Function} onTrackSelect - Callback when track is selected
 */
const TrackFrame = ({ libraries, currentLibTrackIndex, onTrackSelect }) => (
  <>
    <div className="track-frame-wrapper">
      <Tab.Container defaultActiveKey={0}>
        {/* Tabs navigation */}
        <Nav variant="tabs" className="modern-tabs">
          {libraries.map((lib, libIndex) => (
            <Nav.Item key={libIndex} className="modern-tab-item">
              <Nav.Link eventKey={libIndex} className="modern-tab-link">{lib.name}</Nav.Link>
            </Nav.Item>
          ))}
        </Nav>
        
        {/* Track frame container */}
        <div className="track-frame">
          <div className="track-list">
            <Tab.Content>
              {libraries.map((lib, libIndex) => (
                <Tab.Pane eventKey={libIndex} key={libIndex}>
                  {/* Map through tracks in the current tab */}
                  {lib.track.map((track, trackIndex) => (
                    <Track
                      key={track.trackId}
                      track={track}
                      isActive={trackIndex === currentLibTrackIndex.trackIndex && libIndex === currentLibTrackIndex.libraryIndex} //after clicking on a track, it will update the currentLibTrackIndex and make it active in isActive...which changes the styling of the track
                      onClick={() => onTrackSelect(trackIndex, libIndex)} //so by clicking on it, it will update the currentLibTrackIndex and make it active in isActive above...which changes the styling of the track
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