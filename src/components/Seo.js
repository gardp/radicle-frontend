import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import {
  SITE_NAME,
  DEFAULT_TITLE,
  DEFAULT_DESCRIPTION,
  DEFAULT_OG_IMAGE,
  TWITTER_HANDLE,
  absoluteUrl,
} from '../config/site';

/**
 * Reusable SEO component. Renders per-page <title>, meta description,
 * canonical URL, Open Graph and Twitter Card tags, plus optional JSON-LD
 * structured data.
 *
 * Props:
 *  - title:        page title (site name is appended automatically)
 *  - description:  meta description
 *  - image:        absolute URL for social share image
 *  - type:         Open Graph type (default 'website')
 *  - noindex:      when true, prevents indexing (use for cart/checkout/404)
 *  - canonicalPath optional explicit path to canonicalize (defaults to current)
 *  - jsonLd:       object or array of JSON-LD structured data
 */
const Seo = ({
  title,
  description = DEFAULT_DESCRIPTION,
  image = DEFAULT_OG_IMAGE,
  type = 'website',
  noindex = false,
  canonicalPath,
  jsonLd,
}) => {
  const location = useLocation();
  const path = canonicalPath || location.pathname || '/';
  const canonical = absoluteUrl(path);

  const fullTitle = title ? `${title} | ${SITE_NAME}` : DEFAULT_TITLE;

  const structuredData = jsonLd
    ? Array.isArray(jsonLd)
      ? jsonLd
      : [jsonLd]
    : [];

  return (
    <Helmet prioritizeSeoTags>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />
      {noindex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow" />
      )}

      {/* Open Graph */}
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={image} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={TWITTER_HANDLE} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {structuredData.map((data, i) => (
        <script type="application/ld+json" key={i}>
          {JSON.stringify(data)}
        </script>
      ))}
    </Helmet>
  );
};

export default Seo;
