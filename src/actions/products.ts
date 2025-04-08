
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';
import { zv } from '~/lib/utils';

export type Product = {
  id: string;
  title: string;
  description: string;
  price: number;
  imageUrl: string;
  fileUrl: string;
  isVisible: boolean;
  displayOrder: number;
};

export const getProducts = createServerFn()
  .validator(
    zv(z.object({
      userId: z.string().optional()
    }))
  )
  .handler(async ({data: { userId }}) => {
    const user = await auth();
    userId = userId ?? user?.id;
    if (!userId) {
      throw new Error('User not authenticated');
    }
    try {
      const products = await prisma.product.findMany({
        where: { userId },
        orderBy: { displayOrder: 'asc' }
      });
      return products;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw new Error('Failed to fetch products');
    }
  });

export const getProductsBySlug = createServerFn()
  .validator(
    zv(z.object({
      slug: z.string()
    }))
  )
  .handler(async ({ data: { slug } }) => {
    try {
      const user = await prisma.user.findUnique({
        where: { shopSlug: slug },
        select: { id: true }
      });

      if (!user?.id) {
        throw new Error('User not found');
      }

      return getProducts({ data: { userId: user.id } });
    } catch (error) {
      console.error('Error fetching products by slug:', error);
      throw new Error('Failed to fetch products by slug');
    }
  });

export const createProductInputSchema = z.object({
  title: z.string(),
  description: z.string(),
  price: z.number(),
  imageUrl: z.string(),
  fileUrl: z.string()
});
export const createProduct = createServerFn()
  .validator(
    zv(createProductInputSchema)
  )
  .handler(async ({ data }) => {
    try {
      const user = await auth();
      if (!user?.id) {
        throw new Error('User not authenticated');
      }

      const lastProduct = await prisma.product.findFirst({
        orderBy: { displayOrder: 'desc' }
      });
      const displayOrder = lastProduct ? lastProduct.displayOrder + 1 : 0;

      const product = await prisma.product.create({
        data: {
          ...data,
          isVisible: true,
          displayOrder,
          userId: user.id
        }
      });
      return product;
    } catch (error) {
      console.error('Error creating product:', error);
      throw new Error('Failed to create product');
    }
  });

export const updateProduct = createServerFn()
  .validator(
    zv(
      z.object({
        id: z.string(),
        data: z.object({
          title: z.string().optional(),
          description: z.string().optional(),
          price: z.number().optional(),
          imageUrl: z.string().optional(),
          fileUrl: z.string().optional(),
          isVisible: z.boolean().optional(),
          displayOrder: z.number().optional()
        })
      })
    )
  )
  .handler(async ({ data: { id, data } }) => {
    try {
      const product = await prisma.product.update({
        where: { id },
        data
      });
      return product;
    } catch (error) {
      console.error('Error updating product:', error);
      throw new Error('Failed to update product');
    }
  });

export const updateProductsOrder = createServerFn()
  .validator(
    zv(
      z.object({
        products: z.array(
          z.object({
            id: z.string(),
            displayOrder: z.number()
          })
        )
      })
    )
  )
  .handler(async ({ data: { products } }) => {
    try {
      const updates = products.map((product) =>
        prisma.product.update({
          where: { id: product.id },
          data: { displayOrder: product.displayOrder }
        })
      );
      await prisma.$transaction(updates);
      return true;
    } catch (error) {
      console.error('Error updating product order:', error);
      throw new Error('Failed to update product order');
    }
  });

export const toggleProductVisibility = createServerFn()
  .validator(
    zv(
      z.object({
        id: z.string(),
        isVisible: z.boolean()
      })
    )
  )
  .handler(async ({ data: { id, isVisible } }) => {
    try {
      const product = await prisma.product.update({
        where: { id },
        data: { isVisible }
      });
      return product;
    } catch (error) {
      console.error('Error toggling product visibility:', error);
      throw new Error('Failed to toggle product visibility');
    }
  });

export const deleteProduct = createServerFn()
  .validator(
    zv(
      z.object({
        id: z.string()
      })
    )
  )
  .handler(async ({ data: { id } }) => {
    try {
      await prisma.product.delete({
        where: { id }
      });
      return true;
    } catch (error) {
      console.error('Error deleting product:', error);
      throw new Error('Failed to delete product');
    }
  });

export const getProductById = createServerFn()
  .validator(
    zv(
      z.object({
        id: z.string()
      })
    )
  )
  .handler(async ({ data: { id } }) => {
    try {
      const product = await prisma.product.findUnique({
        where: { id }
      });
      return product;
    } catch (error) {
      console.error('Error fetching product by ID:', error);
      throw new Error('Failed to fetch product by ID');
    }
  });
