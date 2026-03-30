// Application Constants

// AR Configuration
export const AR_CONFIG = {
  ENABLE_IMAGE_TRACKING: process.env.NEXT_PUBLIC_AR_ENABLE_IMAGE_TRACKING === 'true',
  FALLBACK_TO_MODEL_VIEWER: process.env.NEXT_PUBLIC_AR_FALLBACK_TO_MODEL_VIEWER === 'true',
  DEFAULT_MODEL_SCALE: 1,
  DEFAULT_MODEL_Z: -2,
  MAX_MODEL_SCALE: 5,
  MIN_MODEL_SCALE: 0.1,
};

// Shopify Configuration
export const SHOPIFY_CONFIG = {
  PRODUCTS_PER_PAGE: 12,
  IMAGES_PER_PRODUCT: 10,
  VARIANTS_PER_PRODUCT: 10,
};

// AR Model Configuration
export const MODEL_CONFIG = {
  MAX_FILE_SIZE_MB: 5,
  SUPPORTED_FORMATS: ['glb', 'usdz', 'gltf'] as const,
  CACHE_DURATION_MS: 7 * 24 * 60 * 60 * 1000, // 7 days
};

// UI Configuration
export const UI_CONFIG = {
  INSTRUCTION_DISPLAY_DURATION_MS: 3000,
  GESTURE_DEBOUNCE_MS: 50,
  LOADING_SPINNER_SIZE: 48,
};

// Three.js Configuration
export const THREE_CONFIG = {
  CAMERA_FOV: 75,
  CAMERA_NEAR: 0.1,
  CAMERA_FAR: 10000,
  RENDERER_ANTIALIAS: true,
  RENDERER_ALPHA: true,
  SHADOW_MAP_SIZE: 1024,
  LIGHT_INTENSITY: 1,
  AMBIENT_LIGHT_INTENSITY: 0.6,
};

// MindAR Configuration (for CDN)
export const MINDAR_CONFIG = {
  CDN_URL: 'https://cdn.jsdelivr.net/npm/mind-ar@1.2.2/dist/',
  IMAGE_TRACKING: {
    MAX_TRACK_RATE: 30, // FPS
    PREDICTION_DEPTH: 20,
  },
};

// Camera Configuration
export const CAMERA_CONFIG = {
  WIDTH: 720,
  HEIGHT: 1280,
  FACINGMODE: 'environment', // Use rear camera
};
