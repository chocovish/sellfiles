import { useState } from 'react';
import { Product } from '@/types/product';

export interface ShopCustomization {
  layout: 'grid' | 'list';
  showPrice: boolean;
  showDescription: boolean;
  showThumbnails: boolean;
  customCss: string;
  customJs: string;
}

export function useShopCustomization() {
  const [customization, setCustomization] = useState<ShopCustomization>({
    layout: 'grid',
    showPrice: true,
    showDescription: true,
    showThumbnails: true,
    customCss: '',
    customJs: ''
  });

  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const [bannerImage, setBannerImage] = useState<string>();

  const updateCustomization = (updates: Partial<ShopCustomization>) => {
    setCustomization(prev => ({ ...prev, ...updates }));
  };

  const saveCustomization = async () => {
    setIsSaving(true);
    try {
      // TODO: Implement API call to save customization
      await new Promise(resolve => setTimeout(resolve, 1000));
    } finally {
      setIsSaving(false);
    }
  };

  const loadProducts = async () => {
    setIsLoading(true);
    try {
      // TODO: Implement API call to load products
      await new Promise(resolve => setTimeout(resolve, 1000));
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    customization,
    products,
    isLoading,
    isSaving,
    previewMode,
    activeTab,
    bannerImage,
    setPreviewMode,
    setActiveTab,
    setBannerImage,
    updateCustomization,
    saveCustomization,
    loadProducts,
    ...customization // Spread customization properties for direct access
  };
} 