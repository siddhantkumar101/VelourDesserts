/**
 * Velour Desserts - High-Fidelity Asset Fallback Utility
 * Provides custom, beautiful vector SVG cards if external Unsplash domains
 * are offline, blocked, or throttled.
 */

export const FALLBACK_IMAGE = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500" fill="%232C1810"><rect width="100%" height="100%" fill="%23FAF6F1"/><circle cx="200" cy="220" r="90" fill="%23E8C5BC" opacity="0.4"/><path d="M120 220 C120 160, 280 160, 280 220 C280 280, 120 280, 120 220 Z" fill="%23C9897B"/><circle cx="200" cy="150" r="16" fill="%23FF7B93"/><text x="50%" y="360" font-family="Georgia, serif" font-size="20" font-weight="bold" fill="%232C1810" text-anchor="middle">Velour Desserts</text><text x="50%" y="390" font-family="sans-serif" font-size="12" fill="%232C1810" opacity="0.6" text-anchor="middle">Artisanal Pâtisserie</text></svg>`;

export const FALLBACK_IMAGE_DARK = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500" fill="%23FAF6F1"><rect width="100%" height="100%" fill="%23160B06"/><circle cx="200" cy="220" r="90" fill="%23FF7B93" opacity="0.1"/><path d="M120 220 C120 160, 280 160, 280 220 C280 280, 120 280, 120 220 Z" fill="%23C9897B"/><circle cx="200" cy="150" r="16" fill="%23FF7B93" /><text x="50%" y="360" font-family="Georgia, serif" font-size="20" font-weight="bold" fill="%23FAF6F1" text-anchor="middle">Velour Desserts</text><text x="50%" y="390" font-family="sans-serif" font-size="12" fill="%23FF7B93" opacity="0.8" text-anchor="middle">Artisanal Pâtisserie</text></svg>`;

export const handleImageError = (e) => {
  e.target.onerror = null;
  e.target.src = FALLBACK_IMAGE;
};

export const handleImageErrorDark = (e) => {
  e.target.onerror = null;
  e.target.src = FALLBACK_IMAGE_DARK;
};
