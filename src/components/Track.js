import React, { useEffect, useState } from 'react';
import '../styles/AudioPlayer.css';
import '../styles/Track.css';
import '../styles/SkeuomorphicButtons.css';
import PricingTable from './PricingTable';
import { useSelector, useDispatch } from 'react-redux';
import { openPricingModal, closePricingModal } from '../features/priceLicensing/priceLicensing.js';
import cartIconRed from '../assets/images/icons8-cart-crimson-red.png';
import downloadIcon from '../assets/images/icons8-listening-to-music-on-headphones-100.png';
import streamIcon from '../assets/images/icons8-music-stream-red.png';
import babyRadicle from '../assets/images/baby-radicle.png';
import avatar from '../assets/images/radicleavatar.jpg';
const Track = ({ track, isActive, onClick }) => {
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);
  const dispatch = useDispatch();
  const { currentTrack } = useSelector((state) => state.priceLicensing); // read nad destructure currentTrack from state
  
  // Function to handle track image click
  const handleTrackImageClick = (e) => {
    // Only trigger onClick if clicking directly on the track image
    if (e.target.className === 'track-thumb') {
      onClick();
    }
  };

  // Size functionality has been removed
  
  // Handle cart icon click to open pricing modal
  const handleCartClick = (e) => {
    e.preventDefault();
    dispatch(openPricingModal(track));
    // currentTrack = track; //After reading the track from the useSelector, assign it to the currentTrack state
  };
  
  // Close the pricing modal
  const closePricingModal = () => {
    dispatch(closePricingModal());
  };

  return (
    <>
      <div 
        className={`track-item ${isActive ? 'active' : ''}`}
        onClick={onClick}
      >
        {/* Vinyl thumbnail - reduced to 1/3 size */}
        <div className="track-thumb-container">
          <img
            className="track-thumb"
            src={track.vinyl_thumbnail}
            alt={`track artwork for ${track.title}`}
          />
        </div>
        
        {/* Track details - positioned between stream icon and buy/download icons */}
        <div className="track-label">
          <div className="track-info-line">
            <span className="track-title">{track.title}</span>
            <span className="track-separator"> - </span>
            <span className="track-artist">{track.artist}</span>
            <span className="track-bpm">{track.tempo_bpm}bpm</span>
          </div>  
          <img
            className="track-label-thumbnail"
            src={babyRadicle}
            alt="Decorative thumbnail"
          />
        </div>
        
        {/* Icons container - stacked vertically */}
        <div className="track-icons">
          {/* Buy and Download icons */}
          <div className="track-icons-left">
            {track.links?.buyLink && (
              <a href="#" onClick={(e) => { e.stopPropagation(); handleCartClick(e); }}>
                <img
                  // className="track-icon buy-icon skeuomorphic-btn primary with-glare" justink
                  className="track-icon buy-icon primary with-glare"
                  src={cartIconRed}
                  alt="Buy"
                />
                <span className="tooltip">Buy</span>
              </a>
            )}
            {track.links?.downloadLink && (
              <a href={track.links.downloadLink} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                <img
                  className="track-icon download-icon skeuomorphic-btn accent with-glare"
                  src={downloadIcon}
                  alt="Download"
                />
                <span className="tooltip">Download</span>
              </a>
            )}
          </div>
          {/* Stream icon */}
          <div className="track-icons-right">
            {track.links?.streamLink && (
              <a href={track.links.streamLink} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                <img
                  className="track-icon stream-icon skeuomorphic-btn"
                  src={streamIcon}
                  alt="Stream"
                />
                <span className="tooltip">Stream</span>
              </a>
            )}
          </div>
        </div>
      </div>
      
      {/* Pricing Table Modal */}
      {/* <PricingTable 
        isOpen={isPricingModalOpen}
        onClose={closePricingModal}
        track={track}
      /> */}
    </>
  );
};

export default Track;