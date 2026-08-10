# Inventory Management SPFx Solution

A comprehensive enterprise asset management web part for SharePoint Online built with **SharePoint Framework (SPFx)**, **React**, **Fluent UI**, and **PnPjs**.

## 🎯 Overview

The **Inventory Management SPFx Solution** empowers organizations to manage physical and digital assets within Microsoft 365 / SharePoint Online. It provides full lifecycle tracking, employee request workflows, asset return handling, incident history tracking, interactive analytics reporting, and real-time audit logging directly integrated with SharePoint Online lists.

## ✨ Key Features

### 📊 Interactive Dashboard
- Real-time asset inventory metrics and status breakdowns.
- Visual charts powered by Chart.js (asset status distribution, category allocation).
- Summary cards for pending requests, active assignments, and total inventory.

### 📦 Asset & Inventory Management
- Full inventory catalog view with searching, filtering, and pagination.
- Add, update, and inspect asset details (Serial Numbers, Model, Category, Status, Location, Value).
- **Asset Lifecycle Diagram**: Visual state machine illustrating asset status transitions (`Available`, `Assigned`, `In Repair`, `Retired`, etc.).

### 📝 Asset Request & Manager Workflow
- Employee self-service request submission for new assets or replacements.
- Manager review with approve, reject, and comment controls.
- Request status tracking with request key generation (e.g., `REQ-000123`).

### 🔄 Assigned Assets & Return Requests
- Employees view their active asset assignments.
- Asset return request initiation with return reason and condition status.
- Return request workflow approval and asset status sync.

### 📈 Reports & Data Export
- Comprehensive report generator with category, date, and status filtering.
- One-click **PDF Export** (via `jsPDF`) and **CSV Export** for inventory and request data.
- Executive summary metrics and formatted report data tables.

### 📜 Audit Log & Real-Time Event Stream
- Full activity logging (`EventLogList`) capturing asset changes, approvals, and returns.
- Interactive **Event Stream** viewer with filtering options (`EventFilters`).

### ⚙️ Schema & List Mapping Config
- Dynamic column and field mapping resolution engine (`SharePointBaseService`).
- Inspection utility for list schema metadata, field names, and custom column mappings.

---

## 🛠️ Technology Stack

### Frontend & UI
- **Framework**: SharePoint Framework (SPFx) v1.22.2
- **UI Components**: React 17.0.1 & Fluent UI (`@fluentui/react` v8.106.4)
- **Charts & Visualization**: Chart.js 4.5.1 & `react-chartjs-2`
- **PDF Generation**: `jspdf` v4.2.1
- **Language**: TypeScript ~5.8.0

### Data Layer
- **SharePoint Integration**: PnPjs v4 (`@pnp/sp`, `@pnp/logging`, `@pnp/common`)
- **Backend Data Store**: Native SharePoint Online Lists
- **Schema Resolution**: Dynamic field metadata matching & mapping fallback

### Build & Tooling
- **Build Rig**: Rushstack Heft (`@rushstack/heft` v1.1.2)
- **Linting**: ESLint v8 with SPFx rules
- **Runtime**: Node.js `>=22.14.0 < 23.0.0`

---

## 🗄️ Required SharePoint Lists

The solution interfaces with five primary SharePoint Online lists in the web part site context:

| List Name | Purpose | Key Fields |
|-----------|---------|------------|
| `InventoryList` | Asset catalog & assignment state | `Title`, `Category`, `SerialNumber`, `AssetStatus`, `AssignedTo`, `Model`, `Location` |
| `RequestList` | Asset request tracking | `Title`, `RequestKey`, `Requester`, `ManagerComment`, `RequestStatus`, `Priority` |
| `Asset Return Request List` | Return workflow management | `Title`, `AssetID`, `Requester`, `ReturnStatus`, `Condition`, `Reason` |
| `EventLogList` | Audit logging & activity stream | `Title`, `EventType`, `Description`, `User`, `Timestamp` |
| `Mapping List` | Column & list name resolution | `Title`, `TargetList`, `LogicalName`, `SharePointInternalName` |

---

## 📁 Project Structure

```
InventoryManagement/
├── config/                                 # SPFx configuration files (package-solution, serve, rig, etc.)
├── sharepoint/                             # Packaged solution output (.sppkg)
├── src/
│   └── webparts/
│       └── inventoryManagement/            # Main Web Part folder
│           ├── assets/                     # Static assets & icons
│           ├── components/                 # React UI components
│           │   ├── AssetForm.tsx           # Asset creation/edit modal
│           │   ├── AssetLifecycleDiagram.tsx # Visual lifecycle status flow
│           │   ├── Dashboard.tsx           # Main dashboard container
│           │   ├── EventStream.tsx         # Activity audit stream
│           │   ├── InventoryList.tsx       # Asset inventory grid
│           │   ├── MyAssignedAssetsView.tsx# Employee assigned asset view
│           │   ├── MyRequestsView.tsx      # Employee request tracking
│           │   ├── ReturnAssetForm.tsx     # Return request form
│           │   └── WorkflowPopup.tsx       # Approval workflow popup
│           ├── constants/                  # Application constants & dropdown options
│           ├── data/                       # Mock/seed data helpers
│           ├── loc/                        # Localization files
│           ├── models/                     # TypeScript interfaces & types
│           ├── pages/                      # Main view pages (Dashboard, Inventory, Reports, Config, etc.)
│           ├── services/                   # SharePoint PnPjs Data Services
│           │   ├── AssetAssignmentService.ts
│           │   ├── AuditLogService.ts
│           │   ├── IncidentService.ts
│           │   ├── InventoryItemService.ts
│           │   ├── RequestService.ts
│           │   ├── ReturnRequestService.ts
│           │   └── base/
│           │       └── SharePointBaseService.ts # Dynamic field mapping & coercion engine
│           ├── utils/                      # Formatting, export & utility helpers
│           ├── InventoryManagementWebPart.manifest.json # Web Part manifest
│           ├── InventoryManagementWebPart.ts          # Entry web part class
│           └── pnpjsConfig.ts              # PnPjs initialization
├── package.json                            # Package manifest & scripts
├── tsconfig.json                           # TypeScript configuration
├── .eslintrc.js                            # Linting configuration
└── README.md                               # Project documentation
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: `>=22.14.0 < 23.0.0`
- **Package Manager**: `npm`
- **SharePoint Online Tenant** with developer/App Catalog permissions.

### Installation

1. Clone the repository and navigate to the project directory:
   ```bash
   cd InventoryManagement
   ```

2. Install project dependencies:
   ```bash
   npm install
   ```

### Local Development

Start the local development server and SPFx workbench:
```bash
npm start
```
*Runs `heft start --clean` to compile TypeScript and launch the local workbench.*

---

## 🚢 Building & Deployment

### Build & Package for Production

Generate the production bundle and create the SharePoint solution package (`.sppkg`):
```bash
npm run build
```
*Runs `heft test --clean --production && heft package-solution --production`.*

The solution package file will be generated at:
`sharepoint/solution/spfx-project.sppkg`

### Clean Build Output

To clean temporary build artifacts:
```bash
npm run clean
```

### SharePoint Deployment Instructions

1. Go to your SharePoint **Tenant App Catalog** (or Site Collection App Catalog).
2. Upload the `sharepoint/solution/spfx-project.sppkg` file.
3. Select **Deploy** (check *Make this solution available to all sites* if desired).
4. Navigate to any SharePoint page, edit the page, search for **Inventory Management** web part, and add it to the page.
5. Ensure the required SharePoint Lists (`InventoryList`, `RequestList`, `Asset Return Request List`, `EventLogList`, `Mapping List`) exist in the site context.

---

## 📝 License

Proprietary - All rights reserved.