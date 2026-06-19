import * as React from 'react';
import styles from './InventoryManagement.module.scss';
import { escape } from '@microsoft/sp-lodash-subset';
import { InventoryList } from './InventoryList';
import { MyAssignedAssetsView } from './MyAssignedAssetsView';
import { MyRequestsView } from './MyRequestsView';
import { RequestList } from './RequestList';
import { getSP } from '../pnpjsConfig';
import { AssetForm } from './AssetForm';
import { RequestForm } from './RequestForm';
import { EventStream } from './EventStream';
import { ReturnAssetForm } from './ReturnAssetForm';
import { ReturnRequestList } from './ReturnRequestList';
import { PrimaryButton, Pivot, PivotItem, TextField, DetailsList, DetailsListLayoutMode, SelectionMode, DetailsRow, Panel, PanelType, MessageBar, MessageBarType, ProgressIndicator, Icon, Stack } from '@fluentui/react';
import { Chart as ChartJS, CategoryScale, LinearScale, ArcElement, Title, Tooltip, Legend, } from 'chart.js';
import { Pie } from 'react-chartjs-2';
ChartJS.register(CategoryScale, LinearScale, ArcElement, Title, Tooltip, Legend);
import "@pnp/sp/site-users/web";
import "@pnp/sp/site-groups/web";
import { EMPLOYEES } from '../data/mockData';
import { InventoryService } from '../services/InventoryService';
import { Dashboard } from './Dashboard';
import { AssetTracking } from './AssetTracking';
import { NotificationCenter } from './NotificationCenter';
import { IncidentRequestModule } from './IncidentRequest/IncidentRequestModule';
import { IncidentHistory } from './IncidentHistory/IncidentHistory';
import { AssetLifecycleDiagram } from './AssetLifecycleDiagram';
export default class InventoryManagement extends React.Component {
    constructor(props) {
        super(props);
        this._isRequestOwnedByCurrentUser = (requesterName, currentUser) => {
            const normalize = (value) => (value || '').toLowerCase().replace(/[^a-z0-9]/g, '');
            const requestOwner = normalize(requesterName);
            const activeUser = normalize(currentUser);
            if (!requestOwner || !activeUser) {
                return false;
            }
            return requestOwner === activeUser || requestOwner.includes(activeUser) || activeUser.includes(requestOwner);
        };
        this._isAssetAssignedToCurrentUser = (item, currentUser) => {
            const normalize = (value) => (value || '').toLowerCase().replace(/[^a-z0-9]/g, '');
            const activeUser = normalize(currentUser);
            if (!activeUser)
                return false;
            const assignedNorm = normalize(item.assignedTo);
            const isAssigned = assignedNorm && (assignedNorm === activeUser || assignedNorm.includes(activeUser) || activeUser.includes(assignedNorm));
            const isNoted = (item.note || '').toLowerCase().includes('assigned to:') && normalize(item.note).includes(activeUser);
            const isStatus = (item.status || '').toLowerCase().includes('assigned to:') && normalize(item.status).includes(activeUser);
            return !!(isAssigned || isNoted || isStatus);
        };
        this._getNotifications = () => {
            const { items, requests, activeUserDisplayName } = this.state;
            const currentUser = activeUserDisplayName;
            const effectiveRole = this.state.previewRole || this.state.userRole;
            const isAdminOrManager = effectiveRole === 'Admin' || effectiveRole === 'Inventory Manager';
            const isAdmin = effectiveRole === 'Admin';
            const notifications = [];
            const readIds = new Set(this.state.readNotificationIds);
            const clearedIds = new Set(this.state.clearedNotificationIds);
            const normalize = (value) => (value || '').toLowerCase().replace(/[^a-z0-9]/g, '');
            const activeUserNorm = normalize(currentUser);
            const formatTime = (isoString) => {
                if (!isoString)
                    return '';
                try {
                    const d = new Date(isoString);
                    const pad = (n) => n < 10 ? '0' + n : '' + n;
                    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
                }
                catch {
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
                            let type = 'success';
                            let messageText = `Your return request for ${ret.assetName} has been approved. Please hand it over.`;
                            if (ret.status === 'Rejected') {
                                titleText = "Return Request Rejected";
                                type = 'error';
                                messageText = `Your return request for ${ret.assetName} was rejected. Note: ${ret.managerComment || ""}`;
                            }
                            else if (ret.status === 'Completed') {
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
                                actionLink: 'My Assets',
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
        this._markNotificationAsRead = (id) => {
            const readNotificationIds = [...this.state.readNotificationIds, id];
            this.setState({ readNotificationIds });
            localStorage.setItem('inventory_read_notifications', JSON.stringify(readNotificationIds));
        };
        this._markAllNotificationsAsRead = () => {
            const notifications = this._getNotifications();
            const readNotificationIds = Array.from(new Set([...this.state.readNotificationIds, ...notifications.map(n => n.id)]));
            this.setState({ readNotificationIds });
            localStorage.setItem('inventory_read_notifications', JSON.stringify(readNotificationIds));
        };
        this._clearNotification = (id) => {
            const clearedNotificationIds = [...this.state.clearedNotificationIds, id];
            this.setState({ clearedNotificationIds });
            localStorage.setItem('inventory_cleared_notifications', JSON.stringify(clearedNotificationIds));
        };
        this._clearAllNotifications = () => {
            const notifications = this._getNotifications();
            const clearedNotificationIds = Array.from(new Set([...this.state.clearedNotificationIds, ...notifications.map(n => n.id)]));
            this.setState({ clearedNotificationIds });
            localStorage.setItem('inventory_cleared_notifications', JSON.stringify(clearedNotificationIds));
        };
        this._handleNotificationAction = (actionLink, notificationId) => {
            this._markNotificationAsRead(notificationId);
            const notifications = this._getNotifications();
            const selectedNotification = notifications.find(n => n.id === notificationId);
            this.setState({
                selectedNotification,
                isNotificationDetailsOpen: true
            });
        };
        this._resolveUserRole = async () => {
            try {
                const sp = getSP();
                const groups = await sp.web.currentUser.groups();
                const groupNames = groups.map((group) => (group.Title || '').toLowerCase().trim());
                const isAdmin = groupNames.some((name) => name === 'msft owners' || name.indexOf('msft owners') >= 0);
                const isInventoryManager = groupNames.some((name) => name === 'msft members' || name.indexOf('msft members') >= 0);
                const isInventoryEmployee = groupNames.some((name) => name === 'msft visitors' || name.indexOf('msft visitors') >= 0);
                let userRole = 'Inventory Employee';
                if (isAdmin) {
                    userRole = 'Admin';
                }
                else if (isInventoryManager) {
                    userRole = 'Inventory Manager';
                }
                else if (isInventoryEmployee) {
                    userRole = 'Inventory Employee';
                }
                // Load employees from groups dynamically
                const loadedEmployees = [];
                const seenEmails = new Set();
                const addUsers = (users, jobTitle, department) => {
                    users.forEach(u => {
                        const email = (u.Email || u.LoginName || '').toLowerCase().trim();
                        if (email && !seenEmails.has(email)) {
                            seenEmails.add(email);
                            loadedEmployees.push({
                                id: u.Id ? u.Id.toString() : u.Email || Math.random().toString(),
                                name: u.Title || 'Unknown User',
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
                }
                catch (e) {
                    console.warn("Could not load users from group 'MSFT Owners':", e);
                }
                try {
                    const members = await sp.web.siteGroups.getByName("MSFT Members").users();
                    addUsers(members, 'Inventory Manager', 'Operations');
                }
                catch (e) {
                    console.warn("Could not load users from group 'MSFT Members':", e);
                }
                try {
                    const visitors = await sp.web.siteGroups.getByName("MSFT Visitors").users();
                    addUsers(visitors, 'Inventory Employee', 'Operations');
                }
                catch (e) {
                    console.warn("Could not load users from group 'MSFT Visitors':", e);
                }
                const finalEmployees = loadedEmployees.length > 0 ? loadedEmployees : EMPLOYEES;
                this.setState({
                    userRole,
                    roleGroups: groups.map((group) => group.Title || ''),
                    employees: finalEmployees,
                    roleLoading: false
                });
            }
            catch (error) {
                console.error("Failed to resolve SharePoint group role:", error);
                this.setState({
                    userRole: 'Inventory Employee',
                    roleGroups: [],
                    employees: EMPLOYEES,
                    roleLoading: false
                });
            }
        };
        this._loadInventory = async () => {
            try {
                this.setState({ loading: true, errorMessage: undefined });
                const items = await InventoryService.getItems();
                if (items && items.length > 0) {
                    this.setState({ items, loading: false });
                }
                else {
                    // List is empty
                    this.setState({
                        items: [],
                        loading: false,
                        errorMessage: 'SharePoint list is empty. Please add items.'
                    });
                }
            }
            catch (error) {
                console.error("Failed to load inventory:", error);
                // Fallback to empty if SharePoint fails so the UI remains functional
                this.setState({
                    items: [],
                    loading: false,
                    errorMessage: `SharePoint Error: ${error.message || JSON.stringify(error)}`
                });
            }
        };
        this._loadRequests = async () => {
            try {
                const requests = await InventoryService.getRequests();
                this.setState({ requests });
            }
            catch (error) {
                console.error("Failed to load requests:", error);
                this.setState({
                    errorMessage: `Failed to load Requests. Error: ${error.message || JSON.stringify(error)}`
                });
            }
        };
        this._loadAuditLogs = async () => {
            try {
                this.setState({ auditLogsLoading: true });
                const auditLogs = await InventoryService.getAuditLogs();
                this.setState({ auditLogs, auditLogsLoading: false });
            }
            catch (error) {
                console.error("Failed to load audit logs:", error);
                this.setState({ auditLogsLoading: false });
            }
        };
        this._loadReturnRequests = async () => {
            try {
                this.setState({ returnRequestsLoading: true });
                const returnRequests = await InventoryService.getReturnRequests();
                this.setState({ returnRequests, returnRequestsLoading: false });
            }
            catch (error) {
                console.error("Failed to load return requests:", error);
                this.setState({ returnRequestsLoading: false });
            }
        };
        this._onSubmitReturnRequest = async (reason, condition) => {
            const { selectedAssetForReturn } = this.state;
            if (!selectedAssetForReturn)
                return;
            try {
                this.setState({ returnRequestsLoading: true });
                const reqPayload = {
                    title: `Return Request for ${selectedAssetForReturn.assetName || selectedAssetForReturn.title}`,
                    assetId: selectedAssetForReturn.id,
                    assetName: selectedAssetForReturn.assetName || selectedAssetForReturn.title,
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
            }
            catch (error) {
                this.setState({
                    errorMessage: `Failed to submit return request: ${error.message || JSON.stringify(error)}`,
                    returnRequestsLoading: false
                });
            }
        };
        this._onUpdateReturnRequestStatus = async (requestId, status, comment, finalCondition) => {
            try {
                this.setState({ returnRequestsLoading: true });
                await InventoryService.updateReturnRequestStatus(requestId, status, comment, this.state.activeUserDisplayName, finalCondition);
                await this._loadInventory();
                await this._loadReturnRequests();
                await this._loadAuditLogs();
            }
            catch (error) {
                this.setState({
                    errorMessage: `Failed to update return status: ${error.message || JSON.stringify(error)}`,
                    returnRequestsLoading: false
                });
            }
        };
        this._onAddAsset = async (newAssetData) => {
            try {
                this.setState({ loading: true, errorMessage: undefined });
                const newAsset = {
                    ...newAssetData,
                    status: 'In Stock'
                };
                await InventoryService.addItem(newAsset, this.state.activeUserDisplayName);
                await this._loadInventory(); // Refresh list
                await this._loadAuditLogs(); // Refresh audit logs
            }
            catch (error) {
                console.error("Failed to add asset:", error);
                this.setState({
                    loading: false,
                    errorMessage: `Failed to add Asset. SharePoint rejected the save. Error: ${error.message || JSON.stringify(error)}`
                });
            }
        };
        this._onSubmitRequest = async (requestData) => {
            try {
                const requesterEmployee = this.state.employees.find(e => e.name.toLowerCase() === requestData.requesterName.toLowerCase());
                const requesterRole = requesterEmployee ? requesterEmployee.jobTitle : 'Inventory Employee';
                const initialStatus = requesterRole === 'Inventory Manager' ? 'Approved' : 'Pending';
                const tempId = `temp-${Date.now()}`;
                const localRequest = {
                    id: tempId,
                    requestKey: `REQ-${("000000" + (this.state.requests.length + 1)).slice(-6)}`,
                    requesterName: requestData.requesterName,
                    employeeId: requestData.employeeId || "",
                    assetId: requestData.assetId || "1",
                    assetTitle: requestData.assetTitle,
                    assetName: "",
                    priority: requestData.priority || "Medium",
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
                }, this.state.activeUserDisplayName);
                console.log('Successfully saved request to SharePoint');
                await this._loadRequests(); // Refresh list from SharePoint
                await this._loadAuditLogs(); // Refresh audit logs
            }
            catch (error) {
                console.error('Failed to save request to SharePoint AssetRequests list:', error);
                this.setState({
                    errorMessage: `Failed to save Request to SharePoint. A local copy was added. Error: ${error.message || JSON.stringify(error)}`
                });
            }
        };
        this._onApproveRequest = async (request) => {
            try {
                this.setState({ requestActionInProgressId: request.id, errorMessage: undefined });
                if (request.id.indexOf('temp-') === 0) {
                    this.setState(prevState => ({
                        requests: prevState.requests.map(r => r.id === request.id ? { ...r, status: 'Approved' } : r)
                    }));
                }
                else {
                    await InventoryService.updateRequestStatus(parseInt(request.id, 10), 'Approved', this.state.activeUserDisplayName);
                    await this._loadRequests();
                    await this._loadAuditLogs();
                }
            }
            catch (error) {
                this.setState({
                    errorMessage: `Failed to approve request #${request.id}. ${error.message || JSON.stringify(error)}`
                });
            }
            finally {
                this.setState({ requestActionInProgressId: undefined });
            }
        };
        this._onRejectRequest = async (request, reason) => {
            try {
                this.setState({ requestActionInProgressId: request.id, errorMessage: undefined });
                if (request.id.indexOf('temp-') === 0) {
                    this.setState(prevState => ({
                        requests: prevState.requests.map(r => r.id === request.id ? { ...r, status: 'Declined', managerResponse: reason } : r)
                    }));
                }
                else {
                    await InventoryService.updateRequestStatus(parseInt(request.id, 10), 'Declined', this.state.activeUserDisplayName, reason);
                    await this._loadRequests();
                    await this._loadAuditLogs();
                }
            }
            catch (error) {
                this.setState({
                    errorMessage: `Failed to reject request #${request.id}. ${error.message || JSON.stringify(error)}`
                });
            }
            finally {
                this.setState({ requestActionInProgressId: undefined });
            }
        };
        this._onApproveAsset = async (request) => {
            try {
                this.setState({ requestActionInProgressId: request.id, errorMessage: undefined });
                if (request.id.indexOf('temp-') === 0) {
                    this.setState(prevState => ({
                        requests: prevState.requests.map(r => r.id === request.id ? { ...r, assetStatus: 'Approved' } : r)
                    }));
                }
                else {
                    await InventoryService.updateAssetStatus(parseInt(request.id, 10), 'Approved', this.state.activeUserDisplayName);
                    await this._loadRequests();
                    await this._loadAuditLogs();
                }
            }
            catch (error) {
                this.setState({
                    errorMessage: `Failed to approve asset status for request #${request.requestKey || request.id}. ${error.message || JSON.stringify(error)}`
                });
            }
            finally {
                this.setState({ requestActionInProgressId: undefined });
            }
        };
        this._onAssignAssets = async (employeeName, employeeEmail, assetIds) => {
            try {
                this.setState({ isTrackingActionInProgress: true, errorMessage: undefined });
                const employee = this.state.employees.find(e => e.name.toLowerCase() === employeeName.toLowerCase());
                const employeeId = employee ? employee.id : "";
                await InventoryService.assignAssetsToEmployee(assetIds, employeeName, employeeEmail, this.state.activeUserDisplayName, employeeId);
                await this._loadInventory();
                await this._loadAuditLogs();
            }
            catch (error) {
                this.setState({
                    errorMessage: `Failed to assign assets. ${error.message || JSON.stringify(error)}`
                });
            }
            finally {
                this.setState({ isTrackingActionInProgress: false });
            }
        };
        this._onSyncAssignedAssets = async () => {
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
            }
            catch (e) {
                console.error("Manual sync failed:", e);
                this.setState({
                    syncInProgress: false,
                    syncMessage: `Failed to synchronize mapping records: ${e.message || JSON.stringify(e)}`,
                    syncMessageType: MessageBarType.error
                });
            }
        };
        this._onRunDiagnostics = async () => {
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
            }
            catch (e) {
                this.setState({
                    syncInProgress: false,
                    syncMessage: `Failed to retrieve diagnostics: ${e.message || JSON.stringify(e)}`,
                    syncMessageType: MessageBarType.error
                });
            }
        };
        this._exportWarrantyReportToExcel = () => {
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
        this._renderRequestAnalysis = (request) => {
            const reqAssetTitle = request.assetTitle || "";
            const inStockItems = this.state.items.filter(item => (item.assetType || '').toLowerCase() === reqAssetTitle.toLowerCase() &&
                (item.status === 'In Stock' || item.status === 'Yes' || (item.status || '').toLowerCase() === 'in stock'));
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
            }
            else if (request.status === 'Declined') {
                progressPercent = 1.0;
                currentStepText = "Declined by Manager";
            }
            return (React.createElement(Stack, { tokens: { childrenGap: 20 } },
                React.createElement("div", { style: { backgroundColor: '#ffffff', padding: '16px', borderRadius: '8px', border: '1px solid #e5e7eb' } },
                    React.createElement("h4", { style: { margin: '0 0 12px 0', color: '#111827', fontSize: '1rem', borderBottom: '1px solid #f3f4f6', paddingBottom: '8px' } }, "Request Overview"),
                    React.createElement("div", { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '0.88rem' } },
                        React.createElement("div", null,
                            React.createElement("span", { style: { color: '#6b7280' } }, "Request Key:"),
                            " ",
                            React.createElement("strong", { style: { color: '#111827' } }, request.requestKey)),
                        React.createElement("div", null,
                            React.createElement("span", { style: { color: '#6b7280' } }, "Requested Asset:"),
                            " ",
                            React.createElement("strong", { style: { color: '#111827' } }, request.assetTitle)),
                        React.createElement("div", null,
                            React.createElement("span", { style: { color: '#6b7280' } }, "Quantity:"),
                            " ",
                            React.createElement("strong", { style: { color: '#111827' } }, request.quantity)),
                        React.createElement("div", null,
                            React.createElement("span", { style: { color: '#6b7280' } }, "Priority:"),
                            " ",
                            React.createElement("strong", { style: { color: '#111827' } }, request.priority)),
                        React.createElement("div", null,
                            React.createElement("span", { style: { color: '#6b7280' } }, "Requester Name:"),
                            " ",
                            React.createElement("strong", { style: { color: '#111827' } }, request.requesterName)),
                        React.createElement("div", null,
                            React.createElement("span", { style: { color: '#6b7280' } }, "Employee ID:"),
                            " ",
                            React.createElement("strong", { style: { color: '#111827' } }, request.employeeId || "N/A")),
                        React.createElement("div", null,
                            React.createElement("span", { style: { color: '#6b7280' } }, "Request Date:"),
                            " ",
                            React.createElement("strong", { style: { color: '#111827' } }, request.requestDate)),
                        React.createElement("div", null,
                            React.createElement("span", { style: { color: '#6b7280' } }, "Request Status:"),
                            " ",
                            React.createElement("strong", { style: { color: request.status === 'Approved' ? '#16a34a' : request.status === 'Declined' ? '#dc2626' : '#ea580c' } }, request.status))),
                    request.reason && (React.createElement("div", { style: { marginTop: '12px', fontSize: '0.88rem', padding: '8px 10px', backgroundColor: '#f9fafb', borderRadius: '4px', border: '1px solid #f3f4f6' } },
                        React.createElement("span", { style: { color: '#6b7280', display: 'block', marginBottom: '2px' } }, "Reason for Request:"),
                        React.createElement("span", { style: { color: '#374151' } }, request.reason))),
                    request.managerResponse && (React.createElement("div", { style: { marginTop: '12px', fontSize: '0.88rem', padding: '8px 10px', backgroundColor: '#f0fdf4', borderRadius: '4px', border: '1px solid #dcfce7' } },
                        React.createElement("span", { style: { color: '#15803d', display: 'block', marginBottom: '2px' } }, "Manager Response:"),
                        React.createElement("span", { style: { color: '#166534' } }, request.managerResponse)))),
                React.createElement("div", { style: { backgroundColor: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0' } },
                    React.createElement("h4", { style: { margin: '0 0 12px 0', color: '#1e293b', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' } },
                        React.createElement(Icon, { iconName: "BarChart4", style: { color: '#0078d4' } }),
                        " Detailed Analysis"),
                    React.createElement(Stack, { tokens: { childrenGap: 12 } },
                        React.createElement("div", null,
                            React.createElement("span", { style: { display: 'block', fontSize: '0.85rem', color: '#64748b', marginBottom: '6px' } }, "Inventory Availability Check:"),
                            isSufficient ? (React.createElement(MessageBar, { messageBarType: MessageBarType.success, styles: { root: { borderRadius: '6px' } } },
                                React.createElement("strong", null, "Inventory Check Passed:"),
                                " There are currently ",
                                React.createElement("strong", null, inStockCount),
                                " unit(s) of ",
                                React.createElement("strong", null, reqAssetTitle),
                                " in stock, which is sufficient to fulfill this request.")) : (React.createElement(MessageBar, { messageBarType: MessageBarType.warning, styles: { root: { borderRadius: '6px' } } },
                                React.createElement("strong", null, "Inventory Warning:"),
                                " Only ",
                                React.createElement("strong", null, inStockCount),
                                " unit(s) of ",
                                React.createElement("strong", null, reqAssetTitle),
                                " in stock. Procurement is required to fully complete this order."))),
                        React.createElement("div", { style: { borderTop: '1px solid #e2e8f0', paddingTop: '10px' } },
                            React.createElement("span", { style: { display: 'block', fontSize: '0.85rem', color: '#64748b', marginBottom: '4px' } }, "Strategic Recommendation:"),
                            React.createElement("div", { style: { padding: '10px', backgroundColor: '#fff', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '0.85rem', lineHeight: '1.4', color: '#334155' } }, request.status === 'Pending' ? (isSufficient ? (React.createElement("span", null,
                                React.createElement("strong", null, "Recommended Action:"),
                                " Approve the request. Sufficient inventory is available, allowing immediate serial number allocation.")) : (React.createElement("span", null,
                                React.createElement("strong", null, "Recommended Action:"),
                                " Hold approval or assign alternate model. Current stock (",
                                inStockCount,
                                ") is insufficient. Order replenishment units."))) : request.status === 'Approved' && request.assetStatus === 'Pending' ? (React.createElement("span", null,
                                React.createElement("strong", null, "Recommended Action:"),
                                " Proceed to the ",
                                React.createElement("strong", null, "Asset Assignment Queue"),
                                " tab to allocate one of the ",
                                React.createElement("strong", null, inStockCount),
                                " available ",
                                reqAssetTitle,
                                "s to ",
                                request.requesterName,
                                ".")) : request.status === 'Approved' && request.assetStatus === 'Approved' ? (React.createElement("span", null,
                                React.createElement("strong", null, "Lifecycle Complete:"),
                                " The asset has been successfully allocated. No further manager or admin action is required.")) : (React.createElement("span", null,
                                React.createElement("strong", null, "Closed:"),
                                " Request has been declined. Fulfilling alternate options or review arguments if appealed.")))),
                        React.createElement("div", { style: { borderTop: '1px solid #e2e8f0', paddingTop: '10px' } },
                            React.createElement("span", { style: { display: 'block', fontSize: '0.85rem', color: '#64748b', marginBottom: '6px' } }, "Request Lifecycle Stage:"),
                            React.createElement(ProgressIndicator, { label: currentStepText, percentComplete: progressPercent, styles: { root: { marginTop: '5px' } } }))))));
        };
        this._renderAssetAnalysis = (asset) => {
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
            }
            else if (asset.condition === 'Poor' || asset.condition === 'Damaged') {
                conditionColor = '#dc2626';
                healthRating = "Critical Needs Replacement";
                healthIcon = "Warning";
            }
            return (React.createElement(Stack, { tokens: { childrenGap: 20 } },
                React.createElement("div", { style: { backgroundColor: '#ffffff', padding: '16px', borderRadius: '8px', border: '1px solid #e5e7eb' } },
                    React.createElement("h4", { style: { margin: '0 0 12px 0', color: '#111827', fontSize: '1rem', borderBottom: '1px solid #f3f4f6', paddingBottom: '8px' } }, "Asset Specifications"),
                    React.createElement("div", { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '0.88rem' } },
                        React.createElement("div", null,
                            React.createElement("span", { style: { color: '#6b7280' } }, "Asset Name:"),
                            " ",
                            React.createElement("strong", { style: { color: '#111827' } }, asset.assetName || asset.title)),
                        React.createElement("div", null,
                            React.createElement("span", { style: { color: '#6b7280' } }, "Serial Number:"),
                            " ",
                            React.createElement("strong", { style: { color: '#111827' } }, asset.serialNumber)),
                        React.createElement("div", null,
                            React.createElement("span", { style: { color: '#6b7280' } }, "Asset Type:"),
                            " ",
                            React.createElement("strong", { style: { color: '#111827' } }, asset.assetType)),
                        React.createElement("div", null,
                            React.createElement("span", { style: { color: '#6b7280' } }, "Current Status:"),
                            " ",
                            React.createElement("strong", { style: { color: '#111827' } }, asset.status)),
                        React.createElement("div", null,
                            React.createElement("span", { style: { color: '#6b7280' } }, "Condition:"),
                            " ",
                            React.createElement("strong", { style: { color: conditionColor } }, asset.condition || "New")),
                        React.createElement("div", null,
                            React.createElement("span", { style: { color: '#6b7280' } }, "Vendor:"),
                            " ",
                            React.createElement("strong", { style: { color: '#111827' } }, asset.vendor || "N/A")),
                        React.createElement("div", null,
                            React.createElement("span", { style: { color: '#6b7280' } }, "Purchase Date:"),
                            " ",
                            React.createElement("strong", { style: { color: '#111827' } }, asset.purchaseDate || "N/A")),
                        React.createElement("div", null,
                            React.createElement("span", { style: { color: '#6b7280' } }, "Warranty Expiry:"),
                            " ",
                            React.createElement("strong", { style: { color: isExpired ? '#dc2626' : '#111827' } }, asset.warrantyExpiry || "N/A"))),
                    asset.note && (React.createElement("div", { style: { marginTop: '12px', fontSize: '0.88rem', padding: '8px 10px', backgroundColor: '#f9fafb', borderRadius: '4px', border: '1px solid #f3f4f6' } },
                        React.createElement("span", { style: { color: '#6b7280', display: 'block', marginBottom: '2px' } }, "Asset Notes:"),
                        React.createElement("span", { style: { color: '#374151' } }, asset.note)))),
                React.createElement("div", { style: { backgroundColor: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0' } },
                    React.createElement("h4", { style: { margin: '0 0 12px 0', color: '#1e293b', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' } },
                        React.createElement(Icon, { iconName: "Heart", style: { color: conditionColor } }),
                        " Health & Depreciation Analysis"),
                    React.createElement(Stack, { tokens: { childrenGap: 12 } },
                        ageInMonths !== null && (React.createElement("div", null,
                            React.createElement("span", { style: { display: 'block', fontSize: '0.85rem', color: '#64748b', marginBottom: '4px' } }, "Asset Age:"),
                            React.createElement("span", { style: { fontSize: '0.9rem', color: '#334155' } },
                                "This asset is ",
                                React.createElement("strong", null, ageInMonths),
                                " month(s) old (",
                                Math.round(ageInMonths / 12 * 10) / 10,
                                " year(s)). Standard lifecycle depreciation period is 36 months (3 years)."))),
                        React.createElement("div", null,
                            React.createElement("span", { style: { display: 'block', fontSize: '0.85rem', color: '#64748b', marginBottom: '6px' } }, "Warranty Expiry Evaluation:"),
                            asset.warrantyExpiry ? (isExpired ? (React.createElement(MessageBar, { messageBarType: MessageBarType.error, styles: { root: { borderRadius: '6px' } } },
                                React.createElement("strong", null, "Warranty Expired:"),
                                " Coverage ended on ",
                                asset.warrantyExpiry,
                                ". Any future repair operations will incur full direct business costs.")) : (React.createElement(MessageBar, { messageBarType: MessageBarType.success, styles: { root: { borderRadius: '6px' } } },
                                React.createElement("strong", null, "Warranty Active:"),
                                " Covered under manufacturer protection until ",
                                asset.warrantyExpiry,
                                "."))) : (React.createElement(MessageBar, { messageBarType: MessageBarType.info, styles: { root: { borderRadius: '6px' } } },
                                React.createElement("strong", null, "Warranty Unknown:"),
                                " No warranty expiration date has been registered for this asset."))),
                        React.createElement("div", { style: { borderTop: '1px solid #e2e8f0', paddingTop: '10px' } },
                            React.createElement("span", { style: { display: 'block', fontSize: '0.85rem', color: '#64748b', marginBottom: '6px' } }, "Asset Physical Health:"),
                            React.createElement("div", { style: { display: 'flex', alignItems: 'center', gap: '8px', color: '#334155' } },
                                React.createElement(Icon, { iconName: healthIcon, style: { fontSize: '18px', color: conditionColor } }),
                                React.createElement("span", null,
                                    "Health Classification: ",
                                    React.createElement("strong", { style: { color: conditionColor } }, healthRating))),
                            (asset.condition === 'Poor' || asset.condition === 'Damaged') && (React.createElement("p", { style: { margin: '8px 0 0 0', fontSize: '0.8rem', color: '#b91c1c', fontWeight: 'bold' } }, "Critical Action Recommendation: It is highly advised to retire this asset and issue a replacement request.")))))));
        };
        this._renderNotificationDetailsPanel = () => {
            const { selectedNotification, isNotificationDetailsOpen, items, requests } = this.state;
            if (!selectedNotification)
                return null;
            const notifId = selectedNotification.id || "";
            let associatedRequest;
            let associatedAsset;
            if (notifId.startsWith("req-pending-")) {
                const id = notifId.replace("req-pending-", "");
                associatedRequest = requests.find(r => r.id === id);
            }
            else if (notifId.startsWith("req-resolved-")) {
                const parts = notifId.split("-");
                const id = parts[2];
                associatedRequest = requests.find(r => r.id === id);
            }
            else if (notifId.startsWith("req-assign-admin-")) {
                const id = notifId.replace("req-assign-admin-", "");
                associatedRequest = requests.find(r => r.id === id);
            }
            else if (notifId.startsWith("asset-assigned-admin-")) {
                const id = notifId.replace("asset-assigned-admin-", "");
                associatedAsset = items.find(a => a.id === id);
            }
            else if (notifId.startsWith("asset-assigned-")) {
                const id = notifId.replace("asset-assigned-", "");
                associatedAsset = items.find(a => a.id === id);
            }
            else if (notifId.startsWith("asset-maintenance-")) {
                const parts = notifId.replace("asset-maintenance-", "").split("-");
                const id = parts[0];
                associatedAsset = items.find(a => a.id === id);
            }
            return (React.createElement(Panel, { isOpen: isNotificationDetailsOpen, onDismiss: () => this.setState({ isNotificationDetailsOpen: false }), type: PanelType.medium, headerText: selectedNotification.title, closeButtonAriaLabel: "Close" },
                React.createElement("div", { style: { marginTop: '10px' } },
                    React.createElement("p", { style: { color: '#6b7280', fontSize: '0.88rem', margin: '0 0 20px 0' } },
                        React.createElement("strong", null, "Received:"),
                        " ",
                        selectedNotification.timestamp),
                    React.createElement("div", { style: { padding: '12px 15px', backgroundColor: '#f1f5f9', borderRadius: '6px', marginBottom: '20px', borderLeft: '4px solid #64748b' } },
                        React.createElement("p", { style: { margin: 0, fontSize: '0.92rem', color: '#334155', lineHeight: '1.5' } }, selectedNotification.message)),
                    associatedRequest && this._renderRequestAnalysis(associatedRequest),
                    associatedAsset && this._renderAssetAnalysis(associatedAsset),
                    !associatedRequest && !associatedAsset && (React.createElement("div", null,
                        React.createElement("h4", { style: { color: '#111827', borderBottom: '1px solid #e5e7eb', paddingBottom: '8px', marginBottom: '12px' } }, "System Alert Analysis"),
                        React.createElement(MessageBar, { messageBarType: MessageBarType.info }, "This is a general system notification. There is no direct database link to an active request or asset."))))));
        };
        let readIds = [];
        let clearedIds = [];
        try {
            readIds = JSON.parse(localStorage.getItem('inventory_read_notifications') || '[]');
            clearedIds = JSON.parse(localStorage.getItem('inventory_cleared_notifications') || '[]');
        }
        catch (e) {
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
            selectedAssetForIncident: undefined
        };
    }
    async componentDidMount() {
        await this._resolveUserRole();
        await this._loadInventory();
        await this._loadRequests();
        await this._loadAuditLogs();
        await this._loadReturnRequests();
        // Dynamically auto-sync existing assigned assets of our 5 active users to the Mapping List
        try {
            await InventoryService.syncExistingAssignmentsToMappingList(this.state.activeUserDisplayName);
        }
        catch (e) {
            console.warn("Failed to auto-sync existing assignments to Mapping List:", e);
        }
    }
    render() {
        const { description, isDarkTheme, environmentMessage, hasTeamsContext } = this.props;
        const { items, isAssetFormOpen, isRequestFormOpen, auditLogs, auditLogsLoading, userRole, previewRole, roleLoading, roleGroups, requestActionInProgressId, requestSearchId, activeUserDisplayName, activeUserEmail } = this.state;
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
        const filterRequests = (reqs) => normalizedSearch
            ? reqs.filter(request => (request.requestKey || '').toLowerCase().includes(normalizedSearch) ||
                (request.id || '').toLowerCase().includes(normalizedSearch))
            : reqs;
        const visibleAdminRequests = filterRequests(adminQueueRequests);
        const visibleManagerRequests = filterRequests(managerQueueRequests);
        const notifications = this._getNotifications();
        return (React.createElement("section", { className: `${styles.inventoryManagement} ${hasTeamsContext ? styles.teams : ''} ${isDarkTheme ? styles.dark : ''}` },
            React.createElement("div", { className: styles.mainContent },
                React.createElement("div", { className: styles.heroSection },
                    React.createElement("div", { className: styles.heroText },
                        React.createElement("h2", null, "Inventory Management"),
                        React.createElement("p", null,
                            "Welcome back, ",
                            escape(activeUserDisplayName),
                            "!"),
                        React.createElement("p", { className: styles.smallText },
                            "Role: ",
                            React.createElement("strong", null, effectiveRole)),
                        React.createElement("span", { className: styles.smallText },
                            environmentMessage,
                            " \u2022 Location: ",
                            escape(description)),
                        isAdmin && roleGroups.length > 0 && (React.createElement("p", { className: styles.smallText },
                            "SharePoint Groups: ",
                            escape(roleGroups.join(', '))))),
                    React.createElement("div", { className: styles.welcomeDiagramContainer },
                        React.createElement(AssetLifecycleDiagram, { isDarkTheme: isDarkTheme }))),
                this.state.errorMessage && (React.createElement("div", { style: { color: '#991b1b', backgroundColor: '#fee2e2', padding: '15px', borderRadius: '8px', marginBottom: '20px', position: 'relative' } },
                    React.createElement("strong", null, "Error:"),
                    " ",
                    this.state.errorMessage,
                    React.createElement("button", { onClick: () => this.setState({ errorMessage: undefined }), style: { position: 'absolute', right: '15px', top: '12px', border: 'none', background: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '1.1rem', color: '#991b1b' }, "aria-label": "Dismiss error" }, "\u00D7"))),
                !roleLoading && (React.createElement("div", { className: styles.actionGrid },
                    (isAdmin || isManager) && (React.createElement("div", { className: styles.actionButtonContainer },
                        React.createElement(PrimaryButton, { text: isAdmin ? "Add New Asset" : "Assign / Manage Assets", onClick: () => this.setState({ isAssetFormOpen: true }), iconProps: { iconName: 'Add' } }))),
                    (isAdmin || isManager || isEmployee) && (React.createElement("div", { className: styles.actionButtonContainer },
                        React.createElement(PrimaryButton, { text: "Request Asset", onClick: () => this.setState({ isRequestFormOpen: true }), iconProps: { iconName: 'Send' } }))),
                    (isAdmin || isManager || isEmployee) && (React.createElement("div", { className: styles.actionButtonContainer },
                        React.createElement(PrimaryButton, { text: "Raise Incident", onClick: () => this.setState({ isIncidentFormOpen: true }), iconProps: { iconName: 'AlertSolid' } }))))),
                React.createElement("div", { className: styles.card },
                    React.createElement(Pivot, { "aria-label": "Inventory Management Views", selectedKey: this.state.selectedTabKey, onLinkClick: (item) => item && this.setState({ selectedTabKey: item.props.itemKey }) },
                        React.createElement(PivotItem, { headerText: "Dashboard", itemIcon: "BarChart4", itemKey: "Dashboard" },
                            React.createElement(Dashboard, { items: isAdmin || isManager ? items : myAssets, requests: isAdmin || isManager ? this.state.requests : myRequests, isAdmin: isAdmin, isInventoryManager: isManager })),
                        React.createElement(PivotItem, { headerText: "My Assets", itemIcon: "Broom", itemKey: "MyAssets" },
                            React.createElement("div", { style: { marginTop: '20px' } },
                                React.createElement("div", { className: styles.cardHeader },
                                    React.createElement("h3", null, "My Assigned Assets")),
                                React.createElement("p", { style: { color: 'var(--text-muted)', marginBottom: '20px' } }, "View assets currently assigned to you."),
                                React.createElement(MyAssignedAssetsView, { items: myAssets, onReturnAsset: (item) => this.setState({ selectedAssetForReturn: item, isReturnFormOpen: true }), onRaiseIncident: (item) => this.setState({ selectedAssetForIncident: item, isIncidentFormOpen: true }) }))),
                        React.createElement(PivotItem, { headerText: "My Requests", itemIcon: "Send", itemKey: "MyRequests" },
                            React.createElement("div", { style: { marginTop: '20px' } },
                                React.createElement("div", { className: styles.cardHeader },
                                    React.createElement("h3", null, "My Asset Requests")),
                                React.createElement("p", { style: { color: 'var(--text-muted)', marginBottom: '20px' } }, "Track your submitted requests and approval status."),
                                React.createElement(MyRequestsView, { requests: myRequests }))),
                        React.createElement(PivotItem, { headerText: notifications.filter(n => !n.isRead).length > 0 ? `Notifications (${notifications.filter(n => !n.isRead).length})` : "Notifications", itemIcon: "Ringer", itemKey: "Notifications" },
                            React.createElement(NotificationCenter, { notifications: notifications, onMarkAsRead: this._markNotificationAsRead, onMarkAllAsRead: this._markAllNotificationsAsRead, onClearNotification: this._clearNotification, onClearAllNotifications: this._clearAllNotifications, onNotificationAction: this._handleNotificationAction })),
                        React.createElement(PivotItem, { headerText: "Incident History", itemIcon: "History", itemKey: "IncidentHistory" },
                            React.createElement("div", { style: { marginTop: '20px' } },
                                React.createElement(IncidentHistory, { ...this.props, userDisplayName: activeUserDisplayName, userEmail: activeUserEmail, userRole: effectiveRole, setIsLoading: (loading) => this.setState({ loading }) }))),
                        isAdmin && (React.createElement(PivotItem, { headerText: "Inventory", itemIcon: "List", itemKey: "Inventory" },
                            React.createElement("div", { style: { marginTop: '20px' } },
                                React.createElement("div", { className: styles.cardHeader },
                                    React.createElement("h3", null, "Current Inventory Overview")),
                                React.createElement("p", { style: { color: 'var(--text-muted)', marginBottom: '20px' } }, "Track and manage your organizational assets efficiently within the SharePoint Framework."),
                                this.state.loading ? (React.createElement("p", null, "Loading inventory...")) : (React.createElement(InventoryList, { items: items, isAdmin: true, enablePagination: true }))))),
                        isManager && (React.createElement(PivotItem, { headerText: "Approvals", itemIcon: "DoubleChevronRight12", itemKey: "Approvals" },
                            React.createElement("div", { style: { marginTop: '20px' } },
                                React.createElement("div", { className: styles.cardHeader },
                                    React.createElement("h3", null, "Request Approvals & Assignment Queue")),
                                React.createElement("p", { style: { color: 'var(--text-muted)', marginBottom: '20px' } }, "Track and manage all asset requests efficiently."),
                                React.createElement(TextField, { label: "Search by Request ID", placeholder: "e.g. REQ-000123", value: requestSearchId, onChange: (_, value) => this.setState({ requestSearchId: value || '' }), styles: { root: { marginBottom: '12px', maxWidth: 320 } } }),
                                React.createElement("div", { style: { marginBottom: '20px', padding: '15px', backgroundColor: 'var(--surface-color, #ffffff)', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' } },
                                    React.createElement("h4", { style: { marginBottom: '10px' } }, "Request Approval Distribution"),
                                    React.createElement("div", { style: { height: '250px', position: 'relative' } },
                                        React.createElement(Pie, { data: {
                                                labels: Object.keys(managerQueueRequests.reduce((acc, req) => {
                                                    const status = req.status || 'Pending';
                                                    acc[status] = (acc[status] || 0) + 1;
                                                    return acc;
                                                }, {})).length ? Object.keys(managerQueueRequests.reduce((acc, req) => {
                                                    const status = req.status || 'Pending';
                                                    acc[status] = (acc[status] || 0) + 1;
                                                    return acc;
                                                }, {})) : ['No data'],
                                                datasets: [
                                                    {
                                                        label: 'Requests by Status',
                                                        data: Object.keys(managerQueueRequests.reduce((acc, req) => {
                                                            const status = req.status || 'Pending';
                                                            acc[status] = (acc[status] || 0) + 1;
                                                            return acc;
                                                        }, {})).length ? Object.keys(managerQueueRequests.reduce((acc, req) => {
                                                            const status = req.status || 'Pending';
                                                            acc[status] = (acc[status] || 0) + 1;
                                                            return acc;
                                                        }, {})).map(k => (managerQueueRequests.reduce((acc, req) => {
                                                            const status = req.status || 'Pending';
                                                            acc[status] = (acc[status] || 0) + 1;
                                                            return acc;
                                                        }, {}))[k]) : [1],
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
                                            }, options: { maintainAspectRatio: false } }))),
                                React.createElement(RequestList, { items: visibleManagerRequests, canApproveReject: true, canApproveAsset: false, hideStatusColumn: false, showResponseColumns: false, onApproveRequest: this._onApproveRequest, onRejectRequest: this._onRejectRequest, actionInProgressId: requestActionInProgressId })))),
                        isAdmin && (React.createElement(PivotItem, { headerText: "Asset Assignment Queue", itemIcon: "Send", itemKey: "AssetAssignmentQueue" },
                            React.createElement("div", { style: { marginTop: '20px' } },
                                React.createElement("div", { className: styles.cardHeader },
                                    React.createElement("h3", null, "Approved Requests for Asset Assignment")),
                                React.createElement("p", { style: { color: 'var(--text-muted)', marginBottom: '20px' } }, "Only approved requests are shown here so assets can be assigned."),
                                React.createElement(TextField, { label: "Search by Request ID", placeholder: "e.g. REQ-000123", value: requestSearchId, onChange: (_, value) => this.setState({ requestSearchId: value || '' }), styles: { root: { marginBottom: '12px', maxWidth: 320 } } }),
                                React.createElement(RequestList, { items: visibleAdminRequests, canApproveReject: false, canApproveAsset: true, hideStatusColumn: true, showResponseColumns: false, onApproveAsset: this._onApproveAsset, actionInProgressId: requestActionInProgressId })))),
                        (isAdmin || isManager) && (React.createElement(PivotItem, { headerText: "Asset Returns", itemIcon: "ReturnToSession", itemKey: "AssetReturns" },
                            React.createElement("div", { style: { marginTop: '20px' } },
                                React.createElement("div", { className: styles.cardHeader },
                                    React.createElement("h3", null, "Asset Returns Registry")),
                                React.createElement("p", { style: { color: 'var(--text-muted)', marginBottom: '20px' } }, "Review and complete employee asset return requests, and verify physical hardware check-ins."),
                                React.createElement(ReturnRequestList, { items: this.state.returnRequests, isAdmin: isAdmin, isManager: isManager, onUpdateStatus: this._onUpdateReturnRequestStatus, loading: this.state.returnRequestsLoading })))),
                        isAdmin && (React.createElement(PivotItem, { headerText: "Event Stream", itemIcon: "ActivityFeed", itemKey: "EventStream" },
                            React.createElement(EventStream, { logs: auditLogs, loading: auditLogsLoading, errorMessage: undefined, currentUserRole: effectiveRole, currentUserName: activeUserDisplayName }))),
                        isAdmin && (React.createElement(PivotItem, { headerText: "Users", itemIcon: "People", itemKey: "Users" },
                            React.createElement("div", { style: { marginTop: '20px' } },
                                React.createElement("div", { className: styles.cardHeader },
                                    React.createElement("h3", null, "User Administration")),
                                React.createElement("p", { style: { color: 'var(--text-muted)', marginBottom: '20px' } }, "Admin-only area. Manage SharePoint groups and user onboarding from your site permissions."),
                                React.createElement("div", { style: { marginBottom: '20px', padding: '15px', backgroundColor: '#f0f6ff', borderRadius: '8px', borderLeft: '4px solid #0078d4' } },
                                    React.createElement("h4", { style: { marginTop: 0, marginBottom: '10px', color: '#0078d4' } }, "SharePoint Group Management"),
                                    React.createElement("p", { style: { margin: 0, fontSize: '0.9rem', color: '#323130', marginBottom: '15px' } }, "To onboard new employees, grant them Admin access, or assign them as Inventory Managers, you must add them to the respective SharePoint Site Groups."),
                                    React.createElement(PrimaryButton, { text: "Manage Site Permissions", iconProps: { iconName: 'Permissions' }, onClick: () => {
                                            const siteUrl = window.location.pathname.substring(0, window.location.pathname.toLowerCase().indexOf('/sitepages'));
                                            window.open(`${window.location.origin}${siteUrl}/_layouts/15/user.aspx`, '_blank');
                                        } })),
                                React.createElement("h4", { style: { marginBottom: '15px' } }, "Employee Directory & Asset Ownership"),
                                React.createElement("div", { style: { backgroundColor: 'var(--surface-color, #ffffff)', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' } },
                                    React.createElement(DetailsList, { items: this.state.employees.map(emp => {
                                            const realName = emp.jobTitle === 'Admin' ? (activeUserDisplayName || emp.name) : emp.name;
                                            const assignedItems = items.filter(i => this._isAssetAssignedToCurrentUser(i, realName));
                                            const assetTypes = Array.from(new Set(assignedItems.map(a => a.assetType))).filter(t => t).join(', ');
                                            return {
                                                ...emp,
                                                assignedAssets: assignedItems.length,
                                                assignedItems: assignedItems,
                                                assetTypes: assetTypes || 'None'
                                            };
                                        }), columns: [
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
                                                onRender: (item) => (React.createElement("span", { style: {
                                                        backgroundColor: item.assignedAssets > 0 ? '#dbeafe' : '#f3f4f6',
                                                        color: item.assignedAssets > 0 ? '#1e40af' : '#4b5563',
                                                        padding: '4px 10px',
                                                        borderRadius: '9999px',
                                                        fontWeight: 'bold'
                                                    } }, item.assignedAssets))
                                            },
                                            { key: 'col6', name: 'Asset Types', fieldName: 'assetTypes', minWidth: 120, maxWidth: 250, isResizable: true }
                                        ], setKey: "usersList", layoutMode: DetailsListLayoutMode.justified, selectionMode: SelectionMode.none, onRenderRow: (rowProps) => {
                                            if (!rowProps)
                                                return null;
                                            const isExpanded = this.state.expandedUserEmail === rowProps.item.email;
                                            return (React.createElement("div", null,
                                                React.createElement("div", { onClick: () => this.setState({ expandedUserEmail: isExpanded ? undefined : rowProps.item.email }), style: { cursor: 'pointer', '&:hover': { backgroundColor: '#f3f2f1' } } },
                                                    React.createElement(DetailsRow, { ...rowProps })),
                                                isExpanded && (React.createElement("div", { style: { padding: '20px 40px', backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' } },
                                                    React.createElement("h4", { style: { marginTop: 0, marginBottom: '15px', color: '#111827' } },
                                                        "Assets assigned to ",
                                                        rowProps.item.name),
                                                    rowProps.item.assignedItems.length > 0 ? (React.createElement(InventoryList, { items: rowProps.item.assignedItems, isAdmin: false })) : (React.createElement("p", { style: { color: '#6b7280', fontSize: '0.9rem', margin: 0 } }, "This user currently has no assets assigned to them."))))));
                                        } }))))),
                        isAdmin && (React.createElement(PivotItem, { headerText: "Asset Tracking", itemIcon: "EntitlementPolicy", itemKey: "AssetTracking" },
                            React.createElement("div", { style: { marginTop: '20px' } },
                                React.createElement("div", { className: styles.cardHeader },
                                    React.createElement("h3", null, "Asset Tracking & Direct Assignment")),
                                React.createElement("p", { style: { color: 'var(--text-muted)', marginBottom: '20px' } }, "Admin and Manager area. Select an employee to view their assigned assets or directly assign new assets from the inventory."),
                                React.createElement(AssetTracking, { items: items, employees: this.state.employees, currentUserRole: effectiveRole, currentUserName: activeUserDisplayName, currentUserEmail: activeUserEmail, onAssignAssets: this._onAssignAssets, isActionInProgress: !!this.state.isTrackingActionInProgress })))),
                        isAdmin && (React.createElement(PivotItem, { headerText: "Reports", itemIcon: "ReportDocument", itemKey: "Reports" },
                            React.createElement("div", { style: { marginTop: '20px' } },
                                React.createElement("div", { className: styles.cardHeader },
                                    React.createElement("h3", null, "Reporting & Insights")),
                                React.createElement("p", { style: { color: 'var(--text-muted)', marginBottom: '20px' } }, "Use dashboard and event history to derive utilization, approval trends, and asset aging reports."),
                                React.createElement("div", { style: { marginTop: '20px', padding: '15px', backgroundColor: 'var(--surface-color, #ffffff)', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' } },
                                    React.createElement("h4", { style: { marginBottom: '10px' } }, "Asset Utilization"),
                                    React.createElement("div", { style: { display: 'flex', gap: '20px' } },
                                        React.createElement("div", { style: { padding: '10px 15px', backgroundColor: '#f3f4f6', borderRadius: '6px', flex: 1 } },
                                            React.createElement("span", { style: { display: 'block', fontSize: '0.85rem', color: '#4b5563', marginBottom: '4px' } }, "Total Assets"),
                                            React.createElement("span", { style: { fontSize: '1.25rem', fontWeight: 'bold', color: '#111827' } }, items.length)),
                                        React.createElement("div", { style: { padding: '10px 15px', backgroundColor: '#dbeafe', borderRadius: '6px', flex: 1 } },
                                            React.createElement("span", { style: { display: 'block', fontSize: '0.85rem', color: '#1e40af', marginBottom: '4px' } }, "In Use / Assigned"),
                                            React.createElement("span", { style: { fontSize: '1.25rem', fontWeight: 'bold', color: '#1e3a8a' } }, items.length - items.filter(i => i.status === 'In Stock' || i.status === 'Yes').length)),
                                        React.createElement("div", { style: { padding: '10px 15px', backgroundColor: '#dcfce7', borderRadius: '6px', flex: 1 } },
                                            React.createElement("span", { style: { display: 'block', fontSize: '0.85rem', color: '#166534', marginBottom: '4px' } }, "Utilization Rate"),
                                            React.createElement("span", { style: { fontSize: '1.25rem', fontWeight: 'bold', color: '#14532d' } },
                                                items.length > 0 ? Math.round(((items.length - items.filter(i => i.status === 'In Stock' || i.status === 'Yes').length) / items.length) * 100) : 0,
                                                "%")))),
                                React.createElement("div", { style: { marginTop: '20px', padding: '15px', backgroundColor: 'var(--surface-color, #ffffff)', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' } },
                                    React.createElement("h4", { style: { marginBottom: '10px' } }, "Approval Trends"),
                                    React.createElement("div", { style: { display: 'flex', gap: '20px' } },
                                        React.createElement("div", { style: { padding: '10px 15px', backgroundColor: '#f3f4f6', borderRadius: '6px', flex: 1 } },
                                            React.createElement("span", { style: { display: 'block', fontSize: '0.85rem', color: '#4b5563', marginBottom: '4px' } }, "Total Requests"),
                                            React.createElement("span", { style: { fontSize: '1.25rem', fontWeight: 'bold', color: '#111827' } }, this.state.requests.length)),
                                        React.createElement("div", { style: { padding: '10px 15px', backgroundColor: '#dcfce7', borderRadius: '6px', flex: 1 } },
                                            React.createElement("span", { style: { display: 'block', fontSize: '0.85rem', color: '#166534', marginBottom: '4px' } }, "Approved"),
                                            React.createElement("span", { style: { fontSize: '1.25rem', fontWeight: 'bold', color: '#14532d' } }, this.state.requests.filter(r => (r.status || '').toLowerCase().includes('approv')).length)),
                                        React.createElement("div", { style: { padding: '10px 15px', backgroundColor: '#fee2e2', borderRadius: '6px', flex: 1 } },
                                            React.createElement("span", { style: { display: 'block', fontSize: '0.85rem', color: '#991b1b', marginBottom: '4px' } }, "Declined"),
                                            React.createElement("span", { style: { fontSize: '1.25rem', fontWeight: 'bold', color: '#7f1d1d' } }, this.state.requests.filter(r => (r.status || '').toLowerCase().includes('declin') || (r.status || '').toLowerCase().includes('reject')).length)),
                                        React.createElement("div", { style: { padding: '10px 15px', backgroundColor: '#fef3c7', borderRadius: '6px', flex: 1 } },
                                            React.createElement("span", { style: { display: 'block', fontSize: '0.85rem', color: '#92400e', marginBottom: '4px' } }, "Approval Rate"),
                                            React.createElement("span", { style: { fontSize: '1.25rem', fontWeight: 'bold', color: '#78350f' } },
                                                this.state.requests.length > 0 ? Math.round((this.state.requests.filter(r => (r.status || '').toLowerCase().includes('approv')).length / this.state.requests.length) * 100) : 0,
                                                "%")))),
                                (() => {
                                    const now = new Date();
                                    const aging = items.reduce((acc, item) => {
                                        if (!item.purchaseDate) {
                                            acc.unknown++;
                                            return acc;
                                        }
                                        const pd = new Date(item.purchaseDate);
                                        const diffYears = Math.abs(now.getTime() - pd.getTime()) / (1000 * 60 * 60 * 24 * 365);
                                        if (diffYears < 1)
                                            acc.under1++;
                                        else if (diffYears <= 3)
                                            acc.between1and3++;
                                        else
                                            acc.over3++;
                                        return acc;
                                    }, { under1: 0, between1and3: 0, over3: 0, unknown: 0 });
                                    return (React.createElement("div", { style: { marginTop: '20px', padding: '15px', backgroundColor: 'var(--surface-color, #ffffff)', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' } },
                                        React.createElement("h4", { style: { marginBottom: '10px' } }, "Asset Aging"),
                                        React.createElement("div", { style: { display: 'flex', gap: '20px' } },
                                            React.createElement("div", { style: { padding: '10px 15px', backgroundColor: '#dcfce7', borderRadius: '6px', flex: 1 } },
                                                React.createElement("span", { style: { display: 'block', fontSize: '0.85rem', color: '#166534', marginBottom: '4px' } }, "< 1 Year Old (New)"),
                                                React.createElement("span", { style: { fontSize: '1.25rem', fontWeight: 'bold', color: '#14532d' } }, aging.under1)),
                                            React.createElement("div", { style: { padding: '10px 15px', backgroundColor: '#fef3c7', borderRadius: '6px', flex: 1 } },
                                                React.createElement("span", { style: { display: 'block', fontSize: '0.85rem', color: '#92400e', marginBottom: '4px' } }, "1 - 3 Years Old"),
                                                React.createElement("span", { style: { fontSize: '1.25rem', fontWeight: 'bold', color: '#78350f' } }, aging.between1and3)),
                                            React.createElement("div", { style: { padding: '10px 15px', backgroundColor: '#fee2e2', borderRadius: '6px', flex: 1 } },
                                                React.createElement("span", { style: { display: 'block', fontSize: '0.85rem', color: '#991b1b', marginBottom: '4px' } }, "> 3 Years Old (Aging)"),
                                                React.createElement("span", { style: { fontSize: '1.25rem', fontWeight: 'bold', color: '#7f1d1d' } }, aging.over3)),
                                            React.createElement("div", { style: { padding: '10px 15px', backgroundColor: '#f3f4f6', borderRadius: '6px', flex: 1 } },
                                                React.createElement("span", { style: { display: 'block', fontSize: '0.85rem', color: '#4b5563', marginBottom: '4px' } }, "Unknown Age"),
                                                React.createElement("span", { style: { fontSize: '1.25rem', fontWeight: 'bold', color: '#111827' } }, aging.unknown)))));
                                })(),
                                React.createElement("div", { style: { marginTop: '20px', padding: '15px', backgroundColor: 'var(--surface-color, #ffffff)', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' } },
                                    React.createElement("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' } },
                                        React.createElement("h4", { style: { margin: 0 } }, "Warranty Expiry Report"),
                                        React.createElement(PrimaryButton, { text: "Export to Excel", iconProps: { iconName: 'ExcelDocument' }, onClick: this._exportWarrantyReportToExcel, styles: {
                                                root: { backgroundColor: '#107c41', borderColor: '#107c41', color: '#ffffff' },
                                                rootHovered: { backgroundColor: '#0b592e', borderColor: '#0b592e', color: '#ffffff' },
                                                rootPressed: { backgroundColor: '#0a522a', borderColor: '#0a522a', color: '#ffffff' }
                                            } })),
                                    React.createElement("div", { style: { marginBottom: '15px', display: 'flex', gap: '20px' } },
                                        React.createElement("div", { style: { padding: '10px 15px', backgroundColor: '#f3f4f6', borderRadius: '6px' } },
                                            React.createElement("span", { style: { display: 'block', fontSize: '0.85rem', color: '#4b5563', marginBottom: '4px' } }, "Total Assets Count"),
                                            React.createElement("span", { style: { fontSize: '1.25rem', fontWeight: 'bold', color: '#111827' } }, items.length)),
                                        React.createElement("div", { style: { padding: '10px 15px', backgroundColor: '#f3f4f6', borderRadius: '6px' } },
                                            React.createElement("span", { style: { display: 'block', fontSize: '0.85rem', color: '#4b5563', marginBottom: '4px' } }, "Assets with Warranty Data"),
                                            React.createElement("span", { style: { fontSize: '1.25rem', fontWeight: 'bold', color: '#111827' } }, items.filter(i => i.warrantyExpiry).length))),
                                    React.createElement(DetailsList, { items: items, columns: [
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
                                                    return (React.createElement("span", { style: {
                                                            color: isExpired ? '#ef4444' : 'inherit',
                                                            fontWeight: isExpired ? 'bold' : 'normal'
                                                        } },
                                                        item.warrantyExpiry || 'N/A',
                                                        " ",
                                                        isExpired && '(Expired)'));
                                                }
                                            }
                                        ], setKey: "warrantyReport", layoutMode: DetailsListLayoutMode.justified, selectionMode: SelectionMode.none }))))),
                        isAdmin && (React.createElement(PivotItem, { headerText: "Config", itemIcon: "Settings", itemKey: "Config" },
                            React.createElement("div", { style: { marginTop: '20px' } },
                                React.createElement("div", { className: styles.cardHeader },
                                    React.createElement("h3", null, "Configuration")),
                                React.createElement("p", { style: { color: 'var(--text-muted)', marginBottom: '20px' } }, "Admin-only configuration area for list schema, process settings, and environment setup."),
                                React.createElement("div", { style: { backgroundColor: 'var(--surface-color, #ffffff)', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '20px' } },
                                    React.createElement("h4", { style: { marginBottom: '10px', color: '#111827', marginTop: 0 } }, "Mapping List Management & Sync"),
                                    React.createElement("p", { style: { fontSize: '0.88rem', color: '#4b5563', margin: '0 0 15px 0' } },
                                        "Ensure all assets currently assigned to active employees are properly mapped to the SharePoint ",
                                        React.createElement("strong", null, "Mapping List"),
                                        ". Use the buttons below to perform a manual synchronization check or diagnose the list's database schema."),
                                    React.createElement("div", { style: { display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '15px' } },
                                        React.createElement(PrimaryButton, { text: this.state.syncInProgress ? "Processing..." : "Sync Assigned Assets", iconProps: { iconName: 'Sync' }, onClick: this._onSyncAssignedAssets, disabled: this.state.syncInProgress }),
                                        React.createElement(PrimaryButton, { text: this.state.syncInProgress ? "Checking Schema..." : "Run Schema Diagnostics", iconProps: { iconName: 'Database' }, onClick: this._onRunDiagnostics, disabled: this.state.syncInProgress, styles: {
                                                root: { backgroundColor: '#5c2d91', borderColor: '#5c2d91' },
                                                rootHovered: { backgroundColor: '#4b2278', borderColor: '#4b2278' }
                                            } })),
                                    this.state.syncMessage && (React.createElement(MessageBar, { messageBarType: this.state.syncMessageType, onDismiss: () => this.setState({ syncMessage: undefined }), styles: { root: { marginBottom: '15px', borderRadius: '6px' } } }, this.state.syncMessage)),
                                    this.state.diagnosticInfo && (React.createElement("div", { style: { marginTop: '15px' } },
                                        React.createElement("span", { style: { display: 'block', fontSize: '0.85rem', fontWeight: 'bold', color: '#323130', marginBottom: '6px' } }, "Diagnostic Log Output:"),
                                        React.createElement("textarea", { readOnly: true, value: this.state.diagnosticInfo, rows: 10, style: {
                                                width: '100%',
                                                fontFamily: 'monospace',
                                                fontSize: '0.82rem',
                                                padding: '10px',
                                                backgroundColor: '#f3f2f1',
                                                border: '1px solid #e1dfdd',
                                                borderRadius: '4px',
                                                resize: 'vertical',
                                                color: '#323130'
                                            } })))),
                                React.createElement("div", { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' } },
                                    React.createElement("div", { style: { backgroundColor: 'var(--surface-color, #ffffff)', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' } },
                                        React.createElement("h4", { style: { marginBottom: '15px', color: '#111827', marginTop: 0 } }, "SharePoint List Connections"),
                                        React.createElement("ul", { style: { listStyle: 'none', padding: 0, margin: 0, fontSize: '0.9rem' } },
                                            React.createElement("li", { style: { marginBottom: '12px', display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f3f4f6', paddingBottom: '8px' } },
                                                React.createElement("span", { style: { color: '#4b5563' } }, "Inventory Database:"),
                                                React.createElement("strong", { style: { color: '#111827' } }, "InventoryList")),
                                            React.createElement("li", { style: { marginBottom: '12px', display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f3f4f6', paddingBottom: '8px' } },
                                                React.createElement("span", { style: { color: '#4b5563' } }, "Approvals & Requests:"),
                                                React.createElement("strong", { style: { color: '#111827' } }, "RequestList")),
                                            React.createElement("li", { style: { display: 'flex', justifyContent: 'space-between' } },
                                                React.createElement("span", { style: { color: '#4b5563' } }, "System Audit Logs:"),
                                                React.createElement("strong", { style: { color: '#111827' } }, "AuditLogList")))),
                                    React.createElement("div", { style: { backgroundColor: 'var(--surface-color, #ffffff)', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' } },
                                        React.createElement("h4", { style: { marginBottom: '15px', color: '#111827', marginTop: 0 } }, "Role Based Access Control"),
                                        React.createElement("ul", { style: { listStyle: 'none', padding: 0, margin: 0, fontSize: '0.9rem' } },
                                            React.createElement("li", { style: { marginBottom: '12px', display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f3f4f6', paddingBottom: '8px' } },
                                                React.createElement("span", { style: { color: '#4b5563' } }, "Admin Group:"),
                                                React.createElement("strong", { style: { color: '#111827' } }, "Inventory Administrators")),
                                            React.createElement("li", { style: { marginBottom: '12px', display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f3f4f6', paddingBottom: '8px' } },
                                                React.createElement("span", { style: { color: '#4b5563' } }, "Manager Group:"),
                                                React.createElement("strong", { style: { color: '#111827' } }, "Inventory Managers")),
                                            React.createElement("li", { style: { display: 'flex', justifyContent: 'space-between' } },
                                                React.createElement("span", { style: { color: '#4b5563' } }, "Employee Access:"),
                                                React.createElement("strong", { style: { color: '#111827' } }, "Site Visitors"))))),
                                React.createElement("div", { style: { marginTop: '20px', backgroundColor: 'var(--surface-color, #ffffff)', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' } },
                                    React.createElement("h4", { style: { marginBottom: '5px', color: '#111827', marginTop: 0 } }, "Required List Schema (Developer Reference)"),
                                    React.createElement("p", { style: { fontSize: '0.85rem', color: '#6b7280', marginBottom: '15px', marginTop: 0 } }, "Ensure your SharePoint lists contain the following columns exactly as written to prevent validation errors."),
                                    React.createElement("h5", { style: { marginTop: '15px', marginBottom: '8px', color: '#374151' } },
                                        "InventoryList ",
                                        React.createElement("span", { style: { fontWeight: 'normal', color: '#9ca3af' } }, "(Asset Database)")),
                                    React.createElement("div", { style: { display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '25px' } }, ['Title', 'AssetName', 'AssetType', 'SerialNumber', 'PurchaseDate', 'Status', 'Specifications', 'AssignedTo (Person/Group)'].map(col => (React.createElement("span", { key: col, style: { backgroundColor: '#f3f4f6', padding: '4px 10px', borderRadius: '4px', fontSize: '0.75rem', color: '#374151', border: '1px solid #e5e7eb' } }, col)))),
                                    React.createElement("h5", { style: { marginBottom: '8px', color: '#374151' } },
                                        "RequestList ",
                                        React.createElement("span", { style: { fontWeight: 'normal', color: '#9ca3af' } }, "(Approval Workflows)")),
                                    React.createElement("div", { style: { display: 'flex', gap: '8px', flexWrap: 'wrap' } }, ['Title', 'Employee', 'AssetType', 'Quantity', 'ReasonforRequest', 'RequestStatus', 'RequestKey', 'AssetStatus'].map(col => (React.createElement("span", { key: col, style: { backgroundColor: '#f3f4f6', padding: '4px 10px', borderRadius: '4px', fontSize: '0.75rem', color: '#374151', border: '1px solid #e5e7eb' } }, col))))))))))),
            (isAdmin || isManager) && (React.createElement(AssetForm, { isOpen: isAssetFormOpen, onClose: () => this.setState({ isAssetFormOpen: false }), currentUserRole: effectiveRole, onAddAsset: this._onAddAsset })),
            (isAdmin || isManager || isEmployee) && (React.createElement(RequestForm, { isOpen: isRequestFormOpen, onClose: () => this.setState({ isRequestFormOpen: false }), availableAssets: items, employees: this.state.employees, currentUserRole: effectiveRole, currentUserName: activeUserDisplayName, onSubmitRequest: this._onSubmitRequest })),
            (isAdmin || isManager || isEmployee) && (React.createElement(IncidentRequestModule, { ...this.props, isOpen: this.state.isIncidentFormOpen, onClose: () => this.setState({ isIncidentFormOpen: false, selectedAssetForIncident: undefined }), userDisplayName: activeUserDisplayName, userEmail: activeUserEmail, setIsLoading: (loading) => this.setState({ loading }), preselectedAsset: this.state.selectedAssetForIncident })),
            this._renderNotificationDetailsPanel(),
            React.createElement(ReturnAssetForm, { isOpen: this.state.isReturnFormOpen, onDismiss: () => this.setState({ isReturnFormOpen: false, selectedAssetForReturn: undefined }), asset: this.state.selectedAssetForReturn, onSubmit: this._onSubmitReturnRequest })));
    }
}
//# sourceMappingURL=InventoryManagement.js.map