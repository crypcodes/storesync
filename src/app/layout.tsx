import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ClerkProvider } from '@clerk/nextjs'
import { TRPCReactProvider } from '@/lib/trpc/react'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'StoreSync - Multi-Platform E-Commerce Management',
  description: 'Centralize your e-commerce operations across multiple marketplaces',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <TRPCReactProvider>
        <html lang="en">
          <body className={inter.className}>{children}</body>
        </html>
      </TRPCReactProvider>
    </ClerkProvider>
  )
}