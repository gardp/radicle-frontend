import React from 'react';
import CustomCarousel from './Carousel';
import FeaturedHighlight from './FeaturedHighlight';
import MusicContainer from './MusicContainer';
import Media from './Media';
import NewsletterSub from './NewsletterSub';
import Section from './Section';
import { useAllLibrariesWithTracks } from '../hooks/useTracks';

const HomePage = () => {
  const { librariesWithTracks, isLoading, error } = useAllLibrariesWithTracks();

  console.log('HomePage', librariesWithTracks);
  console.log('HomePage Loading', isLoading);
  console.log('HomePage Error', error);

  return (
    <div className="page-wrapper">
      {/* Hero Section - Full Viewport Height Carousel */}
      {/* <section className="hero-section">

      </section> */}
      <CustomCarousel />
      {/* Visual transition component */}
      <FeaturedHighlight />
      {/* Main Content Sections */}
      <div className="main-content">
        <div className="content-section">

        </div>
        <Section title="Latest Music Releases">
          {isLoading && <p>Loading music...</p>}
          {error && <p>Error fetching music. Please try again later.</p>}
          {librariesWithTracks && (
            <MusicContainer 
              libraries={librariesWithTracks} 
              trackCount={3}
              playerTitle="New Features" 
              scale={0.5} /* Scale from 0.5 to 1, where 1 is 100% (default) */
            />
          )}
        </Section>
        <Section title="More Media">
          <Media/>
        </Section>
        <div className="content-section">
          <NewsletterSub/>
        </div>
      </div>
    </div>
  );    
};

export default HomePage;
