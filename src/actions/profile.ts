import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { paymentMethodSchema, profileSchema } from "@/lib/validations/profile";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { zv, zva } from "~/lib/utils";
import {zodValidator} from "@tanstack/zod-adapter";
import { logMiddleware } from "~/utils/loggingMiddleware";
// import { revalidatePath } from "next/cache";

export const updateProfile = createServerFn()
  .validator(zva(profileSchema))
  .handler(async ({ data: dataAsync }) => {
    const data = await dataAsync;
    const user = await auth();
    if (!user?.id) {
      throw new Error("Unauthorized");
    }

    await prisma.user.update({
      where: { id: user.id },
      data,
    });
  });

export const updatePaymentMethod = createServerFn()
  .validator(zv(paymentMethodSchema))
  .handler(async ({ data }) => {
    const user = await auth();
    if (!user?.id) {
      throw new Error("Unauthorized");
    }

    // Use a transaction to ensure both operations succeed or fail together
    const result = await prisma.$transaction(async (tx) => {
      // Update or create payment method
      const paymentMethod = await tx.paymentMethod.upsert({
        where: { userId: user.id },
        update: {
          ...data,
          details: data.details,
        },
        create: {
          ...data,
          details: data.details,
          userId: user.id,
        },
      });

      // Create history entry
      await tx.paymentMethodHistory.create({
        data: {
          paymentMethodId: paymentMethod.id,
          type: data.type,
          details: data.details,
        },
      });

      return paymentMethod;
    });
    return result;
  });

export const  getPaymentMethod = createServerFn()
  .handler(async () => {
    const user = await auth();
    if (!user?.id) {
      throw new Error("Unauthorized");
    }
    const method = await prisma.paymentMethod.findUnique({
      where: { userId: user.id },
    });
    return method;
  });

export const getUserProfile = createServerFn().handler(async () => {
  console.log("getUserProfile called");
  const user = await auth();
  console.log("user:::::::::::", user);
  if (!user?.id) {
    throw new Error("Unauthorized");
  }
  const profile = await prisma.user.findUnique({
    where: { id: user.id },
  });
  console.log("profile:::::::::::", profile);
  return profile;
});

// export async function getUserBySlug(slug: string) {
//   "use server";
//   const user = await prisma.user.findUnique({
//     where: { shopSlug: slug },
//     select: { id: true }
//   });
//   return user?.id;
// }
export const getUserBySlug = createServerFn()
  .validator(zv(z.string()))
  .handler(async ({ data }) => {
    const user = await prisma.user.findUnique({
      where: { shopSlug: data },
      select: { id: true },
    });
    return user?.id;
  });

export const getPaymentMethodHistory = createServerFn()
.handler(async () => {
  const user = await auth();
  if (!user?.id) {
    throw new Error("Unauthorized");
  }

  const history = await prisma.paymentMethodHistory.findMany({
    where: {
      paymentMethod: {
        userId: user.id,
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      paymentMethod: true,
    },
  });

  return history;
}); 
