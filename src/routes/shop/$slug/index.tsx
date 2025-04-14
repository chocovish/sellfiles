import { createFileRoute } from '@tanstack/react-router'
import { ProductCard } from '@/components/shop/ProductCard';
export const Route = createFileRoute('/shop/$slug/')({
  component: UserShopPage,
  ssr: true,
  beforeLoad: async ({ params }) => {
    const { slug } = params;
    const products = (await getProductsBySlug({data: {slug}})).filter(product => product.isVisible);
    const shopCustomization = await getShopCustomizationBySlug({data: {slug}});
    return {products, shopCustomization};
  },
  loader(ctx) {
    return {
      products: ctx.context.products,
      shopCustomization: ctx.context.shopCustomization
    }
  },
})

import { Card, CardContent } from '@/components/ui/card';
import { getProducts, getProductsBySlug } from '@/actions/products';
import { ShoppingCart, Star, Tag, Eye, Store } from 'lucide-react';
import ShopHeader from '@/components/shop/ShopHeader';
import { getShopCustomizationBySlug } from '@/actions/shop-customization';
import { ImageCarousel } from '@/components/ui/image-carousel';
import { useEffect, useState } from 'react';
import { FeaturedProductsCarousel } from '@/components/shop/FeaturedProductsCarousel';

export function UserShopPage() {
  let { products, shopCustomization } = Route.useLoaderData();
  let { slug } = Route.useParams();
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  
  useEffect(() => {
    if (shopCustomization?.featuredProducts?.length ?? 0) {
      const featured = products.filter((product: any) => 
        shopCustomization?.featuredProducts.includes(product.id)
      );
      setFeaturedProducts(featured);
    }
  }, [products, shopCustomization]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50">
      <ShopHeader shopName={slug} />
      
      {/* Banner Section */}
      {shopCustomization?.bannerImage && (
        <div className="relative w-full overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="relative rounded-xl overflow-hidden shadow-lg">
            <a href={shopCustomization.bannerLink ?? ""} target="_blank" rel="noopener noreferrer" className={!shopCustomization.bannerLink ? "pointer-events-none": ""}>
                  <img 
                    src={shopCustomization.bannerImage} 
                    alt="Shop Banner" 
                    className="w-full h-48 object-cover"
                  />
                  {/* {shopCustomization.bannerText && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black opacity-60">
                      <h2 className="text-white text-2xl font-bold px-4 py-2 rounded bg-black opacity-60">
                        {shopCustomization.bannerText}
                      </h2>
                    </div>
                  )} */}
                </a>
            </div>
          </div>
        </div>
      )}
      
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          
          {/* Featured Products Carousel */}
          {featuredProducts.length > 0 && (
            <FeaturedProductsCarousel products={featuredProducts} shopSlug={slug} />
          )}
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} shopSlug={slug} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

