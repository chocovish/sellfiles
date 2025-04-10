import Razorpay from 'razorpay';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';
import { auth } from '@/lib/auth';
import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';
import { zv } from '~/lib/utils';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || '',
  key_secret: process.env.RAZORPAY_KEY_SECRET || ''
});

type GuestBuyer = {
  email: string;
  name: string;
};

export const initializePayment = createServerFn()
  .validator(
    zv(z.object({
      productId: z.string(),
      guestInfo: z
        .object({
          email: z.string().email(),
          name: z.string(),
        })
        .optional(),
    }))
  )
  .handler(async ({ data }) => {
    const { productId } = data;

    try {
      // Get product details
      const product = await prisma.product.findUnique({
        where: { id: productId },
      });

      if (!product || !product.isVisible) {
        throw new Error('Product not found');
      }

      // Create Razorpay order
      const order = await razorpay.orders.create({
        amount: Math.round(product.price * 100), // Convert to smallest currency unit (paise)
        currency: 'INR',
        receipt: `${productId}_${Date.now()}`,
      });

      return {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        key: process.env.RAZORPAY_KEY_ID,
      };
    } catch (error) {
      console.error('Payment initialization error:', error);
      throw new Error('Failed to initialize payment');
    }
  });

export const verifyPayment = createServerFn()
  .validator(
    zv(
      z.object({
        razorpay_payment_id: z.string(),
        razorpay_order_id: z.string(),
        razorpay_signature: z.string(),
        productId: z.string(),
        sellerId: z.string(),
        guestInfo: z
          .object({
            email: z.string().email(),
            name: z.string(),
          })
          .optional(),
      })
    )
  )
  .handler(async ({ data }) => {
    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      productId,
      sellerId,
      guestInfo,
    } = data;

    try {
      // Verify payment signature
      const body = razorpay_order_id + '|' + razorpay_payment_id;
      const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '')
        .update(body.toString())
        .digest('hex');

      if (expectedSignature !== razorpay_signature) {
        throw new Error('Invalid payment signature');
      }

      // Get current user if logged in
      const user = await auth();
      const buyerId = user?.id || null;

      // Record the sale
      const amount = (await razorpay.payments.fetch(razorpay_payment_id)).amount;
      if (typeof amount !== 'number') {
        throw new Error('Invalid payment amount');
      }

      // Use a transaction to ensure both sale creation and balance update succeed or fail together
      const [sale, _] = await prisma.$transaction([
        // Create the sale record
        prisma.sale.create({
          data: {
            productId,
            sellerId,
            buyerId,
            amount: amount / 100,
            razorpayId: razorpay_payment_id,
            status: 'completed',
          },
        }),
        // Update seller's balance
        prisma.user.update({
          where: { id: sellerId },
          data: {
            balance: {
              increment: amount / 100,
            },
          },
        }),
      ]);

      // Get product details for download
      const product = await prisma.product.findUnique({
        where: { id: productId },
        select: { fileUrl: true },
      });

      return {
        success: true,
        fileUrl: product?.fileUrl,
        saleId: sale.id,
      };
    } catch (error) {
      console.error('Payment verification error:', error);
      throw error;
    }
  });