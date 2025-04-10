import { auth, requireAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';
import { zv } from '~/lib/utils';

export interface PurchaseData {
  id: string;
  product: {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    fileUrl: string;
    price: number;
  };
  seller: {
    name: string;
    shopSlug: string;
  };
  amount: number;
  status: string;
  createdAt: Date;
}

export const getUserPurchases = createServerFn()
  .handler(async () => {
    const { id: userId } = await requireAuth();
    try {
      const purchases = await prisma.sale.findMany({
        where: {
          buyerId: userId,
        },
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          product: {
            select: {
              id: true,
              title: true,
              description: true,
              imageUrl: true,
              fileUrl: true,
              price: true,
            },
          },
          seller: {
            select: {
              name: true,
              shopSlug: true,
            },
          },
        },
      });

      return purchases as PurchaseData[];
    } catch (error) {
      console.error('Error fetching user purchases:', error);
      throw new Error('Failed to fetch user purchases');
    }
  });

export const getPurchaseStats = createServerFn()
  .handler(async () => {
    try {
      const { id: userId } = await requireAuth();

      const stats = await prisma.sale.aggregate({
        where: {
          buyerId: userId,
        },
        _count: {
          id: true,
        },
        _sum: {
          amount: true,
        },
      });

      return {
        totalPurchases: stats._count.id || 0,
        totalSpent: stats._sum.amount || 0,
      };
    } catch (error) {
      console.error('Error fetching purchase stats:', error);
      throw new Error('Failed to fetch purchase stats');
    }
  });