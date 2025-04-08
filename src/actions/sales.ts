import { auth, requireAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { dateKeyMaker, zv } from '@/lib/utils';
import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';

export interface SaleData {
  date: string;
  amount: number;
  transactions: number;
  uniqueCustomers: Array<string|null>;
}
export interface RecentSale {
  id: string;
  amount: number;
  createdAt: Date;
  productName: string;
  buyerName: string;
}

export const getSalesData = createServerFn()
  .validator(
    zv(z.object({
      timeframe: z.enum(['day', 'month', 'year']),
    }))
  )
  .handler(async ({data: {timeframe}}) => {
    try {
      const user = await requireAuth();
      const userId = user.id;
      const today = new Date();
      let startDate: Date;

      switch (timeframe) {
        case 'day':
          startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 30);
          break;
        case 'month':
          startDate = new Date(today.getFullYear(), today.getMonth() - 12, 1);
          break;
        case 'year':
          startDate = new Date(today.getFullYear() - 5, 0, 1);
          break;
      }

      const sales = await prisma.sale.findMany({
        where: {
          sellerId: userId,
          createdAt: {
            gte: startDate,
          },
        },
        orderBy: {
          createdAt: 'asc',
        },
      });

      // Format the data based on timeframe
      const formattedSales = sales.reduce<SaleData[]>((acc, sale) => {
        const date = new Date(sale.createdAt);
        const dateKey = dateKeyMaker(timeframe, date);

        const existingEntry = acc.find((entry) => entry.date === dateKey);
        if (existingEntry) {
          existingEntry.amount += sale.amount;
          existingEntry.transactions++;
          if(!existingEntry.uniqueCustomers.includes(sale.buyerId)) existingEntry.uniqueCustomers.push(sale.buyerId);
        } else {
          acc.push({
            date: dateKey,
            amount: sale.amount,
            transactions: 1,
            uniqueCustomers: [sale.buyerId],
          });
        }

        return acc;
      }, []);

      return formattedSales as SaleData[];
    } catch (error) {
      console.error('Error fetching sales data:', error);
      throw new Error('Failed to fetch sales data');
    }
  });

export const getRecentSales = createServerFn()
  .validator(
    zv(z.object({
      limit: z.number().min(1).max(100).optional().default(10),
    }))
  )
  .handler(async ({ data: { limit } }) => {
    try {
      const user = await requireAuth();
      const userId = user.id;
      const recentSales = await prisma.sale.findMany({
        where: {
          sellerId: userId,
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: limit,
        include: {
          product: true,
          buyer: true,
        },
      });

      return recentSales.map((sale) => ({
        id: sale.id,
        amount: sale.amount,
        createdAt: sale.createdAt,
        productName: sale.product.title,
        buyerName: sale.buyer?.name || 'Anonymous',
      }));
    } catch (error) {
      console.error('Error fetching recent sales:', error);
      throw new Error('Failed to fetch recent sales');
    }
  });