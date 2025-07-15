import React from 'react';
import '../styles/Media.css';

/**
 * Media Component - Displays media content in an elegant, responsive grid layout
 * 
 * Features:
 * - Supports multiple media types (YouTube, Vimeo, Instagram, local videos, images)
 * - Responsive 3-column grid that adjusts to 2-cols on tablet and 1-col on mobile
 * - Uniform card height with sophisticated design elements
 * - Enhanced hover effects and micro-interactions
 * - Implements Haitian art-inspired color theme with rich crimson, vivid blue and gold accents
 */
const Media = () => {
    // Sample media items - replace with your actual content
    // Each item requires: 
    // - type: Specifies the media source ('youtube', 'vimeo', 'instagram', 'video', 'image')
    // - src: URL or path to media content
    // - title: Title to display in the caption
    // - description: Brief description shown below the title
    const mediaItems = [
        {
            type: 'youtube', 
            src: 'https://www.youtube.com/embed/YOUR_VIDEO_ID',
            title: 'Latest Music Video',
            description: 'Check out our latest music video release'
        },
        {
            type: 'image',
            src: process.env.PUBLIC_URL + '/assets/images/sample-image-1.jpg',
            title: 'Studio Session',
            description: 'Behind the scenes at the studio'
        },
        {
            type: 'vimeo',
            src: 'https://player.vimeo.com/video/VIMEO_VIDEO_ID',
            title: 'Live Performance',
            description: 'Live at the Summer Festival'
        },
        {
            type: 'image',
            src: process.env.PUBLIC_URL + '/assets/images/sample-image-2.jpg',
            title: 'Album Cover',
            description: 'New album dropping soon'
        },
        {
            type: 'instagram',
            src: 'https://www.instagram.com/p/INSTAGRAM_POST_ID/embed',
            title: 'Behind The Scenes',
            description: 'Exclusive content from our latest recording session'
        },
        {
            type: 'video',
            src: process.env.PUBLIC_URL + '/assets/videos/sample-video.mp4',
            title: 'Acoustic Session',
            description: 'Unplugged version of our new single'
        }
    ];

    /**
     * Renders the appropriate media content based on media type
     * Supports YouTube, Vimeo, Instagram, local videos, and images
     * 
     * @param {Object} item - The media item object
     * @returns {JSX.Element} The rendered media element
     */
    const renderMediaContent = (item) => {
        // YouTube video embed handling
        if (item.type === 'youtube') {
            return (
                <iframe
                    src={item.src}
                    title={item.title}
                    frameBorder="0"
                    className="media-iframe"
                    loading="lazy"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                />
            );
        }
        // Vimeo video embed handling
        else if (item.type === 'vimeo') {
            return (
                <iframe 
                    src={item.src}
                    title={item.title}
                    frameBorder="0" 
                    className="media-iframe"
                    loading="lazy"
                    allow="autoplay; fullscreen; picture-in-picture" 
                    allowFullScreen
                />
            );
        }
        // Instagram embed handling
        else if (item.type === 'instagram') {
            return (
                <iframe
                    src={item.src}
                    title={item.title}
                    frameBorder="0"
                    className="media-iframe"
                    loading="lazy"
                    scrolling="no"
                    allowTransparency="true"
                    allowFullScreen
                />
            );
        }
        // Local video file handling
        else if (item.type === 'video') {
            return (
                <video
                    src={item.src}
                    title={item.title}
                    className="media-video"
                    controls
                    preload="metadata"
                />
            );
        }
        // Image handling (default)
        else {
            return (
                <img 
                    src={item.src} 
                    alt={item.title} 
                    className="media-image"
                    loading="lazy" 
                />
            );
        }
    };

    /**
     * Determines if the media item is a video type that should show a play indicator
     * 
     * @param {Object} item - The media item object
     * @returns {Boolean} True if media is a video type
     */
    const isVideoType = (item) => {
        return ['youtube', 'vimeo', 'video'].includes(item.type);
    };

    return (
        <section className="media-section">
            {/* Main container for all media content */}
            <div className="media-container">
                {/* Responsive grid that adjusts from 3 to 1 column based on screen size */}
                <div className="media-grid">
                    {mediaItems.map((item, index) => (
                        <div key={index} className="media-card">
                            {/* Decorative frame with Haitian art-inspired styling */}
                            <div className="media-frame">
                                {/* Container for the actual media content */}
                                <div className="media-content">
                                    {renderMediaContent(item)}
                                    
                                    {/* Overlay with play indicator for video content */}
                                    <div className="media-overlay">
                                        {isVideoType(item) && (
                                            <div className="media-play-indicator">
                                                <div className="play-icon"></div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            
                            {/* Caption area for title and description */}
                            <div className="media-caption">
                                <h3>{item.title}</h3>
                                <p>{item.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Media;
