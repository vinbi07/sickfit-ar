import { GraphQLClient, gql } from 'graphql-request';
import type { ShopifyProduct, ShopifyProductConnection } from './types';

const SHOPIFY_STORE_DOMAIN =
  process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN ||
  process.env.NEXT_PUBLIC_SHOPIFY_STORE_URL ||
  '';
const SHOPIFY_STOREFRONT_TOKEN =
  process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN || '';

function normalizeStoreDomain(input: string): string {
  return input
    .trim()
    .replace(/^https?:\/\//i, '')
    .replace(/\/$/, '');
}

const normalizedStoreDomain = normalizeStoreDomain(SHOPIFY_STORE_DOMAIN);
const SHOPIFY_STOREFRONT_ENDPOINT = normalizedStoreDomain
  ? `https://${normalizedStoreDomain}/api/2024-01/graphql.json`
  : '';

const isShopifyConfigured = Boolean(
  normalizedStoreDomain && SHOPIFY_STOREFRONT_TOKEN
);

const AR_COLLECTION_HANDLE = 'ar-try-on';
const AR_COLLECTION_NUMERIC_ID = '595109544100';
const AR_COLLECTION_GID = `gid://shopify/Collection/${AR_COLLECTION_NUMERIC_ID}`;

if (!isShopifyConfigured) {
  console.warn(
    'Shopify credentials not configured. Set NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN (or NEXT_PUBLIC_SHOPIFY_STORE_URL) and NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN in .env.local'
  );
}

const client = isShopifyConfigured
  ? new GraphQLClient(SHOPIFY_STOREFRONT_ENDPOINT, {
      headers: {
        'X-Shopify-Storefront-Access-Token': SHOPIFY_STOREFRONT_TOKEN,
      },
    })
  : null;

// GraphQL Queries
const PRODUCTS_QUERY = gql`
  query GetProductsFromCollection($first: Int!, $after: String, $handle: String!, $collectionId: ID!) {
    collectionByHandle: collection(handle: $handle) {
      products(first: $first, after: $after) {
        edges {
          node {
            id
            title
            handle
            description
            images(first: 10) {
              edges {
                node {
                  id
                  url
                  altText
                  width
                  height
                }
              }
            }
            variants(first: 10) {
              edges {
                node {
                  id
                  title
                  price {
                    amount
                    currencyCode
                  }
                  availableForSale
                  sku
                }
              }
            }
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
              maxVariantPrice {
                amount
                currencyCode
              }
            }
            featuredImage {
              url
              altText
            }
            metafields(identifiers: [
              { namespace: "ar", key: "model_url" },
              { namespace: "ar", key: "model_scale" }
            ]) {
              namespace
              key
              value
              type
            }
          }
        }
        pageInfo {
          hasNextPage
          hasPreviousPage
          endCursor
          startCursor
        }
      }
    }
    collectionById: node(id: $collectionId) {
      ... on Collection {
        products(first: $first, after: $after) {
          edges {
            node {
              id
              title
              handle
              description
              images(first: 10) {
                edges {
                  node {
                    id
                    url
                    altText
                    width
                    height
                  }
                }
              }
              variants(first: 10) {
                edges {
                  node {
                    id
                    title
                    price {
                      amount
                      currencyCode
                    }
                    availableForSale
                    sku
                  }
                }
              }
              priceRange {
                minVariantPrice {
                  amount
                  currencyCode
                }
                maxVariantPrice {
                  amount
                  currencyCode
                }
              }
              featuredImage {
                url
                altText
              }
              metafields(identifiers: [
                { namespace: "ar", key: "model_url" },
                { namespace: "ar", key: "model_scale" }
              ]) {
                namespace
                key
                value
                type
              }
            }
          }
          pageInfo {
            hasNextPage
            hasPreviousPage
            endCursor
            startCursor
          }
        }
      }
    }
  }
`;

const PRODUCT_BY_HANDLE_QUERY = gql`
  query GetProductByHandle($handle: String!) {
    productByHandle(handle: $handle) {
      id
      title
      handle
      description
      images(first: 10) {
        edges {
          node {
            id
            url
            altText
            width
            height
          }
        }
      }
      variants(first: 10) {
        edges {
          node {
            id
            title
            price {
              amount
              currencyCode
            }
            availableForSale
            sku
          }
        }
      }
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
        maxVariantPrice {
          amount
          currencyCode
        }
      }
      featuredImage {
        url
        altText
      }
      metafields(identifiers: [
        { namespace: "ar", key: "model_url" },
        { namespace: "ar", key: "model_scale" }
      ]) {
        namespace
        key
        value
        type
      }
    }
  }
`;

// API Functions
export async function fetchProducts(
  first: number = 10,
  after?: string
): Promise<ShopifyProductConnection | null> {
  if (!client) {
    throw new Error(
      'Shopify is not configured. Check NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN and NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN in .env.local'
    );
  }

  try {
    const data = await client.request<{
      collectionByHandle?: { products: ShopifyProductConnection } | null;
      collectionById?: { products: ShopifyProductConnection } | null;
    }>(
      PRODUCTS_QUERY,
      {
        first,
        after,
        handle: AR_COLLECTION_HANDLE,
        collectionId: AR_COLLECTION_GID,
      }
    );

    const collectionProducts =
      data.collectionByHandle?.products || data.collectionById?.products;

    if (!collectionProducts) {
      console.warn(
        `AR collection not found (handle: ${AR_COLLECTION_HANDLE}, id: ${AR_COLLECTION_NUMERIC_ID})`
      );
      return null;
    }

    return collectionProducts;
  } catch (error) {
    console.error('Error fetching products:', error);
    return null;
  }
}

export async function fetchProductByHandle(
  handle: string
): Promise<ShopifyProduct | null> {
  if (!client) {
    throw new Error(
      'Shopify is not configured. Check NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN and NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN in .env.local'
    );
  }

  try {
    const data = await client.request<{ productByHandle: ShopifyProduct }>(
      PRODUCT_BY_HANDLE_QUERY,
      { handle }
    );
    return data.productByHandle;
  } catch (error) {
    console.error('Error fetching product by handle:', error);
    return null;
  }
}

// Helper function to extract metafield value
export function getMetafieldValue(
  metafields: any,
  namespace: string,
  key: string
): string | null {
  if (!metafields) return null;

  if (Array.isArray(metafields)) {
    const field = metafields.find(
      (item: any) => item?.namespace === namespace && item?.key === key
    );
    return field?.value || null;
  }

  if (metafields?.edges) {
    const field = metafields.edges.find(
      (edge: any) => edge.node.namespace === namespace && edge.node.key === key
    );
    return field?.node.value || null;
  }

  return null;
}

// Helper function to transform API response to Product[]
export function transformProducts(connection: ShopifyProductConnection): ShopifyProduct[] {
  return connection.edges.map((edge) => {
    const node = edge.node as any;
    return {
      id: node.id,
      title: node.title,
      handle: node.handle,
      description: node.description,
      images: node.images?.edges?.map((img: any) => ({
        id: img.node.id,
        url: img.node.url,
        altText: img.node.altText,
        width: img.node.width,
        height: img.node.height,
      })) || [],
      variants: node.variants?.edges?.map((variant: any) => ({
        id: variant.node.id,
        title: variant.node.title,
        price: variant.node.price?.amount || '0',
        available: variant.node.availableForSale,
        sku: variant.node.sku,
      })) || [],
      priceRange: node.priceRange,
      featuredImage: node.featuredImage,
      metafields: node.metafields,
    };
  });
}
