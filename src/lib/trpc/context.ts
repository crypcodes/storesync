import { auth } from '@clerk/nextjs/server'
import { db } from '@/db/client'
import type { Context } from './server'

export async function createTRPCContext(): Promise<Context> {
  const { userId } = auth()

  return {
    userId,
    db,
  }
}