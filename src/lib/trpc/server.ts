import { initTRPC } from '@trpc/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/db/client'
import superjson from 'superjson'
import { ZodError } from 'zod'

interface Context {
  userId: string | null
  db: typeof db
}

const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    }
  },
})

export const createTRPCRouter = t.router

export const publicProcedure = t.procedure

export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.userId) {
    throw new Error('Unauthorized')
  }
  return next({
    ctx: {
      userId: ctx.userId,
    },
  })
})

export const createCallerFactory = t.createCallerFactory