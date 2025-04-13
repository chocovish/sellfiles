import { Card } from '@/components/ui/card';
import { useShopCustomization } from '@/routes/dashboard/shop-customization';
import { Eye } from 'lucide-react';

export function ShopPreview() {
  const { 
    layout,
    showPrice,
    showDescription,
    showThumbnails,
    customCss,
    customJs
  } = useShopCustomization();

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 border-none shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Eye className="h-5 w-5 text-blue-600" />
          <h2 className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Shop Preview</h2>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className={`grid gap-4 ${layout === 'grid' ? 'grid-cols-3' : 'grid-cols-1'}`}>
            {/* Sample Product Card */}
            <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="aspect-square bg-gray-100 rounded-md mb-3"></div>
              <h3 className="font-medium text-gray-900">Sample Product</h3>
              {showPrice && (
                <p className="text-blue-600 font-semibold mt-1">$99.99</p>
              )}
              {showDescription && (
                <p className="text-gray-500 text-sm mt-2">
                  This is a sample product description that would appear in your shop.
                </p>
              )}
              {showThumbnails && (
                <div className="flex gap-2 mt-3">
                  <div className="w-12 h-12 bg-gray-200 rounded"></div>
                  <div className="w-12 h-12 bg-gray-200 rounded"></div>
                  <div className="w-12 h-12 bg-gray-200 rounded"></div>
                </div>
              )}
            </div>

            {/* Repeat sample product cards */}
            {[1, 2, 3].map((i) => (
              <div key={i} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="aspect-square bg-gray-100 rounded-md mb-3"></div>
                <h3 className="font-medium text-gray-900">Sample Product {i + 1}</h3>
                {showPrice && (
                  <p className="text-blue-600 font-semibold mt-1">$99.99</p>
                )}
                {showDescription && (
                  <p className="text-gray-500 text-sm mt-2">
                    This is a sample product description that would appear in your shop.
                  </p>
                )}
                {showThumbnails && (
                  <div className="flex gap-2 mt-3">
                    <div className="w-12 h-12 bg-gray-200 rounded"></div>
                    <div className="w-12 h-12 bg-gray-200 rounded"></div>
                    <div className="w-12 h-12 bg-gray-200 rounded"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 text-sm text-gray-500">
          <p>This is a live preview of how your shop will look with the current settings.</p>
          <p className="mt-1">Any custom CSS or JavaScript you've added will be applied to this preview.</p>
        </div>
      </Card>
    </div>
  );
} 