import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useShopCustomization } from '@/routes/dashboard/shop-customization';
import { Star, X } from 'lucide-react';
import { Product } from '@/types/product';

export function FeaturedProducts() {
  const { 
    products, 
    featuredProducts, 
    setFeaturedProducts 
  } = useShopCustomization();

  const handleToggleFeatured = (productId: string) => {
    if (featuredProducts.includes(productId)) {
      setFeaturedProducts(featuredProducts.filter(id => id !== productId));
    } else {
      setFeaturedProducts([...featuredProducts, productId]);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 border-none shadow-sm">
        <h2 className="text-xl font-semibold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Featured Products</h2>
        
        <div className="space-y-4">
          <div>
            <Label className="text-gray-700">Select Featured Products</Label>
            <p className="text-sm text-gray-500 mb-4">
              Choose up to 4 products to feature at the top of your shop.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {products.map((product) => (
                <div 
                  key={product.id} 
                  className={`p-4 rounded-lg border transition-all ${
                    featuredProducts.includes(product.id)
                      ? 'border-purple-300 bg-purple-50'
                      : 'border-gray-200 bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100">
                        {product.imageUrl && (
                          <img 
                            src={product.imageUrl } 
                            alt={product.title} 
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{product.title}</h3>
                        <p className="text-sm text-gray-500">${product.price.toFixed(2)}</p>
                      </div>
                    </div>
                    <Button
                      variant={featuredProducts.includes(product.id) ? "destructive" : "outline"}
                      size="sm"
                      onClick={() => handleToggleFeatured(product.id)}
                      className={featuredProducts.includes(product.id) 
                        ? "bg-red-500 hover:bg-red-600" 
                        : "border-purple-200 hover:bg-purple-50"
                      }
                    >
                      {featuredProducts.includes(product.id) ? (
                        <X className="h-4 w-4" />
                      ) : (
                        <Star className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
} 