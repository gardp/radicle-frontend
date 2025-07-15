import React, { useState, useRef } from 'react';
import { Image } from 'react-bootstrap';
import '../styles/NewMusic.css';

const NewMusic = ({ name, description, imageSrc, audioSrc }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const togglePlay = () => {
    if (audioRef.current.paused) {
      audioRef.current.play();
      setIsPlaying(true);
    } else {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
  };

  return (
    <div className="music-player">
      <div className="player-content">
        <div className="cover-art">
          <Image src={imageSrc} alt={name} roundedCircle />
        </div>
        <div className="track-info">
          <h3 className="track-title">{name}</h3>
          <p className="track-description">{description}</p>
        </div>
        <div className="audio-controls">
          <button 
            className={`play-button ${isPlaying ? 'playing' : ''}`}
            onClick={togglePlay}
          >
            {isPlaying ? '❚❚' : '▶'}
          </button>
          <audio
            ref={audioRef}
            src={audioSrc}
            onEnded={handleEnded}
            controls
            className="audio-element"
          />
        </div>
      </div>
    </div>
  );
};

export default NewMusic;