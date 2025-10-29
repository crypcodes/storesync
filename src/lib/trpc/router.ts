import { createTRPCRouter } from './server'
import { userRouter } from './routers/user'
import { storeRouter } from './routers/store'
import { productRouter } from './routers/product'
import { orderRouter } from './routers/order'

export const appRouter = createTRPCRouter({
  user: userRouter,
  store: storeRouter,
  product: productRouter,
  order: orderRouter,
})

export type AppRouter = typeof appRouter