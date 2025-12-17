import React, { useState, useEffect } from "react";
import { FaGitSquare } from "react-icons/fa";
import '../styles/SkeuomorphicButtons.css';
import '../styles/AudioControlButtons.css';
import '../styles/AudioControls.css';

import playIcon from '../assets/images/icons8-play-button-red.png';
import pauseIcon from '../assets/images/icons8-pause-button-red.png';
import nextIcon from '../assets/images/icons8-next.png';
import prevIcon from '../assets/images/icons8-prev.png';
import playIconBlack from '../assets/images/icons8-play-black.png';
import pauseIconBlack from '../assets/images/icons8-pause-button-black.png';
import nextIconYellow from '../assets/images/icons8-next-yellow.png';
import playIconYellow from '../assets/images/icons8-play-yellow.png';
import pauseIconYellow from '../assets/images/icons8-pause-yellow.png';
import prevIconYellow from '../assets/images/icons8-prev-yellow.png';


// New icons for streaming and buying
import streamIcon from '../assets/images/icons8-music-stream-black.png';
import buyIcon from '../assets/images/icons8-cart-black.png';

const AudioControls = ({
  isPlaying,
  onPlayPauseClick,
  onPrevClick,
  onNextClick,
  trackProgress,
  track,
  audioRef,
  onScrub,
  onScrubEnd,
  trackStyling,
}) => {
  // Size customization functionality has been removed

  // Using a ref to track media query for desktop view
  const [isDesktop, setIsDesktop] = useState(false);
  console.log("AudioControls received track:", track);
  console.log("AudioControls received audioRef:", audioRef || "No audioRef");

  useEffect(() => {
    // Check if we're on desktop
    const mediaQuery = window.matchMedia('(min-width: 768px)');
    setIsDesktop(mediaQuery.matches);

    // Update state when viewport size changes
    const handleResize = (e) => setIsDesktop(e.matches);
    mediaQuery.addEventListener('change', handleResize);

    return () => mediaQuery.removeEventListener('change', handleResize);
  }, []);
  if (!track) {
    return null;
  }
  return (
    <div className="controls-container">
      {/* Vinyl artwork for desktop - direct child of controls-container */}
      {isDesktop && (
        <div className={`vinyl-artwork-container ${isPlaying ? 'is-playing' : ''}`}>
          <img
            className="vinyl-artwork"
            src={track.trackVinylThumbnail}
            alt={`track artwork for ${track.trackTitle}`}
          />
        </div>
      )}
      <h1 className="now-playing-title">Now Playing</h1>
      <div className="now-playing-container">
              {/* New div for stream and buy icons */}
      <div className="audio-actions-bar">
        <div className="stream-icon-container">
          <img src={streamIcon} alt="Stream Track" className="action-icon" />
        </div>
        <div className="buy-icon-container">
          <img src={buyIcon} alt="Buy Track" className="action-icon" />
        </div>
      </div>
        {/* Vinyl artwork for mobile - inside now-playing-container */}
        {!isDesktop && (
          <div className={`vinyl-artwork-container ${isPlaying ? 'is-playing' : ''}`}>
            <img
              className="vinyl-artwork"
              src={track.trackVinylThumbnail}
              alt={`track artwork for ${track.trackTitle}`}
            />
          </div>
        )}
        
        <div className="track-info-frame">
          <div className="track-info">
            <h2 className="title">{track.trackTitle}</h2>
            <h3 className="artist">{track.trackArtistFeaturesLine}</h3>
          </div>
        </div>
        
        <input
          type="range"
          value={trackProgress}
          step="0.1"
          min="0"
          max={audioRef.current?.duration || 0}  // Use actual duration, fallback to 0 if not loaded
          className="progress"
          onChange={(e) => onScrub(e.target.value)}
          onMouseUp={onScrubEnd}
          onKeyUp={onScrubEnd}
          style={{ background: trackStyling }}
          disabled={!audioRef.current.duration} //disable the progress bar if the audio is not loaded i.e. no duration
        />
        
        <div className="controls-frame">
          <div className="audio-controls">
            <button
              type="button"
              className="prev size-sm"
              aria-label="Previous"
              onClick={onPrevClick}
            >
              <img 
                src={isDesktop ? prevIconYellow : prevIcon} 
                alt="Previous Track" 
                className="control-button-img" 
              />
            </button>
            {isPlaying ? (
              <button
                type="button"
                className="pause size-md"
                onClick={() => onPlayPauseClick()}
                aria-label="Pause"
              >
                <img 
                  src={isDesktop ? pauseIconYellow: pauseIcon} 
                  alt="Pause" 
                  className="control-button-img" 
                />
              </button>
            ) : (
              <button
                type="button"
                className="play size-md"
                onClick={() => onPlayPauseClick()}
                aria-label="Play"
              >
                <img 
                  src={isDesktop ? playIconYellow : playIcon} 
                  alt="Play" 
                  className="control-button-img" 
                />
              </button>
            )}
            <button
              type="button"
              className="next size-sm"
              aria-label="Next"
              onClick={onNextClick}
            >
              <img 
                src={isDesktop ? nextIconYellow : nextIcon} 
                alt="Next Track" 
                className="control-button-img" 
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudioControls;
