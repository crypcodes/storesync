import { createTRPCRouter, protectedProcedure } from '../server'
import { z } from 'zod'

export const storeRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    // TODO: Implement store retrieval
    return []
  }),

  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        platform: z.enum(['shopee', 'tiktok_shop', 'custom_website']),
        platformStoreId: z.string(),
        credentials: z.record(z.any()),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // TODO: Implement store creation
      return { success: true, storeId: 'demo-store-id' }
    }),

  sync: protectedProcedure
    .input(z.object({ storeId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      // TODO: Implement store sync
      return { success: true, jobId: 'demo-job-id' }
    }),
})