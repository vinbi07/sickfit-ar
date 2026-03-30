/**
 * AR Detection Utility
 * Detects browser AR capabilities and determines fallback strategy
 */

export interface ARCapabilities {
  supportsWebXR: boolean;
  supportsWebGL: boolean;
  supportsMindAR: boolean;
  supportsModelViewer: boolean;
  recommendedMode: 'webxr' | 'mindar' | 'modelviewer' | 'none';
}

/**
 * Detect WebGL support
 */
function detectWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas');
    const gl =
      canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    return !!(gl && gl instanceof WebGLRenderingContext);
  } catch (e) {
    return false;
  }
}

/**
 * Detect WebXR support
 */
async function detectWebXR(): Promise<boolean> {
  if (!(navigator as any).xr) {
    return false;
  }

  try {
    const xr = (navigator as any).xr;
    const modes = ['immersive-ar', 'immersive-vr'];
    for (const mode of modes) {
      const isSupported = await xr.isSessionSupported(mode);
      if (isSupported) {
        return true;
      }
    }
    return false;
  } catch (e) {
    return false;
  }
}

/**
 * Detect MindAR support (via camera available)
 */
async function detectMindAR(): Promise<boolean> {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    return devices.some((device) => device.kind === 'videoinput');
  } catch (e) {
    return false;
  }
}

/**
 * Detect <model-viewer> support
 */
function detectModelViewer(): boolean {
  // All modern browsers support Web Components
  return 'customElements' in window;
}

/**
 * Main function to detect all AR capabilities
 */
export async function detectARCapabilities(): Promise<ARCapabilities> {
  const supportsWebGL = detectWebGL();
  const supportsWebXR = supportsWebGL && (await detectWebXR());
  const supportsMindAR = supportsWebGL && (await detectMindAR());
  const supportsModelViewer = detectModelViewer();

  let recommendedMode: ARCapabilities['recommendedMode'] = 'none';

  // Priority order: WebXR > MindAR > ModelViewer > None
  if (supportsWebXR) {
    recommendedMode = 'webxr';
  } else if (supportsMindAR) {
    recommendedMode = 'mindar';
  } else if (supportsModelViewer) {
    recommendedMode = 'modelviewer';
  }

  return {
    supportsWebXR,
    supportsWebGL,
    supportsMindAR,
    supportsModelViewer,
    recommendedMode,
  };
}

/**
 * Check if device is mobile
 */
export function isMobileDevice(): boolean {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}

/**
 * Check if device has camera
 */
export async function hasCameraAccess(): Promise<boolean> {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    return devices.some((device) => device.kind === 'videoinput');
  } catch (e) {
    return false;
  }
}
