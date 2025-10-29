# StoreSync Backend Structure Document

This document outlines the backend architecture, hosting, and infrastructure components of StoreSync. It is written in everyday language to ensure clarity for both technical and non-technical readers.

## 1. Backend Architecture

**Overview**
StoreSync follows a **Modular Monolith** approach with plans to extract microservices over time. This means all components live in one codebase today but are organized into clear, independent modules.

**Key Design Patterns and Frameworks**
- Modular Monolith: Separate folders/services for inventory, orders, users, analytics, etc.
- Adapter Pattern: A common `PlatformAdapter` interface with concrete implementations for Shopee, TikTok Shop, and future marketplaces. This keeps platform‐specific code isolated.
- Next.js App Router & tRPC: Acts as an API gateway, routing requests and providing type-safe endpoints.
- Drizzle ORM: Provides a type-safe layer over PostgreSQL.

**Scalability, Maintainability, Performance**
- Scalability: Modules can be split into microservices when needed. Vercel’s serverless functions auto-scale.
- Maintainability: Clear folder structure, strong typing with TypeScript, and module boundaries make code easier to understand and test.
- Performance: Redis-backed queues for asynchronous tasks (inventory sync), in-memory caching for frequent reads, and CDN distribution for static assets.

## 2. Database Management

**Technologies Used**
- Primary Database: PostgreSQL (relational SQL)
- In-Memory Store & Queue: Redis
- File Storage: Amazon S3 (or local disk in development)

**Data Storage and Access**
- Data is normalized in PostgreSQL, with clear tables for users, stores, products, orders, etc.
- Drizzle ORM handles database connections, migrations, and queries in a type-safe way.
- Redis is used for:
  - Caching: frequently accessed data (e.g., inventory counts).
  - Job queues: managing background tasks like syncing with external platforms.

**Best Practices**
- Automated migrations via Drizzle.
- Row-Level Security (RLS) in PostgreSQL to enforce multi-tenant data isolation.
- Regular backups and point-in-time recovery.
- Indexes on key columns (e.g., store_id, product_id) to speed up queries.

## 3. Database Schema

**Human-Readable Schema**
- **User**: Stores user credentials, roles, and organization membership.
- **Organization**: Groups users and stores under a single tenant.
- **Store**: Represents an e-commerce channel (Shopee, TikTok Shop, custom).
- **Product**: Contains SKU, title, price, and links to inventory records.
- **Inventory**: Tracks stock levels per product per store.
- **Order**: Captures orders from all platforms, including status and timestamps.
- **OrderItem**: Line items within an order, linked to products.
- **Integration**: Keeps API credentials and settings for each store.
- **SyncJob**: Logs background tasks (e.g., inventory sync), including status and timestamps.

**PostgreSQL Schema (SQL)**
```sql
-- Users and Organizations
drop table if exists users cascade;
drop table if exists organizations cascade;

create table organizations (
  id uuid primary key,
  name text not null,
  created_at timestamptz default now()
);

create table users (
  id uuid primary key,
  organization_id uuid not null references organizations(id),
  email text unique not null,
  password_hash text not null,
  role text not null,
  created_at timestamptz default now()
);

-- Stores and Integrations
drop table if exists stores cascade;
drop table if exists integrations cascade;

create table stores (
  id uuid primary key,
  organization_id uuid not null references organizations(id),
  platform text not null,
  store_name text,
  created_at timestamptz default now()
);

create table integrations (
  id uuid primary key,
  store_id uuid not null references stores(id),
  api_key text not null,
  api_secret text not null,
  config jsonb,
  created_at timestamptz default now()
);

-- Products and Inventory
drop table if exists products cascade;
drop table if exists inventory cascade;

create table products (
  id uuid primary key,
  organization_id uuid not null references organizations(id),
  sku text unique not null,
  title text not null,
  price numeric not null,
  created_at timestamptz default now()
);

create table inventory (
  id uuid primary key,
  store_id uuid not null references stores(id),
  product_id uuid not null references products(id),
  quantity integer default 0,
  updated_at timestamptz default now(),
  unique(store_id, product_id)
);

-- Orders and Order Items
drop table if exists orders cascade;
drop table if exists order_items cascade;

create table orders (
  id uuid primary key,
  store_id uuid not null references stores(id),
  external_order_id text not null,
  status text not null,
  total_amount numeric not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(store_id, external_order_id)
);

create table order_items (
  id uuid primary key,
  order_id uuid not null references orders(id),
  product_id uuid not null references products(id),
  quantity integer not null,
  price numeric not null
);

-- Sync Jobs
drop table if exists sync_jobs cascade;

create table sync_jobs (
  id uuid primary key,
  store_id uuid not null references stores(id),
  job_type text not null,
  status text not null,
  started_at timestamptz default now(),
  completed_at timestamptz
);
```  

## 4. API Design and Endpoints

**Approach**
- Uses **tRPC** over Next.js App Router for fully type-safe RPC-style endpoints.
- Endpoints are grouped by service (e.g., `store`, `inventory`, `order`).
- Authentication via Clerk is enforced at the gateway.

**Key Endpoints**
- `store.create` (POST): Add a new store integration.
- `store.list` (GET): Retrieve all stores for the user’s organization.
- `inventory.get` (GET): Fetch current stock for a product in a store.
- `inventory.sync` (POST): Trigger manual inventory synchronization.
- `order.list` (GET): List orders across all stores with filter options.
- `order.detail` (GET): Get detailed order information, including items.
- `analytics.salesReport` (GET): Generate real-time sales and performance metrics.
- `user.me` (GET): Retrieve current user’s profile and permissions.

Clients call these endpoints directly from the frontend with full type safety, eliminating mismatches between client and server.

## 5. Hosting Solutions

**Primary Hosting**
- Vercel: Hosts serverless functions (API), frontend, and static assets behind a global CDN.

**Supporting Services**
- AWS RDS (PostgreSQL): Managed relational database with automated backups.
- AWS ElastiCache (Redis): Managed in-memory store for caching and queues.
- AWS S3: Object storage for file uploads and exports.

**Benefits**
- Reliability: AWS managed services and Vercel SLA.
- Scalability: Serverless functions auto-scale; databases can scale vertically and horizontally.
- Cost-Effectiveness: Pay-as-you-go pricing, minimal upfront costs.

## 6. Infrastructure Components

- **Load Balancer & CDN**: Vercel’s global edge network serves static assets and routes function calls to the nearest region.
- **Caching**: Redis caches frequent reads (e.g., product catalog) to reduce database load.
- **Job Queue**: Redis-managed queues handle asynchronous tasks like inventory sync, order polling, and notifications.
- **File Storage**: S3 stores uploaded images, export files, and reports.
- **CI/CD Pipeline**: GitHub Actions runs linting, testing (Vitest), and deployments to Vercel on each push.

These components work together to ensure fast response times, high availability, and a smooth user experience.

## 7. Security Measures

- **Authentication & Authorization**
  - Clerk for user sign-up, sign-in, and session management.
  - Role-based access control enforced both in application logic and at the database level using RLS.
- **Data Encryption**
  - Transport: TLS/HTTPS for all API and database connections.
  - At Rest: Default encryption on AWS RDS and S3.
- **Secrets Management**
  - Environment variables stored securely in Vercel and AWS Parameter Store.
- **API Protection**
  - Rate limiting on sensitive endpoints.
  - Input validation at the API gateway and deeper in service layers.
- **Compliance & Best Practices**
  - OWASP guidelines for web security.
  - GDPR/CCPA readiness by scoping data collection and offering export/deletion.

## 8. Monitoring and Maintenance

- **Logging & Monitoring**
  - Vercel Logs for serverless function invocations.
  - AWS CloudWatch for database and ElastiCache metrics.
  - Structured logs in JSON for easier searching and alerting.
- **Alerts & Dashboards**
  - Threshold-based alerts (e.g., high error rates, queue backlog) via CloudWatch or third-party APM.
- **Maintenance Strategies**
  - Automated database backups and periodic restore drills.
  - Regular dependency updates and security patching via automated GitHub Actions.
  - Drizzle migrations run automatically during CI/CD to keep schemas in sync.
  - Scheduled queue health checks and retry policies for failed jobs.

## 9. Conclusion and Overall Backend Summary

StoreSync’s backend is designed to be modular, scalable, and maintainable. By leveraging a modular monolith, type-safe frameworks, and managed cloud services, it delivers:

- A clear separation of concerns across layers (API gateway, business logic, data access).
- Fast development cycles and confidence through end-to-end type safety.
- Reliable hosting and automated scaling with Vercel and AWS.
- Robust security with Clerk, RLS, encryption, and best practices.
- Observability and maintainability via logging, monitoring, and CI/CD automation.

This setup aligns with StoreSync’s goal of providing merchants a unified, real-time e-commerce management platform that can grow effortlessly as needs evolve.