import { Link, useParams } from "@tanstack/react-router";
import { Card, CardContent } from "../ui/card";
import { Eye, Star, Tag } from "lucide-react";
import {type getProductsBySlug} from "@/actions/products";
type Product = Awaited<ReturnType<typeof getProductsBySlug>>[number];

type ProductCardProps = {
  product: Product;
  shopSlug: string;
};
export function ProductCard({product, shopSlug}: ProductCardProps) {
    return <Link to={`/shop/$slug/$productId`} params={{ slug: shopSlug, productId: product.id }} key={product.id}>
      <Card className="py-0 group h-full overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.05] bg-gradient-to-br from-purple-50 to-blue-50 border border-gray-200 hover:border-purple-400 rounded-xl">
        <div className="relative">
          {/* Product Image */}
          <div className="aspect-[4/3] overflow-hidden bg-gradient-to-br from-purple-100 to-blue-100 rounded-t-xl">
            <img
              src={product.imageUrl}
              alt={product.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out" />
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
    </Link>;
  }