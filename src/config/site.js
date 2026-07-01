// Central SEO/site configuration.
//
// IMPORTANT: Set VITE_SITE_URL in your .env.production to your real production
// origin (e.g. https://www.radiclesound.com). It is used to build absolute
// canonical/Open Graph URLs and the sitemap. The fallback below is only a
// sensible default and should be replaced with your real domain.
export const SITE_URL = (
  import.meta.env.VITE_SITE_URL || 'https://www.radiclesound.com'
).replace(/\/$/, '');

export const SITE_NAME = 'Radicle Sound';

export const DEFAULT_TITLE = 'Radicle Sound | Beats, Remixes & Music Licensing';

export const DEFAULT_DESCRIPTION =
  'Radicle Sound is an independent music label and beat marketplace. Stream original beats, remixes and features, and license premium sound for your next project.';

// Default social share image (absolute URL). Replace with a branded 1200x630 image.
export const DEFAULT_OG_IMAGE = `${SITE_URL}/logo512.png`;

export const TWITTER_HANDLE = '@radiclesound';

// Build an absolute URL from a route path.
export const absoluteUrl = (path = '/') =>
  `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
