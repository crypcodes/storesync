# Project Requirements Document (PRD): StoreSync

## 1. Project Overview
StoreSync is a cross-platform e-commerce management system that centralizes operations for multiple online stores—whether on marketplaces like Shopee and TikTok Shop or on custom websites—into a single dashboard. By unifying inventory, orders, analytics, and integrations, it eliminates the need to juggle multiple vendor portals, reduces manual reconciliation, and prevents overselling through real-time synchronization.

The platform is being built to streamline everyday workflows for merchants managing several sales channels, boost operational efficiency, and provide actionable business insights. The key success criteria include accurate, real-time inventory updates; consolidated order processing with clear status tracking; reliable marketplace integrations; and insightful BI dashboards that help merchants make data-driven decisions.

## 2. In-Scope vs. Out-of-Scope

**In-Scope (Version 1.0)**
- User authentication and organization management via Clerk
- Dashboard for adding and configuring Shopee and TikTok Shop stores
- Real-time inventory synchronization using Redis queues and event-driven processing
- Centralized order ingestion and management through Next.js App Router + tRPC
- Business Intelligence dashboards showing sales, inventory turnover, and order metrics
- Modular PlatformAdapter pattern with ShopeeAdapter and TikTokShopAdapter
- PostgreSQL database with Drizzle ORM, Redis for caching/queues, and S3 for file storage
- CI/CD pipelines using GitHub Actions, automated testing with Vitest, and deployment to Vercel
- Role-based access control and row-level security in the database

**Out-of-Scope (Future Phases)**
- Mobile native apps (React Native or SwiftUI)
- Integrations beyond Shopee and TikTok Shop (e.g., Amazon, Shopify custom sites)
- Microservices extraction—initial release remains a modular monolith
- Advanced job scheduling (e.g., BullMQ features) and multi-region deployments
- Full observability stack (APM, distributed tracing)—basic logging only
- GDPR/CCPA compliance automation tools
- OpenAPI/Swagger generation for external API contracts

## 3. User Flow
A merchant lands on StoreSync’s login page and signs in with email/password or single sign-on via Clerk. After authentication, they arrive at the main dashboard where they see a top navigation bar with quick links (Stores, Orders, Inventory, Analytics, Settings). If it’s their first time, a guided “Add a Store” wizard prompts them to connect either Shopee or TikTok Shop by entering API credentials and selecting desired sync options.

Once stores are connected, the user navigates to the Inventory page via the sidebar. Here they view a table of products aggregated across all channels, with live stock levels and sync status indicators. If they click on an individual order in the Orders tab, they see a detail panel with order items, customer info, current status, and action buttons for fulfillment or refund. The Analytics page offers charts and filters for sales trends, best-selling SKUs, and inventory health.

## 4. Core Features
- **Authentication & Authorization**: Clerk-powered signup, login, password reset, and RBAC with row-level security.
- **Store Management**: Wizard UI for adding/removing marketplaces; configuration settings (sync intervals, default warehouse).
- **Inventory Sync**: Event-driven stock updates via Redis queues; conflict resolution and retry logic.
- **Order Management**: Central ingestion of orders, status tracking, fulfillment actions, and error handling.
- **Platform Adapters**: ShopeeAdapter and TikTokShopAdapter following a common PlatformAdapter interface.
- **Business Intelligence**: Real-time dashboards, custom report exports (CSV/PDF), filterable charts.
- **API Gateway**: Next.js App Router + tRPC for type-safe API endpoints and rate limiting.
- **Data Access**: Drizzle ORM with PostgreSQL for relational data models, migrations, and row-level security.
- **Caching & Queues**: Redis for caching frequently accessed data and managing background jobs.
- **File Storage**: S3 (or local) for storing exports, logs, and attachments.
- **CI/CD & Testing**: GitHub Actions workflows, Vitest unit/integration tests, ESLint/Prettier linting.

## 5. Tech Stack & Tools
- Frontend: Next.js 15 (App Router), React, Tailwind CSS, shadcn/ui, Zustand for state
- Backend/API: Next.js App Router, tRPC, Clerk for auth
- Database: PostgreSQL with Drizzle ORM
- Caching & Queues: Redis
- File Storage: S3 (AWS) or local filesystem fallback
- Deployment: Vercel
- CI/CD: GitHub Actions
- Testing & Quality: Vitest, ESLint, Prettier
- AI Integration (Future): Vercel AI SDK

## 6. Non-Functional Requirements
- **Performance**: <200ms average API response time under normal load; inventory sync jobs processed within 1–2 seconds of an external update event
- **Scalability**: Modular monolith designed for eventual microservice extraction; Redis queues must handle 1,000+ messages/min
- **Security**: Enforce HTTPS, store secrets in environment variables, use RLS in PostgreSQL, protect against OWASP Top 10
- **Availability**: 99.9% uptime excluding scheduled maintenance
- **Usability**: Dashboard UI loads in <1 second; mobile-responsive design
- **Data Retention & Compliance**: Store logs for 30 days; user data in compliance with GDPR guidelines (manual process)

## 7. Constraints & Assumptions
- Must use TypeScript end-to-end for compile-time type safety
- GPT-4o or AI features are optional and not required for version 1.0
- Clerk service availability and API rate limits for marketplace integrations
- Hosting exclusively on Vercel (no on-premise support)
- Users have existing Shopee/TikTok Shop developer accounts with API credentials

## 8. Known Issues & Potential Pitfalls
- **API Rate Limits**: Shopee and TikTok Shop enforce tight rate limits—implement exponential backoff and circuit breakers
- **Data Consistency**: Race conditions during high-volume inventory updates—use Redis locks or optimistic concurrency control
- **Error Handling**: Unhandled external API failures can leave data out of sync—centralize retry logic and dead-letter queues
- **Modular Drift**: Team might bypass service boundaries—enforce architecture via code reviews and automated checks
- **Observability Gaps**: Lack of full APM could slow down incident response—start with structured logs and plan for adding tracing early


---
This PRD provides a clear, unambiguous blueprint for building StoreSync’s initial version. The AI can now generate frontend guidelines, backend structure, app flows, and more without missing critical details.