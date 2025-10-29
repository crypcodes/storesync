import { create } from 'zustand'

interface User {
  id: string
  email: string
  name?: string
  organizationId: string
  role: 'owner' | 'admin' | 'member' | 'viewer'
}

interface Store {
  id: string
  name: string
  platform: 'shopee' | 'tiktok_shop' | 'custom_website'
  status: 'active' | 'paused' | 'error'
  lastSyncAt?: Date
}

interface AppState {
  // User state
  user: User | null
  setUser: (user: User | null) => void

  // Stores state
  stores: Store[]
  setStores: (stores: Store[]) => void
  addStore: (store: Store) => void
  updateStore: (id: string, updates: Partial<Store>) => void
  removeStore: (id: string) => void

  // UI state
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void

  // Notifications
  notifications: Notification[]
  addNotification: (notification: Omit<Notification, 'id'>) => void
  removeNotification: (id: string) => void
}

interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
  timestamp: Date
}

export const useAppStore = create<AppState>((set, get) => ({
  // User state
  user: null,
  setUser: (user) => set({ user }),

  // Stores state
  stores: [],
  setStores: (stores) => set({ stores }),
  addStore: (store) => set((state) => ({ stores: [...state.stores, store] })),
  updateStore: (id, updates) =>
    set((state) => ({
      stores: state.stores.map((store) =>
        store.id === id ? { ...store, ...updates } : store
      ),
    })),
  removeStore: (id) =>
    set((state) => ({
      stores: state.stores.filter((store) => store.id !== id),
    })),

  // UI state
  sidebarOpen: true,
  setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),

  // Notifications
  notifications: [],
  addNotification: (notification) =>
    set((state) => ({
      notifications: [
        ...state.notifications,
        { ...notification, id: Date.now().toString() },
      ],
    })),
  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),
}))