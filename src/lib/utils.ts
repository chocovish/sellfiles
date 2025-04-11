import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { z } from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function dateKeyMaker(timeframe: 'day' | 'month' | 'year', date: Date) {
  let dateKey: string;

  switch (timeframe) {
    case 'day':
      dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      break;
    case 'month':
      dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      break;
    case 'year':
      dateKey = date.getFullYear().toString();
      break;
  }
  return dateKey;
}
// for async validation
export function zva<T>(schema: z.ZodSchema<T>) {
  return async (data: z.infer<typeof schema>): Promise<T> => {
    return await schema.parseAsync(data);
  };
}
// for sync validation
export function zv<T>(schema: z.ZodSchema<T>) {
  return (data: z.infer<typeof schema>): T => {
    return schema.parse(data);
  };
}