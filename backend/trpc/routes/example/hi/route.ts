import { z } from "zod";
import { publicProcedure } from "@/backend/trpc/create-context";

export default publicProcedure
  .input(z.object({ name: z.string() }))
  .query(({ input }) => {
    return {
      hello: input.name,
      date: new Date(),
    };
  });
