import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getProducts, restoreProduct } from '@/actions/products';
import { Search, RotateCcw, X } from 'lucide-react';
import { toast } from 'sonner';

export const Route = createFileRoute('/dashboard/archived-products')({
  component: ArchivedProductsPage,
})

type Product = {
  id: string;
  title: string;
  description: string;
  price: number;
  imageUrl: string;
  fileUrl: string;
  isVisible: boolean;
  isArchived: boolean;
  displayOrder: number;
};

function ArchivedProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchArchivedProducts();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter((product) => 
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  }, [searchQuery, products]);

  const fetchArchivedProducts = async () => {
    try {
      const data = await getProducts({data: {includeArchived: true}});
      const archivedProducts = data.filter(product => product.isArchived);
      setProducts(archivedProducts);
      setFilteredProducts(archivedProducts);
    } catch (error) {
      console.error('Error fetching archived products:', error);
    }
  };

  const handleRestore = async (product: Product) => {
    try {
      await restoreProduct({data: {id: product.id}});
      toast.success('Product restored successfully');
      fetchArchivedProducts();
    } catch (error) {
      console.error('Error restoring product:', error);
      toast.error('Failed to restore product');
    }
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="container mx-auto md:p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Archived Products</h1>
        </div>

        <div className="mb-4 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1 order-1 md:order-2">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              className="pl-10"
              placeholder="Search archived products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6"
                onClick={() => setSearchQuery('')}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        <div className="space-y-4">
          {filteredProducts.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-gray-500">No archived products found.</p>
            </Card>
          ) : (
            filteredProducts.map((product) => (
              <Card
                key={product.id}
                className="p-4 shadow-md transform hover:scale-[1.01] transition-all duration-300 bg-gray-100 opacity-75"
              >
                <div className="flex max-sm:flex-col md:justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
                      <img
                        src={product.imageUrl}
                        alt={product.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-grow">
                      <h3 className="font-semibold text-lg text-gray-500">{product.title}</h3>
                      <p className="text-sm font-medium text-gray-500">
                        ${product.price}
                      </p>
                      <span className="text-xs text-gray-500">Archived</span>
                    </div>
                  </div>
                  <div className="flex items-center mt-4 md:mt-0">
                    <Button
                      variant="outline"
                      onClick={() => handleRestore(product)}
                      className="bg-white hover:bg-gray-50"
                    >
                      <RotateCcw className="h-4 w-4 mr-2" /> Restore
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </main>
  );
} 