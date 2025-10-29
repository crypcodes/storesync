flowchart TD
    Start[Start] --> Login[User Login Page]
    Login --> Auth{Authenticated}
    Auth -- No --> Login
    Auth -- Yes --> Dashboard[Dashboard]
    Dashboard --> StoreManagement[Store Management]
    Dashboard --> OrderManagement[Order Management]
    Dashboard --> InventorySync[Inventory Synchronization]
    Dashboard --> Analytics[Analytics]
    Dashboard --> Settings[Settings]
    StoreManagement --> AddStore[Add New Store]
    AddStore --> ConfigureAdapter[Configure Platform Adapter]
    ConfigureAdapter --> SaveStore[Save Configuration]
    SaveStore --> StoreManagement
    OrderManagement --> ViewOrders[View Orders List]
    ViewOrders --> OrderDetails[Order Details]
    OrderDetails --> UpdateStatus[Update Order Status]
    UpdateStatus --> OrderManagement
    InventorySync --> TriggerSync[Trigger Inventory Sync]
    TriggerSync --> SyncProcess[Sync Process via Queue]
    SyncProcess --> SyncSuccess{Sync Success}
    SyncSuccess -- Yes --> Dashboard
    SyncSuccess -- No --> SyncError[Handle Sync Error]
    SyncError --> Dashboard
    Analytics --> ViewReports[View Sales Reports]
    ViewReports --> ExportReports[Export Reports]
    ExportReports --> Dashboard
    Settings --> UserProfile[User Profile Settings]
    Settings --> ManageApiKeys[Manage API Keys]
    Settings --> OrganizationSettings[Organization Settings]
    OrganizationSettings --> Dashboard