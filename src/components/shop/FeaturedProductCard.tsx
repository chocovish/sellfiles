import { Link } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Eye, Star, Tag } from "lucide-react";
import { type getProductsBySlug } from "@/actions/products";

type Product = Awaited<ReturnType<typeof getProductsBySlug>>[number];

type FeaturedProductCardProps = {
  product: Product;
  shopSlug: string;
};

export function FeaturedProductCard({ product, shopSlug }: FeaturedProductCardProps) {
  return (
    <Link
      to={`/shop/$slug/$productId`}
      params={{ slug: shopSlug, productId: product.id }}
      className="block w-full h-full"
    >
      <Card className="h-[400px] p-0 group overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] bg-gradient-to-br from-purple-50 to-blue-50 border-0">
        <div className="relative h-[400px] overflow-hidden">
          {/* Product Image */}
          <img
            src={product.imageUrl}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
          />

          {/* Overlay gradient for text */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

          {/* Product Info Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-white line-clamp-1">
                {product.title}
              </h2>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                <Tag className="w-5 h-5 text-white" />
                <span className="font-bold text-white">₹{product.price}</span>
              </div>
            </div>

            <p className="text-white/90 line-clamp-2 mb-6 text-lg">
              {product.description.replace(/<\/?[^>]+(>|$)/g, "")}
            </p>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-current" />
                ))}
              </div>
              <div className="flex items-center gap-2 text-white font-medium">
                <Eye className="w-5 h-5" />
                <span>View Details</span>
              </div>
            </div>
          </div>

          {/* Featured Badge */}
          <div className="absolute top-4 left-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-full shadow-lg">
            Featured
          </div>
        </div>
      </Card>
    </Link>
  );
}