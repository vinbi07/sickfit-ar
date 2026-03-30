import { ProductDetail } from "../../components/ProductDetail";

export const metadata = {
  title: "Product Details - SickFit AR",
  description: "View product details and try on with AR",
};

interface ProductPageProps {
  params: Promise<{
    handle: string;
  }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { handle } = await params;

  return (
    <div className="min-h-screenbg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">SickFit AR</h1>
        </div>
      </header>
      <main>
        <ProductDetail handle={handle} />
      </main>
    </div>
  );
}
