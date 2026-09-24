import * as React from 'react';
import styles from './InventoryManagement.module.scss';
import type { IInventoryManagementProps } from '../models/IInventoryManagementProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { IInventoryItem } from '../models/IInventoryItem';
import { IRequest } from '../models/IRequest';
import { IEventLog } from '../models/IEventLog';
import { getSP } from '../pnpjsConfig';
import { AssetForm } from './AssetForm';
import { RequestForm } from './RequestForm';
import { IReturnRequest } from '../models/IReturnRequest';
import { ReturnAssetForm } from './ReturnAssetForm';
import { getAvailableStock } from '../utils/StockUtils';
import { PrimaryButton, DefaultButton, TextField, Dropdown, IDropdownOption, Panel, PanelType, MessageBar, MessageBarType, ProgressIndicator, Icon, Stack } from '@fluentui/react';
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
import { EmailService } from '../services/EmailService';
import { ConfigPage, DashboardPage, ReportsPage, IncidentHistoryPage, InventoryPage, ReplacementHistoryPage, NotificationsPage, NotificationDetailsPanel, AssetReturnsPage, EventStreamPage, AssetAssignmentQueuePage, MyWorkspacePage, AdminAssignmentPanel, ApprovalsPage, UsersPage } from '../pages';
import { INotification } from '../models/INotification';
import { IncidentRequestModule } from './IncidentRequest/IncidentRequestModule';
import { IncidentHistory } from './IncidentHistory/IncidentHistory';
import { AssetLifecycleDiagram } from './AssetLifecycleDiagram';
import { WorkflowPopup, IWorkflowPopupDetails } from './WorkflowPopup';
import * as strings from 'InventoryManagementWebPartStrings';
import { formatString } from '../utils/LocalizationUtils';
import { SUPPORTED_LANGUAGES, getCurrentLanguage, setLanguage, onLanguageChange, SupportedLanguage } from '../services/LanguageSwitcherService';
import { getNotifications } from '../utils/getNotifications';
import { exportWarrantyReportToExcel, exportWarrantyReportToPDF, exportDetailedReportToExcel, exportDetailedReportToPDF } from '../utils/ReportExportUtils';

export interface IWorkflowPopupConfig {
  isOpen: boolean;
  title: string;
  stage: string;
  type: 'success' | 'info' | 'warning' | 'error';
  message: string;
  details?: IWorkflowPopupDetails;
}

export interface IInventoryManagementState {
  languageVersion: number;
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
  isAllNotificationsCleared: boolean;
  selectedNotification?: INotification;
  isNotificationDetailsOpen: boolean;
  returnRequests: IReturnRequest[];
  returnRequestsLoading: boolean;
  auditLogsRefreshTrigger: number;
  selectedAssetForReturn: IInventoryItem | undefined;
  isReturnFormOpen: boolean;
  activeUserDisplayName: string;
  activeUserEmail: string;
  isIncidentFormOpen: boolean;
  selectedAssetForIncident: IInventoryItem | undefined;
  preselectedIncidentType?: string;
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
  workflowPopup: IWorkflowPopupConfig;
  lastMockEmail?: { to: string[]; subject: string; body: string };
  editMockEmailTo: string;
  editMockEmailSubject: string;
  isSendingMockEmail: boolean;
  mockEmailSendError?: string;
  mockEmailSendSuccess: boolean;
}

export default class InventoryManagement extends React.Component<IInventoryManagementProps, IInventoryManagementState> {
  private _getRoleDisplayLabel = (role: 'Admin' | 'Inventory Manager' | 'Inventory Employee'): string => {
    switch (role) {
      case 'Admin':
        return strings.Roles.Admin;
      case 'Inventory Manager':
        return strings.Roles.InventoryManager;
      case 'Inventory Employee':
        return strings.Roles.InventoryEmployee;
      default:
        return role;
    }
  };

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

    // 1. Check item status - returned or in-stock assets are no longer assigned
    const statusLower = (item.status || '').toLowerCase().trim();
    if (
      statusLower === 'in stock' ||
      statusLower === 'instock' ||
      statusLower === 'available' ||
      statusLower === 'returned' ||
      statusLower === 'return approved' ||
      statusLower === 'returnapproved' ||
      statusLower === 'under maintenance' ||
      statusLower === 'damaged' ||
      statusLower === 'disposed' ||
      statusLower === 'retired'
    ) {
      return false;
    }

    // 2. Check if there is a completed return request for this asset
    const returnRequests = this.state ? this.state.returnRequests : [];
    if (returnRequests && returnRequests.length > 0) {
      const isReturned = returnRequests.some(r => {
        const isSameAsset = (r.assetId && r.assetId === item.id) ||
          (r.serialNumber && item.serialNumber && r.serialNumber.toLowerCase().trim() === item.serialNumber.toLowerCase().trim()) ||
          (r.assetName && item.assetName && r.assetName.toLowerCase().trim() === item.assetName.toLowerCase().trim() && normalize(r.requesterName) === activeUser);
        const isCompleted = r.status === 'Completed' || r.status === 'Returned' || r.adminStatus === 'Completed';
        return isSameAsset && isCompleted;
      });
      if (isReturned) {
        return false;
      }
    }

    // 3. Match user assignment
    const assignedNorm = normalize(item.assignedTo);
    const isAssigned = assignedNorm && (assignedNorm === activeUser || assignedNorm.includes(activeUser) || activeUser.includes(assignedNorm));
    const isNoted = (item.note || '').toLowerCase().includes('assigned to:') && normalize(item.note).includes(activeUser);
    const isStatus = (item.status || '').toLowerCase().includes('assigned to:') && normalize(item.status).includes(activeUser);

    return !!(isAssigned || isNoted || isStatus);
  };

  private _getNotifications = (): INotification[] => {
    return getNotifications({
      items: this.state.items,
      requests: this.state.requests,
      returnRequests: this.state.returnRequests,
      activeUserDisplayName: this.state.activeUserDisplayName,
      previewRole: this.state.previewRole,
      userRole: this.state.userRole,
      readNotificationIds: this.state.readNotificationIds,
      clearedNotificationIds: this.state.clearedNotificationIds
    });
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

  private _clearAllNotifications = (filterTab?: string): void => {
    const targetFilter = filterTab || 'All';
    if (targetFilter === 'All') {
      this.setState({ isAllNotificationsCleared: true });
      localStorage.setItem('inventory_cleared_all_tab', 'true');
    } else {
      const notifications = this._getNotifications();
      const idsToClear = notifications
        .filter(n => n.category === targetFilter)
        .map(n => n.id);
      const clearedNotificationIds = Array.from(new Set([...this.state.clearedNotificationIds, ...idsToClear]));
      this.setState({ clearedNotificationIds });
      localStorage.setItem('inventory_cleared_notifications', JSON.stringify(clearedNotificationIds));
    }
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
    let isAllCleared = false;
    try {
      readIds = JSON.parse(localStorage.getItem('inventory_read_notifications') || '[]');
      clearedIds = JSON.parse(localStorage.getItem('inventory_cleared_notifications') || '[]');
      isAllCleared = localStorage.getItem('inventory_cleared_all_tab') === 'true';
    } catch (e) {
      console.warn("localStorage parsing failed", e);
    }

    const activeName = props.userDisplayName;
    const activeEmail = props.userEmail;

    this.state = {
      languageVersion: 0,
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
      auditLogsRefreshTrigger: 0,
      errorMessage: undefined,
      selectedTabKey: 'Dashboard',
      readNotificationIds: readIds,
      clearedNotificationIds: clearedIds,
      isAllNotificationsCleared: isAllCleared,
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
      preselectedIncidentType: undefined,
      selectedAdminRequest: undefined,
      isAdminPanelOpen: false,
      adminSelectedAssetId: undefined,
      adminComment: '',
      sidebarCollapsed: window.innerWidth <= 600,
      reportsSelectedTab: 'insights',
      reportsAssetTypeFilter: 'All',
      reportsStatusFilter: 'All',
      configSelectedTab: 'overview',
      workflowPopup: {
        isOpen: false,
        title: '',
        stage: '',
        type: 'info',
        message: ''
      },
      lastMockEmail: undefined,
      editMockEmailTo: '',
      editMockEmailSubject: '',
      isSendingMockEmail: false,
      mockEmailSendError: undefined,
      mockEmailSendSuccess: false
    };
  }

  private _unsubscribeLanguageChange?: () => void;

  private _onLanguageChanged = (): void => {
    this.setState(prev => ({ languageVersion: prev.languageVersion + 1 }));
  };

  public async componentDidMount(): Promise<void> {
    this._unsubscribeLanguageChange = onLanguageChange(this._onLanguageChanged);
    await this._resolveUserRole();
    await this._loadReturnRequests();

    // Run self-healing cleanup for Return Approved/Completed assets BEFORE loading inventory
    try {
      await InventoryService.cleanupReturnApprovedAssets();
    } catch (e) {
      console.warn("Failed to run Return Approved assets self-healing cleanup:", e);
    }

    await this._loadInventory();
    await this._loadRequests();
    await this._loadAuditLogs();

    // Dynamically auto-sync existing assigned assets of our 5 active users to the Mapping List
    try {
      await InventoryService.syncExistingAssignmentsToMappingList(this.state.activeUserDisplayName);
      await this._loadInventory();
    } catch (e) {
      console.warn("Failed to auto-sync existing assignments to Mapping List:", e);
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('spfx_mock_email_sent', this._handleMockEmailSent as any);
      window.addEventListener('spfx_email_send_failed', this._handleEmailSendFailed as any);
    }
  }

  public componentWillUnmount(): void {
    if (typeof window !== 'undefined') {
      window.removeEventListener('spfx_mock_email_sent', this._handleMockEmailSent as any);
      window.removeEventListener('spfx_email_send_failed', this._handleEmailSendFailed as any);
    }
    if (this._unsubscribeLanguageChange) {
      this._unsubscribeLanguageChange();
    }
  }

  private _onLanguageSelect = (languageCode: SupportedLanguage): void => {
    setLanguage(languageCode);
  };

  private _handleMockEmailSent = (ev: CustomEvent<{ to: string[]; subject: string; body: string }>): void => {
    this.setState({
      lastMockEmail: ev.detail,
      editMockEmailTo: ev.detail.to.join(', '),
      editMockEmailSubject: ev.detail.subject,
      isSendingMockEmail: false,
      mockEmailSendError: undefined,
      mockEmailSendSuccess: false
    });
  };

  private _handleEmailSendFailed = (ev: CustomEvent<{ to: string[]; subject: string; errorMessage: string }>): void => {
    this.setState({
      syncMessage: `⚠️ Email Notification failed to send to ${ev.detail.to.join(', ')}. Details: ${ev.detail.errorMessage}`,
      syncMessageType: MessageBarType.warning
    });
  };

  private _onSendMockEmail = async (): Promise<void> => {
    const { lastMockEmail, editMockEmailTo, editMockEmailSubject } = this.state;
    if (!lastMockEmail) return;

    this.setState({ isSendingMockEmail: true, mockEmailSendError: undefined, mockEmailSendSuccess: false });

    try {
      const recipients = editMockEmailTo.split(',').map(email => email.trim()).filter(Boolean);
      await EmailService.sendMail(recipients, editMockEmailSubject, lastMockEmail.body);
      this.setState({
        isSendingMockEmail: false,
        mockEmailSendSuccess: true
      });
      setTimeout(() => {
        this.setState({ lastMockEmail: undefined, mockEmailSendSuccess: false });
      }, 2000);
    } catch (e: any) {
      console.error("Failed to send email from panel:", e);
      this.setState({
        isSendingMockEmail: false,
        mockEmailSendError: e.message || JSON.stringify(e)
      });
    }
  };

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
    this.setState(prevState => ({
      auditLogsRefreshTrigger: (prevState.auditLogsRefreshTrigger || 0) + 1
    }));
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
      this.setState({
        isReturnFormOpen: false,
        selectedAssetForReturn: undefined,
        returnRequestsLoading: false,
        syncMessage: `Return request for "${selectedAssetForReturn.assetName || selectedAssetForReturn.title}" submitted successfully!`,
        syncMessageType: MessageBarType.success,
        workflowPopup: {
          isOpen: true,
          title: 'Asset Return Request Submitted',
          stage: 'Return Stage 1: Submitted',
          type: 'info',
          message: `Return request for "${selectedAssetForReturn.assetName || selectedAssetForReturn.title}" has been submitted and is awaiting manager review.`,
          details: {
            assetTitle: selectedAssetForReturn.assetName || selectedAssetForReturn.title,
            requesterName: this.state.activeUserDisplayName,
            status: 'Pending Manager Approval',
            condition: condition,
            comment: reason,
            date: new Date().toISOString().split('T')[0]
          }
        }
      });
    } catch (error: any) {
      const msg = error.message && error.message.includes("already in progress")
        ? error.message
        : `Failed to submit return request: ${error.message || JSON.stringify(error)}`;
      this.setState({
        errorMessage: msg,
        returnRequestsLoading: false
      });
    }
  };

  private _onUpdateReturnRequestStatus = async (
    requestId: string,
    status: 'Approved' | 'Rejected' | 'Completed' | 'Pending Manager Approval' | 'Pending Admin Verification',
    comment: string,
    finalCondition?: string,
    adminComments?: string,
    managerStatus?: 'Pending' | 'Approved' | 'Rejected',
    adminStatus?: 'Not Started' | 'Completed'
  ): Promise<void> => {
    try {
      this.setState({ returnRequestsLoading: true });
      await InventoryService.updateReturnRequestStatus(
        requestId,
        status,
        comment,
        this.state.activeUserDisplayName,
        finalCondition,
        adminComments,
        managerStatus,
        adminStatus
      );

      await this._loadInventory();
      await this._loadReturnRequests();
      await this._loadAuditLogs();

      const isCompleted = status === 'Completed';
      const isRejected = status === 'Rejected';

      this.setState({
        returnRequestsLoading: false,
        workflowPopup: {
          isOpen: true,
          title: isCompleted ? 'Asset Return Completed' : isRejected ? 'Return Request Rejected' : 'Return Request Approved',
          stage: isCompleted ? 'Return Stage 3: Completed & Checked In' : isRejected ? 'Return Stage: Rejected' : 'Return Stage 2: Manager Approved',
          type: isCompleted ? 'success' : isRejected ? 'error' : 'info',
          message: isCompleted
            ? `Asset return #${requestId} has been verified by IT Admin and checked back into active stock.`
            : isRejected
              ? `Return request #${requestId} was rejected.`
              : `Return request #${requestId} was approved by manager and sent to IT Admin for verification.`,
          details: {
            requestId: `#${requestId}`,
            status: status,
            comment: comment || adminComments,
            date: new Date().toISOString().split('T')[0]
          }
        }
      });
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

      this.setState({
        loading: false,
        isAssetFormOpen: false,
        workflowPopup: {
          isOpen: true,
          title: 'New Inventory Asset Created',
          stage: 'Catalog Management',
          type: 'success',
          message: `Asset "${newAssetData.title || newAssetData.assetName}" was successfully added to stock inventory.`,
          details: {
            assetTitle: newAssetData.title || newAssetData.assetName,
            status: 'In Stock',
            date: newAssetData.purchaseDate || new Date().toISOString().split('T')[0]
          }
        }
      });
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
      const initialStatus = 'Pending';

      const tempId = `temp-${Date.now()}`;
      const localRequest: IRequest = {
        id: tempId,
        requestKey: `REQ-${("000000" + (this.state.requests.length + 1)).slice(-6)}`,
        requesterName: requestData.requesterName,
        requesterEmail: requestData.requesterEmail,
        employeeId: (requestData as any).employeeId || "",
        managerName: (requestData as any).managerName || "",
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
        requests: [localRequest, ...prevState.requests],
        workflowPopup: {
          isOpen: true,
          title: 'Asset Request Created',
          stage: 'Stage 1: Request Submitted',
          type: 'success',
          message: `Your request for "${requestData.assetTitle}" has been submitted successfully and routed to manager (${(requestData as any).managerName || 'Manager'}) for approval.`,
          details: {
            requestId: localRequest.requestKey,
            assetTitle: requestData.assetTitle,
            quantity: requestData.quantity,
            requesterName: requestData.requesterName,
            managerName: (requestData as any).managerName,
            status: initialStatus,
            date: localRequest.requestDate
          }
        }
      }));

      const effectiveRole = this.state.previewRole || this.state.userRole;
      const isEmpUI = effectiveRole !== 'Admin';

      await InventoryService.addRequest({
        ...requestData,
        status: initialStatus
      }, this.state.activeUserDisplayName, effectiveRole, isEmpUI);
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

  private _onApproveRequest = async (
    request: IRequest,
    comment: string = ''
  ): Promise<void> => {

    const availableStock = getAvailableStock(
      this.state.items,
      request
    );

    const requestedQuantity = Number(
      request.quantity || 0
    );

    if (availableStock < requestedQuantity) {
      this.setState({
        errorMessage: `Insufficient stock for "${request.assetTitle}". Available: ${availableStock}, Requested: ${requestedQuantity}`
      });

      return;
    }

    try {
      this.setState({
        requestActionInProgressId: request.id,
        errorMessage: undefined
      });

      // KEEP THE REST OF YOUR EXISTING CODE EXACTLY AS IT IS
      if (request.id.indexOf('temp-') === 0) {
        this.setState(prevState => ({
          requests: prevState.requests.map(
            r =>
              r.id === request.id
                ? {
                  ...r,
                  status: 'Approved',
                  managerResponse: comment
                }
                : r
          )
        }));
      } else {
        await InventoryService.updateRequestStatus(
          parseInt(request.id, 10),
          'Approved',
          this.state.activeUserDisplayName,
          comment
        );
        await this._loadRequests();
        await this._loadAuditLogs();
      }

      this.setState({
        workflowPopup: {
          isOpen: true,
          title: 'Asset Request Approved by Manager',
          stage: 'Stage 2: Manager Approved',
          type: 'success',
          message: `Request ${request.requestKey || `#${request.id}`} for "${request.assetTitle}" requested by ${request.requesterName} was APPROVED by Manager. Moved to IT Admin for physical asset allocation.`,
          details: {
            requestId: request.requestKey || `#${request.id}`,
            assetTitle: request.assetTitle,
            requesterName: request.requesterName,
            managerName: request.managerName || this.state.activeUserDisplayName,
            status: 'Approved',
            date: request.requestDate
          }
        }
      });
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

      this.setState({
        workflowPopup: {
          isOpen: true,
          title: 'Asset Request Rejected by Manager',
          stage: 'Stage 2: Manager Review',
          type: 'error',
          message: `Request ${request.requestKey || `#${request.id}`} for "${request.assetTitle}" requested by ${request.requesterName} was REJECTED by Manager.`,
          details: {
            requestId: request.requestKey || `#${request.id}`,
            assetTitle: request.assetTitle,
            requesterName: request.requesterName,
            managerName: request.managerName || this.state.activeUserDisplayName,
            status: 'Declined',
            comment: reason,
            date: request.requestDate
          }
        }
      });
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

      this.setState({
        workflowPopup: {
          isOpen: true,
          title: 'Physical Asset Allocated & Dispatched',
          stage: 'Stage 3: Admin Asset Allocation',
          type: 'success',
          message: `Physical asset "${request.assetTitle}" has been allocated to ${request.requesterName} by System Administrator! Request fulfilled.`,
          details: {
            requestId: request.requestKey || `#${request.id}`,
            assetTitle: request.assetTitle,
            requesterName: request.requesterName,
            status: 'Asset Allocated & Dispatched',
            date: new Date().toISOString().split('T')[0]
          }
        }
      });
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
    exportWarrantyReportToExcel(this.state.items);
  };

  private _exportWarrantyReportToPDF = (): void => {
    exportWarrantyReportToPDF(this.state.items);
  };

  private _exportDetailedReportToExcel = (filteredItems: IInventoryItem[]): void => {
    exportDetailedReportToExcel(filteredItems);
  };

  private _exportDetailedReportToPDF = (filteredItems: IInventoryItem[]): void => {
    exportDetailedReportToPDF(filteredItems);
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
        adminComment: '',
        workflowPopup: {
          isOpen: true,
          title: 'Physical Asset Allocated & Dispatched',
          stage: 'Stage 3: Admin Asset Allocation',
          type: 'success',
          message: `Asset "${request.assetTitle}" has been allocated to ${request.requesterName} by System Administrator! Request fulfilled.`,
          details: {
            requestId: request.requestKey || `#${request.id}`,
            assetTitle: request.assetTitle,
            requesterName: request.requesterName,
            status: 'Asset Allocated & Dispatched',
            comment: adminComment,
            date: new Date().toISOString().split('T')[0]
          }
        }
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
      activeUserEmail,
      loading
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
      { key: 'Dashboard', text: strings.Nav.Dashboard, icon: 'BarChart4', group: strings.Nav.GroupMain },
      { key: 'MyWorkspace', text: strings.Nav.MyWorkspace, icon: 'Briefcase' },
      {
        key: 'Notifications',
        text: strings.Nav.Notifications,
        icon: 'Ringer',
        badge: notifications.filter(n => !n.isRead).length || undefined,
        badgeColor: '#0078d4'
      },
      { key: 'IncidentHistory', text: strings.Nav.IncidentHistory, icon: 'History' },
      { key: 'ReplacementHistory', text: strings.Nav.ReplacementHistory, icon: 'Sync' },
      ...(isAdmin || isManager ? [
        { key: 'Inventory', text: strings.Nav.Inventory, icon: 'List', group: strings.Nav.GroupManagement }
      ] : []),
      ...(isManager ? [
        { key: 'Approvals', text: strings.Nav.Approvals, icon: 'DoubleChevronRight12', group: strings.Nav.GroupManagement }
      ] : []),
      ...(isAdmin ? [
        { key: 'AssetAssignmentQueue', text: strings.Nav.AssetAssignmentQueue, icon: 'Send', ...(isManager ? {} : { group: undefined }) }
      ] : []),
      ...(isAdmin || isManager ? [
        {
          key: 'AssetReturns',
          text: strings.Nav.AssetReturns,
          icon: 'ReturnToSession',
          badge: this.state.returnRequests.filter(r => {
            if (isAdmin) return r.status === 'Pending Admin Verification';
            if (isManager) return r.status === 'Pending Manager Approval';
            return r.status === 'Pending';
          }).length || undefined,
          badgeColor: '#ea580c'
        }
      ] : []),
      ...(isAdmin ? [
        { key: 'EventStream', text: strings.Nav.EventStream, icon: 'ActivityFeed', group: strings.Nav.GroupSystem },
        { key: 'Users', text: strings.Nav.Users, icon: 'People' },
        { key: 'Reports', text: strings.Nav.Reports, icon: 'ReportDocument' },
        { key: 'Config', text: strings.Nav.Config, icon: 'Settings' }
      ] : [])
    ];

    return (
      <section className={`${styles.inventoryManagement} ${hasTeamsContext ? styles.teams : ''} ${isDarkTheme ? styles.dark : ''}`}>
        <div className={styles.mainContent}>

          <div className={styles.heroSection}>
            <div className={styles.heroText}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', flexWrap: 'wrap' }}>
                <h2 style={{ margin: 0 }}>{strings.Hero.Title}</h2>
                <Dropdown
                  aria-label={strings.Common.LanguageLabel}
                  title={strings.Common.LanguageLabel}
                  selectedKey={getCurrentLanguage()}
                  onChange={(_, option) => option && this._onLanguageSelect(option.key as SupportedLanguage)}
                  options={SUPPORTED_LANGUAGES.map(l => ({ key: l.code, text: l.nativeName }))}
                  styles={{
                    root: { minWidth: 130 },
                    title: { backgroundColor: 'rgba(255,255,255,0.15)', color: '#ffffff', border: '1px solid rgba(255,255,255,0.35)', borderRadius: '4px' },
                    caretDown: { color: '#ffffff' }
                  }}
                />
              </div>
              <p>{formatString(strings.Hero.WelcomeBack, escape(activeUserDisplayName))}</p>
              <p className={styles.smallText}>
                {strings.Hero.RoleLabel.split('{0}')[0]}<strong>{this._getRoleDisplayLabel(effectiveRole)}</strong>
              </p>

              <span className={styles.smallText}>
                {environmentMessage} • {formatString(strings.Hero.LocationLabel, escape(description))}
              </span>
              {isAdmin && roleGroups.length > 0 && (
                <p className={styles.smallText}>
                  {formatString(strings.Hero.SharePointGroupsLabel, escape(roleGroups.join(', ')))}
                </p>
              )}

            </div>
            <div className={styles.welcomeDiagramContainer}>
              <AssetLifecycleDiagram isDarkTheme={isDarkTheme} />
            </div>
          </div>

          {this.state.errorMessage && (
            <div style={{ color: '#991b1b', backgroundColor: '#fee2e2', padding: '15px', borderRadius: '8px', marginBottom: '20px', position: 'relative' }}>
              <strong>{strings.Common.ErrorLabel}</strong> {this.state.errorMessage}
              <button
                onClick={() => this.setState({ errorMessage: undefined })}
                style={{ position: 'absolute', right: '15px', top: '12px', border: 'none', background: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '1.1rem', color: '#991b1b' }}
                aria-label={strings.Common.DismissError}
              >
                &times;
              </button>
            </div>
          )}



          <div className={styles.appLayoutContainer}>
            {/* Mobile Sidebar backdrop overlay */}
            {!this.state.sidebarCollapsed && (
              <div
                className={styles.sidebarOverlay}
                onClick={() => this.setState({ sidebarCollapsed: true })}
                role="presentation"
              />
            )}
            {/* Left Sidebar Navigation */}
            <div
              className={`${styles.sidebarContainer} ${this.state.sidebarCollapsed ? styles.sidebarCollapsed : ''}`}
              role="navigation"
              aria-label={strings.Nav.MainNavigation}
            >
              <div className={styles.navHeader}>
                <h4>{strings.Nav.Header}</h4>
                <span>{formatString(strings.Nav.RoleLabel, this._getRoleDisplayLabel(effectiveRole))}</span>
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
                aria-label={this.state.sidebarCollapsed ? strings.Nav.Expand : strings.Nav.Collapse}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.setState(prev => ({ sidebarCollapsed: !prev.sidebarCollapsed }));
                  }
                }}
              >
                <Icon iconName={this.state.sidebarCollapsed ? 'DoubleChevronRight' : 'DoubleChevronLeft'} />
                <span className={styles.collapseText}>
                  {this.state.sidebarCollapsed ? strings.Nav.Expand : strings.Nav.Collapse}
                </span>
              </div>
            </div>

            {/* Right Main Content Area */}
            <div className={`${styles.card} ${styles.contentContainer}`}>
              {/* Mobile Navigation Header */}
              <div className={styles.mobileNavHeader}>
                <button
                  className={styles.mobileMenuToggle}
                  onClick={() => this.setState(prev => ({ sidebarCollapsed: !prev.sidebarCollapsed }))}
                  aria-label={strings.Nav.ToggleNavigation}
                >
                  <Icon iconName="GlobalNavButton" />
                </button>
                <span className={styles.mobileNavTitle}>{strings.Hero.Title}</span>
              </div>
              {(() => {
                const dashboardState = {
                  items: isAdmin || isManager ? items : myAssets,
                  requests: isAdmin || isManager ? this.state.requests : myRequests,
                  isAdmin,
                  isInventoryManager: isManager
                };

                const dashboardActions = {
                  onNavigate: (key: string) => this.setState({ selectedTabKey: key })
                };

                const reportsState = {
                  reportsSelectedTab: this.state.reportsSelectedTab,
                  reportsAssetTypeFilter: this.state.reportsAssetTypeFilter,
                  reportsStatusFilter: this.state.reportsStatusFilter,
                  items,
                  requests: this.state.requests
                };

                const reportsActions = {
                  onTabChange: (tabKey: string) => this.setState({ reportsSelectedTab: tabKey }),
                  onAssetTypeFilterChange: (type: string) => this.setState({ reportsAssetTypeFilter: type }),
                  onStatusFilterChange: (status: string) => this.setState({ reportsStatusFilter: status }),
                  onExportDetailedReportToExcel: (filteredItems: any[]) => this._exportDetailedReportToExcel(filteredItems),
                  onExportDetailedReportToPDF: (filteredItems: any[]) => this._exportDetailedReportToPDF(filteredItems),
                  onExportWarrantyReportToExcel: () => this._exportWarrantyReportToExcel(),
                  onExportWarrantyReportToPDF: () => this._exportWarrantyReportToPDF()
                };

                const incidentHistoryState = {
                  userDisplayName: activeUserDisplayName || '',
                  userEmail: activeUserEmail || '',
                  userRole: effectiveRole
                };

                const incidentHistoryActions = {
                  setIsLoading: (loading: boolean) => this.setState({ loading })
                };

                const inventoryState = {
                  items,
                  loading,
                  isAdmin,
                  isInventoryManager: isManager
                };

                const inventoryActions = {
                  onOpenAssetForm: () => this.setState({ isAssetFormOpen: true })
                };

                switch (this.state.selectedTabKey) {
                  case 'Dashboard':
                    return (
                      <DashboardPage
                        state={dashboardState}
                        actions={dashboardActions}
                      />
                    );
                  case 'MyWorkspace':
                    return (
                      <MyWorkspacePage
                        state={{
                          myAssets,
                          myRequests,
                          myReturnRequests: this.state.returnRequests.filter(r =>
                            this._isRequestOwnedByCurrentUser(r.requesterName || '', activeUserDisplayName || '')
                          )
                        }}
                        actions={{
                          onRequestAsset: () => this.setState({ isRequestFormOpen: true }),
                          onReturnAsset: (item) => this.setState({ selectedAssetForReturn: item, isReturnFormOpen: true }),
                          onRaiseIncident: (item) => this.setState({ selectedAssetForIncident: item, isIncidentFormOpen: true }),
                          onAssetReplacement: (item) => this.setState({ selectedAssetForIncident: item, isIncidentFormOpen: true, preselectedIncidentType: 'Replacement Request' })
                        }}
                      />
                    );
                  case 'Notifications':
                    return (
                      <NotificationsPage
                        state={{
                          notifications,
                          isAllNotificationsCleared: this.state.isAllNotificationsCleared
                        }}
                        actions={{
                          onMarkAsRead: this._markNotificationAsRead,
                          onMarkAllAsRead: this._markAllNotificationsAsRead,
                          onClearNotification: this._clearNotification,
                          onClearAllNotifications: this._clearAllNotifications,
                          onNotificationAction: this._handleNotificationAction
                        }}
                      />
                    );
                  case 'IncidentHistory':
                    return (
                      <IncidentHistoryPage
                        {...this.props}
                        state={incidentHistoryState}
                        actions={incidentHistoryActions}
                      />
                    );
                  case 'ReplacementHistory':
                    return (
                      <ReplacementHistoryPage
                        {...this.props}
                        state={{
                          userDisplayName: activeUserDisplayName,
                          userEmail: activeUserEmail,
                          userRole: effectiveRole
                        }}
                        actions={{
                          setIsLoading: (loading) => this.setState({ loading })
                        }}
                      />
                    );
                  case 'Inventory':
                    return (isAdmin || isManager) ? (
                      <InventoryPage
                        state={inventoryState}
                        actions={inventoryActions}
                      />
                    ) : null;
                  case 'Approvals':
                    return isManager ? (
                      <ApprovalsPage
                        state={{
                          requestSearchId,
                          managerQueueRequests,
                          visibleManagerRequests,
                          items: this.state.items,
                          requestActionInProgressId
                        }}
                        actions={{
                          onSearchChange: (value) => this.setState({ requestSearchId: value }),
                          onApproveRequest: this._onApproveRequest,
                          onRejectRequest: this._onRejectRequest
                        }}
                      />
                    ) : null;
                  case 'AssetAssignmentQueue':
                    return isAdmin ? (
                      <AssetAssignmentQueuePage
                        state={{
                          requestSearchId,
                          visibleAdminRequests,
                          items: this.state.items,
                          requestActionInProgressId
                        }}
                        actions={{
                          onSearchChange: (value) => this.setState({ requestSearchId: value }),
                          onSelectRequestForAssignment: (request) => this.setState({ selectedAdminRequest: request, isAdminPanelOpen: true, adminSelectedAssetId: undefined, adminComment: '' })
                        }}
                      />
                    ) : null;
                  case 'AssetReturns':
                    return isAdmin || isManager ? (
                      <AssetReturnsPage
                        state={{
                          returnRequests: this.state.returnRequests,
                          returnRequestsLoading: this.state.returnRequestsLoading,
                          isAdmin,
                          isManager
                        }}
                        actions={{
                          onUpdateStatus: this._onUpdateReturnRequestStatus
                        }}
                      />
                    ) : null;
                  case 'EventStream':
                    return isAdmin ? (
                      <EventStreamPage
                        state={{
                          auditLogs,
                          auditLogsLoading,
                          effectiveRole,
                          activeUserDisplayName,
                          auditLogsRefreshTrigger: this.state.auditLogsRefreshTrigger
                        }}
                      />
                    ) : null;
                  case 'Users':
                    return isAdmin ? (
                      <UsersPage
                        state={{
                          employees: this.state.employees,
                          items,
                          activeUserDisplayName,
                          effectiveRole,
                          activeUserEmail,
                          expandedUserEmail: this.state.expandedUserEmail
                        }}
                        actions={{
                          onToggleExpandUser: (email) => this.setState({ expandedUserEmail: email }),
                          isAssetAssignedToCurrentUser: this._isAssetAssignedToCurrentUser
                        }}
                      />
                    ) : null;
                  case 'Reports':
                    return isAdmin ? (
                      <ReportsPage
                        state={reportsState}
                        actions={reportsActions}
                      />
                    ) : null;
                  case 'Config': {
                    const configState = {
                      configSelectedTab: this.state.configSelectedTab,
                      syncInProgress: this.state.syncInProgress,
                      syncMessage: this.state.syncMessage,
                      syncMessageType: this.state.syncMessageType,
                      diagnosticInfo: this.state.diagnosticInfo
                    };

                    const configActions = {
                      onSyncAssignedAssets: this._onSyncAssignedAssets,
                      onRunDiagnostics: this._onRunDiagnostics,
                      onDismissSyncMessage: () => this.setState({ syncMessage: undefined }),
                      onTabChange: (tabKey: string) => this.setState({ configSelectedTab: tabKey })
                    };

                    return isAdmin ? (
                      <ConfigPage
                        state={configState}
                        actions={configActions}
                      />
                    ) : null;
                  }
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
            currentUserEmail={this.state.activeUserEmail}
            onSubmitRequest={this._onSubmitRequest}
          />
        )}

        {(isAdmin || isManager || isEmployee) && (
          <IncidentRequestModule
            {...this.props}
            isOpen={this.state.isIncidentFormOpen}
            onClose={() => this.setState({ isIncidentFormOpen: false, selectedAssetForIncident: undefined, preselectedIncidentType: undefined })}
            userDisplayName={activeUserDisplayName}
            userEmail={activeUserEmail}
            setIsLoading={(loading) => this.setState({ loading })}
            preselectedAsset={this.state.selectedAssetForIncident}
            preselectedIncidentType={this.state.preselectedIncidentType}
            onSuccessPopup={(details) => {
              this.setState({
                workflowPopup: {
                  isOpen: true,
                  title: strings.IncidentSuccessPopup.Title,
                  stage: strings.IncidentSuccessPopup.Stage,
                  type: 'warning',
                  message: formatString(strings.IncidentSuccessPopup.Message, details.assetName, details.incidentType),
                  details: {
                    assetTitle: details.assetName,
                    requesterName: details.requesterName,
                    status: strings.IncidentSuccessPopup.StatusOpenTicket,
                    date: new Date().toISOString().split('T')[0]
                  }
                }
              });
            }}
          />
        )}

        <NotificationDetailsPanel
          state={{
            selectedNotification: this.state.selectedNotification,
            isNotificationDetailsOpen: this.state.isNotificationDetailsOpen,
            items: this.state.items,
            requests: this.state.requests
          }}
          actions={{
            onDismiss: () => this.setState({ isNotificationDetailsOpen: false })
          }}
        />
        <AdminAssignmentPanel
          state={{
            selectedAdminRequest: this.state.selectedAdminRequest,
            isAdminPanelOpen: this.state.isAdminPanelOpen,
            items: this.state.items,
            requestActionInProgressId: this.state.requestActionInProgressId,
            adminSelectedAssetId: this.state.adminSelectedAssetId,
            adminComment: this.state.adminComment,
            isDarkTheme
          }}
          actions={{
            onDismiss: () => this.setState({ isAdminPanelOpen: false, selectedAdminRequest: undefined }),
            onAssetChange: this._onAdminAssetChange,
            onCommentChange: (value) => this.setState({ adminComment: value }),
            onAssignAndApprove: this._handleAdminAssignAndApprove,
            onReject: this._handleAdminReject
          }}
        />
        <ReturnAssetForm
          isOpen={this.state.isReturnFormOpen}
          onDismiss={() => this.setState({ isReturnFormOpen: false, selectedAssetForReturn: undefined })}
          asset={this.state.selectedAssetForReturn}
          onSubmit={this._onSubmitReturnRequest}
        />
        <WorkflowPopup
          isOpen={this.state.workflowPopup?.isOpen}
          title={this.state.workflowPopup?.title || ''}
          stage={this.state.workflowPopup?.stage || ''}
          type={this.state.workflowPopup?.type || 'info'}
          message={this.state.workflowPopup?.message || ''}
          details={this.state.workflowPopup?.details}
          onDismiss={() => this.setState({ workflowPopup: { ...this.state.workflowPopup, isOpen: false } })}
        />

        <Panel
          isOpen={this.state.lastMockEmail !== undefined}
          onDismiss={() => this.setState({ lastMockEmail: undefined })}
          type={PanelType.medium}
          headerText={strings.MockEmailPanel.HeaderText}
          closeButtonAriaLabel={strings.Common.Close}
          onRenderFooterContent={() => (
            <Stack horizontal tokens={{ childrenGap: 10 }} style={{ padding: '10px 0' }}>
              <PrimaryButton
                text={this.state.isSendingMockEmail ? strings.MockEmailPanel.ButtonSending : strings.MockEmailPanel.ButtonSendEmail}
                onClick={this._onSendMockEmail}
                disabled={this.state.isSendingMockEmail || this.state.mockEmailSendSuccess || !this.state.editMockEmailTo}
                iconProps={{ iconName: 'Send' }}
              />
              <DefaultButton
                text={strings.MockEmailPanel.ButtonClose}
                onClick={() => this.setState({ lastMockEmail: undefined })}
                disabled={this.state.isSendingMockEmail}
              />
            </Stack>
          )}
          isFooterAtBottom={true}
        >
          {this.state.lastMockEmail && (
            <Stack tokens={{ childrenGap: 15 }} style={{ padding: '10px 0' }}>
              <MessageBar messageBarType={MessageBarType.info}>
                {strings.MockEmailPanel.InfoText}
              </MessageBar>

              <TextField
                label={strings.MockEmailPanel.LabelRecipients}
                value={this.state.editMockEmailTo}
                onChange={(_, val) => this.setState({ editMockEmailTo: val || '' })}
                required
                disabled={this.state.isSendingMockEmail}
                iconProps={{ iconName: 'Mail' }}
              />

              <TextField
                label={strings.MockEmailPanel.LabelSubject}
                value={this.state.editMockEmailSubject}
                onChange={(_, val) => this.setState({ editMockEmailSubject: val || '' })}
                required
                disabled={this.state.isSendingMockEmail}
              />

              {this.state.mockEmailSendSuccess && (
                <MessageBar messageBarType={MessageBarType.success}>
                  {strings.MockEmailPanel.SuccessText}
                </MessageBar>
              )}

              {this.state.mockEmailSendError && (
                <MessageBar messageBarType={MessageBarType.error}>
                  {strings.MockEmailPanel.ErrorPrefix} {this.state.mockEmailSendError}
                </MessageBar>
              )}

              {this.state.isSendingMockEmail && (
                <ProgressIndicator label={strings.MockEmailPanel.ProgressLabel} />
              )}

              <div style={{ marginTop: '10px' }}>
                <span style={{ fontSize: '0.9rem', fontWeight: 600, display: 'block', marginBottom: '8px' }}>{strings.MockEmailPanel.PreviewLabel}</span>
                <div
                  style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '15px', overflow: 'auto', background: '#fff', boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.05)', maxHeight: '400px' }}
                  dangerouslySetInnerHTML={{ __html: this.state.lastMockEmail.body }}
                />
              </div>
            </Stack>
          )}
        </Panel>
      </section>
    );
  }
}
