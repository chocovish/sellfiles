import { createServerFn } from "@tanstack/react-start"

export const s1 = createServerFn().handler(() => {
  return {
      message: 'Hello from server',
  }
})
export const dummy = createServerFn().handler(async () => {
  console.log("dummy called");
  return {id: "12344"};
});
