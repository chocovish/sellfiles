import { createServerFn } from "@tanstack/react-start"
import { z, ZodType } from "zod";
import { zv } from "~/lib/utils";

export const s1 = createServerFn().handler(() => {
  return {
      message: 'Hello from server',
  }
})