import React from 'react';
import MusicContainer from './MusicContainer';
import Section from './Section';
import Seo from './Seo';
import { useAllLibrariesWithTracks } from '../hooks/useTracks';

const Catalog = () => {
  const { librariesWithTracks, isLoading, error } = useAllLibrariesWithTracks();

  const libraries = librariesWithTracks || [];

  return (
    <div className="page-wrapper">
      <Seo
        title="Catalog"
        description="Browse the full Radicle Sound catalog — beats, remixes and features available to stream, download and license."
      />
      <div className="main-content">
        <Section title="Catalog">
          {isLoading && <p>Loading music…</p>}
          {error && <p>Error fetching music. Please try again later.</p>}
          {!isLoading && !error && libraries.length === 0 && (
            <p>No music available yet. Check back soon.</p>
          )}
          {libraries.length > 0 && (
            <MusicContainer
              libraries={libraries}
              playerTitle="CATALOG"
              scale={1}
            />
          )}
        </Section>
      </div>
    </div>
  );
};

export default Catalog;
