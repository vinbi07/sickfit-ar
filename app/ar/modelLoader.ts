/**
 * Model Loader Utility
 * Handles loading and caching 3D models (GLB/USDZ)
 */

interface LoadedModel {
  url: string;
  data: ArrayBuffer;
  loadedAt: number;
}

const modelCache: Map<string, LoadedModel> = new Map();
const MODEL_CACHE_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export class ModelLoader {
  /**
   * Load a 3D model from URL
   */
  static async loadModel(url: string): Promise<ArrayBuffer> {
    // Check cache first
    const cached = modelCache.get(url);
    if (cached && Date.now() - cached.loadedAt < MODEL_CACHE_DURATION_MS) {
      console.log(`[ModelLoader] Loaded from cache: ${url}`);
      return cached.data;
    }

    try {
      console.log(`[ModelLoader] Loading model: ${url}`);
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(
          `Failed to fetch model: ${response.status} ${response.statusText}`
        );
      }

      const arrayBuffer = await response.arrayBuffer();

      // Cache the model
      modelCache.set(url, {
        url,
        data: arrayBuffer,
        loadedAt: Date.now(),
      });

      console.log(`[ModelLoader] Model loaded successfully: ${url}`);
      return arrayBuffer;
    } catch (error) {
      console.error(`[ModelLoader] Error loading model: ${url}`, error);
      throw error;
    }
  }

  /**
   * Validate model file size
   */
  static validateModelSize(arrayBuffer: ArrayBuffer, maxSizeMB: number = 5): boolean {
    const sizeInMB = arrayBuffer.byteLength / (1024 * 1024);
    return sizeInMB <= maxSizeMB;
  }

  /**
   * Get file size in MB
   */
  static getModelSize(arrayBuffer: ArrayBuffer): number {
    return arrayBuffer.byteLength / (1024 * 1024);
  }

  /**
   * Clear cache
   */
  static clearCache(): void {
    modelCache.clear();
    console.log('[ModelLoader] Cache cleared');
  }

  /**
   * Get cache stats
   */
  static getCacheStats(): {
    size: number;
    items: number;
    sizeInMB: number;
  } {
    let totalSize = 0;
    modelCache.forEach((model) => {
      totalSize += model.data.byteLength;
    });

    return {
      size: totalSize,
      items: modelCache.size,
      sizeInMB: totalSize / (1024 * 1024),
    };
  }
}
