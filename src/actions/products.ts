import { prisma } from '@/lib/prisma';
import { auth, requireAuth } from '@/lib/auth';
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
  isArchived: boolean;
  displayOrder: number;
  thumbnails: {
    id: string;
    fileUrl: string;
    isFeatured: boolean;
  }[];
};

export const getProducts = createServerFn()
  .validator(
    zv(z.object({
      userId: z.string().optional(),
      includeArchived: z.boolean().optional().default(false)
    }))
  )
  .handler(async ({data: { userId, includeArchived }}) => {
    const user = await auth();
    userId = userId ?? user?.id;
    if (!userId) {
      throw new Error('User not authenticated');
    }
    try {
      const products = await prisma.product.findMany({
        where: { 
          userId,
          isArchived: includeArchived ? undefined : false
        },
        orderBy: { displayOrder: 'asc' },
        include: {
          thumbnails: true
        }
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
  fileUrl: z.string(),
  thumbnails: z.array(z.object({
    id: z.string(),
    fileUrl: z.string(),
    displayOrder: z.number()
  })).optional()
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

      const { thumbnails, ...productData } = data;

      const product = await prisma.product.create({
        data: {
          ...productData,
          isVisible: true,
          displayOrder,
          userId: user.id,
          thumbnails: thumbnails ? {
            create: thumbnails.map(thumb => ({
              id: thumb.id,
              fileUrl: thumb.fileUrl,
              displayOrder: thumb.displayOrder
            }))
          } : undefined
        },
        include: {
          thumbnails: true
        }
      });
      return product;
    } catch (error) {
      console.error('Error creating product:', error);
      throw new Error('Failed to create product');
    }
  });
export const updateProductInputSchema = createProductInputSchema.partial().extend({ 
  id: z.string(),
});
export const updateProduct = createServerFn()
  .validator(
    zv(updateProductInputSchema)
  )
  .handler(async ({ data: { id, thumbnails, ...data } }) => {
    const user = await requireAuth();
    if (
      await prisma.product.count({
        where: { id, userId: user.id }
      }) === 0
    ) throw new Error('logged in user is not owner of product');
    try {
      const product = await prisma.product.update({
        where: { id },
        data: {
          ...data,
          thumbnails: thumbnails ? {
            deleteMany: {},
            create: thumbnails.map(thumb => ({
              id: thumb.id,
              fileUrl: thumb.fileUrl,
              displayOrder: thumb.displayOrder
            }))
          } : undefined
        },
        include: {
          thumbnails: true
        }
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
        where: { id },
        include: {
          thumbnails: true
        }
      });
      return product;
    } catch (error) {
      console.error('Error fetching product by ID:', error);
      throw new Error('Failed to fetch product by ID');
    }
  });

export const archiveProduct = createServerFn()
  .validator(
    zv(
      z.object({
        id: z.string()
      })
    )
  )
  .handler(async ({ data: { id } }) => {
    try {
      const user = await requireAuth();
      if (
        await prisma.product.count({
          where: { id, userId: user.id }
        }) === 0
      ) throw new Error('logged in user is not owner of product');
      
      const product = await prisma.product.update({
        where: { id },
        data: { isArchived: true, isVisible: false }
      });
      return product;
    } catch (error) {
      console.error('Error archiving product:', error);
      throw new Error('Failed to archive product');
    }
  });

export const restoreProduct = createServerFn()
  .validator(
    zv(
      z.object({
        id: z.string()
      })
    )
  )
  .handler(async ({ data: { id } }) => {
    try {
      const user = await requireAuth();
      if (
        await prisma.product.count({
          where: { id, userId: user.id }
        }) === 0
      ) throw new Error('logged in user is not owner of product');
      
      const product = await prisma.product.update({
        where: { id },
        data: { isArchived: false }
      });
      return product;
    } catch (error) {
      console.error('Error restoring product:', error);
      throw new Error('Failed to restore product');
    }
  });
