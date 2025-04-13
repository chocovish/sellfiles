import { prisma } from '@/lib/prisma';
import { auth, requireAuth } from '@/lib/auth';
import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';
import { zv } from '~/lib/utils';

export type ShopCustomization = {
  id: string;
  userId: string;
  bannerImage: string | null;
  bannerLink: string | null;
  bannerText: string | null;
  featuredProducts: string[];
  productLayout: string;
  accentColor: string;
  showPrice: boolean;
  showDescription: boolean;
  showThumbnails: boolean;
  customCss: string | null;
  customJs: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export const getShopCustomization = createServerFn()
  .validator(
    zv(z.object({
      userId: z.string().optional(),
    }))
  )
  .handler(async ({ data: { userId } }) => {
    const user = await auth();
    userId = userId ?? user?.id;
    if (!userId) {
      throw new Error('User not authenticated');
    }
    try {
      const customization = await prisma.shopCustomization.findUnique({
        where: { userId }
      });
      return customization;
    } catch (error) {
      console.error('Error fetching shop customization:', error);
      throw new Error('Failed to fetch shop customization');
    }
  });

export const getShopCustomizationBySlug = createServerFn()
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

      return getShopCustomization({ data: { userId: user.id } });
    } catch (error) {
      console.error('Error fetching shop customization by slug:', error);
      throw new Error('Failed to fetch shop customization by slug');
    }
  });

export const createShopCustomizationInputSchema = z.object({
  bannerImage: z.string().optional(),
  bannerLink: z.string().optional(),
  bannerText: z.string().optional(),
  featuredProducts: z.array(z.string()).optional(),
  productLayout: z.string().optional(),
  accentColor: z.string().optional(),
  showPrice: z.boolean().optional(),
  showDescription: z.boolean().optional(),
  showThumbnails: z.boolean().optional(),
  customCss: z.string().optional(),
  customJs: z.string().optional(),
});

export const createShopCustomization = createServerFn()
  .validator(
    zv(createShopCustomizationInputSchema)
  )
  .handler(async ({ data }) => {
    try {
      const user = await requireAuth();
      if (!user?.id) {
        throw new Error('User not authenticated');
      }

      // Check if customization already exists
      const existingCustomization = await prisma.shopCustomization.findUnique({
        where: { userId: user.id }
      });

      if (existingCustomization) {
        throw new Error('Shop customization already exists for this user');
      }

      const customization = await prisma.shopCustomization.create({
        data: {
          ...data,
          userId: user.id,
        }
      });
      return customization;
    } catch (error) {
      console.error('Error creating shop customization:', error);
      throw new Error('Failed to create shop customization');
    }
  });

export const updateShopCustomizationInputSchema = createShopCustomizationInputSchema.partial();

export const updateShopCustomization = createServerFn()
  .validator(
    zv(updateShopCustomizationInputSchema)
  )
  .handler(async ({ data }) => {
    const user = await requireAuth();
    if (!user?.id) {
      throw new Error('User not authenticated');
    }

    try {
      // Check if customization exists
      const existingCustomization = await prisma.shopCustomization.findUnique({
        where: { userId: user.id }
      });

      if (!existingCustomization) {
        // Create if it doesn't exist
        return prisma.shopCustomization.create({
          data: {
            ...data,
            userId: user.id,
          }
        });
      }

      // Update if it exists
      const customization = await prisma.shopCustomization.update({
        where: { userId: user.id },
        data
      });
      return customization;
    } catch (error) {
      console.error('Error updating shop customization:', error);
      throw new Error('Failed to update shop customization');
    }
  });

export const deleteShopCustomization = createServerFn()
  .validator(
    zv(
      z.object({
        id: z.string()
      })
    )
  )
  .handler(async ({ data: { id } }) => {
    const user = await requireAuth();
    if (!user?.id) {
      throw new Error('User not authenticated');
    }

    try {
      // Verify ownership
      const customization = await prisma.shopCustomization.findUnique({
        where: { id }
      });

      if (!customization || customization.userId !== user.id) {
        throw new Error('Unauthorized to delete this shop customization');
      }

      await prisma.shopCustomization.delete({
        where: { id }
      });
      return true;
    } catch (error) {
      console.error('Error deleting shop customization:', error);
      throw new Error('Failed to delete shop customization');
    }
  }); 