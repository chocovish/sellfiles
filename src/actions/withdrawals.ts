// "use server";
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';
import { zv } from '~/lib/utils';

export interface WithdrawalRequest {
  amount: number;
}

export interface Withdrawal {
  id: string;
  amount: number;
  status: string;
  createdAt: Date;
  bankDetails: object;
  transactionDetails: {
    transactionId: string;
    date: string;
    reference: string;
    notes?: string;
  };
}

export async function getWithdrawals() {
    const { id: userId } = await requireAuth();

    const withdrawals = await prisma.withdrawal.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return withdrawals.map(withdrawal => ({
      id: withdrawal.id,
      amount: withdrawal.amount,
      status: withdrawal.status,
      createdAt: withdrawal.createdAt,
      bankDetails: JSON.parse(withdrawal.bankDetails),
      transactionDetails: JSON.parse(withdrawal.transactionDetails ?? '{}')
    }));
}

export async function requestWithdrawal(data: WithdrawalRequest) {
  
  const { id: userId } = await requireAuth();

  // Get user's current balance
  const user = await prisma.user.findUnique({
    where: { id: userId }
  });

  if (!user || user.balance < data.amount) {
    throw new Error('Insufficient balance');
  }

  // Get user's payment method
  const paymentMethod = await prisma.paymentMethod.findUnique({
    where: { userId }
  });

  if (!paymentMethod) {
    throw new Error('No payment method found. Please add a payment method in your profile settings.');
  }

  // Create withdrawal request
  const withdrawal = await prisma.withdrawal.create({
    data: {
      userId,
      amount: data.amount,
      bankDetails: JSON.stringify(paymentMethod.details)
    }
  });

  // Deduct amount from user's balance
  await prisma.user.update({
    where: { id: userId },
    data: { balance: user.balance - data.amount }
  });

  return withdrawal;
}

export const getUserBalance = createServerFn()
  .validator(
    zv(z.object({
      userId: z.string().optional(), // Optional if you want to allow passing userId explicitly
    }))
  )
  .handler(async ({data: { userId } = {}}) => {
    const { id: authenticatedUserId } = await requireAuth();
    const resolvedUserId = userId || authenticatedUserId;

    const user = await prisma.user.findUnique({
      where: { id: resolvedUserId },
      select: {
        balance: true,
        _count: {
          select: {
            sales: true,
            withdrawals: {
              where: {
                status: {
                  in: ['completed', 'pending'],
                },
              },
            },
          },
        },
      },
    });

    if (!user) {
      return 0;
    }

    if (user.balance > 0) {
      return user.balance;
    }

    const [totalSales, totalWithdrawals] = await Promise.all([
      prisma.sale.aggregate({
        where: {
          sellerId: resolvedUserId,
        },
        _sum: {
          amount: true,
        },
      }),
      prisma.withdrawal.aggregate({
        where: {
          userId: resolvedUserId,
          status: {
            in: ['completed', 'pending'],
          },
        },
        _sum: {
          amount: true,
        },
      }),
    ]);

    const calculatedBalance =
      (totalSales._sum.amount || 0) - (totalWithdrawals._sum.amount || 0);

    await prisma.user.update({
      where: { id: resolvedUserId },
      data: { balance: calculatedBalance },
    });

    return calculatedBalance;
  });

export async function deleteWithdrawal(withdrawalId: string) {
  const { id: userId } = await requireAuth();

    // Find the withdrawal and verify ownership
    const withdrawal = await prisma.withdrawal.findUnique({
      where: { id: withdrawalId }
    });

    if (!withdrawal) {
      throw new Error('Withdrawal not found');
    }

    if (withdrawal.userId !== userId) {
      throw new Error('Unauthorized');
    }

    if (withdrawal.status !== 'pending') {
      throw new Error('Only pending withdrawals can be deleted');
    }

    // Use a transaction to ensure both operations succeed or fail together
    await prisma.$transaction([
      // Delete the withdrawal
      prisma.withdrawal.delete({
        where: { id: withdrawalId }
      }),
      // Refund the amount back to user's balance
      prisma.user.update({
        where: { id: userId },
        data: {
          balance: {
            increment: withdrawal.amount
          }
        }
      })
    ]);

    return { success: true };
} 