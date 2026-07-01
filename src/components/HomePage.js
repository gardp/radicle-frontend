import React from 'react';
import CustomCarousel from './Carousel';
import FeaturedHighlight from './FeaturedHighlight';
import MusicContainer from './MusicContainer';
import Media from './Media';
import NewsletterSub from './NewsletterSub';
import Section from './Section';
import Seo from './Seo';
import { SITE_NAME, SITE_URL } from '../config/site';
import { useAllLibrariesWithTracks } from '../hooks/useTracks';

const HomePage = () => {
  const { librariesWithTracks, isLoading, error } = useAllLibrariesWithTracks();
  //when executing the useAllLibrariesWithTracks hook, it will automatically execute the fetchLibrariesWithTracks,....(see next line)
  // so you don't need the function in the component, you just need the state objects extracted using the selectors!!!

  //now extract the right libraries for the home page musicContainer/AudioPlayer
  const previewLibraries = librariesWithTracks?.filter(lib => lib.libraryName == "NEW BEATS" || lib.libraryName == "FEATURES" || lib.libraryName == "REMIXES") || [];
  console.log('HomePage', librariesWithTracks);
  console.log('HomePage Loading', isLoading);
  console.log('HomePage Error', error);
  console.log('HomePage previewLibraries', previewLibraries);

  const structuredData = [
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
      logo: `${SITE_URL}/logo512.png`,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: SITE_NAME,
      url: SITE_URL,
    },
  ];

  return (
    <div className="page-wrapper">
      <Seo
        title=""
        description="Stream original beats, remixes and features from Radicle Sound. Discover new music and license premium sound for your next project."
        canonicalPath="/"
        jsonLd={structuredData}
      />
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
        <Section title="Latest Releases">
          {isLoading && <p>Loading music...</p>}
          {error && <p>Error fetching music. Please try again later.</p>}
          {previewLibraries && previewLibraries.length > 0 && (
            <MusicContainer
              libraries={previewLibraries}
              trackCountByLibrary={{
                "NEW BEATS": 5,
                "FEATURES": 20,
                "REMIXES": 20,
              }}
              playerTitle="HIGHLIGHTS"
              scale={0.5} /* Scale from 0.5 to 1, where 1 is 100% (default) */
            />
          )}
        </Section>
        <Section title="More Media">
          <Media />
        </Section>
        <div className="content-section">
          <NewsletterSub />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
