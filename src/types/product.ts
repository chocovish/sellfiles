export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  thumbnails: string[];
  images: string[];
  category: string;
  tags: string[];
  stock: number;
  createdAt: string;
  updatedAt: string;
  userId: string;
  isPublished: boolean;
  isFeatured: boolean;
  isDeleted: boolean;
  metadata: {
    [key: string]: any;
  };
} 