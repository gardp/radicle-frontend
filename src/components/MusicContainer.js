import { Container, Row } from 'react-bootstrap';
import AudioPlayer from './AudioPlayer';
import '../styles/AudioPlayer.css';
import '../styles/MusicContainer.css';
import React from 'react';

// const MusicContainer = ({ libraries, trackCount, playerTitle, scale = 1 }) => {
const MusicContainer = ({ libraries, trackCountByLibrary = {}, playerTitle, scale = 1, onTrackChange }) => {
  // Props for customization have been simplified
  // console.log("MusicContainer received library", libraries); // Debug log

// prop implementation example:
{/* <MusicContainer
  libraries={libraries}
  playerTitle="..."
  trackCountByLibrary={{
    FEATURES: 8,
    REMIX: 4,
  }}
/> */}
  // Non-selected libraries remain unchanged.
  const newLibraries = libraries.map((lib) => {
    const limit = trackCountByLibrary?.[lib.libraryName];

    if (Number.isInteger(limit) && limit >= 0) {
      return {
        ...lib,
        tracks: (lib.tracks || []).slice(0, limit),
      };
    }

    return lib;
  });

  const validScale = Math.min(Math.max(scale, 0.5), 1);

  const containerStyle = {

  };

  return (
    <Container fluid className="music-container" style={containerStyle}>
      <Row className="g-0 w-100">
        <AudioPlayer
          libraries={newLibraries}
          playerTitle={playerTitle}
          onTrackChange={onTrackChange}
        />
        {/* {console.log("The music container track is:", tracks)} */}
      </Row>
    </Container>
  );
};

export default MusicContainer;
