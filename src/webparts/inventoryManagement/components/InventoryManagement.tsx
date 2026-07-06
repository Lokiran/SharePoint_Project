import * as React from 'react';
import styles from './InventoryManagement.module.scss';
import type { IInventoryManagementProps } from '../models/IInventoryManagementProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { InventoryList } from './InventoryList';
import { MyAssignedAssetsView } from './MyAssignedAssetsView';
import { MyRequestsView } from './MyRequestsView';
import { RequestList } from './RequestList';
import { IInventoryItem } from '../models/IInventoryItem';
import { IRequest } from '../models/IRequest';
import { IEventLog } from '../models/IEventLog';
import { getSP } from '../pnpjsConfig';
import { AssetForm } from './AssetForm';
import { RequestForm } from './RequestForm';
import { EventStream } from './EventStream';
import { IReturnRequest } from '../models/IReturnRequest';
import { ReturnAssetForm } from './ReturnAssetForm';
import { ReturnRequestList } from './ReturnRequestList';
import { PrimaryButton, DefaultButton, Pivot, PivotItem, TextField, Dropdown, IDropdownOption, DetailsList, DetailsListLayoutMode, SelectionMode, IColumn, DetailsRow, Panel, PanelType, MessageBar, MessageBarType, ProgressIndicator, Icon, Stack } from '@fluentui/react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  ArcElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Pie, Bar, Doughnut } from 'react-chartjs-2';
import { jsPDF } from 'jspdf';

ChartJS.register(
  CategoryScale,
  LinearScale,
  ArcElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);
import "@pnp/sp/site-users/web";
import "@pnp/sp/site-groups/web";

import { EMPLOYEES } from '../data/mockData';
import { IEmployee } from '../models/IEmployee';
import { InventoryService } from '../services/InventoryService';
import { Dashboard } from './Dashboard';
import { AssetTracking } from './AssetTracking';
import { INotification } from '../models/INotification';
import { NotificationCenter } from './NotificationCenter';
import { IncidentRequestModule } from './IncidentRequest/IncidentRequestModule';
import { IncidentHistory } from './IncidentHistory/IncidentHistory';
import { AssetLifecycleDiagram } from './AssetLifecycleDiagram';

export interface IInventoryManagementState {
  items: IInventoryItem[];
  employees: IEmployee[];
  requests: IRequest[];
  auditLogs: IEventLog[];
  userRole: 'Admin' | 'Inventory Manager' | 'Inventory Employee';
  previewRole?: 'Admin' | 'Inventory Manager' | 'Inventory Employee';
  roleGroups: string[];
  roleLoading: boolean;
  requestActionInProgressId?: string;
  requestSearchId: string;
  isAssetFormOpen: boolean;
  isRequestFormOpen: boolean;
  loading: boolean;
  auditLogsLoading: boolean;
  errorMessage?: string;
  isTrackingActionInProgress?: boolean;
  expandedUserEmail?: string;
  selectedTabKey?: string;
  readNotificationIds: string[];
  clearedNotificationIds: string[];
  selectedNotification?: INotification;
  isNotificationDetailsOpen: boolean;
  returnRequests: IReturnRequest[];
  returnRequestsLoading: boolean;
  selectedAssetForReturn: IInventoryItem | undefined;
  isReturnFormOpen: boolean;
  activeUserDisplayName: string;
  activeUserEmail: string;
  isIncidentFormOpen: boolean;
  selectedAssetForIncident: IInventoryItem | undefined;
  syncInProgress?: boolean;
  syncMessage?: string;
  syncMessageType?: MessageBarType;
  diagnosticInfo?: string;
  selectedAdminRequest?: IRequest;
  isAdminPanelOpen?: boolean;
  adminSelectedAssetId?: string;
  adminComment?: string;
  sidebarCollapsed: boolean;
  reportsSelectedTab: string;
  reportsAssetTypeFilter: string;
  reportsStatusFilter: string;
  configSelectedTab: string;
  connectionStatuses: { [listTitle: string]: 'connected' | 'error' | 'testing' };
  connectionErrorMessages: { [listTitle: string]: string };
  groupUsersList: { [groupName: string]: string[] };
  loadingGroupUsers: { [groupName: string]: boolean };
}

export default class InventoryManagement extends React.Component<IInventoryManagementProps, IInventoryManagementState> {
  private _isRequestOwnedByCurrentUser = (requesterName: string, currentUser: string): boolean => {
    const normalize = (value: string): string => (value || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    const requestOwner = normalize(requesterName);
    const activeUser = normalize(currentUser);
    if (!requestOwner || !activeUser) {
      return false;
    }
    return requestOwner === activeUser || requestOwner.includes(activeUser) || activeUser.includes(requestOwner);
  };

  private _isAssetAssignedToCurrentUser = (item: IInventoryItem, currentUser: string): boolean => {
    const normalize = (value: string | undefined): string => (value || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    const activeUser = normalize(currentUser);
    if (!activeUser) return false;

    const assignedNorm = normalize(item.assignedTo);
    const isAssigned = assignedNorm && (assignedNorm === activeUser || assignedNorm.includes(activeUser) || activeUser.includes(assignedNorm));
    const isNoted = (item.note || '').toLowerCase().includes('assigned to:') && normalize(item.note).includes(activeUser);
    const isStatus = (item.status || '').toLowerCase().includes('assigned to:') && normalize(item.status).includes(activeUser);

    return !!(isAssigned || isNoted || isStatus);
  };

  private _getNotifications = (): INotification[] => {
    const { items, requests, activeUserDisplayName } = this.state;
    const currentUser = activeUserDisplayName;
    const effectiveRole = this.state.previewRole || this.state.userRole;
    const isAdminOrManager = effectiveRole === 'Admin' || effectiveRole === 'Inventory Manager';
    const isAdmin = effectiveRole === 'Admin';

    const notifications: INotification[] = [];
    const readIds = new Set(this.state.readNotificationIds);
    const clearedIds = new Set(this.state.clearedNotificationIds);

    const normalize = (value: string | undefined): string => (value || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    const activeUserNorm = normalize(currentUser);

    const formatTime = (isoString: string | undefined): string => {
      if (!isoString) return '';
      try {
        const d = new Date(isoString);
        const pad = (n: number) => n < 10 ? '0' + n : '' + n;
        return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
      } catch {
        return isoString;
      }
    };

    // 1. Generate Asset Request Notifications
    requests.forEach(req => {
      const requesterNorm = normalize(req.requesterName);
      const isMyRequest = requesterNorm && (requesterNorm === activeUserNorm || activeUserNorm.includes(requesterNorm) || requesterNorm.includes(activeUserNorm));

      if (isAdminOrManager) {
        // Pending requests notify Admins & Managers
        if (req.status === 'Pending') {
          const id = `req-pending-${req.id}`;
          if (!clearedIds.has(id)) {
            notifications.push({
              id,
              title: "Asset Request Pending",
              message: `${req.requesterName} requested ${req.quantity}x ${req.assetTitle} (Reason: ${req.reason || "None"})`,
              type: 'info',
              timestamp: formatTime(req.requestDate),
              isRead: readIds.has(id),
              actionLink: 'Approvals',
              category: 'Request'
            });
          }
        }
      }

      if (isMyRequest) {
        // Approved/Declined requests notify the Employee
        if (req.status === 'Approved' || req.status === 'Declined') {
          const id = `req-resolved-${req.id}-${req.status}`;
          if (!clearedIds.has(id)) {
            notifications.push({
              id,
              title: req.status === 'Approved' ? "Request Approved" : "Request Declined",
              message: req.status === 'Approved'
                ? `Your request for ${req.quantity}x ${req.assetTitle} has been approved.`
                : `Your request for ${req.quantity}x ${req.assetTitle} has been declined.`,
              type: req.status === 'Approved' ? 'success' : 'error',
              timestamp: formatTime(req.requestDate),
              isRead: readIds.has(id),
              actionLink: 'My Requests',
              category: 'Request'
            });
          }
        }
      }

      if (isAdmin && req.status === 'Approved' && req.assetStatus === 'Pending') {
        const id = `req-assign-admin-${req.id}`;
        if (!clearedIds.has(id)) {
          notifications.push({
            id,
            title: "Asset Ready for Assignment",
            message: `${req.requesterName}'s request for ${req.quantity}x ${req.assetTitle} is approved and ready for assignment.`,
            type: 'info',
            timestamp: formatTime(req.requestDate),
            isRead: readIds.has(id),
            actionLink: 'AssetAssignmentQueue',
            category: 'Request'
          });
        }
      }
    });

    // 2. Generate Asset Assignment & Audit Notifications
    items.forEach(item => {
      const assignedNorm = normalize(item.assignedTo);
      const isMyAsset = assignedNorm && (assignedNorm === activeUserNorm || activeUserNorm.includes(assignedNorm) || assignedNorm.includes(activeUserNorm));

      const isNotedMyAsset = (item.note || '').toLowerCase().includes('assigned to:') && normalize(item.note).includes(activeUserNorm);

      if (isMyAsset || isNotedMyAsset) {
        // Asset Assignment notifies the Employee
        const id = `asset-assigned-${item.id}`;
        if (!clearedIds.has(id)) {
          notifications.push({
            id,
            title: "Asset Assigned",
            message: `Asset '${item.assetName || item.title}' (${item.serialNumber || 'N/A'}) has been assigned to you.`,
            type: 'success',
            timestamp: formatTime(item.assignedDate || item.purchaseDate),
            isRead: readIds.has(id),
            actionLink: 'My Assets',
            category: 'Assignment'
          });
        }
      }

      if (isAdminOrManager) {
        // When status is 'Assigned', notify Admin/Manager of assignments
        if (item.status === 'Assigned') {
          const id = `asset-assigned-admin-${item.id}`;
          if (!clearedIds.has(id)) {
            notifications.push({
              id,
              title: "Asset Assigned to Employee",
              message: `Asset '${item.assetName || item.title}' (${item.serialNumber || 'N/A'}) is assigned to ${item.assignedTo || "Employee"}.`,
              type: 'info',
              timestamp: formatTime(item.assignedDate || item.purchaseDate),
              isRead: readIds.has(id),
              actionLink: 'Asset Tracking',
              category: 'Assignment'
            });
          }
        }

        // Audit/Maintenance warnings
        if (item.status === 'Under Maintenance' || item.condition === 'Damaged' || item.condition === 'Poor') {
          const id = `asset-maintenance-${item.id}-${item.status}-${item.condition}`;
          if (!clearedIds.has(id)) {
            notifications.push({
              id,
              title: "Asset Status Alert",
              message: `Asset '${item.assetName || item.title}' is in ${item.condition} condition and marked as ${item.status}.`,
              type: 'warning',
              timestamp: formatTime(item.purchaseDate),
              isRead: readIds.has(id),
              actionLink: 'Inventory',
              category: 'Audit'
            });
          }
        }
      }
    });

    // 3. Generate Asset Return Notifications
    const returnRequests = this.state.returnRequests || [];
    returnRequests.forEach(ret => {
      const isMyReturn = normalize(ret.requesterName) === activeUserNorm || activeUserNorm.includes(normalize(ret.requesterName)) || normalize(ret.requesterName).includes(activeUserNorm);

      if (isAdminOrManager) {
        if (ret.status === 'Pending') {
          const id = `ret-pending-${ret.id}`;
          if (!clearedIds.has(id)) {
            notifications.push({
              id,
              title: "Asset Return Pending",
              message: `${ret.requesterName} requested to return ${ret.assetName} (Reason: ${ret.returnReason || "None"})`,
              type: 'info',
              timestamp: formatTime(ret.requestDate),
              isRead: readIds.has(id),
              actionLink: 'AssetReturns',
              category: 'Request'
            });
          }
        }
      }

      if (isMyReturn) {
        if (ret.status === 'Approved' || ret.status === 'Rejected' || ret.status === 'Completed') {
          const id = `ret-resolved-${ret.id}-${ret.status}`;
          if (!clearedIds.has(id)) {
            let titleText = "Return Request Approved";
            let type: 'info' | 'success' | 'warning' | 'error' = 'success';
            let messageText = `Your return request for ${ret.assetName} has been approved. Please hand it over.`;

            if (ret.status === 'Rejected') {
              titleText = "Return Request Rejected";
              type = 'error';
              messageText = `Your return request for ${ret.assetName} was rejected. Note: ${ret.managerComment || ""}`;
            } else if (ret.status === 'Completed') {
              titleText = "Asset Return Completed";
              type = 'success';
              messageText = `Your return of ${ret.assetName} is complete and has been checked back into stock.`;
            }

            notifications.push({
              id,
              title: titleText,
              message: messageText,
              type,
              timestamp: formatTime(ret.completedDate || ret.requestDate),
              isRead: readIds.has(id),
              actionLink: 'MyRequests',
              category: 'Assignment'
            });
          }
        }
      }
    });

    // Sort notifications by timestamp descending
    notifications.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    return notifications;
  };

  private _markNotificationAsRead = (id: string): void => {
    const readNotificationIds = [...this.state.readNotificationIds, id];
    this.setState({ readNotificationIds });
    localStorage.setItem('inventory_read_notifications', JSON.stringify(readNotificationIds));
  };

  private _markAllNotificationsAsRead = (): void => {
    const notifications = this._getNotifications();
    const readNotificationIds = Array.from(new Set([...this.state.readNotificationIds, ...notifications.map(n => n.id)]));
    this.setState({ readNotificationIds });
    localStorage.setItem('inventory_read_notifications', JSON.stringify(readNotificationIds));
  };

  private _clearNotification = (id: string): void => {
    const clearedNotificationIds = [...this.state.clearedNotificationIds, id];
    this.setState({ clearedNotificationIds });
    localStorage.setItem('inventory_cleared_notifications', JSON.stringify(clearedNotificationIds));
  };

  private _clearAllNotifications = (): void => {
    const notifications = this._getNotifications();
    const clearedNotificationIds = Array.from(new Set([...this.state.clearedNotificationIds, ...notifications.map(n => n.id)]));
    this.setState({ clearedNotificationIds });
    localStorage.setItem('inventory_cleared_notifications', JSON.stringify(clearedNotificationIds));
  };

  private _handleNotificationAction = (actionLink: string, notificationId: string): void => {
    this._markNotificationAsRead(notificationId);
    const notifications = this._getNotifications();
    const selectedNotification = notifications.find(n => n.id === notificationId);
    this.setState({ 
      selectedNotification,
      isNotificationDetailsOpen: true
    });
  };

  constructor(props: IInventoryManagementProps) {
    super(props);

    let readIds: string[] = [];
    let clearedIds: string[] = [];
    try {
      readIds = JSON.parse(localStorage.getItem('inventory_read_notifications') || '[]');
      clearedIds = JSON.parse(localStorage.getItem('inventory_cleared_notifications') || '[]');
    } catch (e) {
      console.warn("localStorage parsing failed", e);
    }

    const activeName = props.userDisplayName;
    const activeEmail = props.userEmail;

    this.state = {
      items: [],
      employees: EMPLOYEES,
      requests: [],
      auditLogs: [],
      userRole: 'Inventory Employee',
      previewRole: undefined,
      roleGroups: [],
      roleLoading: true,
      requestActionInProgressId: undefined,
      requestSearchId: '',
      isAssetFormOpen: false,
      isRequestFormOpen: false,
      loading: true,
      auditLogsLoading: true,
      errorMessage: undefined,
      selectedTabKey: 'Dashboard',
      readNotificationIds: readIds,
      clearedNotificationIds: clearedIds,
      selectedNotification: undefined,
      isNotificationDetailsOpen: false,
      returnRequests: [],
      returnRequestsLoading: true,
      selectedAssetForReturn: undefined,
      isReturnFormOpen: false,
      activeUserDisplayName: activeName,
      activeUserEmail: activeEmail,
      isIncidentFormOpen: false,
      selectedAssetForIncident: undefined,
      selectedAdminRequest: undefined,
      isAdminPanelOpen: false,
      adminSelectedAssetId: undefined,
      adminComment: '',
      sidebarCollapsed: false,
      reportsSelectedTab: 'insights',
      reportsAssetTypeFilter: 'All',
      reportsStatusFilter: 'All',
      configSelectedTab: 'operations',
      connectionStatuses: {},
      connectionErrorMessages: {},
      groupUsersList: {},
      loadingGroupUsers: {}
    };
  }

  public async componentDidMount(): Promise<void> {
    await this._resolveUserRole();
    await this._loadInventory();
    await this._loadRequests();
    await this._loadAuditLogs();
    await this._loadReturnRequests();

    // Run self-healing cleanup for Return Approved assets
    try {
      await InventoryService.cleanupReturnApprovedAssets();
    } catch (e) {
      console.warn("Failed to run Return Approved assets self-healing cleanup:", e);
    }

    // Dynamically auto-sync existing assigned assets of our 5 active users to the Mapping List
    try {
      await InventoryService.syncExistingAssignmentsToMappingList(this.state.activeUserDisplayName);
    } catch (e) {
      console.warn("Failed to auto-sync existing assignments to Mapping List:", e);
    }
  }

  private _resolveUserRole = async (): Promise<void> => {
    try {
      const sp = getSP();
      const groups = await sp.web.currentUser.groups();
      const groupNames = groups.map((group: any) => (group.Title || '').toLowerCase().trim());

      const isAdmin = groupNames.some((name: string) => name === 'msft owners' || name.indexOf('msft owners') >= 0);
      const isInventoryManager = groupNames.some((name: string) => name === 'msft members' || name.indexOf('msft members') >= 0);
      const isInventoryEmployee = groupNames.some((name: string) => name === 'msft visitors' || name.indexOf('msft visitors') >= 0);

      let userRole: 'Admin' | 'Inventory Manager' | 'Inventory Employee' = 'Inventory Employee';

      if (isAdmin) {
        userRole = 'Admin';
      } else if (isInventoryManager) {
        userRole = 'Inventory Manager';
      } else if (isInventoryEmployee) {
        userRole = 'Inventory Employee';
      }

      // Load employees from groups dynamically
      const loadedEmployees: IEmployee[] = [];
      const seenEmails = new Set<string>();

      const addUsers = (users: any[], jobTitle: 'Admin' | 'Inventory Manager' | 'Inventory Employee', department: string) => {
        users.forEach(u => {
          const email = (u.Email || u.LoginName || '').toLowerCase().trim();
          const name = (u.Title || '').trim();
          const nameLower = name.toLowerCase();

          // Skip system/group users
          if (nameLower === 'msft owners' || nameLower === 'system account' || !name) {
            return;
          }

          if (email && !seenEmails.has(email)) {
            seenEmails.add(email);
            loadedEmployees.push({
              id: u.Id ? u.Id.toString() : u.Email || Math.random().toString(),
              name: name,
              email: u.Email || '',
              department: department,
              jobTitle: jobTitle
            });
          }
        });
      };

      try {
        const owners = await sp.web.siteGroups.getByName("MSFT Owners").users();
        addUsers(owners, 'Admin', 'Management');
      } catch (e) {
        console.warn("Could not load users from group 'MSFT Owners':", e);
      }

      try {
        const members = await sp.web.siteGroups.getByName("MSFT Members").users();
        addUsers(members, 'Inventory Manager', 'Operations');
      } catch (e) {
        console.warn("Could not load users from group 'MSFT Members':", e);
      }

      try {
        const visitors = await sp.web.siteGroups.getByName("MSFT Visitors").users();
        addUsers(visitors, 'Inventory Employee', 'Operations');
      } catch (e) {
        console.warn("Could not load users from group 'MSFT Visitors':", e);
      }

      const finalEmployees = loadedEmployees.length > 0 ? loadedEmployees : EMPLOYEES;

      this.setState({
        userRole,
        roleGroups: groups.map((group: any) => group.Title || ''),
        employees: finalEmployees,
        roleLoading: false
      });
    } catch (error) {
      console.error("Failed to resolve SharePoint group role:", error);
      this.setState({
        userRole: 'Inventory Employee',
        roleGroups: [],
        employees: EMPLOYEES,
        roleLoading: false
      });
    }
  };


  private _loadInventory = async (): Promise<void> => {
    try {
      this.setState({ loading: true, errorMessage: undefined });
      const items = await InventoryService.getItems();
      if (items && items.length > 0) {
        this.setState({ items, loading: false });
      } else {
        // List is empty
        this.setState({
          items: [],
          loading: false,
          errorMessage: 'SharePoint list is empty. Please add items.'
        });
      }
    } catch (error: any) {
      console.error("Failed to load inventory:", error);

      // Fallback to empty if SharePoint fails so the UI remains functional
      this.setState({
        items: [],
        loading: false,
        errorMessage: `SharePoint Error: ${error.message || JSON.stringify(error)}`
      });
    }
  };

  private _loadRequests = async (): Promise<void> => {
    try {
      const requests = await InventoryService.getRequests();
      this.setState({ requests });
    } catch (error: any) {
      console.error("Failed to load requests:", error);
      this.setState({
        errorMessage: `Failed to load Requests. Error: ${error.message || JSON.stringify(error)}`
      });
    }
  };

  private _loadAuditLogs = async (): Promise<void> => {
    try {
      this.setState({ auditLogsLoading: true });
      const auditLogs = await InventoryService.getAuditLogs();
      this.setState({ auditLogs, auditLogsLoading: false });
    } catch (error) {
      console.error("Failed to load audit logs:", error);
      this.setState({ auditLogsLoading: false });
    }
  };

  private _loadReturnRequests = async (): Promise<void> => {
    try {
      this.setState({ returnRequestsLoading: true });
      const returnRequests = await InventoryService.getReturnRequests();
      this.setState({ returnRequests, returnRequestsLoading: false });
    } catch (error) {
      console.error("Failed to load return requests:", error);
      this.setState({ returnRequestsLoading: false });
    }
  };

  private _onSubmitReturnRequest = async (reason: string, condition: string): Promise<void> => {
    const { selectedAssetForReturn } = this.state;
    if (!selectedAssetForReturn) return;

    try {
      this.setState({ returnRequestsLoading: true });
      const reqPayload = {
        title: `Return Request for ${selectedAssetForReturn.assetName || selectedAssetForReturn.title}`,
        assetId: selectedAssetForReturn.id,
        assetName: selectedAssetForReturn.assetName || selectedAssetForReturn.title,
        assetType: selectedAssetForReturn.assetType,
        serialNumber: selectedAssetForReturn.serialNumber,
        requesterName: this.state.activeUserDisplayName,
        requesterEmail: this.state.activeUserEmail,
        requestDate: new Date().toISOString().split('T')[0],
        returnReason: reason,
        proposedCondition: condition
      };

      await InventoryService.addReturnRequest(reqPayload, this.state.activeUserDisplayName);

      await this._loadInventory();
      await this._loadReturnRequests();
      await this._loadAuditLogs();
      this.setState({ isReturnFormOpen: false, selectedAssetForReturn: undefined });
    } catch (error: any) {
      this.setState({ 
        errorMessage: `Failed to submit return request: ${error.message || JSON.stringify(error)}`,
        returnRequestsLoading: false
      });
    }
  };

  private _onUpdateReturnRequestStatus = async (
    requestId: string,
    status: 'Approved' | 'Rejected' | 'Completed',
    comment: string,
    finalCondition?: string
  ): Promise<void> => {
    try {
      this.setState({ returnRequestsLoading: true });
      await InventoryService.updateReturnRequestStatus(requestId, status, comment, this.state.activeUserDisplayName, finalCondition);

      await this._loadInventory();
      await this._loadReturnRequests();
      await this._loadAuditLogs();
    } catch (error: any) {
      this.setState({ 
        errorMessage: `Failed to update return status: ${error.message || JSON.stringify(error)}`,
        returnRequestsLoading: false
      });
    }
  };

  private _onAddAsset = async (newAssetData: Omit<IInventoryItem, 'id' | 'status' | 'assignedTo'>): Promise<void> => {
    try {
      this.setState({ loading: true, errorMessage: undefined });
      const newAsset: Omit<IInventoryItem, 'id'> = {
        ...newAssetData,
        status: 'In Stock'
      };

      await InventoryService.addItem(newAsset, this.state.activeUserDisplayName);
      await this._loadInventory(); // Refresh list
      await this._loadAuditLogs(); // Refresh audit logs
    } catch (error: any) {
      console.error("Failed to add asset:", error);
      this.setState({
        loading: false,
        errorMessage: `Failed to add Asset. SharePoint rejected the save. Error: ${error.message || JSON.stringify(error)}`
      });
    }
  };

  private _onSubmitRequest = async (requestData: Omit<IRequest, 'id' | 'requestKey' | 'status'>): Promise<void> => {
    try {
      const requesterEmployee = this.state.employees.find(e => e.name.toLowerCase() === requestData.requesterName.toLowerCase());
      const requesterRole = requesterEmployee ? requesterEmployee.jobTitle : 'Inventory Employee';
      const initialStatus = (requesterRole === 'Inventory Manager' || requesterRole === 'Admin') ? 'Approved' : 'Pending';

      const tempId = `temp-${Date.now()}`;
      const localRequest: IRequest = {
        id: tempId,
        requestKey: `REQ-${("000000" + (this.state.requests.length + 1)).slice(-6)}`,
        requesterName: requestData.requesterName,
        employeeId: (requestData as any).employeeId || "",
        assetId: requestData.assetId || "1",
        assetTitle: requestData.assetTitle,
        assetName: "",
        priority: (requestData as any).priority || "Medium",
        quantity: requestData.quantity || 1,
        status: initialStatus,
        assetStatus: 'Pending',
        requestDate: requestData.requestDate || new Date().toISOString().split('T')[0],
        reason: requestData.reason || ""
      };

      // Optimistic update so it gets added to the RequestList directly
      this.setState(prevState => ({
        requests: [localRequest, ...prevState.requests]
      }));

      await InventoryService.addRequest({
        ...requestData,
        status: initialStatus
      } as any, this.state.activeUserDisplayName);
      console.log('Successfully saved request to SharePoint');
      await this._loadRequests(); // Refresh list from SharePoint
      await this._loadAuditLogs(); // Refresh audit logs
    } catch (error: any) {
      console.error('Failed to save request to SharePoint AssetRequests list:', error);

      this.setState({
        errorMessage: `Failed to save Request to SharePoint. A local copy was added. Error: ${error.message || JSON.stringify(error)}`
      });
    }
  };

  private _onApproveRequest = async (request: IRequest): Promise<void> => {
    try {
      this.setState({ requestActionInProgressId: request.id, errorMessage: undefined });
      if (request.id.indexOf('temp-') === 0) {
        this.setState(prevState => ({
          requests: prevState.requests.map(r => r.id === request.id ? { ...r, status: 'Approved' } : r)
        }));
      } else {
        await InventoryService.updateRequestStatus(parseInt(request.id, 10), 'Approved', this.state.activeUserDisplayName);
        await this._loadRequests();
        await this._loadAuditLogs();
      }
    } catch (error: any) {
      this.setState({
        errorMessage: `Failed to approve request #${request.id}. ${error.message || JSON.stringify(error)}`
      });
    } finally {
      this.setState({ requestActionInProgressId: undefined });
    }
  };

  private _onRejectRequest = async (request: IRequest, reason: string): Promise<void> => {
    try {
      this.setState({ requestActionInProgressId: request.id, errorMessage: undefined });
      if (request.id.indexOf('temp-') === 0) {
        this.setState(prevState => ({
          requests: prevState.requests.map(r => r.id === request.id ? { ...r, status: 'Declined', managerResponse: reason } : r)
        }));
      } else {
        await InventoryService.updateRequestStatus(
          parseInt(request.id, 10),
          'Declined',
          this.state.activeUserDisplayName,
          reason
        );
        await this._loadRequests();
        await this._loadAuditLogs();
      }
    } catch (error: any) {
      this.setState({
        errorMessage: `Failed to reject request #${request.id}. ${error.message || JSON.stringify(error)}`
      });
    } finally {
      this.setState({ requestActionInProgressId: undefined });
    }
  };

  private _onApproveAsset = async (request: IRequest): Promise<void> => {
    try {
      this.setState({ requestActionInProgressId: request.id, errorMessage: undefined });
      if (request.id.indexOf('temp-') === 0) {
        this.setState(prevState => ({
          requests: prevState.requests.map(r => r.id === request.id ? { ...r, assetStatus: 'Approved' } : r)
        }));
      } else {
        await InventoryService.updateAssetStatus(parseInt(request.id, 10), 'Approved', this.state.activeUserDisplayName);
        await this._loadRequests();
        await this._loadAuditLogs();
      }
    } catch (error: any) {
      this.setState({
        errorMessage: `Failed to approve asset status for request #${request.requestKey || request.id}. ${error.message || JSON.stringify(error)}`
      });
    } finally {
      this.setState({ requestActionInProgressId: undefined });
    }
  };

  private _onAssignAssets = async (employeeName: string, employeeEmail: string, assetIds: string[]): Promise<void> => {
    try {
      this.setState({ isTrackingActionInProgress: true, errorMessage: undefined });
      const employee = this.state.employees.find(e => e.name.toLowerCase() === employeeName.toLowerCase());
      const employeeId = employee ? employee.id : "";
      await InventoryService.assignAssetsToEmployee(assetIds, employeeName, employeeEmail, this.state.activeUserDisplayName, employeeId);
      await this._loadInventory();
      await this._loadAuditLogs();
    } catch (error: any) {
      this.setState({
        errorMessage: `Failed to assign assets. ${error.message || JSON.stringify(error)}`
      });
    } finally {
      this.setState({ isTrackingActionInProgress: false });
    }
  };

  private _onSyncAssignedAssets = async (): Promise<void> => {
    try {
      this.setState({
        syncInProgress: true,
        syncMessage: 'Synchronizing assigned assets with SharePoint Mapping List...',
        syncMessageType: MessageBarType.info
      });

      const result = await InventoryService.syncExistingAssignmentsToMappingList(this.state.activeUserDisplayName);

      this.setState({
        syncInProgress: false,
        syncMessage: `Synchronization complete! Verified ${result.checkedCount} assigned assets. Successfully checked and synchronized ${result.syncedCount} missing mapping records.`,
        syncMessageType: MessageBarType.success
      });

      // Reload inventory to ensure consistency
      await this._loadInventory();
    } catch (e: any) {
      console.error("Manual sync failed:", e);
      this.setState({
        syncInProgress: false,
        syncMessage: `Failed to synchronize mapping records: ${e.message || JSON.stringify(e)}`,
        syncMessageType: MessageBarType.error
      });
    }
  };

  private _onRunDiagnostics = async (): Promise<void> => {
    try {
      this.setState({
        syncInProgress: true,
        syncMessage: 'Running Mapping List diagnostic check...',
        syncMessageType: MessageBarType.info
      });

      const diagnosticInfo = await InventoryService.diagnoseMappingListFields();

      this.setState({
        syncInProgress: false,
        diagnosticInfo,
        syncMessage: 'Diagnostic check complete! Columns and item counts retrieved successfully.',
        syncMessageType: MessageBarType.success
      });
    } catch (e: any) {
      this.setState({
        syncInProgress: false,
        syncMessage: `Failed to retrieve diagnostics: ${e.message || JSON.stringify(e)}`,
        syncMessageType: MessageBarType.error
      });
    }
  };

  private _exportWarrantyReportToExcel = (): void => {
    const { items } = this.state;
    const headers = ["Asset Name", "Asset Type", "Status", "Purchase Date", "Warranty Expiry Date"];
    const csvRows = [headers.join(",")];

    items.forEach(item => {
      const name = (item.assetName || item.title || "").replace(/"/g, '""');
      const type = (item.assetType || "").replace(/"/g, '""');
      const status = (item.status || "").replace(/"/g, '""');
      const purchaseDate = (item.purchaseDate || "").replace(/"/g, '""');
      const warrantyExpiry = (item.warrantyExpiry || "N/A").replace(/"/g, '""');
      
      const row = [
        `"${name}"`,
        `"${type}"`,
        `"${status}"`,
        `"${purchaseDate}"`,
        `"${warrantyExpiry}"`
      ];
      csvRows.push(row.join(","));
    });

    const csvContent = "\uFEFF" + csvRows.join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `Warranty_Expiry_Report_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  private _exportWarrantyReportToPDF = (): void => {
    const { items } = this.state;
    const doc = new jsPDF();
    
    // Header
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("Asset Warranty Expiry Report", 14, 20);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 28);
    doc.text(`Total Assets: ${items.length} | Assets with Warranty: ${items.filter(i => i.warrantyExpiry).length}`, 14, 34);
    
    // Table Headers
    doc.setFont("helvetica", "bold");
    doc.setFillColor(240, 240, 240);
    doc.rect(14, 42, 182, 8, "F");
    doc.text("Asset Name", 16, 47);
    doc.text("Asset Type", 70, 47);
    doc.text("Status", 110, 47);
    doc.text("Purchase Date", 140, 47);
    doc.text("Warranty Expiry", 170, 47);
    
    doc.setDrawColor(200, 200, 200);
    doc.line(14, 50, 196, 50);
    
    // Rows
    doc.setFont("helvetica", "normal");
    let y = 56;
    items.forEach((item) => {
      if (y > 275) {
        doc.addPage();
        y = 20;
        doc.setFont("helvetica", "bold");
        doc.setFillColor(240, 240, 240);
        doc.rect(14, y - 6, 182, 8, "F");
        doc.text("Asset Name", 16, y - 1);
        doc.text("Asset Type", 70, y - 1);
        doc.text("Status", 110, y - 1);
        doc.text("Purchase Date", 140, y - 1);
        doc.text("Warranty Expiry", 170, y - 1);
        doc.line(14, y + 2, 196, y + 2);
        doc.setFont("helvetica", "normal");
        y += 8;
      }
      
      const name = (item.assetName || item.title || "").substring(0, 25);
      const type = (item.assetType || "").substring(0, 18);
      const status = (item.status || "").substring(0, 15);
      const purchaseDate = item.purchaseDate || "N/A";
      const warrantyExpiry = item.warrantyExpiry || "N/A";
      
      doc.text(name, 16, y);
      doc.text(type, 70, y);
      doc.text(status, 110, y);
      doc.text(purchaseDate, 140, y);
      doc.text(warrantyExpiry, 170, y);
      
      doc.line(14, y + 2, 196, y + 2);
      y += 8;
    });
    
    doc.save(`Warranty_Expiry_Report_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  private _exportDetailedReportToExcel = (filteredItems: IInventoryItem[]): void => {
    const headers = ["Asset Name", "Asset Type", "Status", "Condition", "Purchase Date", "Assigned To", "Specifications"];
    const csvRows = [headers.join(",")];
    
    filteredItems.forEach(item => {
      const name = (item.assetName || item.title || "").replace(/"/g, '""');
      const type = (item.assetType || "").replace(/"/g, '""');
      const status = (item.status || "").replace(/"/g, '""');
      const condition = (item.condition || "").replace(/"/g, '""');
      const purchaseDate = (item.purchaseDate || "").replace(/"/g, '""');
      const assignedTo = (item.assignedTo || "N/A").replace(/"/g, '""');
      const specs = (item.specifications || "").replace(/"/g, '""');
      
      const row = [
        `"${name}"`,
        `"${type}"`,
        `"${status}"`,
        `"${condition}"`,
        `"${purchaseDate}"`,
        `"${assignedTo}"`,
        `"${specs}"`
      ];
      csvRows.push(row.join(","));
    });
    
    const csvContent = "\uFEFF" + csvRows.join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `Detailed_Asset_Report_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  private _exportDetailedReportToPDF = (filteredItems: IInventoryItem[]): void => {
    const doc = new jsPDF();
    
    // Header
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("Detailed Inventory Asset Report", 14, 20);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 28);
    doc.text(`Total Assets Displayed: ${filteredItems.length}`, 14, 34);
    
    // Table Headers
    doc.setFont("helvetica", "bold");
    doc.setFillColor(240, 240, 240);
    doc.rect(14, 42, 182, 8, "F");
    doc.text("Asset Name", 16, 47);
    doc.text("Asset Type", 65, 47);
    doc.text("Status", 100, 47);
    doc.text("Condition", 130, 47);
    doc.text("Assigned To", 160, 47);
    
    doc.setDrawColor(200, 200, 200);
    doc.line(14, 50, 196, 50);
    
    // Rows
    doc.setFont("helvetica", "normal");
    let y = 56;
    filteredItems.forEach((item) => {
      if (y > 275) {
        doc.addPage();
        y = 20;
        doc.setFont("helvetica", "bold");
        doc.setFillColor(240, 240, 240);
        doc.rect(14, y - 6, 182, 8, "F");
        doc.text("Asset Name", 16, y - 1);
        doc.text("Asset Type", 65, y - 1);
        doc.text("Status", 100, y - 1);
        doc.text("Condition", 130, y - 1);
        doc.text("Assigned To", 160, y - 1);
        doc.line(14, y + 2, 196, y + 2);
        doc.setFont("helvetica", "normal");
        y += 8;
      }
      
      const name = (item.assetName || item.title || "").substring(0, 23);
      const type = (item.assetType || "").substring(0, 15);
      const status = (item.status || "").substring(0, 14);
      const condition = (item.condition || "N/A").substring(0, 14);
      const assignedTo = (item.assignedTo || "N/A").substring(0, 18);
      
      doc.text(name, 16, y);
      doc.text(type, 65, y);
      doc.text(status, 100, y);
      doc.text(condition, 130, y);
      doc.text(assignedTo, 160, y);
      
      doc.line(14, y + 2, 196, y + 2);
      y += 8;
    });
    
    doc.save(`Detailed_Asset_Report_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  private _testListConnection = async (listTitle: string, internalTitle: string): Promise<void> => {
    this.setState(prevState => ({
      connectionStatuses: { ...prevState.connectionStatuses, [listTitle]: 'testing' },
      connectionErrorMessages: { ...prevState.connectionErrorMessages, [listTitle]: '' }
    }));

    try {
      const sp = getSP();
      // Try to load 1 item from list to test connection and permissions
      await sp.web.lists.getByTitle(internalTitle).items.select("ID").top(1)();
      
      this.setState(prevState => ({
        connectionStatuses: { ...prevState.connectionStatuses, [listTitle]: 'connected' }
      }));
    } catch (e: any) {
      console.warn(`Connection test failed for list ${listTitle}`, e);
      this.setState(prevState => ({
        connectionStatuses: { ...prevState.connectionStatuses, [listTitle]: 'error' },
        connectionErrorMessages: { ...prevState.connectionErrorMessages, [listTitle]: e.message || 'Verification failed. List might be missing or inaccessible.' }
      }));
    }
  };

  private _loadGroupUsers = async (groupName: string): Promise<void> => {
    this.setState(prevState => ({
      loadingGroupUsers: { ...prevState.loadingGroupUsers, [groupName]: true }
    }));

    try {
      const sp = getSP();
      const users = await sp.web.siteGroups.getByName(groupName).users();
      const userList = users.map((u: any) => u.Title || u.LoginName || 'Unknown User');
      
      this.setState(prevState => ({
        groupUsersList: { ...prevState.groupUsersList, [groupName]: userList },
        loadingGroupUsers: { ...prevState.loadingGroupUsers, [groupName]: false }
      }));
    } catch (e: any) {
      console.warn(`Failed to load members for group ${groupName}`, e);
      this.setState(prevState => ({
        groupUsersList: { ...prevState.groupUsersList, [groupName]: ['Error retrieving group members'] },
        loadingGroupUsers: { ...prevState.loadingGroupUsers, [groupName]: false }
      }));
    }
  };

  private _renderRequestAnalysis = (request: IRequest): React.ReactNode => {
    const reqAssetTitle = request.assetTitle || "";
    const inStockItems = this.state.items.filter(item => 
      (item.assetType || '').toLowerCase() === reqAssetTitle.toLowerCase() && 
      (item.status === 'In Stock' || item.status === 'Yes' || (item.status || '').toLowerCase() === 'in stock')
    );
    const inStockCount = inStockItems.length;
    const isSufficient = inStockCount >= request.quantity;

    let progressPercent = 0.33;
    let currentStepText = "Submitted & Pending Approval";
    if (request.status === 'Approved') {
      progressPercent = 0.66;
      currentStepText = "Manager Approved - Awaiting Asset Assignment";
      if (request.assetStatus === 'Approved') {
        progressPercent = 1.0;
        currentStepText = "Completed & Asset Assigned";
      }
    } else if (request.status === 'Declined') {
      progressPercent = 1.0;
      currentStepText = "Declined by Manager";
    }

    return (
      <Stack tokens={{ childrenGap: 20 }}>
        {/* Request Overview */}
        <div style={{ backgroundColor: '#ffffff', padding: '16px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
          <h4 style={{ margin: '0 0 12px 0', color: '#111827', fontSize: '1rem', borderBottom: '1px solid #f3f4f6', paddingBottom: '8px' }}>Request Overview</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '0.88rem' }}>
            <div><span style={{ color: '#6b7280' }}>Request Key:</span> <strong style={{ color: '#111827' }}>{request.requestKey}</strong></div>
            <div><span style={{ color: '#6b7280' }}>Requested Asset:</span> <strong style={{ color: '#111827' }}>{request.assetTitle}</strong></div>
            <div><span style={{ color: '#6b7280' }}>Quantity:</span> <strong style={{ color: '#111827' }}>{request.quantity}</strong></div>
            <div><span style={{ color: '#6b7280' }}>Priority:</span> <strong style={{ color: '#111827' }}>{request.priority}</strong></div>
            <div><span style={{ color: '#6b7280' }}>Requester Name:</span> <strong style={{ color: '#111827' }}>{request.requesterName}</strong></div>
            <div><span style={{ color: '#6b7280' }}>Employee ID:</span> <strong style={{ color: '#111827' }}>{request.employeeId || "N/A"}</strong></div>
            <div><span style={{ color: '#6b7280' }}>Request Date:</span> <strong style={{ color: '#111827' }}>{request.requestDate}</strong></div>
            <div><span style={{ color: '#6b7280' }}>Request Status:</span> <strong style={{ color: request.status === 'Approved' ? '#16a34a' : request.status === 'Declined' ? '#dc2626' : '#ea580c' }}>{request.status}</strong></div>
          </div>
          {request.reason && (
            <div style={{ marginTop: '12px', fontSize: '0.88rem', padding: '8px 10px', backgroundColor: '#f9fafb', borderRadius: '4px', border: '1px solid #f3f4f6' }}>
              <span style={{ color: '#6b7280', display: 'block', marginBottom: '2px' }}>Reason for Request:</span>
              <span style={{ color: '#374151' }}>{request.reason}</span>
            </div>
          )}
          {request.managerResponse && (
            <div style={{ marginTop: '12px', fontSize: '0.88rem', padding: '8px 10px', backgroundColor: '#f0fdf4', borderRadius: '4px', border: '1px solid #dcfce7' }}>
              <span style={{ color: '#15803d', display: 'block', marginBottom: '2px' }}>Manager Response:</span>
              <span style={{ color: '#166534' }}>{request.managerResponse}</span>
            </div>
          )}
        </div>

        {/* Detailed Analysis */}
        <div style={{ backgroundColor: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <h4 style={{ margin: '0 0 12px 0', color: '#1e293b', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Icon iconName="BarChart4" style={{ color: '#0078d4' }} /> Detailed Analysis
          </h4>
          
          <Stack tokens={{ childrenGap: 12 }}>
            {/* Inventory Status Check */}
            <div>
              <span style={{ display: 'block', fontSize: '0.85rem', color: '#64748b', marginBottom: '6px' }}>Inventory Availability Check:</span>
              {isSufficient ? (
                <MessageBar messageBarType={MessageBarType.success} styles={{ root: { borderRadius: '6px' } }}>
                  <strong>Inventory Check Passed:</strong> There are currently <strong>{inStockCount}</strong> unit(s) of <strong>{reqAssetTitle}</strong> in stock, which is sufficient to fulfill this request.
                </MessageBar>
              ) : (
                <MessageBar messageBarType={MessageBarType.warning} styles={{ root: { borderRadius: '6px' } }}>
                  <strong>Inventory Warning:</strong> Only <strong>{inStockCount}</strong> unit(s) of <strong>{reqAssetTitle}</strong> in stock. Procurement is required to fully complete this order.
                </MessageBar>
              )}
            </div>

            {/* Smart recommendation */}
            <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '10px' }}>
              <span style={{ display: 'block', fontSize: '0.85rem', color: '#64748b', marginBottom: '4px' }}>Strategic Recommendation:</span>
              <div style={{ padding: '10px', backgroundColor: '#fff', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '0.85rem', lineHeight: '1.4', color: '#334155' }}>
                {request.status === 'Pending' ? (
                  isSufficient ? (
                    <span><strong>Recommended Action:</strong> Approve the request. Sufficient inventory is available, allowing immediate serial number allocation.</span>
                  ) : (
                    <span><strong>Recommended Action:</strong> Hold approval or assign alternate model. Current stock ({inStockCount}) is insufficient. Order replenishment units.</span>
                  )
                ) : request.status === 'Approved' && request.assetStatus === 'Pending' ? (
                  <span><strong>Recommended Action:</strong> Proceed to the <strong>Asset Assignment Queue</strong> tab to allocate one of the <strong>{inStockCount}</strong> available {reqAssetTitle}s to {request.requesterName}.</span>
                ) : request.status === 'Approved' && request.assetStatus === 'Approved' ? (
                  <span><strong>Lifecycle Complete:</strong> The asset has been successfully allocated. No further manager or admin action is required.</span>
                ) : (
                  <span><strong>Closed:</strong> Request has been declined. Fulfilling alternate options or review arguments if appealed.</span>
                )}
              </div>
            </div>

            {/* Lifecycle Timeline Tracker */}
            <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '10px' }}>
              <span style={{ display: 'block', fontSize: '0.85rem', color: '#64748b', marginBottom: '6px' }}>Request Lifecycle Stage:</span>
              <ProgressIndicator 
                label={currentStepText} 
                percentComplete={progressPercent} 
                styles={{ root: { marginTop: '5px' } }}
              />
            </div>
          </Stack>
        </div>
      </Stack>
    );
  };

  private _renderAssetAnalysis = (asset: IInventoryItem): React.ReactNode => {
    const purchaseDateVal = asset.purchaseDate ? new Date(asset.purchaseDate) : null;
    const now = new Date();
    const ageInMonths = purchaseDateVal 
      ? Math.round((now.getTime() - purchaseDateVal.getTime()) / (1000 * 60 * 60 * 24 * 30.4)) 
      : null;
      
    const isExpired = asset.warrantyExpiry && new Date(asset.warrantyExpiry) < now;
    
    let conditionColor = '#16a34a';
    let healthRating = "Excellent";
    let healthIcon = "Heart";
    if (asset.condition === 'Fair') {
      conditionColor = '#ea580c';
      healthRating = "Fair";
      healthIcon = "IncidentTriangle";
    } else if (asset.condition === 'Poor' || asset.condition === 'Damaged') {
      conditionColor = '#dc2626';
      healthRating = "Critical Needs Replacement";
      healthIcon = "Warning";
    }

    return (
      <Stack tokens={{ childrenGap: 20 }}>
        {/* Asset Overview */}
        <div style={{ backgroundColor: '#ffffff', padding: '16px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
          <h4 style={{ margin: '0 0 12px 0', color: '#111827', fontSize: '1rem', borderBottom: '1px solid #f3f4f6', paddingBottom: '8px' }}>Asset Specifications</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '0.88rem' }}>
            <div><span style={{ color: '#6b7280' }}>Asset Name:</span> <strong style={{ color: '#111827' }}>{asset.assetName || asset.title}</strong></div>
            <div><span style={{ color: '#6b7280' }}>Serial Number:</span> <strong style={{ color: '#111827' }}>{asset.serialNumber}</strong></div>
            <div><span style={{ color: '#6b7280' }}>Asset Type:</span> <strong style={{ color: '#111827' }}>{asset.assetType}</strong></div>
            <div><span style={{ color: '#6b7280' }}>Current Status:</span> <strong style={{ color: '#111827' }}>{asset.status}</strong></div>
            <div><span style={{ color: '#6b7280' }}>Condition:</span> <strong style={{ color: conditionColor }}>{asset.condition || "New"}</strong></div>
            <div><span style={{ color: '#6b7280' }}>Vendor:</span> <strong style={{ color: '#111827' }}>{asset.vendor || "N/A"}</strong></div>
            <div><span style={{ color: '#6b7280' }}>Purchase Date:</span> <strong style={{ color: '#111827' }}>{asset.purchaseDate || "N/A"}</strong></div>
            <div><span style={{ color: '#6b7280' }}>Warranty Expiry:</span> <strong style={{ color: isExpired ? '#dc2626' : '#111827' }}>{asset.warrantyExpiry || "N/A"}</strong></div>
          </div>
          {asset.note && (
            <div style={{ marginTop: '12px', fontSize: '0.88rem', padding: '8px 10px', backgroundColor: '#f9fafb', borderRadius: '4px', border: '1px solid #f3f4f6' }}>
              <span style={{ color: '#6b7280', display: 'block', marginBottom: '2px' }}>Asset Notes:</span>
              <span style={{ color: '#374151' }}>{asset.note}</span>
            </div>
          )}
        </div>

        {/* Detailed Analysis */}
        <div style={{ backgroundColor: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <h4 style={{ margin: '0 0 12px 0', color: '#1e293b', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Icon iconName="Heart" style={{ color: conditionColor }} /> Health & Depreciation Analysis
          </h4>
          
          <Stack tokens={{ childrenGap: 12 }}>
            {/* Age evaluation */}
            {ageInMonths !== null && (
              <div>
                <span style={{ display: 'block', fontSize: '0.85rem', color: '#64748b', marginBottom: '4px' }}>Asset Age:</span>
                <span style={{ fontSize: '0.9rem', color: '#334155' }}>
                  This asset is <strong>{ageInMonths}</strong> month(s) old ({Math.round(ageInMonths / 12 * 10) / 10} year(s)). Standard lifecycle depreciation period is 36 months (3 years).
                </span>
              </div>
            )}

            {/* Warranty alert */}
            <div>
              <span style={{ display: 'block', fontSize: '0.85rem', color: '#64748b', marginBottom: '6px' }}>Warranty Expiry Evaluation:</span>
              {asset.warrantyExpiry ? (
                isExpired ? (
                  <MessageBar messageBarType={MessageBarType.error} styles={{ root: { borderRadius: '6px' } }}>
                    <strong>Warranty Expired:</strong> Coverage ended on {asset.warrantyExpiry}. Any future repair operations will incur full direct business costs.
                  </MessageBar>
                ) : (
                  <MessageBar messageBarType={MessageBarType.success} styles={{ root: { borderRadius: '6px' } }}>
                    <strong>Warranty Active:</strong> Covered under manufacturer protection until {asset.warrantyExpiry}.
                  </MessageBar>
                )
              ) : (
                <MessageBar messageBarType={MessageBarType.info} styles={{ root: { borderRadius: '6px' } }}>
                  <strong>Warranty Unknown:</strong> No warranty expiration date has been registered for this asset.
                </MessageBar>
              )}
            </div>

            {/* Condition check */}
            <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '10px' }}>
              <span style={{ display: 'block', fontSize: '0.85rem', color: '#64748b', marginBottom: '6px' }}>Asset Physical Health:</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#334155' }}>
                <Icon iconName={healthIcon} style={{ fontSize: '18px', color: conditionColor }} />
                <span>Health Classification: <strong style={{ color: conditionColor }}>{healthRating}</strong></span>
              </div>
              {(asset.condition === 'Poor' || asset.condition === 'Damaged') && (
                <p style={{ margin: '8px 0 0 0', fontSize: '0.8rem', color: '#b91c1c', fontWeight: 'bold' }}>
                  Critical Action Recommendation: It is highly advised to retire this asset and issue a replacement request.
                </p>
              )}
            </div>
          </Stack>
        </div>
      </Stack>
    );
  };

  private _renderNotificationDetailsPanel = (): React.ReactNode => {
    const { selectedNotification, isNotificationDetailsOpen, items, requests } = this.state;
    if (!selectedNotification) return null;

    const notifId = selectedNotification.id || "";
    let associatedRequest: IRequest | undefined;
    let associatedAsset: IInventoryItem | undefined;

    if (notifId.startsWith("req-pending-")) {
      const id = notifId.replace("req-pending-", "");
      associatedRequest = requests.find(r => r.id === id);
    } else if (notifId.startsWith("req-resolved-")) {
      const parts = notifId.split("-");
      const id = parts[2];
      associatedRequest = requests.find(r => r.id === id);
    } else if (notifId.startsWith("req-assign-admin-")) {
      const id = notifId.replace("req-assign-admin-", "");
      associatedRequest = requests.find(r => r.id === id);
    } else if (notifId.startsWith("asset-assigned-admin-")) {
      const id = notifId.replace("asset-assigned-admin-", "");
      associatedAsset = items.find(a => a.id === id);
    } else if (notifId.startsWith("asset-assigned-")) {
      const id = notifId.replace("asset-assigned-", "");
      associatedAsset = items.find(a => a.id === id);
    } else if (notifId.startsWith("asset-maintenance-")) {
      const parts = notifId.replace("asset-maintenance-", "").split("-");
      const id = parts[0];
      associatedAsset = items.find(a => a.id === id);
    }

    return (
      <Panel
        isOpen={isNotificationDetailsOpen}
        onDismiss={() => this.setState({ isNotificationDetailsOpen: false })}
        type={PanelType.medium}
        headerText={selectedNotification.title}
        closeButtonAriaLabel="Close"
      >
        <div style={{ marginTop: '10px' }}>
          <p style={{ color: '#6b7280', fontSize: '0.88rem', margin: '0 0 20px 0' }}>
            <strong>Received:</strong> {selectedNotification.timestamp}
          </p>
          
          <div style={{ padding: '12px 15px', backgroundColor: '#f1f5f9', borderRadius: '6px', marginBottom: '20px', borderLeft: '4px solid #64748b' }}>
            <p style={{ margin: 0, fontSize: '0.92rem', color: '#334155', lineHeight: '1.5' }}>
              {selectedNotification.message}
            </p>
          </div>

          {associatedRequest && this._renderRequestAnalysis(associatedRequest)}
          {associatedAsset && this._renderAssetAnalysis(associatedAsset)}

          {!associatedRequest && !associatedAsset && (
            <div>
              <h4 style={{ color: '#111827', borderBottom: '1px solid #e5e7eb', paddingBottom: '8px', marginBottom: '12px' }}>System Alert Analysis</h4>
              <MessageBar messageBarType={MessageBarType.info}>
                This is a general system notification. There is no direct database link to an active request or asset.
              </MessageBar>
            </div>
          )}
        </div>
      </Panel>
    );
  };

  private _onAdminAssetChange = (event: React.FormEvent<HTMLDivElement>, option?: IDropdownOption): void => {
    if (option) {
      this.setState({ adminSelectedAssetId: option.key as string });
    }
  };

  private _handleAdminAssignAndApprove = async (): Promise<void> => {
    const request = this.state.selectedAdminRequest;
    if (!request) return;

    try {
      this.setState({ requestActionInProgressId: request.id, errorMessage: undefined });
      
      const { adminSelectedAssetId, adminComment } = this.state;
      const approverName = this.state.activeUserDisplayName;

      if (adminSelectedAssetId) {
        // Find the requester's details
        const employee = this.state.employees.find(e => e.name.toLowerCase() === request.requesterName.toLowerCase());
        const employeeEmail = employee ? employee.email : "";
        const employeeId = employee ? employee.id : "";

        // Assign the asset to the employee and approve the request
        await InventoryService.assignAssetsToEmployee(
          [adminSelectedAssetId],
          request.requesterName,
          employeeEmail,
          approverName,
          employeeId,
          adminComment
        );
      } else {
        // No asset selected, just approve the asset request status
        await InventoryService.updateAssetStatus(
          parseInt(request.id, 10),
          'Approved',
          approverName,
          adminComment
        );
      }

      // Close panel and refresh data
      this.setState({
        isAdminPanelOpen: false,
        selectedAdminRequest: undefined,
        adminSelectedAssetId: undefined,
        adminComment: ''
      });
      
      await this._loadInventory();
      await this._loadRequests();
      await this._loadAuditLogs();

    } catch (error: any) {
      this.setState({
        errorMessage: `Failed to approve & assign request #${request.requestKey || request.id}. ${error.message || JSON.stringify(error)}`
      });
    } finally {
      this.setState({ requestActionInProgressId: undefined });
    }
  };

  private _handleAdminReject = async (): Promise<void> => {
    const request = this.state.selectedAdminRequest;
    if (!request) return;

    try {
      this.setState({ requestActionInProgressId: request.id, errorMessage: undefined });
      
      const { adminComment } = this.state;
      const approverName = this.state.activeUserDisplayName;

      // Rejecting from the Admin side will set the main status of the request to 'Declined'
      await InventoryService.updateRequestStatus(
        parseInt(request.id, 10),
        'Declined',
        approverName,
        adminComment || 'Rejected by Admin during assignment'
      );

      // Close panel and refresh data
      this.setState({
        isAdminPanelOpen: false,
        selectedAdminRequest: undefined,
        adminSelectedAssetId: undefined,
        adminComment: ''
      });
      
      await this._loadInventory();
      await this._loadRequests();
      await this._loadAuditLogs();

    } catch (error: any) {
      this.setState({
        errorMessage: `Failed to reject request #${request.requestKey || request.id}. ${error.message || JSON.stringify(error)}`
      });
    } finally {
      this.setState({ requestActionInProgressId: undefined });
    }
  };

  private _renderAdminAssignmentPanel = (): React.ReactNode => {
    const request = this.state.selectedAdminRequest;
    if (!request || !this.state.isAdminPanelOpen) return null;

    const requestedAssetTitle = request.assetTitle || "";
    const matchingAssets = this.state.items.filter(item => 
      (item.assetType || '').toLowerCase() === requestedAssetTitle.toLowerCase() && 
      (item.status === 'In Stock' || item.status === 'Yes' || (item.status || '').toLowerCase() === 'in stock')
    );

    const matchingAssetOptions: IDropdownOption[] = matchingAssets.map(asset => ({
      key: asset.id,
      text: `${asset.assetName || asset.title} (SN: ${asset.serialNumber || 'N/A'})`
    }));

    const dropdownPlaceholder = matchingAssets.length > 0 
      ? "Select asset to assign..." 
      : "No assets of this type in stock";

    const isBusy = this.state.requestActionInProgressId === request.id;

    return (
      <Panel
        isOpen={this.state.isAdminPanelOpen}
        onDismiss={() => this.setState({ isAdminPanelOpen: false, selectedAdminRequest: undefined })}
        type={PanelType.medium}
        headerText={`Request #${request.requestKey || request.id}`}
        closeButtonAriaLabel="Close"
      >
        <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '20px', fontFamily: 'inherit' }}>
          
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', margin: '0 0 10px 0' }}>
            Asset request details
          </p>

          {/* Request Information Card */}
          <div style={{
            backgroundColor: 'var(--surface-bg)',
            border: '1px solid rgba(128, 128, 128, 0.15)',
            borderRadius: '8px',
            padding: '20px',
            boxShadow: 'var(--card-shadow)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid rgba(128, 128, 128, 0.1)', paddingBottom: '10px' }}>
              <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-main)' }}>Request Information</h4>
              <span style={{
                backgroundColor: '#fef3c7',
                color: '#d97706',
                fontSize: '0.75rem',
                fontWeight: 600,
                padding: '3px 8px',
                borderRadius: '4px'
              }}>
                Pending Admin
              </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', fontSize: '0.85rem' }}>
              <div>
                <span style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '2px' }}>Category</span>
                <strong style={{ color: 'var(--text-main)' }}>{request.assetTitle}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '2px' }}>Quantity</span>
                <strong style={{ color: 'var(--text-main)' }}>{request.quantity}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '2px' }}>Urgency</span>
                <strong style={{ color: 'var(--text-main)' }}>{request.priority || 'Medium'}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '2px' }}>Submitted</span>
                <strong style={{ color: 'var(--text-main)' }}>{request.requestDate}</strong>
              </div>
            </div>
            {request.reason && (
              <div style={{ marginTop: '16px' }}>
                <span style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '4px', fontSize: '0.85rem' }}>Justification</span>
                <div style={{
                  backgroundColor: this.props.isDarkTheme ? 'rgba(255, 255, 255, 0.03)' : '#f8fafc',
                  border: '1px solid rgba(128, 128, 128, 0.1)',
                  borderRadius: '6px',
                  padding: '12px',
                  fontSize: '0.85rem',
                  color: 'var(--text-main)',
                  lineHeight: 1.5
                }}>
                  {request.reason}
                </div>
              </div>
            )}
          </div>

          {/* Approval Trail Card */}
          <div style={{
            backgroundColor: 'var(--surface-bg)',
            border: '1px solid rgba(128, 128, 128, 0.15)',
            borderRadius: '8px',
            padding: '20px',
            boxShadow: 'var(--card-shadow)'
          }}>
            <h4 style={{ margin: '0 0 16px 0', fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-main)', borderBottom: '1px solid rgba(128, 128, 128, 0.1)', paddingBottom: '10px' }}>
              Approval Trail
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '0.85rem' }}>
              {/* Step 1: Submitted */}
              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#10b981', border: '2px solid var(--surface-bg)', boxShadow: '0 0 0 2px #10b981' }} />
                  <div style={{ width: '2px', flexGrow: 1, backgroundColor: '#10b981', minHeight: '20px', marginTop: '4px' }} />
                </div>
                <div>
                  <strong style={{ color: 'var(--text-main)', display: 'block' }}>Submitted</strong>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{request.requestDate}</span>
                </div>
              </div>

              {/* Step 2: Manager Review */}
              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#10b981', border: '2px solid var(--surface-bg)', boxShadow: '0 0 0 2px #10b981' }} />
                  <div style={{ width: '2px', flexGrow: 1, backgroundColor: 'rgba(128, 128, 128, 0.25)', minHeight: '20px', marginTop: '4px' }} />
                </div>
                <div>
                  <strong style={{ color: 'var(--text-main)', display: 'block' }}>Manager Review</strong>
                  <span style={{ color: 'var(--text-muted)', fontStyle: 'italic', display: 'block', marginTop: '2px', fontSize: '0.8rem' }}>
                    &ldquo;{request.managerResponse || 'Approved - valid business need'}&rdquo;
                  </span>
                </div>
              </div>

              {/* Step 3: Admin Assignment */}
              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#3b82f6', border: '2px solid var(--surface-bg)', boxShadow: '0 0 0 2px #3b82f6' }} />
                </div>
                <div>
                  <strong style={{ color: 'var(--text-main)', display: 'block' }}>Admin Assignment</strong>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Awaiting Asset Allocation</span>
                </div>
              </div>
            </div>
          </div>

          {/* Admin Assignment Card */}
          <div style={{
            backgroundColor: this.props.isDarkTheme ? 'rgba(59, 130, 246, 0.05)' : 'rgba(37, 99, 235, 0.03)',
            border: '1px solid rgba(37, 99, 235, 0.15)',
            borderRadius: '8px',
            padding: '20px',
            boxShadow: 'var(--card-shadow)'
          }}>
            <h4 style={{ margin: '0 0 16px 0', fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-main)' }}>
              Admin Assignment
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              {/* Dropdown */}
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-main)', display: 'block', marginBottom: '6px' }}>
                  Assign Asset (optional)
                </label>
                <Dropdown
                  placeholder={dropdownPlaceholder}
                  options={matchingAssetOptions}
                  selectedKey={this.state.adminSelectedAssetId}
                  onChange={this._onAdminAssetChange}
                  disabled={matchingAssets.length === 0 || isBusy}
                  styles={{ dropdown: { width: '100%' } }}
                />
              </div>

              {/* Comment Textfield */}
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-main)', display: 'block', marginBottom: '6px' }}>
                  Comment
                </label>
                <TextField
                  multiline
                  rows={4}
                  placeholder="Add a comment explaining your decision..."
                  value={this.state.adminComment}
                  onChange={(_, value) => this.setState({ adminComment: value || '' })}
                  disabled={isBusy}
                />
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                <PrimaryButton
                  text={isBusy ? "Processing..." : "Assign & Approve"}
                  onClick={this._handleAdminAssignAndApprove}
                  disabled={isBusy}
                  iconProps={{ iconName: 'CompletedSolid' }}
                />
                <DefaultButton
                  text="Reject"
                  onClick={this._handleAdminReject}
                  disabled={isBusy}
                  iconProps={{ iconName: 'Cancel' }}
                  styles={{
                    root: { color: '#dc2626', borderColor: '#dc2626' },
                    rootHovered: { color: '#ffffff', backgroundColor: '#dc2626', borderColor: '#dc2626' }
                  }}
                />
              </div>

            </div>
          </div>

        </div>
      </Panel>
    );
  };

  public render(): React.ReactElement<IInventoryManagementProps> {
    const {
      description,
      isDarkTheme,
      environmentMessage,
      hasTeamsContext
    } = this.props;

    const {
      items,
      isAssetFormOpen,
      isRequestFormOpen,
      auditLogs,
      auditLogsLoading,
      userRole,
      previewRole,
      roleLoading,
      roleGroups,
      requestActionInProgressId,
      requestSearchId,
      activeUserDisplayName,
      activeUserEmail
    } = this.state;

    const effectiveRole = previewRole || userRole;

    const isAdmin = effectiveRole === 'Admin';
    const isManager = effectiveRole === 'Inventory Manager';
    const isEmployee = effectiveRole === 'Inventory Employee';

    const myAssets = items.filter(item => this._isAssetAssignedToCurrentUser(item, activeUserDisplayName || ''));

    const myRequests = this.state.requests.filter(request => this._isRequestOwnedByCurrentUser(request.requesterName || '', activeUserDisplayName || ''));
    const myApprovedRequests = myRequests.filter(request => (request.status || '').toLowerCase().includes('approv'));

    const adminQueueRequests = this.state.requests.filter(request => (request.status || '').toLowerCase().includes('approv'));
    const managerQueueRequests = this.state.requests;

    const normalizedSearch = (requestSearchId || '').trim().toLowerCase();
    const filterRequests = (reqs: IRequest[]) => normalizedSearch
      ? reqs.filter(request =>
        (request.requestKey || '').toLowerCase().includes(normalizedSearch) ||
        (request.id || '').toLowerCase().includes(normalizedSearch)
      )
      : reqs;

    const visibleAdminRequests = filterRequests(adminQueueRequests);
    const visibleManagerRequests = filterRequests(managerQueueRequests);
    const notifications = this._getNotifications();

    const navItems: Array<{ key: string; text: string; icon: string; badge?: number; badgeColor?: string; group?: string }> = [
      { key: 'Dashboard', text: 'Dashboard', icon: 'BarChart4', group: 'MAIN' },
      { key: 'MyWorkspace', text: 'My Workspace', icon: 'Briefcase' },
      { 
        key: 'Notifications', 
        text: 'Notifications', 
        icon: 'Ringer', 
        badge: notifications.filter(n => !n.isRead).length || undefined,
        badgeColor: '#0078d4'
      },
      { key: 'IncidentHistory', text: 'Incident History', icon: 'History' },
      ...(isAdmin || isManager ? [
        { key: 'Inventory', text: 'Inventory', icon: 'List', group: 'MANAGEMENT' }
      ] : []),
      ...(isManager ? [
        { key: 'Approvals', text: 'Approvals', icon: 'DoubleChevronRight12', group: 'MANAGEMENT' }
      ] : []),
      ...(isAdmin ? [
        { key: 'AssetAssignmentQueue', text: 'Asset Assignment Queue', icon: 'Send', ...(isManager ? {} : { group: undefined }) }
      ] : []),
      ...(isAdmin || isManager ? [
        {
          key: 'AssetReturns',
          text: 'Asset Returns',
          icon: 'ReturnToSession',
          badge: this.state.returnRequests.filter(r => r.status === 'Pending').length || undefined,
          badgeColor: '#ea580c'
        }
      ] : []),
      ...(isAdmin ? [
        { key: 'EventStream', text: 'Event Stream', icon: 'ActivityFeed', group: 'SYSTEM' },
        { key: 'Users', text: 'Users', icon: 'People' },
        { key: 'Reports', text: 'Reports', icon: 'ReportDocument' },
        { key: 'Config', text: 'Config', icon: 'Settings' }
      ] : [])
    ];

    return (
      <section className={`${styles.inventoryManagement} ${hasTeamsContext ? styles.teams : ''} ${isDarkTheme ? styles.dark : ''}`}>
        <div className={styles.mainContent}>

          <div className={styles.heroSection}>
            <div className={styles.heroText}>
              <h2>Inventory Management</h2>
              <p>Welcome back, {escape(activeUserDisplayName)}!</p>
              <p className={styles.smallText}>
                Role: <strong>{effectiveRole}</strong>
              </p>

              <span className={styles.smallText}>
                {environmentMessage} • Location: {escape(description)}
              </span>
              {isAdmin && roleGroups.length > 0 && (
                <p className={styles.smallText}>
                  SharePoint Groups: {escape(roleGroups.join(', '))}
                </p>
              )}

            </div>
            <div className={styles.welcomeDiagramContainer}>
              <AssetLifecycleDiagram isDarkTheme={isDarkTheme} />
            </div>
          </div>

          {this.state.errorMessage && (
            <div style={{ color: '#991b1b', backgroundColor: '#fee2e2', padding: '15px', borderRadius: '8px', marginBottom: '20px', position: 'relative' }}>
              <strong>Error:</strong> {this.state.errorMessage}
              <button
                onClick={() => this.setState({ errorMessage: undefined })}
                style={{ position: 'absolute', right: '15px', top: '12px', border: 'none', background: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '1.1rem', color: '#991b1b' }}
                aria-label="Dismiss error"
              >
                &times;
              </button>
            </div>
          )}



          <div className={styles.appLayoutContainer}>
            {/* Left Sidebar Navigation */}
            <div
              className={`${styles.sidebarContainer} ${this.state.sidebarCollapsed ? styles.sidebarCollapsed : ''}`}
              role="navigation"
              aria-label="Main navigation"
            >
              <div className={styles.navHeader}>
                <h4>Navigation</h4>
                <span>Role: {effectiveRole}</span>
              </div>
              {navItems.map((nav, index) => {
                const isActive = this.state.selectedTabKey === nav.key;
                const showGroupLabel = nav.group && (index === 0 || navItems[index - 1]?.group !== nav.group);

                return (
                  <React.Fragment key={nav.key}>
                    {showGroupLabel && (
                      <div className={styles.navGroupLabel}>{nav.group}</div>
                    )}
                    <div
                      onClick={() => this.setState({ selectedTabKey: nav.key })}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          this.setState({ selectedTabKey: nav.key });
                        }
                      }}
                      tabIndex={0}
                      role="button"
                      aria-current={isActive ? 'page' : undefined}
                      aria-label={nav.text}
                      className={`${styles.sidebarNavItem} ${isActive ? styles.navItemActive : ''}`}
                    >
                      <Icon iconName={nav.icon} />
                      <span className={styles.navItemText}>{nav.text}</span>
                      {nav.badge !== undefined && nav.badge > 0 && (
                        <span
                          className={styles.navBadge}
                          style={{ backgroundColor: nav.badgeColor || '#e74c3c' }}
                        >
                          {nav.badge}
                        </span>
                      )}
                    </div>
                  </React.Fragment>
                );
              })}
              <div
                className={styles.collapseToggle}
                onClick={() => this.setState(prev => ({ sidebarCollapsed: !prev.sidebarCollapsed }))}
                role="button"
                tabIndex={0}
                aria-label={this.state.sidebarCollapsed ? 'Expand navigation' : 'Collapse navigation'}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.setState(prev => ({ sidebarCollapsed: !prev.sidebarCollapsed }));
                  }
                }}
              >
                <Icon iconName={this.state.sidebarCollapsed ? 'DoubleChevronRight' : 'DoubleChevronLeft'} />
                <span className={styles.collapseText}>
                  {this.state.sidebarCollapsed ? 'Expand' : 'Collapse'}
                </span>
              </div>
            </div>

            {/* Right Main Content Area */}
            <div className={`${styles.card} ${styles.contentContainer}`}>
              {(() => {
                switch (this.state.selectedTabKey) {
                  case 'Dashboard':
                    return (
                      <Dashboard
                        items={isAdmin || isManager ? items : myAssets}
                        requests={isAdmin || isManager ? this.state.requests : myRequests}
                        isAdmin={isAdmin}
                        isInventoryManager={isManager}
                        onNavigate={(key) => this.setState({ selectedTabKey: key })}
                      />
                    );
                  case 'MyWorkspace':
                    return (
                      <div>
                        <div className={styles.cardHeader}>
                          <h3>My Workspace</h3>
                        </div>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>
                          Manage your assigned assets and track your requests.
                        </p>
                        <Pivot aria-label="My Workspace Tabs">
                          <PivotItem headerText="Assets">
                            <div style={{ marginTop: '20px' }}>
                              <div style={{ marginBottom: '15px' }}>
                                <PrimaryButton
                                  text="Request Asset"
                                  onClick={() => this.setState({ isRequestFormOpen: true })}
                                  iconProps={{ iconName: 'Send' }}
                                />
                              </div>
                              <MyAssignedAssetsView 
                                items={myAssets} 
                                onReturnAsset={(item) => this.setState({ selectedAssetForReturn: item, isReturnFormOpen: true })}
                                onRaiseIncident={(item) => this.setState({ selectedAssetForIncident: item, isIncidentFormOpen: true })}
                              />
                            </div>
                          </PivotItem>
                          <PivotItem headerText="Requests">
                            <div style={{ marginTop: '20px' }}>
                              <MyRequestsView
                                requests={myRequests}
                                returnRequests={this.state.returnRequests.filter(r =>
                                  this._isRequestOwnedByCurrentUser(r.requesterName || '', activeUserDisplayName || '')
                                )}
                              />
                            </div>
                          </PivotItem>
                        </Pivot>
                      </div>
                    );
                  case 'Notifications':
                    return (
                      <NotificationCenter
                        notifications={notifications}
                        onMarkAsRead={this._markNotificationAsRead}
                        onMarkAllAsRead={this._markAllNotificationsAsRead}
                        onClearNotification={this._clearNotification}
                        onClearAllNotifications={this._clearAllNotifications}
                        onNotificationAction={this._handleNotificationAction}
                      />
                    );
                  case 'IncidentHistory':
                    return (
                      <div>
                        <div className={styles.cardHeader}>
                          <h3>Incident History</h3>
                        </div>
                        <IncidentHistory
                          {...this.props}
                          userDisplayName={activeUserDisplayName}
                          userEmail={activeUserEmail}
                          userRole={effectiveRole}
                          setIsLoading={(loading) => this.setState({ loading })}
                        />
                      </div>
                    );
                  case 'Inventory':
                    return (isAdmin || isManager) ? (
                      <div>
                        <div className={styles.cardHeader}>
                          <h3>Current Inventory Overview</h3>
                        </div>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>
                          Track and manage your organizational assets efficiently within the SharePoint Framework.
                        </p>
                        {this.state.loading ? (
                          <p>Loading inventory...</p>
                        ) : (
                          <div>
                            <div style={{ marginBottom: '15px' }}>
                              <PrimaryButton
                                text={isAdmin ? "Add New Asset" : "Assign / Manage Assets"}
                                onClick={() => this.setState({ isAssetFormOpen: true })}
                                iconProps={{ iconName: 'Add' }}
                              />
                            </div>
                            <InventoryList items={items} isAdmin={isAdmin} enablePagination={true} />
                          </div>
                        )}
                      </div>
                    ) : null;
                  case 'Approvals':
                    return isManager ? (
                      <div>
                        <div className={styles.cardHeader}>
                          <h3>Request Approvals & Assignment Queue</h3>
                        </div>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>
                          Track and manage all asset requests efficiently.
                        </p>
                        <TextField
                          label="Search by Request ID"
                          placeholder="e.g. REQ-000123"
                          value={requestSearchId}
                          onChange={(_, value) => this.setState({ requestSearchId: value || '' })}
                          styles={{ root: { marginBottom: '12px', maxWidth: 320 } }}
                        />
                        <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: 'var(--surface-color, #ffffff)', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                          <h4 style={{ marginBottom: '10px' }}>Request Approval Distribution</h4>
                          <div style={{ height: '250px', position: 'relative' }}>
                            <Pie
                              data={{
                                labels: Object.keys(
                                  managerQueueRequests.reduce((acc, req) => {
                                    const status = req.status || 'Pending';
                                    acc[status] = (acc[status] || 0) + 1;
                                    return acc;
                                  }, {} as Record<string, number>)
                                ).length ? Object.keys(
                                  managerQueueRequests.reduce((acc, req) => {
                                    const status = req.status || 'Pending';
                                    acc[status] = (acc[status] || 0) + 1;
                                    return acc;
                                  }, {} as Record<string, number>)
                                ) : ['No data'],
                                datasets: [
                                  {
                                    label: 'Requests by Status',
                                    data: Object.keys(
                                      managerQueueRequests.reduce((acc, req) => {
                                        const status = req.status || 'Pending';
                                        acc[status] = (acc[status] || 0) + 1;
                                        return acc;
                                      }, {} as Record<string, number>)
                                    ).length ? Object.keys(
                                      managerQueueRequests.reduce((acc, req) => {
                                        const status = req.status || 'Pending';
                                        acc[status] = (acc[status] || 0) + 1;
                                        return acc;
                                      }, {} as Record<string, number>)
                                    ).map(k =>
                                      (managerQueueRequests.reduce((acc, req) => {
                                        const status = req.status || 'Pending';
                                        acc[status] = (acc[status] || 0) + 1;
                                        return acc;
                                      }, {} as Record<string, number>))[k]
                                    ) : [1],
                                    backgroundColor: [
                                      'rgba(255, 206, 86, 0.6)',
                                      'rgba(75, 192, 192, 0.6)',
                                      'rgba(255, 99, 132, 0.6)',
                                      'rgba(153, 102, 255, 0.6)',
                                      'rgba(54, 162, 235, 0.6)',
                                    ],
                                    borderColor: [
                                      'rgba(255, 206, 86, 1)',
                                      'rgba(75, 192, 192, 1)',
                                      'rgba(255, 99, 132, 1)',
                                      'rgba(153, 102, 255, 1)',
                                      'rgba(54, 162, 235, 1)',
                                    ],
                                    borderWidth: 1,
                                  },
                                ],
                              }}
                              options={{ maintainAspectRatio: false }}
                            />
                          </div>
                        </div>
                        <RequestList
                          items={visibleManagerRequests}
                          canApproveReject={true}
                          canApproveAsset={false}
                          hideStatusColumn={false}
                          showResponseColumns={false}
                          onApproveRequest={this._onApproveRequest}
                          onRejectRequest={this._onRejectRequest}
                          actionInProgressId={requestActionInProgressId}
                        />
                      </div>
                    ) : null;
                  case 'AssetAssignmentQueue':
                    return isAdmin ? (
                      <div>
                        <div className={styles.cardHeader}>
                          <h3>Approved Requests for Asset Assignment</h3>
                        </div>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>
                          Only approved requests are shown here so assets can be assigned.
                        </p>
                        <TextField
                          label="Search by Request ID"
                          placeholder="e.g. REQ-000123"
                          value={requestSearchId}
                          onChange={(_, value) => this.setState({ requestSearchId: value || '' })}
                          styles={{ root: { marginBottom: '12px', maxWidth: 320 } }}
                        />
                        <RequestList
                          items={visibleAdminRequests}
                          canApproveReject={false}
                          canApproveAsset={true}
                          hideStatusColumn={true}
                          showResponseColumns={false}
                          onSelectRequestForAssignment={(request) => this.setState({ selectedAdminRequest: request, isAdminPanelOpen: true, adminSelectedAssetId: undefined, adminComment: '' })}
                          actionInProgressId={requestActionInProgressId}
                        />
                      </div>
                    ) : null;
                  case 'AssetReturns':
                    return isAdmin || isManager ? (
                      <div>
                        <div className={styles.cardHeader}>
                          <h3>Asset Returns Registry</h3>
                        </div>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>
                          Review and complete employee asset return requests, and verify physical hardware check-ins.
                        </p>
                        <ReturnRequestList
                          items={this.state.returnRequests}
                          isAdmin={isAdmin}
                          isManager={isManager}
                          onUpdateStatus={this._onUpdateReturnRequestStatus}
                          loading={this.state.returnRequestsLoading}
                        />
                      </div>
                    ) : null;
                  case 'EventStream':
                    return isAdmin ? (
                      <EventStream
                        logs={auditLogs}
                        loading={auditLogsLoading}
                        errorMessage={undefined}
                        currentUserRole={effectiveRole}
                        currentUserName={activeUserDisplayName}
                      />
                    ) : null;
                  case 'Users':
                    return isAdmin ? (
                      <div>
                        <div className={styles.cardHeader}>
                          <h3>User Administration</h3>
                        </div>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>
                          Admin-only area. Manage SharePoint groups and user onboarding from your site permissions.
                        </p>
                        <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f0f6ff', borderRadius: '8px', borderLeft: '4px solid #0078d4' }}>
                          <h4 style={{ marginTop: 0, marginBottom: '10px', color: '#0078d4' }}>SharePoint Group Management</h4>
                          <p style={{ margin: 0, fontSize: '0.9rem', color: '#323130', marginBottom: '15px' }}>
                            To onboard new employees, grant them Admin access, or assign them as Inventory Managers, you must add them to the respective SharePoint Site Groups.
                          </p>
                          <PrimaryButton
                            text="Manage Site Permissions"
                            iconProps={{ iconName: 'Permissions' }}
                            onClick={() => {
                              const siteUrl = window.location.pathname.substring(0, window.location.pathname.toLowerCase().indexOf('/sitepages'));
                              window.open(`${window.location.origin}${siteUrl}/_layouts/15/user.aspx`, '_blank');
                            }}
                          />
                        </div>

                        <h4 style={{ marginBottom: '15px' }}>Employee Directory & Asset Ownership</h4>
                        <div style={{ backgroundColor: 'var(--surface-color, #ffffff)', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                          <DetailsList
                            items={this.state.employees.map(emp => {
                              const realName = emp.jobTitle === 'Admin' ? (activeUserDisplayName || emp.name) : emp.name;
                              const assignedItems = items.filter(i => this._isAssetAssignedToCurrentUser(i, realName));
                              const assetTypes = Array.from(new Set(assignedItems.map(a => a.assetType))).filter(t => t).join(', ');
                              return {
                                ...emp,
                                assignedAssets: assignedItems.length,
                                assignedItems: assignedItems,
                                assetTypes: assetTypes || 'None'
                              };
                            })}
                            columns={[
                              { key: 'col1', name: 'Name', fieldName: 'name', minWidth: 100, maxWidth: 150, isResizable: true },
                              { key: 'col2', name: 'Email', fieldName: 'email', minWidth: 150, maxWidth: 200, isResizable: true },
                              { key: 'col3', name: 'Department', fieldName: 'department', minWidth: 100, maxWidth: 120, isResizable: true },
                              { key: 'col4', name: 'Job Title', fieldName: 'jobTitle', minWidth: 120, maxWidth: 150, isResizable: true },
                              {
                                key: 'col5',
                                name: 'Assigned Assets',
                                fieldName: 'assignedAssets',
                                minWidth: 100,
                                maxWidth: 120,
                                isResizable: true,
                                onRender: (item) => (
                                  <span style={{
                                    backgroundColor: item.assignedAssets > 0 ? '#dbeafe' : '#f3f4f6',
                                    color: item.assignedAssets > 0 ? '#1e40af' : '#4b5563',
                                    padding: '4px 10px',
                                    borderRadius: '9999px',
                                    fontWeight: 'bold'
                                  }}>
                                    {item.assignedAssets}
                                  </span>
                                )
                              },
                              { key: 'col6', name: 'Asset Types', fieldName: 'assetTypes', minWidth: 120, maxWidth: 250, isResizable: true }
                            ]}
                            setKey="usersList"
                            layoutMode={DetailsListLayoutMode.justified}
                            selectionMode={SelectionMode.none}
                            onRenderRow={(rowProps) => {
                              if (!rowProps) return null;
                              const isExpanded = this.state.expandedUserEmail === rowProps.item.email;

                              return (
                                <div>
                                  <div
                                    onClick={() => this.setState({ expandedUserEmail: isExpanded ? undefined : rowProps.item.email })}
                                    style={{ cursor: 'pointer', '&:hover': { backgroundColor: '#f3f2f1' } } as any}
                                  >
                                    <DetailsRow {...rowProps} />
                                  </div>
                                  {isExpanded && (
                                    <div style={{ padding: '20px 40px', backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                                      <h4 style={{ marginTop: 0, marginBottom: '15px', color: '#111827' }}>Assets assigned to {rowProps.item.name}</h4>
                                      {rowProps.item.assignedItems.length > 0 ? (
                                        <InventoryList items={rowProps.item.assignedItems} isAdmin={false} />
                                      ) : (
                                        <p style={{ color: '#6b7280', fontSize: '0.9rem', margin: 0 }}>This user currently has no assets assigned to them.</p>
                                      )}
                                    </div>
                                  )}
                                </div>
                              );
                            }}
                          />
                        </div>

                        <div style={{ marginTop: '30px', borderTop: '1px solid rgba(128, 128, 128, 0.15)', paddingTop: '24px' }}>
                          <div className={styles.cardHeader}>
                            <h3>Employee Asset Tracking</h3>
                          </div>
                          <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>
                            Admin and Manager area. Select an employee to view all assets currently assigned to them.
                          </p>
                          <AssetTracking
                            items={items}
                            employees={this.state.employees}
                            currentUserRole={effectiveRole}
                            currentUserName={activeUserDisplayName}
                            currentUserEmail={activeUserEmail}
                          />
                        </div>

                      </div>
                    ) : null;
                  case 'Reports':
                    return isAdmin ? (
                      <div>
                        <div className={styles.cardHeader} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <h3>Reporting & Insights</h3>
                            <p style={{ color: 'var(--text-muted)', margin: '4px 0 0 0', fontSize: '0.85rem' }}>
                              Interactive dashboards, live graphs, status analysis, and exporter module.
                            </p>
                          </div>
                        </div>

                        <Pivot
                          selectedKey={this.state.reportsSelectedTab}
                          onLinkClick={(item) => this.setState({ reportsSelectedTab: item ? item.props.itemKey || 'insights' : 'insights' })}
                          styles={{ root: { marginBottom: '20px', borderBottom: '1px solid rgba(128,128,128,0.1)' } }}
                        >
                          <PivotItem headerText="Visual Insights" itemKey="insights" />
                          <PivotItem headerText="Detailed Reports" itemKey="detailed" />
                          <PivotItem headerText="Warranty Expiry" itemKey="expiry" />
                        </Pivot>

                        {this.state.reportsSelectedTab === 'insights' && (
                          <Stack tokens={{ childrenGap: 24 }}>
                            {/* Stats Summary Cards Row */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                              <div style={{ padding: '16px', backgroundColor: 'var(--surface-color, #ffffff)', borderRadius: '8px', border: '1px solid rgba(128, 128, 128, 0.12)', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                                <span style={{ display: 'block', fontSize: '0.82rem', color: '#6b7280', fontWeight: 600, marginBottom: '6px' }}>TOTAL INVENTORY ASSETS</span>
                                <span style={{ fontSize: '1.75rem', fontWeight: 'bold', color: 'var(--text-main, #111827)' }}>{items.length}</span>
                              </div>
                              <div style={{ padding: '16px', backgroundColor: 'var(--surface-color, #ffffff)', borderRadius: '8px', border: '1px solid rgba(128, 128, 128, 0.12)', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                                <span style={{ display: 'block', fontSize: '0.82rem', color: '#1e40af', fontWeight: 600, marginBottom: '6px' }}>ASSETS CURRENTLY ASSIGNED</span>
                                <span style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#1e3a8a' }}>{items.length - items.filter(i => i.status === 'In Stock' || i.status === 'Yes').length}</span>
                              </div>
                              <div style={{ padding: '16px', backgroundColor: 'var(--surface-color, #ffffff)', borderRadius: '8px', border: '1px solid rgba(128, 128, 128, 0.12)', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                                <span style={{ display: 'block', fontSize: '0.82rem', color: '#166534', fontWeight: 600, marginBottom: '6px' }}>UTILIZATION RATE</span>
                                <span style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#14532d' }}>
                                  {items.length > 0 ? Math.round(((items.length - items.filter(i => i.status === 'In Stock' || i.status === 'Yes').length) / items.length) * 100) : 0}%
                                </span>
                              </div>
                              <div style={{ padding: '16px', backgroundColor: 'var(--surface-color, #ffffff)', borderRadius: '8px', border: '1px solid rgba(128, 128, 128, 0.12)', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                                <span style={{ display: 'block', fontSize: '0.82rem', color: '#92400e', fontWeight: 600, marginBottom: '6px' }}>TOTAL APPROVAL REQUESTS</span>
                                <span style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#78350f' }}>{this.state.requests.length}</span>
                              </div>
                            </div>

                            {/* Charts Grid */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                              {/* Chart 1: Status Distribution */}
                              <div style={{ backgroundColor: 'var(--surface-color, #ffffff)', padding: '20px', borderRadius: '8px', border: '1px solid rgba(128, 128, 128, 0.12)', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <h4 style={{ margin: '0 0 15px 0', alignSelf: 'flex-start', color: '#374151' }}>Asset Status Distribution</h4>
                                <div style={{ height: '220px', width: '220px', position: 'relative' }}>
                                  <Pie
                                    data={{
                                      labels: ['In Stock', 'Assigned', 'Pending Return', 'Under Maintenance'],
                                      datasets: [{
                                        data: [
                                          items.filter(i => i.status === 'In Stock' || i.status === 'Yes').length,
                                          items.filter(i => i.status === 'Assigned' || i.status === 'Yes (Assigned)').length,
                                          items.filter(i => i.status === 'Pending Return').length,
                                          items.filter(i => i.status === 'Under Maintenance' || i.status === 'Damaged' || i.status === 'Poor').length,
                                        ],
                                        backgroundColor: ['#107c41', '#1f77b4', '#ea580c', '#b91c1c']
                                      }]
                                    }}
                                    options={{
                                      responsive: true,
                                      maintainAspectRatio: false,
                                      plugins: { legend: { display: false } }
                                    }}
                                  />
                                </div>
                                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center', marginTop: '15px', fontSize: '0.78rem', color: '#4b5563' }}>
                                  <span><span style={{ color: '#107c41', fontSize: '1.25rem', verticalAlign: 'middle', marginRight: '4px' }}>●</span>In Stock</span>
                                  <span><span style={{ color: '#1f77b4', fontSize: '1.25rem', verticalAlign: 'middle', marginRight: '4px' }}>●</span>Assigned</span>
                                  <span><span style={{ color: '#ea580c', fontSize: '1.25rem', verticalAlign: 'middle', marginRight: '4px' }}>●</span>Pending Return</span>
                                  <span><span style={{ color: '#b91c1c', fontSize: '1.25rem', verticalAlign: 'middle', marginRight: '4px' }}>●</span>Maintenance</span>
                                </div>
                              </div>

                              {/* Chart 2: Category Distribution */}
                              <div style={{ backgroundColor: 'var(--surface-color, #ffffff)', padding: '20px', borderRadius: '8px', border: '1px solid rgba(128, 128, 128, 0.12)', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                                <h4 style={{ margin: '0 0 15px 0', color: '#374151' }}>Asset Type Distribution</h4>
                                <div style={{ height: '240px' }}>
                                  {(() => {
                                    const typeCounts: { [type: string]: number } = {};
                                    items.forEach(i => {
                                      const type = i.assetType || "Other";
                                      typeCounts[type] = (typeCounts[type] || 0) + 1;
                                    });
                                    const labels = Object.keys(typeCounts);
                                    const data = Object.keys(typeCounts).map(key => typeCounts[key]);

                                    return (
                                      <Bar
                                        data={{
                                          labels,
                                          datasets: [{
                                            label: 'Assets Count',
                                            data,
                                            backgroundColor: '#1f77b4',
                                            borderRadius: 4
                                          }]
                                        }}
                                        options={{
                                          responsive: true,
                                          maintainAspectRatio: false,
                                          plugins: { legend: { display: false } },
                                          scales: {
                                            y: { beginAtZero: true, ticks: { precision: 0 } }
                                          }
                                        }}
                                      />
                                    );
                                  })()}
                                </div>
                              </div>

                              {/* Chart 3: Asset Aging */}
                              <div style={{ backgroundColor: 'var(--surface-color, #ffffff)', padding: '20px', borderRadius: '8px', border: '1px solid rgba(128, 128, 128, 0.12)', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <h4 style={{ margin: '0 0 15px 0', alignSelf: 'flex-start', color: '#374151' }}>Asset Aging Analysis</h4>
                                <div style={{ height: '220px', width: '220px', position: 'relative' }}>
                                  {(() => {
                                    const now = new Date();
                                    const aging = items.reduce((acc, item) => {
                                      if (!item.purchaseDate) {
                                        acc.unknown++;
                                        return acc;
                                      }
                                      const pd = new Date(item.purchaseDate);
                                      const diffYears = Math.abs(now.getTime() - pd.getTime()) / (1000 * 60 * 60 * 24 * 365);
                                      if (diffYears < 1) acc.under1++;
                                      else if (diffYears <= 3) acc.between1and3++;
                                      else acc.over3++;
                                      return acc;
                                    }, { under1: 0, between1and3: 0, over3: 0, unknown: 0 });

                                    return (
                                      <Doughnut
                                        data={{
                                          labels: ['< 1 Year (New)', '1-3 Years', '> 3 Years (Aging)', 'Unknown'],
                                          datasets: [{
                                            data: [aging.under1, aging.between1and3, aging.over3, aging.unknown],
                                            backgroundColor: ['#2ca02c', '#ff7f0e', '#d62728', '#9467bd']
                                          }]
                                        }}
                                        options={{
                                          responsive: true,
                                          maintainAspectRatio: false,
                                          plugins: { legend: { display: false } }
                                        }}
                                      />
                                    );
                                  })()}
                                </div>
                                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center', marginTop: '15px', fontSize: '0.78rem', color: '#4b5563' }}>
                                  <span><span style={{ color: '#2ca02c', fontSize: '1.25rem', verticalAlign: 'middle', marginRight: '4px' }}>●</span>&lt; 1 Year</span>
                                  <span><span style={{ color: '#ff7f0e', fontSize: '1.25rem', verticalAlign: 'middle', marginRight: '4px' }}>●</span>1-3 Years</span>
                                  <span><span style={{ color: '#d62728', fontSize: '1.25rem', verticalAlign: 'middle', marginRight: '4px' }}>●</span>&gt; 3 Years</span>
                                  <span><span style={{ color: '#9467bd', fontSize: '1.25rem', verticalAlign: 'middle', marginRight: '4px' }}>●</span>Unknown</span>
                                </div>
                              </div>

                              {/* Chart 4: Request Trends */}
                              <div style={{ backgroundColor: 'var(--surface-color, #ffffff)', padding: '20px', borderRadius: '8px', border: '1px solid rgba(128, 128, 128, 0.12)', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                                <h4 style={{ margin: '0 0 15px 0', color: '#374151' }}>Request Approval Trends</h4>
                                <div style={{ height: '240px' }}>
                                  <Bar
                                    data={{
                                      labels: ['Approved', 'Declined/Rejected', 'Pending'],
                                      datasets: [{
                                        data: [
                                          this.state.requests.filter(r => (r.status || '').toLowerCase().includes('approv')).length,
                                          this.state.requests.filter(r => (r.status || '').toLowerCase().includes('declin') || (r.status || '').toLowerCase().includes('reject')).length,
                                          this.state.requests.filter(r => (r.status || '').toLowerCase() === 'pending').length
                                        ],
                                        backgroundColor: ['#2ca02c', '#d62728', '#ff7f0e']
                                      }]
                                    }}
                                    options={{
                                      responsive: true,
                                      maintainAspectRatio: false,
                                      plugins: { legend: { display: false } },
                                      scales: {
                                        y: { beginAtZero: true, ticks: { precision: 0 } }
                                      }
                                    }}
                                  />
                                </div>
                              </div>

                            </div>
                          </Stack>
                        )}

                        {this.state.reportsSelectedTab === 'detailed' && (
                          <div style={{ backgroundColor: 'var(--surface-color, #ffffff)', padding: '20px', borderRadius: '8px', border: '1px solid rgba(128, 128, 128, 0.12)', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '15px', alignItems: 'center', marginBottom: '20px' }}>
                              <h4 style={{ margin: 0 }}>Filterable Asset Inventory</h4>
                              <Stack horizontal tokens={{ childrenGap: 8 }}>
                                <PrimaryButton
                                  text="Export Excel"
                                  iconProps={{ iconName: 'ExcelDocument' }}
                                  onClick={() => {
                                    const filtered = items.filter(i => {
                                      const typeMatch = this.state.reportsAssetTypeFilter === 'All' || i.assetType === this.state.reportsAssetTypeFilter;
                                      const statusMatch = this.state.reportsStatusFilter === 'All' || i.status === this.state.reportsStatusFilter;
                                      return typeMatch && statusMatch;
                                    });
                                    this._exportDetailedReportToExcel(filtered);
                                  }}
                                  styles={{ root: { backgroundColor: '#107c41', borderColor: '#107c41', color: '#ffffff' } }}
                                />
                                <PrimaryButton
                                  text="Export PDF"
                                  iconProps={{ iconName: 'PDF' }}
                                  onClick={() => {
                                    const filtered = items.filter(i => {
                                      const typeMatch = this.state.reportsAssetTypeFilter === 'All' || i.assetType === this.state.reportsAssetTypeFilter;
                                      const statusMatch = this.state.reportsStatusFilter === 'All' || i.status === this.state.reportsStatusFilter;
                                      return typeMatch && statusMatch;
                                    });
                                    this._exportDetailedReportToPDF(filtered);
                                  }}
                                  styles={{ root: { backgroundColor: '#d13438', borderColor: '#d13438', color: '#ffffff' } }}
                                />
                              </Stack>
                            </div>

                            {/* Filters Row */}
                            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '20px', padding: '12px', backgroundColor: '#f9fafb', borderRadius: '6px' }}>
                              <div style={{ minWidth: '150px' }}>
                                <Dropdown
                                  label="Asset Type"
                                  selectedKey={this.state.reportsAssetTypeFilter}
                                  options={[
                                    { key: 'All', text: 'All Types' },
                                    ...Array.from(new Set(items.map(i => i.assetType).filter(Boolean))).map(type => ({ key: type, text: type }))
                                  ]}
                                  onChange={(_, opt) => this.setState({ reportsAssetTypeFilter: opt ? opt.key as string : 'All' })}
                                />
                              </div>
                              <div style={{ minWidth: '150px' }}>
                                <Dropdown
                                  label="Asset Status"
                                  selectedKey={this.state.reportsStatusFilter}
                                  options={[
                                    { key: 'All', text: 'All Statuses' },
                                    ...Array.from(new Set(items.map(i => i.status).filter(Boolean))).map(status => ({ key: status, text: status }))
                                  ]}
                                  onChange={(_, opt) => this.setState({ reportsStatusFilter: opt ? opt.key as string : 'All' })}
                                />
                              </div>
                            </div>

                            {(() => {
                              const filtered = items.filter(i => {
                                const typeMatch = this.state.reportsAssetTypeFilter === 'All' || i.assetType === this.state.reportsAssetTypeFilter;
                                const statusMatch = this.state.reportsStatusFilter === 'All' || i.status === this.state.reportsStatusFilter;
                                return typeMatch && statusMatch;
                              });

                              return (
                                <DetailsList
                                  items={filtered}
                                  columns={[
                                    { key: 'col1', name: 'Asset Name', fieldName: 'assetName', minWidth: 120, maxWidth: 180, isResizable: true, onRender: (item) => item.assetName || item.title },
                                    { key: 'col2', name: 'Asset Type', fieldName: 'assetType', minWidth: 90, maxWidth: 120, isResizable: true },
                                    { key: 'col3', name: 'Status', fieldName: 'status', minWidth: 90, maxWidth: 120, isResizable: true },
                                    { key: 'col4', name: 'Condition', fieldName: 'condition', minWidth: 80, maxWidth: 100, isResizable: true },
                                    { key: 'col5', name: 'Assigned To', fieldName: 'assignedTo', minWidth: 100, maxWidth: 140, isResizable: true, onRender: (item) => item.assignedTo || <span style={{ color: '#9ca3af', fontStyle: 'italic' }}>Unassigned</span> }
                                  ]}
                                  setKey="detailedReportList"
                                  layoutMode={DetailsListLayoutMode.justified}
                                  selectionMode={SelectionMode.none}
                                />
                              );
                            })()}
                          </div>
                        )}

                        {this.state.reportsSelectedTab === 'expiry' && (
                          <div style={{ backgroundColor: 'var(--surface-color, #ffffff)', padding: '20px', borderRadius: '8px', border: '1px solid rgba(128, 128, 128, 0.12)', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                              <h4 style={{ margin: 0 }}>Warranty Expiry Report</h4>
                              <Stack horizontal tokens={{ childrenGap: 8 }}>
                                <PrimaryButton
                                  text="Export Excel"
                                  iconProps={{ iconName: 'ExcelDocument' }}
                                  onClick={this._exportWarrantyReportToExcel}
                                  styles={{ root: { backgroundColor: '#107c41', borderColor: '#107c41', color: '#ffffff' } }}
                                />
                                <PrimaryButton
                                  text="Export PDF"
                                  iconProps={{ iconName: 'PDF' }}
                                  onClick={this._exportWarrantyReportToPDF}
                                  styles={{ root: { backgroundColor: '#d13438', borderColor: '#d13438', color: '#ffffff' } }}
                                />
                              </Stack>
                            </div>
                            <div style={{ marginBottom: '15px', display: 'flex', gap: '20px' }}>
                              <div style={{ padding: '10px 15px', backgroundColor: '#f3f4f6', borderRadius: '6px' }}>
                                <span style={{ display: 'block', fontSize: '0.85rem', color: '#4b5563', marginBottom: '4px' }}>Total Assets Count</span>
                                <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#111827' }}>{items.length}</span>
                              </div>
                              <div style={{ padding: '10px 15px', backgroundColor: '#f3f4f6', borderRadius: '6px' }}>
                                <span style={{ display: 'block', fontSize: '0.85rem', color: '#4b5563', marginBottom: '4px' }}>Assets with Warranty Data</span>
                                <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#111827' }}>{items.filter(i => i.warrantyExpiry).length}</span>
                              </div>
                            </div>
                            <DetailsList
                              items={items}
                              columns={[
                                { key: 'col1', name: 'Asset Name', fieldName: 'assetName', minWidth: 120, maxWidth: 200, isResizable: true, onRender: (item) => item.assetName || item.title },
                                { key: 'col2', name: 'Asset Type', fieldName: 'assetType', minWidth: 100, maxWidth: 150, isResizable: true },
                                { key: 'col3', name: 'Status', fieldName: 'status', minWidth: 80, maxWidth: 100, isResizable: true },
                                { key: 'col4', name: 'Purchase Date', fieldName: 'purchaseDate', minWidth: 100, maxWidth: 120, isResizable: true },
                                {
                                  key: 'col5',
                                  name: 'Warranty Expiry Date',
                                  fieldName: 'warrantyExpiry',
                                  minWidth: 140,
                                  maxWidth: 200,
                                  isResizable: true,
                                  onRender: (item) => {
                                    const isExpired = item.warrantyExpiry && new Date(item.warrantyExpiry) < new Date();
                                    return (
                                      <span style={{
                                        color: isExpired ? '#ef4444' : '#166534',
                                        fontWeight: 600,
                                        backgroundColor: isExpired ? '#fee2e2' : '#dcfce7',
                                        padding: '2px 8px',
                                        borderRadius: '9999px',
                                        fontSize: '0.75rem',
                                        display: 'inline-block'
                                      }}>
                                        {item.warrantyExpiry || 'N/A'} {isExpired ? '(Expired)' : '(Active)'}
                                      </span>
                                    );
                                  }
                                }
                              ]}
                              setKey="warrantyReport"
                              layoutMode={DetailsListLayoutMode.justified}
                              selectionMode={SelectionMode.none}
                            />
                          </div>
                        )}
                      </div>
                    ) : null;
                  case 'Config':
                    return isAdmin ? (
                      <div>
                        <div className={styles.cardHeader}>
                          <h3>Configuration & List Management</h3>
                          <p style={{ color: 'var(--text-muted)', margin: '4px 0 0 0', fontSize: '0.85rem' }}>
                            Admin-only control center for list syncing, database connection tests, role diagnostics, and list schemas.
                          </p>
                        </div>

                        <Pivot
                          selectedKey={this.state.configSelectedTab}
                          onLinkClick={(item) => this.setState({ configSelectedTab: item ? item.props.itemKey || 'operations' : 'operations' })}
                          styles={{ root: { marginBottom: '20px', borderBottom: '1px solid rgba(128,128,128,0.1)' } }}
                        >
                          <PivotItem headerText="Sync Operations" itemKey="operations" />
                          <PivotItem headerText="List Connections" itemKey="connections" />
                          <PivotItem headerText="RBAC Site Groups" itemKey="rbac" />
                          <PivotItem headerText="Required Schema Guides" itemKey="schema" />
                        </Pivot>

                        {this.state.configSelectedTab === 'operations' && (
                          <div style={{ backgroundColor: 'var(--surface-color, #ffffff)', padding: '20px', borderRadius: '8px', border: '1px solid rgba(128, 128, 128, 0.12)', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                            <h4 style={{ marginBottom: '10px', color: '#111827', marginTop: 0 }}>Mapping List Management & Sync</h4>
                            <p style={{ fontSize: '0.88rem', color: '#4b5563', margin: '0 0 15px 0' }}>
                              Ensure all assets currently assigned to active employees are properly mapped to the SharePoint <strong>Mapping List</strong>.
                              Use the buttons below to perform a manual synchronization check or diagnose the list&apos;s database schema.
                            </p>

                            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '15px' }}>
                              <PrimaryButton
                                text={this.state.syncInProgress ? "Processing..." : "Sync Assigned Assets"}
                                iconProps={{ iconName: 'Sync' }}
                                onClick={this._onSyncAssignedAssets}
                                disabled={this.state.syncInProgress}
                              />
                              <PrimaryButton
                                text={this.state.syncInProgress ? "Checking Schema..." : "Run Schema Diagnostics"}
                                iconProps={{ iconName: 'Database' }}
                                onClick={this._onRunDiagnostics}
                                disabled={this.state.syncInProgress}
                                styles={{
                                  root: { backgroundColor: '#5c2d91', borderColor: '#5c2d91' },
                                  rootHovered: { backgroundColor: '#4b2278', borderColor: '#4b2278' }
                                }}
                              />
                            </div>

                            {this.state.syncMessage && (
                              <MessageBar
                                messageBarType={this.state.syncMessageType}
                                onDismiss={() => this.setState({ syncMessage: undefined })}
                                styles={{ root: { marginBottom: '15px', borderRadius: '6px' } }}
                              >
                                {this.state.syncMessage}
                              </MessageBar>
                            )}

                            {this.state.diagnosticInfo && (
                              <div style={{ marginTop: '15px' }}>
                                <span style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', color: '#323130', marginBottom: '6px' }}>Diagnostic Log Output:</span>
                                <textarea
                                  readOnly
                                  value={this.state.diagnosticInfo}
                                  rows={10}
                                  style={{
                                    width: '100%',
                                    fontFamily: 'monospace',
                                    fontSize: '0.82rem',
                                    padding: '10px',
                                    backgroundColor: '#f3f2f1',
                                    border: '1px solid #e1dfdd',
                                    borderRadius: '4px',
                                    resize: 'vertical',
                                    color: '#323130'
                                  }}
                                />
                              </div>
                            )}
                          </div>
                        )}

                        {this.state.configSelectedTab === 'connections' && (
                          <div style={{ backgroundColor: 'var(--surface-color, #ffffff)', padding: '20px', borderRadius: '8px', border: '1px solid rgba(128, 128, 128, 0.12)', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                            <h4 style={{ marginBottom: '15px', color: '#111827', marginTop: 0 }}>SharePoint List Connections</h4>
                            <p style={{ fontSize: '0.85rem', color: '#6b7280', marginBottom: '20px' }}>
                              Verify the read/write database connection status of the required SharePoint storage lists.
                            </p>
                            
                            <Stack tokens={{ childrenGap: 16 }}>
                              {[
                                { title: 'Inventory List', internal: 'InventoryList', desc: 'Stores the master catalog of all physical assets and hardware.' },
                                { title: 'Request List', internal: 'RequestList', desc: 'Manages employee request tickets, workflow histories, and assignment queues.' },
                                { title: 'Asset Return Request List', internal: 'Asset Return Request List', desc: 'Handles asset return forms, check-in inspections, and manager validations.' },
                                { title: 'Mapping List', internal: 'Mapping List', desc: 'Maintains live active assignment mapping for automated clearing checks.' },
                                { title: 'System Audit Log', internal: 'AuditLogList', desc: 'Tracks historical change logs, lifecycle states, and admin operations.' }
                              ].map(list => {
                                const status = this.state.connectionStatuses[list.title];
                                const errorMsg = this.state.connectionErrorMessages[list.title];
                                
                                return (
                                  <div key={list.title} style={{ padding: '16px', borderRadius: '8px', border: '1px solid rgba(128, 128, 128, 0.15)', backgroundColor: 'var(--surface-color, #ffffff)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                                    <div style={{ flex: '1 1 300px' }}>
                                      <h5 style={{ margin: '0 0 4px 0', fontSize: '0.95rem', fontWeight: 600, color: '#111827' }}>
                                        {list.title} <span style={{ fontWeight: 'normal', color: '#6b7280', fontSize: '0.8rem' }}>({list.internal})</span>
                                      </h5>
                                      <span style={{ fontSize: '0.82rem', color: '#4b5563' }}>{list.desc}</span>
                                      {errorMsg && (
                                        <div style={{ marginTop: '8px', color: '#d13438', fontSize: '0.78rem', backgroundColor: '#fde7e9', padding: '6px 10px', borderRadius: '4px' }}>
                                          <strong>Error:</strong> {errorMsg}
                                        </div>
                                      )}
                                    </div>
                                    
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                      {status === 'testing' && (
                                        <span style={{ fontSize: '0.8rem', color: '#0078d4', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                          <Icon iconName="ProgressLoopOuter" style={{ animation: 'spin 1.5s linear infinite' }} /> Verifying...
                                        </span>
                                      )}
                                      {status === 'connected' && (
                                        <span style={{
                                          color: '#166534',
                                          backgroundColor: '#dcfce7',
                                          padding: '4px 12px',
                                          borderRadius: '9999px',
                                          fontSize: '0.75rem',
                                          fontWeight: 600,
                                          display: 'inline-flex',
                                          alignItems: 'center',
                                          gap: '4px'
                                        }}>
                                          <Icon iconName="Completed" /> Connected
                                        </span>
                                      )}
                                      {status === 'error' && (
                                        <span style={{
                                          color: '#b91c1c',
                                          backgroundColor: '#fee2e2',
                                          padding: '4px 12px',
                                          borderRadius: '9999px',
                                          fontSize: '0.75rem',
                                          fontWeight: 600,
                                          display: 'inline-flex',
                                          alignItems: 'center',
                                          gap: '4px'
                                        }}>
                                          <Icon iconName="ErrorBadge" /> Failed
                                        </span>
                                      )}
                                      {!status && (
                                        <span style={{
                                          color: '#4b5563',
                                          backgroundColor: '#f3f4f6',
                                          padding: '4px 12px',
                                          borderRadius: '9999px',
                                          fontSize: '0.75rem',
                                          fontWeight: 500
                                        }}>
                                          Not Verified
                                        </span>
                                      )}
                                      
                                      <DefaultButton
                                        text="Test Live"
                                        iconProps={{ iconName: 'PlugConnected' }}
                                        onClick={() => this._testListConnection(list.title, list.internal)}
                                        disabled={status === 'testing'}
                                      />
                                    </div>
                                  </div>
                                );
                              })}
                            </Stack>
                          </div>
                        )}

                        {this.state.configSelectedTab === 'rbac' && (
                          <div style={{ backgroundColor: 'var(--surface-color, #ffffff)', padding: '20px', borderRadius: '8px', border: '1px solid rgba(128, 128, 128, 0.12)', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                            <h4 style={{ marginBottom: '15px', color: '#111827', marginTop: 0 }}>Role Based Access Control (RBAC)</h4>
                            <p style={{ fontSize: '0.85rem', color: '#6b7280', marginBottom: '20px' }}>
                              Inspect user groups resolved from SharePoint for permission level verification.
                            </p>
                            
                            <Stack tokens={{ childrenGap: 16 }}>
                              {[
                                { group: 'MSFT Owners', role: 'Admin', desc: 'Full administrative rights to modify assets, approve returns, and manage database connection setups.' },
                                { group: 'MSFT Members', role: 'Inventory Manager', desc: 'Write access to create items, process returns, assign assets, and view reports.' },
                                { group: 'MSFT Visitors', role: 'Inventory Employee', desc: 'Read-only access to available stocks and permission to request return tickets.' }
                              ].map(item => {
                                const isLoading = this.state.loadingGroupUsers[item.group];
                                const members = this.state.groupUsersList[item.group];
                                
                                return (
                                  <div key={item.group} style={{ padding: '16px', borderRadius: '8px', border: '1px solid rgba(128, 128, 128, 0.15)', backgroundColor: 'var(--surface-color, #ffffff)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                      <div>
                                        <h5 style={{ margin: 0, fontSize: '1rem', fontWeight: 600, color: '#111827' }}>
                                          {item.group} <span style={{ color: '#0078d4', fontSize: '0.8rem', backgroundColor: '#deecf9', padding: '2px 8px', borderRadius: '4px', marginLeft: '6px', fontWeight: 600 }}>{item.role}</span>
                                        </h5>
                                        <span style={{ fontSize: '0.8rem', color: '#4b5563', display: 'block', marginTop: '4px' }}>{item.desc}</span>
                                      </div>
                                      
                                      <DefaultButton
                                        text={isLoading ? "Loading..." : "View Members"}
                                        iconProps={{ iconName: 'People' }}
                                        onClick={() => this._loadGroupUsers(item.group)}
                                        disabled={isLoading}
                                      />
                                    </div>
                                    
                                    {members && (
                                      <div style={{ marginTop: '12px', padding: '12px', backgroundColor: '#f9fafb', borderRadius: '6px', border: '1px solid rgba(128,128,128,0.1)' }}>
                                        <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '6px' }}>Group Members ({members.length}):</span>
                                        {members.length === 0 ? (
                                          <span style={{ fontSize: '0.8rem', color: '#6b7280', fontStyle: 'italic' }}>No members found in this group</span>
                                        ) : (
                                          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                            {members.map((m, idx) => (
                                              <span key={idx} style={{ backgroundColor: '#ffffff', border: '1px solid rgba(128,128,128,0.15)', padding: '4px 10px', borderRadius: '4px', fontSize: '0.78rem', color: '#111827', fontWeight: 500 }}>
                                                {m}
                                              </span>
                                            ))}
                                          </div>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </Stack>
                          </div>
                        )}

                        {this.state.configSelectedTab === 'schema' && (
                          <div style={{ backgroundColor: 'var(--surface-color, #ffffff)', padding: '20px', borderRadius: '8px', border: '1px solid rgba(128, 128, 128, 0.12)', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                            <h4 style={{ marginBottom: '5px', color: '#111827', marginTop: 0 }}>Required List Schema (Developer Reference)</h4>
                            <p style={{ fontSize: '0.85rem', color: '#6b7280', marginBottom: '20px', marginTop: 0 }}>Ensure your SharePoint lists contain the following columns exactly as written to prevent validation errors.</p>

                            <h5 style={{ marginTop: '15px', marginBottom: '8px', color: '#374151' }}>InventoryList <span style={{ fontWeight: 'normal', color: '#9ca3af' }}>(Asset Database)</span></h5>
                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '25px' }}>
                              {['Title', 'AssetName', 'AssetType', 'SerialNumber', 'PurchaseDate', 'Status', 'Specifications', 'AssignedTo (Person/Group)'].map(col => (
                                <span key={col} style={{ backgroundColor: '#f3f4f6', padding: '4px 10px', borderRadius: '4px', fontSize: '0.75rem', color: '#374151', border: '1px solid #e5e7eb' }}>{col}</span>
                              ))}
                            </div>

                            <h5 style={{ marginBottom: '8px', color: '#374151' }}>RequestList <span style={{ fontWeight: 'normal', color: '#9ca3af' }}>(Approval Workflows)</span></h5>
                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '25px' }}>
                              {['Title', 'Employee', 'AssetType', 'Quantity', 'ReasonforRequest', 'RequestStatus', 'RequestKey', 'AssetStatus'].map(col => (
                                <span key={col} style={{ backgroundColor: '#f3f4f6', padding: '4px 10px', borderRadius: '4px', fontSize: '0.75rem', color: '#374151', border: '1px solid #e5e7eb' }}>{col}</span>
                              ))}
                            </div>

                            <h5 style={{ marginBottom: '8px', color: '#374151' }}>Asset Return Request List <span style={{ fontWeight: 'normal', color: '#9ca3af' }}>(Returns Handling)</span></h5>
                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '25px' }}>
                              {['Title', 'AssetID', 'AssetName', 'SerialNumber', 'Employee', 'ReasonforReturn', 'ProposedCondition', 'RequestStatus', 'ManagerComments'].map(col => (
                                <span key={col} style={{ backgroundColor: '#f3f4f6', padding: '4px 10px', borderRadius: '4px', fontSize: '0.75rem', color: '#374151', border: '1px solid #e5e7eb' }}>{col}</span>
                              ))}
                            </div>

                            <h5 style={{ marginBottom: '8px', color: '#374151' }}>Mapping List <span style={{ fontWeight: 'normal', color: '#9ca3af' }}>(Custody Tracking)</span></h5>
                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                              {['Title', 'SerialNumber', 'Employe', 'EmployeeID', 'AssetName', 'AssignmentID'].map(col => (
                                <span key={col} style={{ backgroundColor: '#f3f4f6', padding: '4px 10px', borderRadius: '4px', fontSize: '0.75rem', color: '#374151', border: '1px solid #e5e7eb' }}>{col}</span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : null;
                  default:
                    return null;
                }
              })()}
            </div>
          </div>

        </div>

        {(isAdmin || isManager) && (
          <AssetForm
            isOpen={isAssetFormOpen}
            onClose={() => this.setState({ isAssetFormOpen: false })}
            currentUserRole={effectiveRole}
            onAddAsset={this._onAddAsset}
          />
        )}

        {(isAdmin || isManager || isEmployee) && (
          <RequestForm
            isOpen={isRequestFormOpen}
            onClose={() => this.setState({ isRequestFormOpen: false })}
            availableAssets={items}
            employees={this.state.employees}
            currentUserRole={effectiveRole}
            currentUserName={activeUserDisplayName}
            onSubmitRequest={this._onSubmitRequest}
          />
        )}

        {(isAdmin || isManager || isEmployee) && (
          <IncidentRequestModule
            {...this.props}
            isOpen={this.state.isIncidentFormOpen}
            onClose={() => this.setState({ isIncidentFormOpen: false, selectedAssetForIncident: undefined })}
            userDisplayName={activeUserDisplayName}
            userEmail={activeUserEmail}
            setIsLoading={(loading) => this.setState({ loading })}
            preselectedAsset={this.state.selectedAssetForIncident}
          />
        )}

        {this._renderNotificationDetailsPanel()}
        {this._renderAdminAssignmentPanel()}
        <ReturnAssetForm
          isOpen={this.state.isReturnFormOpen}
          onDismiss={() => this.setState({ isReturnFormOpen: false, selectedAssetForReturn: undefined })}
          asset={this.state.selectedAssetForReturn}
          onSubmit={this._onSubmitReturnRequest}
        />
      </section>
    );
  }
}
