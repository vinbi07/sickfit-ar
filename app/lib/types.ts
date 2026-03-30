// Shopify Product & API Types
export interface ShopifyImage {
  id: string;
  url: string;
  altText?: string;
  width?: number;
  height?: number;
}

export interface ShopifyProductVariant {
  id: string;
  title: string;
  price: string;
  available: boolean;
  sku?: string;
}

export interface ShopifyMetafieldConnection {
  edges: Array<{
    node: {
      namespace: string;
      key: string;
      value: string;
      type: string;
    };
  }>;
}

export interface ShopifyMetafield {
  namespace: string;
  key: string;
  value: string;
  type: string;
}

export interface ShopifyProduct {
  id: string;
  title: string;
  handle: string;
  description: string;
  images: ShopifyImage[];
  variants: ShopifyProductVariant[];
  metafields?: ShopifyMetafieldConnection | ShopifyMetafield[];
  priceRange?: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
    maxVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  featuredImage?: ShopifyImage;
}

export interface ShopifyProductConnection {
  edges: Array<{
    node: ShopifyProduct;
  }>;
  pageInfo: {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    endCursor: string;
    startCursor: string;
  };
}

// AR Model Types
export interface ARModel {
  id: string;
  productId: string;
  url: string;
  format: 'glb' | 'usdz' | 'gltf';
  scale?: number;
  defaultPosition?: {
    x: number;
    y: number;
    z: number;
  };
}

// AR State Types
export interface ARModelTransform {
  position: {
    x: number;
    y: number;
    z: number;
  };
  scale: number;
  rotation: {
    x: number;
    y: number;
    z: number;
  };
}

export interface ARSessionState {
  isActive: boolean;
  isSupported: boolean;
  cameraPermissionGranted: boolean;
  cameraPermissionDenied: boolean;
  modelLoading: boolean;
  modelLoadError?: string;
}

export interface ARStoreState {
  // Products
  selectedProduct: ShopifyProduct | null;
  products: ShopifyProduct[];
  productsLoading: boolean;
  productsError?: string;

  // AR Session
  arSession: ARSessionState;
  selectedModel: ARModel | null;

  // Model Transforms
  modelTransform: ARModelTransform;

  // Methods
  setSelectedProduct: (product: ShopifyProduct | null) => void;
  setProducts: (products: ShopifyProduct[]) => void;
  setProductsLoading: (loading: boolean) => void;
  setProductsError: (error?: string) => void;

  setARSession: (session: Partial<ARSessionState>) => void;
  setSelectedModel: (model: ARModel | null) => void;

  setModelTransform: (transform: Partial<ARModelTransform>) => void;
  resetModelTransform: () => void;

  setModelLoading: (loading: boolean) => void;
  setModelError: (error?: string) => void;
}
