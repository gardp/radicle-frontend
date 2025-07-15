import { Container, Row } from 'react-bootstrap';
import AudioPlayer from './AudioPlayer';
import '../styles/AudioPlayer.css';
import '../styles/MusicContainer.css';
import React from 'react';

const MusicContainer = ({ tracks, playerTitle, scale = 1 }) => {
  // Props for customization have been simplified
  console.log("MusicContainer received tracks:", tracks); // Debug log
  // const [activePlayer, setActivePlayer] = useState(null);

  // const handlePlay = (index) => {
  //   setActivePlayer(index);
  // };

  // Validate scale is within allowed range (0.5 to 1)
  const validScale = Math.min(Math.max(scale, 0.5), 1);
  
  // Inline transform scaling removed to allow CSS media queries to control scaling.
  // transformOrigin is already set in MusicContainer.css
  const containerStyle = {
    // transform: `scale(${validScale})`, // Removed
    // transformOrigin: 'center center', // Removed
  };

  return (
    <Container fluid className="music-container" style={containerStyle}>
      <Row className="g-0 w-100"> 
        <AudioPlayer 
          tracks={tracks} 
          playerTitle={playerTitle}
          // isActive={activePlayer === index} // Boolean true or false to determine if the player is active
          // onPlay={() => handlePlay(index)}
          // onPause={() => setActivePlayer(null)}
        />
        {/* {console.log("The music container track is:", tracks)} */}
      </Row>
    </Container>
  );
};

export default MusicContainer;
