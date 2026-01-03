import { Container, Row } from 'react-bootstrap';
import AudioPlayer from './AudioPlayer';
import '../styles/AudioPlayer.css';
import '../styles/MusicContainer.css';
import React from 'react';

const MusicContainer = ({ libraries, trackCount, playerTitle, scale = 1, onTrackChange }) => {
  // Props for customization have been simplified
  // console.log("MusicContainer received library", libraries); // Debug log
  
  // Filter tracks if trackCount is specified (creates new array/objects, doesn't mutate props) to decrease the number of tracks in the AudioPlayer
  const newLibraries = trackCount
    ? libraries.map(lib => ({
        ...lib,
        tracks: lib.tracks.slice(0, trackCount)
      }))
    : libraries;

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
