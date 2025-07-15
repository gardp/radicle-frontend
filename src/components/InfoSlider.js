import React from 'react';
import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/InfoSlider.css';

const InfoSlider = ({ slides }) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [nextSlide, setNextSlide] = useState(null);
    const [slideDirection, setSlideDirection] = useState(''); // 'slide-left' or 'slide-right'
    const [isAnimating, setIsAnimating] = useState(false);
    
    // Get total number of slides for circular navigation
    const totalSlides = slides.length;
    
    // Handler for previous slide with circular navigation
    const prevSlide = () => {
        if (isAnimating) return; // Prevent multiple clicks during animation
        setIsAnimating(true);
        
        // Calculate previous slide index
        const prevIndex = currentSlide === 0 ? totalSlides - 1 : currentSlide - 1;
        
        // First render the next slide (which will appear blurry)
        setNextSlide(prevIndex);
        
        // Use a very small delay before setting the direction to ensure the next slide is rendered first
        setTimeout(() => {
            setSlideDirection('slide-right');
        }, 50);

        // Wait for animation to complete before changing slide
        setTimeout(() => {
            // Update the current slide FIRST
            setCurrentSlide(prevIndex);
            
            // Then use a small delay before removing the old slide to prevent flickering
            setTimeout(() => {
                setNextSlide(null);
                setSlideDirection('');
                setIsAnimating(false);
            }, 50);
        }, 800); // Matches the CSS blur transition duration
    };
    
    // Handler for next slide with circular navigation
    const nextSlideHandler = () => {
        if (isAnimating) return; // Prevent multiple clicks during animation
        setIsAnimating(true);
        
        // Calculate next slide index
        const nextIndex = currentSlide === totalSlides - 1 ? 0 : currentSlide + 1;
        
        // First render the next slide (which will appear blurry)
        setNextSlide(nextIndex);
        
        // Use a very small delay before setting the direction to ensure the next slide is rendered first
        setTimeout(() => {
            setSlideDirection('slide-right');
        }, 50);
   
        // Wait for animation to complete before changing slide
        setTimeout(() => {
            // Update the current slide FIRST
            setCurrentSlide(nextIndex);
            
            // Then use a small delay before removing the old slide to prevent flickering
            setTimeout(() => {
                setNextSlide(null);
                setSlideDirection('');
                setIsAnimating(false);
            }, 50);
        }, 800); // Matches the CSS blur transition duration
    };
    
    // Get current, next, and previous slide data
    const currentSlideData = slides[currentSlide];
    const nextSlideData = nextSlide !== null ? slides[nextSlide] : null;
    
    // Calculate indices for hover previews
    const nextSlideIndex = (currentSlide === totalSlides - 1) ? 0 : currentSlide + 1;
    const prevSlideIndex = (currentSlide === 0) ? totalSlides - 1 : currentSlide - 1;
    
    // Get the image URLs for hover previews
    const nextSlideImageUrl = slides[nextSlideIndex].url;
    const prevSlideImageUrl = slides[prevSlideIndex].url;
    
    // Define slide titles based on slide index/alt text
    const slideTitles = {
        "Sonic Energy": "Sound Taking Us Back to Our Roots!",
        "Music Production": "Professional Music Production",
        "Songwriting & Arrangement": "Creative Songwriting & Arrangement"
    };
    
    // Define slide sub-headlines
    const slideSubheadlines = {
        "Sonic Energy": "Percussive, Tribal, Electric and Novel",
        "Production, Songwriting & Arrangement": "State-of-the-art Mixing services, Songwriting & Arrangement",
    };
    
    // Define slide navigation links
    const slideLinks = {
        "Music Production": "/services",
        "Songwriting & Arrangement": "/licensing"
    };
    
    return (
        <div className="info-slider">
            <div 
                className="slider-control prev-control" 
                onClick={prevSlide}
                style={{
                    '--preview-image': `url(${prevSlideImageUrl})`
                }}
            >
                <span className="control-text">PREV</span>
            </div>
            
            <div className="slides-container">
                {/* Current Slide */}
                <div 
                    className={`info-slide current-slide ${slideDirection}`}
                    style={{ 
                        backgroundImage: `url(${currentSlideData.url})` 
                    }}
                >
                    {/* Slide Content Container */}
                    <div className="slide-content">
                        {/* Title Overlay */}
                        <h2 className="slide-title">
                            {slideTitles[currentSlideData.alt] || currentSlideData.alt}
                        </h2>
                        
                        {/* Sub-headline */}
                        <p className="slide-subheadline">
                            {slideSubheadlines[currentSlideData.alt] || ""}
                        </p>
                        
                        {/* Navigation Button */}
                        <Link 
                            to={slideLinks[currentSlideData.alt] || "#"} 
                            className="slide-nav-button"
                        >
                            Buy Premium Beats!
                        </Link>
                    </div>
                </div>

                {/* Next Slide - only rendered during transition */}
                {nextSlideData && (
                    <div 
                        className="info-slide next-slide"
                        style={{ 
                            backgroundImage: `url(${nextSlideData.url})` 
                        }}
                    >
                        {/* Slide Content Container */}
                        <div className="slide-content">
                            {/* Title Overlay */}
                            <h2 className="slide-title">
                                {slideTitles[nextSlideData.alt] || nextSlideData.alt}
                            </h2>
                            
                            {/* Sub-headline */}
                            <p className="slide-subheadline">
                                {slideSubheadlines[nextSlideData.alt] || ""}
                            </p>
                            
                            {/* Navigation Button */}
                            <Link 
                                to={slideLinks[nextSlideData.alt] || "#"} 
                                className="slide-nav-button"
                            >
                                Buy Premium Beats!
                            </Link>
                        </div>
                    </div>
                )}
            </div>
            
            <div 
                className="slider-control next-control" 
                onClick={nextSlideHandler}
                style={{
                    '--preview-image': `url(${nextSlideImageUrl})`
                }}
            >
                <span className="control-text">NEXT</span>
            </div>
        </div>  
    );
}

export default InfoSlider;