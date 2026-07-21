import React from 'react';
import '../styles/FeaturedHighlight.css';
import instagramIcon from '../assets/images/instagram.svg';
import facebookIcon from '../assets/images/facebook-color.svg';
import youtubeIcon from '../assets/images/youtube.svg';
import spotifyIcon from '../assets/images/spotify.svg';
import twitterIcon from '../assets/images/twitter.svg';
import tiktokIcon from '../assets/images/tiktok.png';
import soundcloudIcon from '../assets/images/soundcloud.png';
import vinylIcon from '../assets/images/vinyl-red.png';

const FeaturedHighlight = () => {
  // Social media icons from public assets folder
  const socialIcons = [
    { name: 'instagram', icon: instagramIcon, url: 'https://www.instagram.com/gardlyradicle/' },
    { name: 'facebook', icon: facebookIcon, url: 'https://www.instagram.com/gardlyradicle/' },
    { name: 'youtube', icon: youtubeIcon, url: 'https://www.instagram.com/gardlyradicle/' },
    { name: 'spotify', icon: spotifyIcon, url: 'https://www.instagram.com/gardlyradicle/' },
    { name: 'twitter', icon: twitterIcon, url: 'https://www.instagram.com/gardlyradicle/' },
    { name: 'tiktok', icon: tiktokIcon, url: 'https://www.instagram.com/gardlyradicle/' },
    { name: 'soundcloud', icon: soundcloudIcon, url: 'https://www.instagram.com/gardlyradicle/' },
    { name: 'vinyl', icon: vinylIcon, url: '/catalog' }
  ];

  return (
    <div className="featured-highlight-container">
      <div className="featured-highlight-content">
        <div className="featured-text">
          <h3>
            Follow for New Releases Every Month!
            <span className="follow-arrow" aria-hidden="true">
              <svg viewBox="0 0 64 16" role="presentation" focusable="false">
                <path d="M2 8h46" className="arrow-line" />
                <path d="M46 2l16 6-16 6" className="arrow-head" />
              </svg>
            </span>
          </h3>
        </div>
        <div className="social-icons">
          {socialIcons.map((social, index) => (
            <a 
              key={index} 
              href={social.url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="social-icon-link"
            >
              <img 
                src={social.icon} 
                alt={social.name} 
                className="social-icon" 
              />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturedHighlight;
