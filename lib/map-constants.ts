/**
 * Map Constants and Configuration for SearchResultsMap
 */

export const MAP_CONSTANTS = {
  // Default map center (Nashville, TN)
  DEFAULT_CENTER: {
    latitude: 36.1627,
    longitude: -86.7816,
  },

  // Default zoom level
  DEFAULT_ZOOM: 12,
  MIN_ZOOM: 8,
  MAX_ZOOM: 20,

  // Clustering settings
  CLUSTER_RADIUS: 50,
  MAX_ZOOM_BEFORE_UNCLUSTERING: 16,

  // Marker sizes
  MARKER_SIZE: 40,
  CLUSTER_SIZE_SMALL: 45,
  CLUSTER_SIZE_MEDIUM: 55,
  CLUSTER_SIZE_LARGE: 70,

  // Map style URL (free OpenMapTiles)
  MAP_STYLE_URL: '/map-style.json',

  // Results view height
  RESULTS_HEIGHT: {
    DESKTOP: '600px',
    TABLET: '500px',
    MOBILE: 'auto',
  },
};

// Brand colors from tailwind config
export const BRAND_COLORS = {
  PRIMARY_SAGE: '#5aae97',
  PRIMARY_SAGE_DARK: '#3d8e74',
  ACCENT_CORAL: '#e07856',
  ACCENT_CORAL_DARK: '#c85633',
  NEUTRAL_50: '#f9fafa',
  NEUTRAL_100: '#f5f5f5',
  NEUTRAL_200: '#e8e8e8',
  NEUTRAL_600: '#555555',
  NEUTRAL_700: '#3d3f47',
  NEUTRAL_900: '#1a1b1e',
};

// Marker icon SVG templates
export const MARKER_ICONS = {
  // Default business marker (pin shape)
  BUSINESS: (color: string = BRAND_COLORS.ACCENT_CORAL) => `
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 0C11.163 0 4 7.163 4 16c0 6.867 8.284 18.933 16 23.933 7.716-5 16-17.066 16-23.933 0-8.837-7.163-16-16-16z" fill="${color}"/>
      <circle cx="20" cy="16" r="5" fill="white"/>
    </svg>
  `,

  // Cluster marker (circle with count)
  CLUSTER: (count: number, color: string = BRAND_COLORS.PRIMARY_SAGE) => `
    <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="25" cy="25" r="25" fill="${color}"/>
      <circle cx="25" cy="25" r="23" fill="none" stroke="${BRAND_COLORS.PRIMARY_SAGE_DARK}" stroke-width="2"/>
      <text x="25" y="32" font-size="18" font-weight="bold" fill="white" text-anchor="middle">${count}</text>
    </svg>
  `,

  // Active marker (highlighted)
  ACTIVE: (color: string = BRAND_COLORS.ACCENT_CORAL) => `
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <filter id="shadow">
        <feDropShadow dx="0" dy="0" stdDeviation="3" flood-opacity="0.6"/>
      </filter>
      <path d="M20 0C11.163 0 4 7.163 4 16c0 6.867 8.284 18.933 16 23.933 7.716-5 16-17.066 16-23.933 0-8.837-7.163-16-16-16z" fill="${color}" filter="url(#shadow)"/>
      <circle cx="20" cy="16" r="5" fill="white"/>
    </svg>
  `,
};

// Service type colors
export const SERVICE_TYPE_COLORS = {
  residential: BRAND_COLORS.ACCENT_CORAL,
  commercial: BRAND_COLORS.PRIMARY_SAGE,
  both: BRAND_COLORS.ACCENT_CORAL,
};

// Map popup templates
export const POPUP_TEMPLATE = (business: any) => `
  <div style="font-family: Arial, sans-serif; max-width: 250px;">
    <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600; color: #3d3f47;">
      ${business.name}
    </h3>
    <div style="margin: 8px 0; font-size: 14px; color: #6b6b6b;">
      <p style="margin: 4px 0;">⭐ ${business.average_rating || 'N/A'} (${business.review_count || 0} reviews)</p>
      <p style="margin: 4px 0;">${business.address || ''}</p>
      <p style="margin: 4px 0;">
        <span style="display: inline-block; padding: 4px 8px; background-color: #f0f5f3; border-radius: 4px; font-size: 12px; color: #3d8e74;">
          ${business.service_type === 'both' ? 'Residential & Commercial' : business.service_type === 'residential' ? 'Residential' : 'Commercial'}
        </span>
      </p>
    </div>
  </div>
`;
