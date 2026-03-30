import { create } from 'zustand';
import type { ARStoreState, ShopifyProduct, ARModel, ARModelTransform } from '@/app/lib/types';

const defaultModelTransform: ARModelTransform = {
  position: { x: 0, y: 0, z: -2 },
  scale: 1,
  rotation: { x: 0, y: 0, z: 0 },
};

export const useARStore = create<ARStoreState>((set) => ({
  // Products state
  selectedProduct: null,
  products: [],
  productsLoading: false,
  productsError: undefined,

  // AR Session state
  arSession: {
    isActive: false,
    isSupported: false,
    cameraPermissionGranted: false,
    cameraPermissionDenied: false,
    modelLoading: false,
    modelLoadError: undefined,
  },
  selectedModel: null,

  // Model Transform state
  modelTransform: defaultModelTransform,

  // Product Actions
  setSelectedProduct: (product) => set({ selectedProduct: product }),
  
  setProducts: (products) => set({ products }),
  
  setProductsLoading: (loading) => set({ productsLoading: loading }),
  
  setProductsError: (error) => set({ productsError: error }),

  // AR Session Actions
  setARSession: (session) =>
    set((state) => ({
      arSession: { ...state.arSession, ...session },
    })),

  setSelectedModel: (model) => set({ selectedModel: model }),

  // Model Transform Actions
  setModelTransform: (transform) =>
    set((state) => ({
      modelTransform: {
        position: { ...state.modelTransform.position, ...transform.position },
        scale: transform.scale ?? state.modelTransform.scale,
        rotation: { ...state.modelTransform.rotation, ...transform.rotation },
      },
    })),

  resetModelTransform: () => set({ modelTransform: defaultModelTransform }),

  // Model Loading Actions
  setModelLoading: (loading) =>
    set((state) => ({
      arSession: { ...state.arSession, modelLoading: loading },
    })),

  setModelError: (error) =>
    set((state) => ({
      arSession: { ...state.arSession, modelLoadError: error },
    })),
}));
