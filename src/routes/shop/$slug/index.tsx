import { createFileRoute, Link, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/shop/$slug/')({
  component: UserShopPage,
  ssr: true,
  beforeLoad: async ({ params }) => {
    const { slug } = params;
    const products = (await getProductsBySlug({data: {slug}})).filter(product => product.isVisible);
    return {products};
  },
  loader(ctx) {
    return ctx.context.products
  },
})

import { Card, CardContent } from '@/components/ui/card';
import { getProducts, getProductsBySlug } from '@/actions/products';
import { ShoppingCart, Star, Tag, Eye, Store } from 'lucide-react';
import ShopHeader from '@/components/shop/ShopHeader';

// type Product = {
//   id: string;
//   title: string;
//   description: string;
//   price: number;
//   imageUrl: string;
//   fileUrl: string;
//   isVisible: boolean;
//   displayOrder: number;
// };

function UserShopPage() {
  let products = Route.useLoaderData();
  let { slug } = Route.useParams();
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50">
      <ShopHeader shopName={slug} />
      
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* <div className="text-center mb-16">
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Explore Digital Treasures
            </h1>
            <p className="mt-4 text-gray-700 text-lg">
              Discover and purchase amazing digital products crafted just for you.
            </p>
          </div> */}
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <Link to={`/shop/$slug/$productId`} params={{slug,productId: product.id}} key={product.id}>
                <Card className="py-0 group h-full overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.05] bg-gradient-to-br from-purple-50 to-blue-50 border border-gray-200 hover:border-purple-400 rounded-xl">
                  <div className="relative">
                  {/* Product Image */}
                  <div className="aspect-[4/3] overflow-hidden bg-gradient-to-br from-purple-100 to-blue-100 rounded-t-xl">
                    <img
                    src={product.imageUrl}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
                    />
                  </div>
                  
                  {/* Price Tag */}
                  <div className="absolute top-4 right-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-full shadow-md flex items-center gap-2">
                    <Tag className="w-5 h-5 text-white" />
                    <span className="font-bold">
                    ₹{product.price}
                    </span>
                  </div>
                  </div>

                  <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                    <h2 className="text-xl font-semibold text-gray-800 group-hover:text-purple-600 transition-colors line-clamp-1">
                      {product.title}
                    </h2>
                    <p className="mt-2 text-gray-600 text-sm line-clamp-2">
                        {product.description.replace(/<\/?[^>]+(>|$)/g, "")}
                    </p>
                    </div>
                  </div>

                  {/* Action Bar */}
                  <div className="mt-6 flex items-center justify-between">
                    <div className="flex items-center gap-1 text-yellow-400">
                    <Star className="w-5 h-5 fill-current" />
                    <Star className="w-5 h-5 fill-current" />
                    <Star className="w-5 h-5 fill-current" />
                    <Star className="w-5 h-5 fill-current" />
                    <Star className="w-5 h-5 fill-current" />
                    </div>
                    <div className="flex items-center gap-2 text-purple-600 font-medium text-sm">
                    <Eye className="w-5 h-5" />
                    <span>View Details</span>
                    </div>
                  </div>

                  {/* Buy Button */}
                  {/* <div className="mt-6 transition-transform transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100">
                    <div className="flex items-center justify-center gap-2 py-3 px-5 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium shadow-lg hover:shadow-xl">
                    <ShoppingCart className="w-5 h-5" />
                    <span>Buy Now</span>
                    </div>
                  </div> */}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
      <Outlet />
    </div>
  );
}