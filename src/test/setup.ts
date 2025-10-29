import '@testing-library/jest-dom'

// Mock Clerk
jest.mock('@clerk/nextjs', () => ({
  useUser: () => ({
    isSignedIn: true,
    user: {
      id: 'user-123',
      fullName: 'Test User',
      primaryEmailAddress: {
        emailAddress: 'test@example.com',
      },
    },
  }),
  auth: () => ({
    userId: 'user-123',
  }),
}))

// Mock environment variables
process.env.DATABASE_URL = 'postgresql://mock'
process.env.NEXT_PUBLIC_APP_URL = 'http://localhost:3000'