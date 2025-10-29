import { pgTable, uuid, varchar, text, boolean, timestamp, jsonb, decimal, integer, pgEnum } from 'drizzle-orm/pg-core'

// Enums
export const userRoleEnum = pgEnum('user_role', ['owner', 'admin', 'member', 'viewer'])
export const platformEnum = pgEnum('platform', ['shopee', 'tiktok_shop', 'custom_website'])
export const syncStatusEnum = pgEnum('sync_status', ['pending', 'active', 'paused', 'error'])
export const orderStatusEnum = pgEnum('order_status', ['pending', 'paid', 'shipped', 'delivered', 'cancelled'])
export const financialStatusEnum = pgEnum('financial_status', ['pending', 'paid', 'refunded'])
export const fulfillmentStatusEnum = pgEnum('fulfillment_status', ['unfulfilled', 'partial', 'fulfilled'])
export const transactionTypeEnum = pgEnum('transaction_type', ['adjustment', 'sale', 'purchase', 'transfer', 'reservation'])
export const syncJobTypeEnum = pgEnum('sync_job_type', ['product_sync', 'inventory_push', 'order_fetch'])
export const syncJobStatusEnum = pgEnum('sync_job_status', ['pending', 'running', 'completed', 'failed'])

// Organizations
export const organizations = pgTable('organizations', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 100 }).notNull().unique(),
  settings: jsonb('settings').default('{}'),
  subscriptionPlan: varchar('subscription_plan', { length: 50 }).default('free'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

// Users
export const users = pgTable('users', {
  id: uuid('id').primaryKey(), // Clerk user ID
  organizationId: uuid('organization_id').references(() => organizations.id, { onDelete: 'cascade' }),
  email: varchar('email', { length: 255 }).notNull().unique(),
  fullName: varchar('full_name', { length: 255 }),
  role: userRoleEnum('role').default('member'),
  isActive: boolean('is_active').default(true),
  lastActiveAt: timestamp('last_active_at'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

// Platforms
export const platforms = pgTable('platforms', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: platformEnum('name').notNull(),
  displayName: varchar('display_name', { length: 255 }).notNull(),
  isActive: boolean('is_active').default(true),
  apiConfig: jsonb('api_config').default('{}'),
  createdAt: timestamp('created_at').defaultNow(),
})

// Stores
export const stores = pgTable('stores', {
  id: uuid('id').primaryKey().defaultRandom(),
  organizationId: uuid('organization_id').notNull().references(() => organizations.id, { onDelete: 'cascade' }),
  platformId: uuid('platform_id').notNull().references(() => platforms.id),
  name: varchar('name', { length: 255 }).notNull(),
  platformStoreId: varchar('platform_store_id', { length: 255 }).notNull(),
  credentials: jsonb('credentials').notNull(),
  settings: jsonb('settings').default('{}'),
  syncStatus: syncStatusEnum('sync_status').default('active'),
  lastSyncAt: timestamp('last_sync_at'),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

// Products
export const products = pgTable('products', {
  id: uuid('id').primaryKey().defaultRandom(),
  organizationId: uuid('organization_id').notNull().references(() => organizations.id, { onDelete: 'cascade' }),
  sku: varchar('sku', { length: 255 }).notNull(),
  name: varchar('name', { length: 500 }).notNull(),
  description: text('description'),
  category: varchar('category', { length: 255 }),
  brand: varchar('brand', { length: 255 }),
  costPrice: decimal('cost_price', { precision: 12, scale: 2 }),
  weight: decimal('weight', { precision: 8, scale: 2 }),
  dimensions: jsonb('dimensions'),
  images: jsonb('images').default('[]'),
  attributes: jsonb('attributes').default('{}'),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

// Product Variants
export const productVariants = pgTable('product_variants', {
  id: uuid('id').primaryKey().defaultRandom(),
  productId: uuid('product_id').notNull().references(() => products.id, { onDelete: 'cascade' }),
  variantSku: varchar('variant_sku', { length: 255 }).notNull(),
  name: varchar('name', { length: 255 }),
  attributes: jsonb('attributes').default('{}'),
  costPrice: decimal('cost_price', { precision: 12, scale: 2 }),
  weight: decimal('weight', { precision: 8, scale: 2 }),
  images: jsonb('images').default('[]'),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

// Store Product Mappings
export const storeProductMappings = pgTable('store_product_mappings', {
  id: uuid('id').primaryKey().defaultRandom(),
  storeId: uuid('store_id').notNull().references(() => stores.id, { onDelete: 'cascade' }),
  productVariantId: uuid('product_variant_id').notNull().references(() => productVariants.id, { onDelete: 'cascade' }),
  platformProductId: varchar('platform_product_id', { length: 255 }).notNull(),
  platformVariantId: varchar('platform_variant_id', { length: 255 }),
  platformSku: varchar('platform_sku', { length: 255 }),
  price: decimal('price', { precision: 12, scale: 2 }).notNull(),
  compareAtPrice: decimal('compare_at_price', { precision: 12, scale: 2 }),
  isActive: boolean('is_active').default(true),
  lastSyncAt: timestamp('last_sync_at'),
  syncStatus: varchar('sync_status', { length: 50 }).default('pending'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

// Inventory Locations
export const inventoryLocations = pgTable('inventory_locations', {
  id: uuid('id').primaryKey().defaultRandom(),
  organizationId: uuid('organization_id').notNull().references(() => organizations.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  address: jsonb('address'),
  isDefault: boolean('is_default').default(false),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
})

// Inventory Items
export const inventoryItems = pgTable('inventory_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  productVariantId: uuid('product_variant_id').notNull().references(() => productVariants.id, { onDelete: 'cascade' }),
  locationId: uuid('location_id').notNull().references(() => inventoryLocations.id, { onDelete: 'cascade' }),
  quantityOnHand: integer('quantity_on_hand').notNull().default(0),
  quantityReserved: integer('quantity_reserved').notNull().default(0),
  reorderPoint: integer('reorder_point').default(0),
  reorderQuantity: integer('reorder_quantity').default(0),
  updatedAt: timestamp('updated_at').defaultNow(),
})

// Inventory Transactions
export const inventoryTransactions = pgTable('inventory_transactions', {
  id: uuid('id').primaryKey().defaultRandom(),
  inventoryItemId: uuid('inventory_item_id').notNull().references(() => inventoryItems.id, { onDelete: 'cascade' }),
  transactionType: transactionTypeEnum('transaction_type').notNull(),
  quantityChange: integer('quantity_change').notNull(),
  referenceType: varchar('reference_type', { length: 50 }),
  referenceId: uuid('reference_id'),
  notes: text('notes'),
  createdBy: uuid('created_by').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow(),
})

// Orders
export const orders = pgTable('orders', {
  id: uuid('id').primaryKey().defaultRandom(),
  organizationId: uuid('organization_id').notNull().references(() => organizations.id, { onDelete: 'cascade' }),
  storeId: uuid('store_id').notNull().references(() => stores.id),
  platformOrderId: varchar('platform_order_id', { length: 255 }).notNull(),
  orderNumber: varchar('order_number', { length: 255 }),
  customerInfo: jsonb('customer_info').notNull(),
  status: orderStatusEnum('status').notNull(),
  financialStatus: financialStatusEnum('financial_status'),
  fulfillmentStatus: fulfillmentStatusEnum('fulfillment_status'),
  subtotal: decimal('subtotal', { precision: 12, scale: 2 }).notNull(),
  taxAmount: decimal('tax_amount', { precision: 12, scale: 2 }).default(0),
  shippingAmount: decimal('shipping_amount', { precision: 12, scale: 2 }).default(0),
  discountAmount: decimal('discount_amount', { precision: 12, scale: 2 }).default(0),
  totalAmount: decimal('total_amount', { precision: 12, scale: 2 }).notNull(),
  currency: varchar('currency', { length: 3 }).default('IDR'),
  platformData: jsonb('platform_data').default('{}'),
  notes: text('notes'),
  tags: text('tags').array(),
  orderedAt: timestamp('ordered_at').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

// Order Items
export const orderItems = pgTable('order_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  orderId: uuid('order_id').notNull().references(() => orders.id, { onDelete: 'cascade' }),
  productVariantId: uuid('product_variant_id').references(() => productVariants.id),
  platformProductId: varchar('platform_product_id', { length: 255 }),
  platformVariantId: varchar('platform_variant_id', { length: 255 }),
  name: varchar('name', { length: 500 }).notNull(),
  sku: varchar('sku', { length: 255 }),
  quantity: integer('quantity').notNull(),
  price: decimal('price', { precision: 12, scale: 2 }).notNull(),
  totalAmount: decimal('total_amount', { precision: 12, scale: 2 }).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
})

// Sync Jobs
export const syncJobs = pgTable('sync_jobs', {
  id: uuid('id').primaryKey().defaultRandom(),
  organizationId: uuid('organization_id').notNull().references(() => organizations.id, { onDelete: 'cascade' }),
  storeId: uuid('store_id').references(() => stores.id),
  jobType: syncJobTypeEnum('job_type').notNull(),
  status: syncJobStatusEnum('status').notNull(),
  startedAt: timestamp('started_at'),
  completedAt: timestamp('completed_at'),
  itemsTotal: integer('items_total').default(0),
  itemsProcessed: integer('items_processed').default(0),
  itemsFailed: integer('items_failed').default(0),
  errorMessage: text('error_message'),
  retryCount: integer('retry_count').default(0),
  metadata: jsonb('metadata').default('{}'),
  createdAt: timestamp('created_at').defaultNow(),
})

// Sync Logs
export const syncLogs = pgTable('sync_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  syncJobId: uuid('sync_job_id').notNull().references(() => syncJobs.id, { onDelete: 'cascade' }),
  level: varchar('level', { length: 20 }).notNull(),
  message: text('message').notNull(),
  details: jsonb('details'),
  createdAt: timestamp('created_at').defaultNow(),
})

// Types
export type Organization = typeof organizations.$inferSelect
export type NewOrganization = typeof organizations.$inferInsert

export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert

export type Platform = typeof platforms.$inferSelect
export type NewPlatform = typeof platforms.$inferInsert

export type Store = typeof stores.$inferSelect
export type NewStore = typeof stores.$inferInsert

export type Product = typeof products.$inferSelect
export type NewProduct = typeof products.$inferInsert

export type ProductVariant = typeof productVariants.$inferSelect
export type NewProductVariant = typeof productVariants.$inferInsert

export type StoreProductMapping = typeof storeProductMappings.$inferSelect
export type NewStoreProductMapping = typeof storeProductMappings.$inferInsert

export type InventoryLocation = typeof inventoryLocations.$inferSelect
export type NewInventoryLocation = typeof inventoryLocations.$inferInsert

export type InventoryItem = typeof inventoryItems.$inferSelect
export type NewInventoryItem = typeof inventoryItems.$inferInsert

export type InventoryTransaction = typeof inventoryTransactions.$inferSelect
export type NewInventoryTransaction = typeof inventoryTransactions.$inferInsert

export type Order = typeof orders.$inferSelect
export type NewOrder = typeof orders.$inferInsert

export type OrderItem = typeof orderItems.$inferSelect
export type NewOrderItem = typeof orderItems.$inferInsert

export type SyncJob = typeof syncJobs.$inferSelect
export type NewSyncJob = typeof syncJobs.$inferInsert

export type SyncLog = typeof syncLogs.$inferSelect
export type NewSyncLog = typeof syncLogs.$inferInsert