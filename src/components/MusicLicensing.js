import React, { useState } from 'react';
import { Container, Row } from 'react-bootstrap';
import MusicContainer from './MusicContainer';
import { useAllLibrariesWithTracks } from '../hooks/useTracks';
import '../styles/MusicLicensing.css';

const MusicLicensing = () => {
  const { librariesWithTracks, isLoading, error } = useAllLibrariesWithTracks();
  const [currentTrack, setCurrentTrack] = useState(null);

  // Filter for "BEATS" library for licensing
  const beatsLibraries = librariesWithTracks?.filter(lib => lib.libraryName === "BEATS") || [];

  const handleTrackChange = (track) => {
    setCurrentTrack(track);
  };

  if (isLoading) {
    return (
      <div className="licensing-page">
        <div className="loading-message">Loading beats for licensing...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="licensing-page">
        <div className="error-message">Error loading beats. Please try again.</div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <div className="licensing-page">
        <div className="licensing-unified-frame">
          {/* Hero Banner with Current Track Cover Art */}
          <div className="licensing-banner">
            <div 
              className="banner-background"
              style={{
                backgroundImage: currentTrack?.trackCoverArt 
                  ? `url(${currentTrack.trackCoverArt})` 
                  : 'linear-gradient(135deg, var(--haiti-blue), var(--haiti-red))'
              }}
            >
              <div className="banner-overlay">
                <Container>
                  <Row className="banner-content">
                    <div className="banner-text">
                      <h1 className="banner-title">License Your Sound</h1>
                      <p className="banner-subtitle">
                        {currentTrack 
                          ? `Now Playing: ${currentTrack.trackTitle} - ${currentTrack.trackArtistFeaturesLine}`
                          : 'Discover and license premium beats for your next project'
                        }
                      </p>
                    </div>
                  </Row>
                </Container>
              </div>
            </div>
          </div>

          {/* Music Container for All Beats */}
          <Container className="licensing-content">
            <Row className="licensing-music-container">
              <MusicContainer 
                libraries={beatsLibraries}
                playerTitle="Beats Available for Licensing"
                onTrackChange={handleTrackChange}
                scale={1}
              />
            </Row>
          </Container>
        </div>
      </div>
    </div>
  );
};

export default MusicLicensing; 