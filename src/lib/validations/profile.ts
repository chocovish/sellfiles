import { z } from "zod";
// import { getUserBySlug } from "@/actions/profile";

export const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  userType: z.enum(["buyer", "seller"]),
  shopSlug: z.string()
    .min(3, "Shop slug must be at least 3 characters")
    .regex(/^[a-z0-9-]+$/, "Shop slug can only contain lowercase letters, numbers, and hyphens")
    .optional()
    .superRefine(async (slug, ctx) => {
      if (!slug) return true;
      try {
        const {getUserBySlug} = await import("@/actions/profile")
        const existingUser = await getUserBySlug({ data: slug });
        if (existingUser) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "This shop URL is already taken. Please choose another one.",
          });
          return false;
        }
        return true;
      } catch (error) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Error checking shop URL availability. Please try again.",
        });
        return false;
      }
    }),
  image: z.string().optional().nullable(),
});

export const bankDetailsSchema = z.object({
  accountNumber: z.string().min(10, "Account number must be at least 10 characters"),
  accountName: z.string().min(2, "Account name must be at least 2 characters"),
  bankName: z.string().min(2, "Bank name must be at least 2 characters"),
  ifscCode: z.string().min(11, "IFSC code must be 11 characters").max(11, "IFSC code must be 11 characters"),
});

export const upiDetailsSchema = z.object({
  upiId: z.string().min(5, "UPI ID must be at least 5 characters"),
});

export const paymentMethodSchema = z.object({
  type: z.enum(["bank", "upi"]),
  details: z.union([bankDetailsSchema, upiDetailsSchema]),
  isDefault: z.boolean().default(false),
}); 