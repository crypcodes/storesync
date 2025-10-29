import { Redis } from 'redis'

// Redis client configuration
let redisClient: Redis | null = null

export async function getRedisClient() {
  if (!redisClient) {
    if (!process.env.REDIS_URL) {
      console.warn('Redis URL not configured, using mock client')
      return null
    }

    try {
      redisClient = new Redis({
        url: process.env.REDIS_URL,
        token: process.env.REDIS_TOKEN,
      })

      // Test connection
      await redisClient.ping()
      console.log('Connected to Redis')
    } catch (error) {
      console.error('Failed to connect to Redis:', error)
      return null
    }
  }

  return redisClient
}

// Cache utilities
export const cache = {
  async get<T>(key: string): Promise<T | null> {
    const client = await getRedisClient()
    if (!client) return null

    try {
      const value = await client.get(key)
      return value ? JSON.parse(value) : null
    } catch (error) {
      console.error('Cache get error:', error)
      return null
    }
  },

  async set(key: string, value: any, ttlSeconds = 3600): Promise<boolean> {
    const client = await getRedisClient()
    if (!client) return false

    try {
      await client.setEx(key, ttlSeconds, JSON.stringify(value))
      return true
    } catch (error) {
      console.error('Cache set error:', error)
      return false
    }
  },

  async del(key: string): Promise<boolean> {
    const client = await getRedisClient()
    if (!client) return false

    try {
      await client.del(key)
      return true
    } catch (error) {
      console.error('Cache delete error:', error)
      return false
    }
  },

  async invalidatePattern(pattern: string): Promise<boolean> {
    const client = await getRedisClient()
    if (!client) return false

    try {
      const keys = await client.keys(pattern)
      if (keys.length > 0) {
        await client.del(keys)
      }
      return true
    } catch (error) {
      console.error('Cache invalidate pattern error:', error)
      return false
    }
  },
}

// Queue utilities for background jobs
export const queue = {
  async add(queueName: string, jobData: any, options = {}): Promise<boolean> {
    const client = await getRedisClient()
    if (!client) return false

    try {
      const job = {
        id: `${Date.now()}-${Math.random()}`,
        data: jobData,
        createdAt: new Date().toISOString(),
        ...options,
      }

      await client.lPush(queueName, JSON.stringify(job))
      return true
    } catch (error) {
      console.error('Queue add error:', error)
      return false
    }
  },

  async consume(queueName: string): Promise<any | null> {
    const client = await getRedisClient()
    if (!client) return null

    try {
      const jobData = await client.brPop(queueName, 1) // 1 second timeout
      return jobData ? JSON.parse(jobData.element) : null
    } catch (error) {
      console.error('Queue consume error:', error)
      return null
    }
  },
}