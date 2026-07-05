import React from 'react';
import Section from './Section';
import Seo from './Seo';
import '../styles/Catalog.css';

const placeholderCatalog = [
  {
    id: 'CAT-001',
    title: 'Signal Bloom',
    artists: 'GardlyRadicle ft. Lumen Pulse',
    descriptor: 'Tribal / Afrohouse · 118 BPM',
    url: '#',
    logo: 'https://placehold.co/72x72/11141b/e6b54c?text=RS',
  },
  {
    id: 'CAT-002',
    title: 'Night Signal Dub',
    artists: 'GardlyRadicle & The Echo Assembly',
    descriptor: 'Bass Ritual · 124 BPM',
    url: '#',
    logo: 'https://placehold.co/72x72/11141b/ffffff?text=RS',
  },
  {
    id: 'CAT-003',
    title: 'Vodou Bloom',
    artists: 'GardlyRadicle',
    descriptor: 'Rasin Electronica · 122 BPM',
    url: '#',
    logo: 'https://placehold.co/72x72/0f1118/e6b54c?text=RS',
  },
  {
    id: 'CAT-004',
    title: 'Glass Pulse',
    artists: 'GardlyRadicle x Yésiq',
    descriptor: 'Minimal Club · 120 BPM',
    url: '#',
    logo: 'https://placehold.co/72x72/171a21/ffffff?text=RS',
  },
];

const Catalog = () => {
  return (
    <div className="page-wrapper catalog-page">
      <Seo
        title="Catalog"
        description="Browse the full Radicle Sound catalog — beats, remixes and features available to stream, download and license."
      />
      <div className="main-content">
        <Section title="Catalog">
          <p className="catalog-lede">
            A rolling ledger of the Radicle Sound vault. Each entry hints at the mood,
            BPM, and collaborators available for licensing, sync, or exclusive release.
          </p>
          <div className="catalog-panel">
            <ul className="catalog-list" aria-label="Radicle Sound catalog entries">
              {placeholderCatalog.map((entry) => (
                <li key={entry.id} className="catalog-row">
                  <a
                    href={entry.url}
                    className="catalog-item"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${entry.title} by ${entry.artists}`}
                  >
                    <div className="catalog-item-left">
                      <img
                        src={entry.logo}
                        alt={`${entry.title} placeholder logo`}
                        className="catalog-item-logo"
                      />
                    </div>
                    <div className="catalog-item-content">
                      <span className="catalog-item-title">{entry.title}</span>
                      <span className="catalog-item-artists">{entry.artists}</span>
                      <span className="catalog-item-meta">{entry.descriptor}</span>
                    </div>
                    <span className="catalog-item-id">{entry.id}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </Section>
      </div>
    </div>
  );
};

export default Catalog;
