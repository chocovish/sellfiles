import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState, createContext, useContext } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Toggle } from '@/components/ui/toggle';
import { Dropzone } from '@/components/dropzone';
import { 
  getShopCustomization, 
  updateShopCustomization, 
  type ShopCustomization
} from '@/actions/shop-customization';
import { getProducts as getProductsAction, type Product } from '@/actions/products';
import { toast } from 'sonner';
import { ImageCarousel } from '@/components/ui/image-carousel';
import { 
  Palette, 
  LayoutGrid, 
  Image as ImageIcon, 
  Link as LinkIcon, 
  Type, 
  Star, 
  Code, 
  Save, 
  Eye, 
  EyeOff, 
  DollarSign, 
  FileText, 
  Image as ImageIcon2,
  Loader2
} from 'lucide-react';
import { GeneralSettings } from '@/components/shop-customization/general-settings';
import { BannerSettings } from '@/components/shop-customization/banner-settings';
import { FeaturedProducts } from '@/components/shop-customization/featured-products';
import { ProductDisplaySettings } from '@/components/shop-customization/product-display-settings';
import { AdvancedSettings } from '@/components/shop-customization/advanced-settings';
import { ShopPreview } from '@/components/shop-customization/shop-preview';

// Create a context for shop customization state
export const ShopCustomizationContext = createContext<{
  customization: ShopCustomization | null;
  products: Product[];
  isLoading: boolean;
  isSaving: boolean;
  previewMode: boolean;
  activeTab: string;
  bannerImage: string | undefined;
  bannerLink: string | undefined;
  bannerText: string | undefined;
  featuredProducts: string[];
  productLayout: string;
  accentColor: string;
  showPrice: boolean;
  showDescription: boolean;
  showThumbnails: boolean;
  customCss: string | undefined;
  customJs: string | undefined;
  setActiveTab: (tab: string) => void;
  setPreviewMode: (mode: boolean) => void;
  setBannerImage: (image: string | undefined) => void;
  setBannerLink: (link: string | undefined) => void;
  setBannerText: (text: string | undefined) => void;
  setFeaturedProducts: (products: string[]) => void;
  setProductLayout: (layout: string) => void;
  setAccentColor: (color: string) => void;
  setShowPrice: (show: boolean) => void;
  setShowDescription: (show: boolean) => void;
  setShowThumbnails: (show: boolean) => void;
  setCustomCss: (css: string | undefined) => void;
  setCustomJs: (js: string | undefined) => void;
  handleSave: () => Promise<void>;
  handleProductSelect: (productId: string) => void;
  getFeaturedProductsData: () => Product[];
}>({
  customization: null,
  products: [],
  isLoading: true,
  isSaving: false,
  previewMode: false,
  activeTab: 'general',
  bannerImage: undefined,
  bannerLink: undefined,
  bannerText: undefined,
  featuredProducts: [],
  productLayout: 'grid',
  accentColor: '#6366f1',
  showPrice: true,
  showDescription: true,
  showThumbnails: true,
  customCss: undefined,
  customJs: undefined,
  setActiveTab: () => {},
  setPreviewMode: () => {},
  setBannerImage: () => {},
  setBannerLink: () => {},
  setBannerText: () => {},
  setFeaturedProducts: () => {},
  setProductLayout: () => {},
  setAccentColor: () => {},
  setShowPrice: () => {},
  setShowDescription: () => {},
  setShowThumbnails: () => {},
  setCustomCss: () => {},
  setCustomJs: () => {},
  handleSave: async () => {},
  handleProductSelect: () => {},
  getFeaturedProductsData: () => [],
});

export const useShopCustomization = () => useContext(ShopCustomizationContext);

export const Route = createFileRoute('/dashboard/shop-customization')({
  component: ShopCustomizationPage,
});

function ShopCustomizationPage() {
  const [customization, setCustomization] = useState<ShopCustomization | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [activeTab, setActiveTab] = useState('general');

  // Form state
  const [bannerImage, setBannerImage] = useState<string | undefined>(undefined);
  const [bannerLink, setBannerLink] = useState<string | undefined>(undefined);
  const [bannerText, setBannerText] = useState<string | undefined>(undefined);
  const [featuredProducts, setFeaturedProducts] = useState<string[]>([]);
  const [productLayout, setProductLayout] = useState<string>('grid');
  const [accentColor, setAccentColor] = useState<string>('#6366f1');
  const [showPrice, setShowPrice] = useState<boolean>(true);
  const [showDescription, setShowDescription] = useState<boolean>(true);
  const [showThumbnails, setShowThumbnails] = useState<boolean>(true);
  const [customCss, setCustomCss] = useState<string | undefined>(undefined);
  const [customJs, setCustomJs] = useState<string | undefined>(undefined);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [customizationData, productsData] = await Promise.all([
        getShopCustomization({ data: { userId: undefined } }),
        getProductsAction({ data: { userId: undefined } })
      ]);
      
      setProducts(productsData);
      
      if (customizationData) {
        setCustomization(customizationData);
        // Set form state from customization data
        setBannerImage(customizationData.bannerImage || undefined);
        setBannerLink(customizationData.bannerLink || undefined);
        setBannerText(customizationData.bannerText || undefined);
        setFeaturedProducts(customizationData.featuredProducts);
        setProductLayout(customizationData.productLayout);
        setAccentColor(customizationData.accentColor);
        setShowPrice(customizationData.showPrice);
        setShowDescription(customizationData.showDescription);
        setShowThumbnails(customizationData.showThumbnails);
        setCustomCss(customizationData.customCss || undefined);
        setCustomJs(customizationData.customJs || undefined);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load shop customization data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await updateShopCustomization({
        data: {
          bannerImage,
          bannerLink,
          bannerText,
          featuredProducts,
          productLayout,
          accentColor,
          showPrice,
          showDescription,
          showThumbnails,
          customCss,
          customJs,
        }
      });
      toast.success('Shop customization saved successfully');
      fetchData(); // Refresh data
    } catch (error) {
      console.error('Error saving shop customization:', error);
      toast.error('Failed to save shop customization');
    } finally {
      setIsSaving(false);
    }
  };

  const handleProductSelect = (productId: string) => {
    setFeaturedProducts(prev => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId);
      } else {
        return [...prev, productId];
      }
    });
  };

  const getFeaturedProductsData = () => {
    return products.filter(product => featuredProducts.includes(product.id));
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex items-center justify-center h-[50vh]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-purple-600 mb-4" />
            <h1 className="text-2xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Loading Shop Customization</h1>
            <p className="text-gray-500">Please wait while we load your shop settings...</p>
          </div>
        </div>
      </div>
    );
  }

  const contextValue = {
    customization,
    products,
    isLoading,
    isSaving,
    previewMode,
    activeTab,
    bannerImage,
    bannerLink,
    bannerText,
    featuredProducts,
    productLayout,
    accentColor,
    showPrice,
    showDescription,
    showThumbnails,
    customCss,
    customJs,
    setActiveTab,
    setPreviewMode,
    setBannerImage,
    setBannerLink,
    setBannerText,
    setFeaturedProducts,
    setProductLayout,
    setAccentColor,
    setShowPrice,
    setShowDescription,
    setShowThumbnails,
    setCustomCss,
    setCustomJs,
    handleSave,
    handleProductSelect,
    getFeaturedProductsData,
  };

  return (
    <ShopCustomizationContext.Provider value={contextValue}>
      <div className="container mx-auto p-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Shop Customization
          </h1>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => setPreviewMode(!previewMode)}
              className="border-purple-200 hover:bg-purple-50"
            >
              {previewMode ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
              {previewMode ? 'Hide Preview' : 'Preview Shop'}
            </Button>
            <Button 
              variant="default" 
              onClick={handleSave}
              disabled={isSaving}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {isSaving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 md:grid-cols-5 mb-6 bg-gradient-to-r from-blue-50 to-purple-50 p-1 rounded-lg">
            <TabsTrigger value="general" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-purple-600">
              <Palette className="h-4 w-4" />
              <span className="hidden md:inline">General</span>
            </TabsTrigger>
            <TabsTrigger value="banner" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-purple-600">
              <ImageIcon className="h-4 w-4" />
              <span className="hidden md:inline">Banner</span>
            </TabsTrigger>
            <TabsTrigger value="featured" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-purple-600">
              <Star className="h-4 w-4" />
              <span className="hidden md:inline">Featured</span>
            </TabsTrigger>
            <TabsTrigger value="products" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-purple-600">
              <LayoutGrid className="h-4 w-4" />
              <span className="hidden md:inline">Products</span>
            </TabsTrigger>
            <TabsTrigger value="advanced" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-purple-600">
              <Code className="h-4 w-4" />
              <span className="hidden md:inline">Advanced</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <GeneralSettings />
          </TabsContent>

          <TabsContent value="banner">
            <BannerSettings />
          </TabsContent>

          <TabsContent value="featured">
            <FeaturedProducts />
          </TabsContent>

          <TabsContent value="products">
            <ProductDisplaySettings />
          </TabsContent>

          <TabsContent value="advanced">
            <AdvancedSettings />
          </TabsContent>
        </Tabs>

        {previewMode && <ShopPreview />}
      </div>
    </ShopCustomizationContext.Provider>
  );
} 